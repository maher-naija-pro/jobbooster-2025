import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
    const startTime = Date.now()
    let userId: string | undefined

    try {
        logger.info('[GDPR Delete] Starting data deletion request', {
            method: 'POST',
            endpoint: '/api/gdpr/delete',
            timestamp: new Date().toISOString()
        })

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            logger.warn('[GDPR Delete] Unauthorized access attempt for data deletion', {
                endpoint: '/api/gdpr/delete',
                method: 'POST',
                timestamp: new Date().toISOString()
            })
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        userId = user.id
        logger.debug('[GDPR Delete] User authenticated for data deletion', {
            userId,
            userEmail: user.email,
            timestamp: new Date().toISOString()
        })

        const body = await request.json()
        const {
            deleteProfile = true,
            deleteCvData = true,
            deleteActivityLogs = true,
            deleteCommunications = true,
            deleteSessions = true,
            reason = ''
        } = body

        logger.debug('[GDPR Delete] Deletion request parameters received', {
            userId,
            deleteProfile,
            deleteCvData,
            deleteActivityLogs,
            deleteCommunications,
            deleteSessions,
            hasReason: !!reason.trim(),
            reasonLength: reason.length,
            timestamp: new Date().toISOString()
        })

        // Validate reason
        if (!reason.trim()) {
            logger.warn('[GDPR Delete] Deletion request missing required reason', {
                userId,
                timestamp: new Date().toISOString()
            })
            return NextResponse.json(
                { error: 'Deletion reason is required' },
                { status: 400 }
            )
        }

        // Start a transaction to ensure data consistency
        logger.info('[GDPR Delete] Starting database transaction for data deletion', {
            userId,
            reason,
            timestamp: new Date().toISOString()
        })

        const result = await prisma.$transaction(async (tx) => {
            const deletionLog: string[] = []
            let deletedRecords = 0

            try {
                // Delete user sessions
                if (deleteSessions) {
                    logger.debug('[GDPR Delete] Deleting user sessions', {
                        userId,
                        timestamp: new Date().toISOString()
                    })
                    const sessionResult = await tx.userSession.deleteMany({
                        where: { userId: user.id }
                    })
                    deletedRecords += sessionResult.count
                    deletionLog.push(`Deleted ${sessionResult.count} user sessions`)
                    logger.debug('[GDPR Delete] User sessions deleted', {
                        userId,
                        deletedCount: sessionResult.count,
                        timestamp: new Date().toISOString()
                    })
                }

                // Delete user activity logs
                if (deleteActivityLogs) {
                    logger.debug('[GDPR Delete] Deleting user activity logs', {
                        userId,
                        timestamp: new Date().toISOString()
                    })
                    const activityResult = await tx.userActivity.deleteMany({
                        where: { userId: user.id }
                    })
                    deletedRecords += activityResult.count
                    deletionLog.push(`Deleted ${activityResult.count} activity logs`)
                    logger.debug('[GDPR Delete] User activity logs deleted', {
                        userId,
                        deletedCount: activityResult.count,
                        timestamp: new Date().toISOString()
                    })
                }

                // Delete generated content
                if (deleteCvData) {
                    logger.debug('[GDPR Delete] Deleting generated content', {
                        userId,
                        timestamp: new Date().toISOString()
                    })
                    const contentResult = await tx.generatedContent.deleteMany({
                        where: { userId: user.id }
                    })
                    deletedRecords += contentResult.count
                    deletionLog.push(`Deleted ${contentResult.count} generated content items`)
                    logger.debug('[GDPR Delete] Generated content deleted', {
                        userId,
                        deletedCount: contentResult.count,
                        timestamp: new Date().toISOString()
                    })
                }

                // Delete CV data
                if (deleteCvData) {
                    logger.debug('[GDPR Delete] Deleting CV data and uploads', {
                        userId,
                        timestamp: new Date().toISOString()
                    })
                    const cvDataResult = await tx.cvData.deleteMany({
                        where: { userId: user.id }
                    })
                    deletedRecords += cvDataResult.count
                    deletionLog.push(`Deleted ${cvDataResult.count} CV data records`)

                    const cvUploadResult = await tx.cvUpload.deleteMany({
                        where: { userId: user.id }
                    })
                    deletedRecords += cvUploadResult.count
                    deletionLog.push(`Deleted ${cvUploadResult.count} CV uploads`)
                    logger.debug('[GDPR Delete] CV data and uploads deleted', {
                        userId,
                        cvDataCount: cvDataResult.count,
                        cvUploadCount: cvUploadResult.count,
                        timestamp: new Date().toISOString()
                    })
                }

                // Delete communications (if you have a communications table)
                if (deleteCommunications) {
                    logger.debug('[GDPR Delete] Communications deletion not implemented', {
                        userId,
                        timestamp: new Date().toISOString()
                    })
                    // Add your communications table deletion here
                    deletionLog.push('Communications deletion not implemented yet')
                }

                // Delete profile (this should be last)
                if (deleteProfile) {
                    logger.debug('[GDPR Delete] Deleting user profile', {
                        userId,
                        timestamp: new Date().toISOString()
                    })
                    const profileResult = await tx.profile.delete({
                        where: { userId: user.id }
                    })
                    deletedRecords += 1
                    deletionLog.push('Deleted user profile')
                    logger.debug('[GDPR Delete] User profile deleted', {
                        userId,
                        profileId: profileResult.id,
                        timestamp: new Date().toISOString()
                    })
                }

                // Log the deletion activity
                logger.debug('[GDPR Delete] Logging deletion activity', {
                    userId,
                    timestamp: new Date().toISOString()
                })
                await tx.userActivity.create({
                    data: {
                        userId: user.id,
                        action: 'data_deletion',
                        resourceType: 'privacy',
                        metadata: {
                            reason,
                            deletionOptions: {
                                deleteProfile,
                                deleteCvData,
                                deleteActivityLogs,
                                deleteCommunications,
                                deleteSessions
                            },
                            deletedRecords,
                            deletionLog,
                            deletionDate: new Date().toISOString()
                        }
                    }
                })

                logger.info('[GDPR Delete] Database transaction completed successfully', {
                    userId,
                    deletedRecords,
                    deletionLog,
                    timestamp: new Date().toISOString()
                })

                return {
                    success: true,
                    deletedRecords,
                    deletionLog
                }

            } catch (error) {
                logger.error('[GDPR Delete] Error during data deletion transaction', {
                    userId,
                    error: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined,
                    timestamp: new Date().toISOString()
                })
                throw error
            }
        })

        // Sign out the user after successful deletion
        logger.info('[GDPR Delete] Signing out user after successful deletion', {
            userId,
            timestamp: new Date().toISOString()
        })
        await supabase.auth.signOut()

        const duration = Date.now() - startTime
        logger.info('[GDPR Delete] Data deletion completed successfully', {
            userId,
            duration: `${duration}ms`,
            deletedRecords: result.deletedRecords,
            timestamp: new Date().toISOString()
        })

        return NextResponse.json({
            success: true,
            message: 'Data deleted successfully',
            deletedRecords: result.deletedRecords,
            deletionLog: result.deletionLog
        })

    } catch (error) {
        const duration = Date.now() - startTime
        logger.error('[GDPR Delete] Error deleting user data', {
            userId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
        })

        return NextResponse.json(
            { error: 'Failed to delete data' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    const startTime = Date.now()
    let userId: string | undefined

    try {
        logger.info('[GDPR Delete] Starting data summary request', {
            method: 'GET',
            endpoint: '/api/gdpr/delete',
            timestamp: new Date().toISOString()
        })

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            logger.warn('[GDPR Delete] Unauthorized access attempt for data summary', {
                endpoint: '/api/gdpr/delete',
                method: 'GET',
                timestamp: new Date().toISOString()
            })
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        userId = user.id
        logger.debug('[GDPR Delete] User authenticated for data summary', {
            userId,
            userEmail: user.email,
            timestamp: new Date().toISOString()
        })

        // Get data summary for deletion preview
        logger.debug('[GDPR Delete] Fetching data summary counts', {
            userId,
            timestamp: new Date().toISOString()
        })

        const [
            profileCount,
            cvDataCount,
            generatedContentCount,
            activityCount,
            sessionCount
        ] = await Promise.all([
            prisma.profile.count({ where: { userId: user.id } }),
            prisma.cvData.count({ where: { userId: user.id } }),
            prisma.generatedContent.count({ where: { userId: user.id } }),
            prisma.userActivity.count({ where: { userId: user.id } }),
            prisma.userSession.count({ where: { userId: user.id } })
        ])

        const dataSummary = {
            profile: profileCount,
            cvData: cvDataCount,
            generatedContent: generatedContentCount,
            activityLogs: activityCount,
            sessions: sessionCount
        }

        const duration = Date.now() - startTime
        logger.info('[GDPR Delete] Data summary fetched successfully', {
            userId,
            duration: `${duration}ms`,
            dataSummary,
            timestamp: new Date().toISOString()
        })

        return NextResponse.json({
            dataSummary
        })

    } catch (error) {
        const duration = Date.now() - startTime
        logger.error('[GDPR Delete] Error fetching data summary', {
            userId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
        })

        return NextResponse.json(
            { error: 'Failed to fetch data summary' },
            { status: 500 }
        )
    }
}
