import { prisma } from '@/lib/prisma'
import { User } from '@supabase/supabase-js'
import { headers } from 'next/headers'

export interface SessionData {
    userId: string
    sessionToken: string
    deviceInfo?: {
        browser?: string
        os?: string
        device?: string
        screen?: string
        language?: string
    }
    ipAddress?: string
    userAgent?: string
    expiresAt: Date
}

export interface SessionAnalytics {
    totalSessions: number
    activeSessions: number
    expiredSessions: number
    sessionsByDevice: Array<{
        device: string
        count: number
    }>
    sessionsByLocation: Array<{
        location: string
        count: number
    }>
    recentSessions: Array<{
        id: string
        createdAt: Date
        lastActivity: Date
        deviceInfo: any
        ipAddress: string
    }>
}

/**
 * Creates a new user session in the database
 */
export async function createUserSession(
    user: User,
    sessionToken: string,
    request?: Request
): Promise<{ success: boolean; sessionId?: string; error?: any }> {
    try {
        const headersList = request ? await headers() : null
        const userAgent = headersList?.get('user-agent') || 'Unknown'
        const ipAddress = getClientIP(request, headersList || undefined)

        // Parse device information from user agent
        const deviceInfo = parseUserAgent(userAgent)

        // Set session expiration (30 days from now)
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 30)

        const session = await prisma.userSession.create({
            data: {
                userId: user.id,
                sessionToken,
                deviceInfo,
                ipAddress,
                userAgent,
                expiresAt,
                lastActivity: new Date()
            }
        })

        // Log session creation activity
        await prisma.userActivity.create({
            data: {
                userId: user.id,
                action: 'session_created',
                resourceType: 'session',
                ipAddress,
                userAgent,
                metadata: {
                    sessionId: session.id,
                    deviceInfo,
                    expiresAt: expiresAt.toISOString()
                }
            }
        })

        return { success: true, sessionId: session.id }
    } catch (error) {
        console.error('Error creating user session:', error)
        return { success: false, error }
    }
}

/**
 * Updates the last activity timestamp for a session
 */
export async function updateSessionActivity(
    userId: string,
    sessionToken: string,
    request?: Request
): Promise<{ success: boolean; error?: any }> {
    try {
        const headersList = request ? await headers() : null
        const ipAddress = getClientIP(request, headersList || undefined)
        const userAgent = headersList?.get('user-agent') || 'Unknown'

        await prisma.userSession.updateMany({
            where: {
                userId,
                sessionToken,
                expiresAt: { gt: new Date() } // Only update non-expired sessions
            },
            data: {
                lastActivity: new Date(),
                ipAddress,
                userAgent
            }
        })

        return { success: true }
    } catch (error) {
        console.error('Error updating session activity:', error)
        return { success: false, error }
    }
}

/**
 * Ends a user session (marks as expired)
 */
export async function endUserSession(
    userId: string,
    sessionToken: string
): Promise<{ success: boolean; error?: any }> {
    try {
        await prisma.userSession.updateMany({
            where: {
                userId,
                sessionToken
            },
            data: {
                expiresAt: new Date() // Set to now to expire immediately
            }
        })

        // Log session end activity
        await prisma.userActivity.create({
            data: {
                userId,
                action: 'session_ended',
                resourceType: 'session',
                metadata: {
                    sessionToken,
                    endedAt: new Date().toISOString()
                }
            }
        })

        return { success: true }
    } catch (error) {
        console.error('Error ending user session:', error)
        return { success: false, error }
    }
}

/**
 * Gets session analytics for a user
 */
export async function getSessionAnalytics(userId: string): Promise<SessionAnalytics> {
    try {
        const now = new Date()

        // Get all sessions for the user
        const sessions = await prisma.userSession.findMany({
            where: { userId },
            orderBy: { lastActivity: 'desc' }
        })

        const totalSessions = sessions.length
        const activeSessions = sessions.filter(s => s.expiresAt > now).length
        const expiredSessions = totalSessions - activeSessions

        // Group by device type
        const deviceCounts = sessions.reduce((acc, session) => {
            const device = (session.deviceInfo as any)?.device || 'Unknown'
            acc[device] = (acc[device] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        const sessionsByDevice = Object.entries(deviceCounts).map(([device, count]) => ({
            device,
            count
        }))

        // Group by IP (simplified location)
        const locationCounts = sessions.reduce((acc, session) => {
            const location = session.ipAddress ? session.ipAddress.split('.').slice(0, 2).join('.') + '.*' : 'Unknown'
            acc[location] = (acc[location] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        const sessionsByLocation = Object.entries(locationCounts).map(([location, count]) => ({
            location,
            count
        }))

        // Get recent sessions (last 10)
        const recentSessions = sessions.slice(0, 10).map(session => ({
            id: session.id,
            createdAt: session.createdAt,
            lastActivity: session.lastActivity,
            deviceInfo: session.deviceInfo,
            ipAddress: session.ipAddress || 'Unknown'
        }))

        return {
            totalSessions,
            activeSessions,
            expiredSessions,
            sessionsByDevice,
            sessionsByLocation,
            recentSessions
        }
    } catch (error) {
        console.error('Error getting session analytics:', error)
        return {
            totalSessions: 0,
            activeSessions: 0,
            expiredSessions: 0,
            sessionsByDevice: [],
            sessionsByLocation: [],
            recentSessions: []
        }
    }
}

/**
 * Cleans up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<{ success: boolean; deletedCount?: number; error?: any }> {
    try {
        const result = await prisma.userSession.deleteMany({
            where: {
                expiresAt: { lt: new Date() }
            }
        })

        console.log(`Cleaned up ${result.count} expired sessions`)
        return { success: true, deletedCount: result.count }
    } catch (error) {
        console.error('Error cleaning up expired sessions:', error)
        return { success: false, error }
    }
}

/**
 * Gets active sessions for a user
 */
export async function getActiveSessions(userId: string) {
    try {
        return await prisma.userSession.findMany({
            where: {
                userId,
                expiresAt: { gt: new Date() }
            },
            orderBy: { lastActivity: 'desc' }
        })
    } catch (error) {
        console.error('Error getting active sessions:', error)
        return []
    }
}

/**
 * Helper function to get client IP address
 */
function getClientIP(request?: Request, headersList?: Headers): string {
    if (!request || !headersList) return 'Unknown'

    // Check various headers for IP address
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIP = headersList.get('x-real-ip')
    const cfConnectingIP = headersList.get('cf-connecting-ip')

    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim()
    }
    if (realIP) {
        return realIP
    }
    if (cfConnectingIP) {
        return cfConnectingIP
    }

    return 'Unknown'
}

/**
 * Helper function to parse user agent and extract device information
 */
function parseUserAgent(userAgent: string) {
    const ua = userAgent.toLowerCase()

    // Browser detection
    let browser = 'Unknown'
    if (ua.includes('chrome')) browser = 'Chrome'
    else if (ua.includes('firefox')) browser = 'Firefox'
    else if (ua.includes('safari')) browser = 'Safari'
    else if (ua.includes('edge')) browser = 'Edge'
    else if (ua.includes('opera')) browser = 'Opera'

    // OS detection
    let os = 'Unknown'
    if (ua.includes('windows')) os = 'Windows'
    else if (ua.includes('mac')) os = 'macOS'
    else if (ua.includes('linux')) os = 'Linux'
    else if (ua.includes('android')) os = 'Android'
    else if (ua.includes('ios')) os = 'iOS'

    // Device type detection
    let device = 'Desktop'
    if (ua.includes('mobile')) device = 'Mobile'
    else if (ua.includes('tablet')) device = 'Tablet'

    // Screen resolution (if available in user agent)
    const screenMatch = userAgent.match(/(\d+)x(\d+)/)
    const screen = screenMatch ? `${screenMatch[1]}x${screenMatch[2]}` : 'Unknown'

    // Language detection
    const languageMatch = userAgent.match(/language[:\s]+([a-z-]+)/i)
    const language = languageMatch ? languageMatch[1] : 'Unknown'

    return {
        browser,
        os,
        device,
        screen,
        language
    }
}
