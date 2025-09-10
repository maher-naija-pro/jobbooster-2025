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
        const { format = 'json' } = body

        // Validate format
        if (!['json', 'csv', 'pdf'].includes(format)) {
            return NextResponse.json(
                { error: 'Invalid format. Must be json, csv, or pdf' },
                { status: 400 }
            )
        }

        // Collect all user data
        const userData = await collectUserData(user.id)

        // Generate export based on format
        let exportData: string
        let contentType: string
        let filename: string

        switch (format) {
            case 'json':
                exportData = JSON.stringify(userData, null, 2)
                contentType = 'application/json'
                filename = `user-data-export-${new Date().toISOString().split('T')[0]}.json`
                break

            case 'csv':
                exportData = convertToCSV(userData)
                contentType = 'text/csv'
                filename = `user-data-export-${new Date().toISOString().split('T')[0]}.csv`
                break

            case 'pdf':
                // For PDF, you would typically use a library like puppeteer or jsPDF
                // For now, we'll return a simple text representation
                exportData = convertToText(userData)
                contentType = 'text/plain'
                filename = `user-data-export-${new Date().toISOString().split('T')[0]}.txt`
                break

            default:
                throw new Error('Unsupported format')
        }

        // Log export activity
        await prisma.userActivity.create({
            data: {
                userId: user.id,
                action: 'data_export',
                resourceType: 'privacy',
                metadata: {
                    format,
                    exportDate: new Date().toISOString(),
                    dataSize: exportData.length
                }
            }
        })

        // Return the export data
        return new NextResponse(exportData, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': exportData.length.toString()
            }
        })

    } catch (error) {
        console.error('Error exporting data:', error)
        return NextResponse.json(
            { error: 'Failed to export data' },
            { status: 500 }
        )
    }
}

async function collectUserData(userId: string) {
    // Collect all user data from database
    const [
        profile,
        cvData,
        generatedContent,
        userActivity,
        userSessions,
        cvUploads
    ] = await Promise.all([
        prisma.profile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        createdAt: true,
                        lastSignInAt: true
                    }
                }
            }
        }),
        prisma.cvData.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.generatedContent.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.userActivity.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 100 // Limit to last 100 activities
        }),
        prisma.userSession.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.cvUpload.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        })
    ])

    return {
        exportInfo: {
            exportDate: new Date().toISOString(),
            userId,
            dataVersion: '1.0'
        },
        profile: profile ? {
            ...profile,
            // Remove sensitive fields if needed
            user: profile.user ? {
                id: profile.user.id,
                email: profile.user.email,
                createdAt: profile.user.createdAt,
                lastSignInAt: profile.user.lastSignInAt
            } : null
        } : null,
        cvData: cvData.map(cv => ({
            id: cv.id,
            fileName: cv.fileName,
            fileSize: cv.fileSize,
            fileType: cv.fileType,
            createdAt: cv.createdAt,
            updatedAt: cv.updatedAt,
            // Don't include the actual file content for privacy
            hasContent: !!cv.content
        })),
        generatedContent: generatedContent.map(content => ({
            id: content.id,
            type: content.type,
            title: content.title,
            content: content.content,
            createdAt: content.createdAt,
            updatedAt: content.updatedAt
        })),
        activityLogs: userActivity.map(activity => ({
            id: activity.id,
            action: activity.action,
            resourceType: activity.resourceType,
            createdAt: activity.createdAt,
            metadata: activity.metadata
        })),
        sessions: userSessions.map(session => ({
            id: session.id,
            deviceInfo: session.deviceInfo,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
            createdAt: session.createdAt,
            lastActiveAt: session.lastActiveAt
        })),
        uploads: cvUploads.map(upload => ({
            id: upload.id,
            fileName: upload.fileName,
            fileSize: upload.fileSize,
            fileType: upload.fileType,
            status: upload.status,
            createdAt: upload.createdAt
        }))
    }
}

function convertToCSV(data: any): string {
    // Simple CSV conversion - in production, use a proper CSV library
    const csvRows: string[] = []

    // Add header
    csvRows.push('Data Type,Field,Value,Date')

    // Convert profile data
    if (data.profile) {
        Object.entries(data.profile).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    csvRows.push(`Profile,${key}.${subKey},"${subValue}",${data.profile.updatedAt || 'N/A'}`)
                })
            } else {
                csvRows.push(`Profile,${key},"${value}",${data.profile.updatedAt || 'N/A'}`)
            }
        })
    }

    // Convert CV data
    data.cvData.forEach((cv: any, index: number) => {
        csvRows.push(`CV Data,File ${index + 1},"${cv.fileName}",${cv.createdAt}`)
    })

    // Convert generated content
    data.generatedContent.forEach((content: any, index: number) => {
        csvRows.push(`Generated Content,${content.type} ${index + 1},"${content.title}",${content.createdAt}`)
    })

    return csvRows.join('\n')
}

function convertToText(data: any): string {
    let text = `USER DATA EXPORT\n`
    text += `================\n\n`
    text += `Export Date: ${data.exportInfo.exportDate}\n`
    text += `User ID: ${data.exportInfo.userId}\n\n`

    if (data.profile) {
        text += `PROFILE INFORMATION\n`
        text += `===================\n`
        text += `Email: ${data.profile.user?.email || 'N/A'}\n`
        text += `Created: ${data.profile.user?.createdAt || 'N/A'}\n`
        text += `Last Sign In: ${data.profile.user?.lastSignInAt || 'N/A'}\n\n`
    }

    text += `CV DATA (${data.cvData.length} files)\n`
    text += `========================\n`
    data.cvData.forEach((cv: any, index: number) => {
        text += `${index + 1}. ${cv.fileName} (${cv.fileSize} bytes) - ${cv.createdAt}\n`
    })

    text += `\nGENERATED CONTENT (${data.generatedContent.length} items)\n`
    text += `=====================================\n`
    data.generatedContent.forEach((content: any, index: number) => {
        text += `${index + 1}. ${content.type}: ${content.title} - ${content.createdAt}\n`
    })

    return text
}
