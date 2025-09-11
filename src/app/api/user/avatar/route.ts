import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureAvatarsBucket } from '@/lib/supabase/storage'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
    const requestId = crypto.randomUUID()
    logger.info('Avatar upload request started', {
        requestId,
        userAgent: request.headers.get('user-agent'),
        contentType: request.headers.get('content-type')
    })

    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            logger.warn('Avatar upload failed - user not authenticated', {
                requestId,
                ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
            })
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
        }

        logger.debug('User authenticated for avatar upload', {
            requestId,
            userId: user.id,
            userEmail: user.email
        })

        const formData = await request.formData()
        const file = formData.get('avatar') as File

        if (!file) {
            logger.warn('Avatar upload failed - no file provided', {
                requestId,
                userId: user.id
            })
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
        }

        logger.debug('File received for avatar upload', {
            requestId,
            userId: user.id,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        })

        // Validate file
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            logger.warn('Avatar upload failed - file too large', {
                requestId,
                userId: user.id,
                fileSize: file.size,
                maxSize,
                fileName: file.name
            })
            return NextResponse.json({ success: false, error: 'File size must be less than 5MB' }, { status: 400 })
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            logger.warn('Avatar upload failed - invalid file type', {
                requestId,
                userId: user.id,
                fileType: file.type,
                allowedTypes,
                fileName: file.name
            })
            return NextResponse.json({ success: false, error: 'Only JPEG, PNG, and WebP images are allowed' }, { status: 400 })
        }

        logger.debug('File validation passed', {
            requestId,
            userId: user.id,
            fileName: file.name
        })

        // Ensure avatars bucket exists
        await ensureAvatarsBucket()

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json({
                success: false,
                error: `Failed to upload avatar: ${uploadError.message || 'Unknown storage error'}`
            }, { status: 500 })
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)

        // Update profile with new avatar URL
        await prisma.profile.upsert({
            where: { userId: user.id },
            update: {
                avatarUrl: publicUrl,
                updatedAt: new Date()
            },
            create: {
                userId: user.id,
                email: user.email!,
                avatarUrl: publicUrl,
            }
        })

        // Log activity
        await prisma.userActivity.create({
            data: {
                userId: user.id,
                action: 'avatar_uploaded',
                resourceType: 'avatar',
                metadata: {
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    filePath
                }
            }
        })

        return NextResponse.json({ success: true, message: 'Avatar uploaded successfully' })
    } catch (error) {
        console.error('Error uploading avatar:', error)
        return NextResponse.json({ success: false, error: 'Failed to upload avatar' }, { status: 500 })
    }
}
