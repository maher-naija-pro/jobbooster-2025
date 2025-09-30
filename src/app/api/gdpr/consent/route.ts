import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import type { Prisma } from '@prisma/client'

export async function POST(request: NextRequest) {
    const startTime = Date.now()
    let userId: string | undefined

    try {
        logger.info('[GDPR Consent] Starting consent update request', {
            method: 'POST',
            endpoint: '/api/gdpr/consent',
            timestamp: new Date().toISOString()
        })

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            logger.warn('[GDPR Consent] Unauthorized access attempt', {
                endpoint: '/api/gdpr/consent',
                method: 'POST',
                timestamp: new Date().toISOString()
            })
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        userId = user.id
        logger.debug('[GDPR Consent] User authenticated', {
            userId,
            userEmail: user.email,
            timestamp: new Date().toISOString()
        })

        const body = await request.json()
        const { consent, consentDate, consentVersion } = body

        logger.debug('[GDPR Consent] Request body received', {
            userId,
            hasConsent: !!consent,
            consentDate,
            consentVersion,
            consentKeys: consent ? Object.keys(consent) : [],
            timestamp: new Date().toISOString()
        })

        // Validate consent data
        if (!consent || typeof consent !== 'object') {
            logger.warn('[GDPR Consent] Invalid consent data provided', {
                userId,
                consent,
                consentType: typeof consent,
                timestamp: new Date().toISOString()
            })
            return NextResponse.json(
                { error: 'Invalid consent data' },
                { status: 400 }
            )
        }

        // Update user consent in database
        logger.debug('[GDPR Consent] Updating user consent in database', {
            userId,
            consentVersion: consentVersion || '1.0',
            timestamp: new Date().toISOString()
        })

        const profileResult = await prisma.profile.upsert({
            where: { userId: user.id },
            update: {
                gdprConsent: true,
                consentDate: new Date(consentDate),
                consentVersion: consentVersion || '1.0',
                preferences: {
                    ...consent,
                    lastUpdated: new Date().toISOString()
                }
            },
            create: {
                userId: user.id,
                email: user.email!,
                gdprConsent: true,
                consentDate: new Date(consentDate),
                consentVersion: consentVersion || '1.0',
                preferences: {
                    ...consent,
                    lastUpdated: new Date().toISOString()
                }
            }
        })

        logger.info('[GDPR Consent] Profile updated successfully', {
            userId,
            profileId: profileResult.id,
            isNewProfile: !profileResult.updatedAt,
            consentVersion: consentVersion || '1.0',
            timestamp: new Date().toISOString()
        })

        // Log consent update activity
        const activityResult = await prisma.userActivity.create({
            data: {
                userId: user.id,
                action: 'consent_updated',
                resourceType: 'privacy',
                metadata: {
                    consent,
                    consentDate,
                    consentVersion
                }
            }
        })

        logger.debug('[GDPR Consent] Activity logged', {
            userId,
            activityId: activityResult.id,
            action: 'consent_updated',
            timestamp: new Date().toISOString()
        })

        const duration = Date.now() - startTime
        logger.info('[GDPR Consent] Consent update completed successfully', {
            userId,
            duration: `${duration}ms`,
            consentVersion: consentVersion || '1.0',
            timestamp: new Date().toISOString()
        })

        return NextResponse.json({
            success: true,
            message: 'Consent updated successfully'
        })

    } catch (error) {
        const duration = Date.now() - startTime
        logger.error('[GDPR Consent] Error updating consent', {
            userId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
        })

        return NextResponse.json(
            { error: 'Failed to update consent' },
            { status: 500 }
        )
    }
}

export async function GET(_request: NextRequest) {
    const startTime = Date.now()
    let userId: string | undefined

    try {
        logger.info('[GDPR Consent] Starting consent fetch request', {
            method: 'GET',
            endpoint: '/api/gdpr/consent',
            timestamp: new Date().toISOString()
        })

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            logger.warn('[GDPR Consent] Unauthorized access attempt for consent fetch', {
                endpoint: '/api/gdpr/consent',
                method: 'GET',
                timestamp: new Date().toISOString()
            })
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        userId = user.id
        logger.debug('[GDPR Consent] User authenticated for consent fetch', {
            userId,
            userEmail: user.email,
            timestamp: new Date().toISOString()
        })

        // Get user consent data
        logger.debug('[GDPR Consent] Fetching user consent data from database', {
            userId,
            timestamp: new Date().toISOString()
        })

        const profile = await prisma.profile.findUnique({
            where: { userId: user.id },
            select: {
                gdprConsent: true,
                consentDate: true,
                consentVersion: true,
                preferences: true
            }
        })

        if (!profile) {
            logger.warn('[GDPR Consent] Profile not found for user', {
                userId,
                timestamp: new Date().toISOString()
            })
            return NextResponse.json(
                { error: 'Profile not found' },
                { status: 404 }
            )
        }

        logger.debug('[GDPR Consent] Profile found, extracting consent data', {
            userId,
            hasGdprConsent: profile.gdprConsent,
            consentVersion: profile.consentVersion,
            hasPreferences: !!profile.preferences,
            timestamp: new Date().toISOString()
        })

        // Extract only the cookie preferences from the preferences JSON
        const { lastUpdated: _lastUpdated, ...cookiePreferences } = (profile.preferences as Prisma.JsonObject | null) ?? {}

        const duration = Date.now() - startTime
        logger.info('[GDPR Consent] Consent data fetched successfully', {
            userId,
            duration: `${duration}ms`,
            hasConsent: !!cookiePreferences,
            consentVersion: profile.consentVersion,
            timestamp: new Date().toISOString()
        })

        return NextResponse.json({
            consent: cookiePreferences,
            consentDate: profile.consentDate,
            consentVersion: profile.consentVersion,
            gdprConsent: profile.gdprConsent
        })

    } catch (error) {
        const duration = Date.now() - startTime
        logger.error('[GDPR Consent] Error fetching consent data', {
            userId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
        })

        return NextResponse.json(
            { error: 'Failed to fetch consent' },
            { status: 500 }
        )
    }
}
