'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { updateProfileSchema } from '@/lib/auth/validation'
import { ensureUserProfile } from '@/lib/auth/profile-utils'

export async function getProfile(userId: string) {
  try {
    let profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        userSessions: {
          orderBy: { lastActivity: 'desc' },
          take: 5
        },
        userActivities: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        cvData: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        generatedContent: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    // If profile doesn't exist, create it as a fallback
    if (!profile) {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user && user.id === userId) {
        const result = await ensureUserProfile(userId, user.email!)
        if (result.success && result.profile) {
          profile = result.profile
        }
      }
    }

    return profile
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const data = {
    fullName: formData.get('fullName') as string,
    username: formData.get('username') as string,
  }

  // Validate input
  const validatedData = updateProfileSchema.parse(data)

  try {
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        fullName: validatedData.fullName,
        username: validatedData.username,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        email: user.email!,
        fullName: validatedData.fullName,
        username: validatedData.username,
      }
    })

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'profile_updated',
        resourceType: 'profile',
        metadata: {
          fields: Object.keys(validatedData)
        }
      }
    })

    revalidatePath('/profile')
    revalidatePath('/dashboard')
  } catch (error) {
    console.error('Error updating profile:', error)
    redirect('/error?message=' + encodeURIComponent('Failed to update profile'))
  }
}

export async function updatePreferences(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const preferences = {
    language: formData.get('language') as string,
    timezone: formData.get('timezone') as string,
    notifications: {
      email: formData.get('emailNotifications') === 'on',
      push: formData.get('pushNotifications') === 'on',
      marketing: formData.get('marketingNotifications') === 'on',
    },
    privacy: {
      profileVisibility: formData.get('profileVisibility') as 'public' | 'private',
      dataRetention: parseInt(formData.get('dataRetention') as string) || 365,
    }
  }

  try {
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        preferences,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        email: user.email!,
        preferences,
      }
    })

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'preferences_updated',
        resourceType: 'preferences',
        metadata: { preferences }
      }
    })

    revalidatePath('/profile')
    revalidatePath('/dashboard')
  } catch (error) {
    console.error('Error updating preferences:', error)
    redirect('/error?message=' + encodeURIComponent('Failed to update preferences'))
  }
}

export async function deleteAccount() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  try {
    // Delete all user data
    await prisma.userActivity.deleteMany({
      where: { userId: user.id }
    })

    await prisma.userSession.deleteMany({
      where: { userId: user.id }
    })

    await prisma.generatedContent.deleteMany({
      where: { userId: user.id }
    })

    await prisma.cvData.deleteMany({
      where: { userId: user.id }
    })

    await prisma.profile.delete({
      where: { userId: user.id }
    })

    // Sign out and delete auth user
    await supabase.auth.signOut()

    redirect('/?message=' + encodeURIComponent('Account deleted successfully'))
  } catch (error) {
    console.error('Error deleting account:', error)
    redirect('/error?message=' + encodeURIComponent('Failed to delete account'))
  }
}
