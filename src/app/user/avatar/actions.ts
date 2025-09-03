'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const file = formData.get('avatar') as File
  
  if (!file) {
    redirect('/error?message=' + encodeURIComponent('No file provided'))
  }

  // Validate file
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    redirect('/error?message=' + encodeURIComponent('File size must be less than 5MB'))
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    redirect('/error?message=' + encodeURIComponent('Only JPEG, PNG, and WebP images are allowed'))
  }

  try {
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
      redirect('/error?message=' + encodeURIComponent('Failed to upload avatar'))
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

    revalidatePath('/profile')
    revalidatePath('/dashboard')
  } catch (error) {
    console.error('Error uploading avatar:', error)
    redirect('/error?message=' + encodeURIComponent('Failed to upload avatar'))
  }
}

export async function deleteAvatar() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  try {
    // Get current profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    if (profile?.avatarUrl) {
      // Extract file path from URL
      const url = new URL(profile.avatarUrl)
      const filePath = url.pathname.split('/').slice(-2).join('/') // Get 'avatars/filename'

      // Delete from Supabase Storage
      await supabase.storage
        .from('avatars')
        .remove([filePath])
    }

    // Update profile to remove avatar URL
    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        avatarUrl: null,
        updatedAt: new Date()
      }
    })

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'avatar_deleted',
        resourceType: 'avatar'
      }
    })

    revalidatePath('/profile')
    revalidatePath('/dashboard')
  } catch (error) {
    console.error('Error deleting avatar:', error)
    redirect('/error?message=' + encodeURIComponent('Failed to delete avatar'))
  }
}
