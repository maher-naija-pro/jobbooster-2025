import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureAvatarsBucket } from '@/lib/supabase/storage'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('avatar') as File

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
        }

        // Validate file
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({ success: false, error: 'File size must be less than 5MB' }, { status: 400 })
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ success: false, error: 'Only JPEG, PNG, and WebP images are allowed' }, { status: 400 })
        }

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
