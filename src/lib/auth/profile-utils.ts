import { prisma } from '@/lib/prisma'
import { User } from '@supabase/supabase-js'

export interface CreateProfileOptions {
    user: User
    registrationMethod?: string
    additionalData?: {
        fullName?: string
        username?: string
        avatarUrl?: string
    }
}

/**
 * Creates a user profile in the database immediately after authentication
 * This ensures real-time profile creation during registration
 */
export async function createUserProfile({
    user,
    registrationMethod = 'email',
    additionalData = {}
}: CreateProfileOptions) {
    try {
        // Create user profile immediately
        const profile = await prisma.profile.upsert({
            where: { userId: user.id },
            update: {
                // Update email in case it changed
                email: user.email!,
                ...(additionalData.fullName && { fullName: additionalData.fullName }),
                ...(additionalData.username && { username: additionalData.username }),
                ...(additionalData.avatarUrl && { avatarUrl: additionalData.avatarUrl }),
                updatedAt: new Date()
            },
            create: {
                userId: user.id,
                email: user.email!,
                fullName: additionalData.fullName,
                username: additionalData.username,
                avatarUrl: additionalData.avatarUrl,
                preferences: {},
                subscription: { plan: 'free' }
            }
        })

        // Log the registration activity
        await prisma.userActivity.create({
            data: {
                userId: user.id,
                action: 'user_registered',
                resourceType: 'profile',
                metadata: {
                    email: user.email,
                    registrationMethod,
                    provider: user.app_metadata?.provider,
                    ...additionalData
                }
            }
        })

        return { success: true, profile }
    } catch (error) {
        console.error('Error creating user profile:', error)
        return { success: false, error }
    }
}

/**
 * Ensures a user profile exists, creating it if it doesn't
 * This is a fallback for cases where profile creation might have failed
 */
export async function ensureUserProfile(userId: string, email: string) {
    try {
        const existingProfile = await prisma.profile.findUnique({
            where: { userId }
        })

        if (existingProfile) {
            return { success: true, profile: existingProfile, created: false }
        }

        // Create profile if it doesn't exist
        const profile = await prisma.profile.create({
            data: {
                userId,
                email,
                preferences: {},
                subscription: { plan: 'free' }
            }
        })

        // Log the profile creation
        await prisma.userActivity.create({
            data: {
                userId,
                action: 'profile_created',
                resourceType: 'profile',
                metadata: {
                    email,
                    method: 'fallback_creation'
                }
            }
        })

        return { success: true, profile, created: true }
    } catch (error) {
        console.error('Error ensuring user profile:', error)
        return { success: false, error }
    }
}
