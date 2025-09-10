import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const {
            deleteProfile = true,
            deleteCvData = true,
            deleteActivityLogs = true,
            deleteCommunications = true,
            deleteSessions = true,
            reason = ''
        } = body

        // Validate reason
        if (!reason.trim()) {
            return NextResponse.json(
                { error: 'Deletion reason is required' },
                { status: 400 }
            )
        }

        // Start a transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            const deletionLog: string[] = []
            let deletedRecords = 0

            try {
                // Delete user sessions
                if (deleteSessions) {
                    const sessionResult = await tx.userSession.deleteMany({
                        where: { userId: user.id }
                    })
                    deletedRecords += sessionResult.count
                    deletionLog.push(`Deleted ${sessionResult.count} user sessions`)
                }

                // Delete user activity logs
                if (deleteActivityLogs) {
                    const activityResult = await tx.userActivity.deleteMany({
                        where: { userId: user.id }
                    })
                    deletedRecords += activityResult.count
                    deletionLog.push(`Deleted ${activityResult.count} activity logs`)
                }

                // Delete generated content
                if (deleteCvData) {
                    const contentResult = await tx.generatedContent.deleteMany({
                        where: { userId: user.id }
                    })
                    deletedRecords += contentResult.count
                    deletionLog.push(`Deleted ${contentResult.count} generated content items`)
                }

                // Delete CV data
                if (deleteCvData) {
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
                }

                // Delete communications (if you have a communications table)
                if (deleteCommunications) {
                    // Add your communications table deletion here
                    deletionLog.push('Communications deletion not implemented yet')
                }

                // Delete profile (this should be last)
                if (deleteProfile) {
                    const profileResult = await tx.profile.delete({
                        where: { userId: user.id }
                    })
                    deletedRecords += 1
                    deletionLog.push('Deleted user profile')
                }

                // Log the deletion activity
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

                return {
                    success: true,
                    deletedRecords,
                    deletionLog
                }

            } catch (error) {
                console.error('Error during data deletion transaction:', error)
                throw error
            }
        })

        // Sign out the user after successful deletion
        await supabase.auth.signOut()

        return NextResponse.json({
            success: true,
            message: 'Data deleted successfully',
            deletedRecords: result.deletedRecords,
            deletionLog: result.deletionLog
        })

    } catch (error) {
        console.error('Error deleting user data:', error)
        return NextResponse.json(
            { error: 'Failed to delete data' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get data summary for deletion preview
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

        return NextResponse.json({
            dataSummary: {
                profile: profileCount,
                cvData: cvDataCount,
                generatedContent: generatedContentCount,
                activityLogs: activityCount,
                sessions: sessionCount
            }
        })

    } catch (error) {
        console.error('Error fetching data summary:', error)
        return NextResponse.json(
            { error: 'Failed to fetch data summary' },
            { status: 500 }
        )
    }
}
