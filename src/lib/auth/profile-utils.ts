import { prisma } from '@/lib/prisma'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

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
        logger.debug('Creating user profile', {
            action: 'create_user_profile',
            step: 'initiated',
            userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
            email: user.email ? `${user.email.substring(0, 3)}***@${user.email.split('@')[1]}` : 'null',
            registrationMethod,
            hasAdditionalData: Object.keys(additionalData).length > 0
        })

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
                fullName: additionalData.fullName || '',
                username: additionalData.username,
                avatarUrl: additionalData.avatarUrl,
                preferences: {},
                subscription: { plan: 'free' }
            }
        })

        logger.info('User profile created successfully', {
            action: 'create_user_profile',
            step: 'profile_created',
            userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
            email: user.email ? `${user.email.substring(0, 3)}***@${user.email.split('@')[1]}` : 'null',
            profileId: profile.id ? `${profile.id.substring(0, 8)}...` : 'null',
            isUpdate: profile.updatedAt > profile.createdAt
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

        logger.debug('User activity logged', {
            action: 'create_user_profile',
            step: 'activity_logged',
            userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
            registrationMethod
        })

        return { success: true, profile }
    } catch (error) {
        logger.error('Error creating user profile', {
            action: 'create_user_profile',
            step: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
            email: user.email ? `${user.email.substring(0, 3)}***@${user.email.split('@')[1]}` : 'null',
            registrationMethod
        })
        return { success: false, error }
    }
}

/**
 * Ensures a user profile exists, creating it if it doesn't
 * This is a fallback for cases where profile creation might have failed
 */
export async function ensureUserProfile(userId: string, email: string) {
    try {
        logger.debug('Ensuring user profile exists', {
            action: 'ensure_user_profile',
            step: 'initiated',
            userId: userId ? `${userId.substring(0, 8)}...` : 'null',
            email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null'
        })

        const existingProfile = await prisma.profile.findUnique({
            where: { userId }
        })

        if (existingProfile) {
            logger.debug('User profile already exists', {
                action: 'ensure_user_profile',
                step: 'profile_found',
                userId: userId ? `${userId.substring(0, 8)}...` : 'null',
                email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null',
                profileId: existingProfile.id ? `${existingProfile.id.substring(0, 8)}...` : 'null'
            })
            return { success: true, profile: existingProfile, created: false }
        }

        logger.warn('User profile not found - this should not happen in normal flow', {
            action: 'ensure_user_profile',
            step: 'profile_not_found',
            userId: userId ? `${userId.substring(0, 8)}...` : 'null',
            email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null'
        })

        return { success: true }
    } catch (error) {
        logger.error('Error ensuring user profile', {
            action: 'ensure_user_profile',
            step: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            userId: userId ? `${userId.substring(0, 8)}...` : 'null',
            email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null'
        })
        return { success: false, error }
    }
}

/**
 * Checks if a user already exists by email address
 * This function checks both Supabase auth and our database profile
 */
export async function checkUserExists(email: string) {
    try {
        logger.debug('Checking if user exists by email', {
            action: 'check_user_exists',
            step: 'initiated',
            email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null'
        })

        // First check if user exists in our database profile
        const existingProfile = await prisma.profile.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (existingProfile) {
            logger.info('User exists in database profile', {
                action: 'check_user_exists',
                step: 'profile_found',
                email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null',
                userId: existingProfile.userId ? `${existingProfile.userId.substring(0, 8)}...` : 'null'
            })
            return { exists: true, source: 'database', profile: existingProfile }
        }

        // Also check Supabase auth to be thorough
        const supabase = await createClient()
        const { data: authUsers, error } = await supabase.auth.admin.listUsers()

        if (error) {
            logger.warn('Error checking Supabase auth users', {
                action: 'check_user_exists',
                step: 'supabase_check_failed',
                error: error.message,
                email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null'
            })
            // If we can't check Supabase, but user doesn't exist in our DB, assume they don't exist
            return { exists: false, source: 'database_only' }
        }

        const existingAuthUser = authUsers.users.find(user =>
            user.email?.toLowerCase() === email.toLowerCase()
        )

        if (existingAuthUser) {
            logger.info('User exists in Supabase auth', {
                action: 'check_user_exists',
                step: 'auth_found',
                email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null',
                userId: existingAuthUser.id ? `${existingAuthUser.id.substring(0, 8)}...` : 'null'
            })
            return { exists: true, source: 'auth', user: existingAuthUser }
        }

        logger.debug('User does not exist', {
            action: 'check_user_exists',
            step: 'not_found',
            email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null'
        })

        return { exists: false, source: 'both' }
    } catch (error) {
        logger.error('Error checking if user exists', {
            action: 'check_user_exists',
            step: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null'
        })
        // If there's an error checking, assume user doesn't exist to avoid blocking registration
        return { exists: false, source: 'error', error }
    }
}
