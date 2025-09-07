/**
 * User Registration Server Action
 * 
 * This file contains the server-side logic for user registration in the JobBooster application.
 * It handles the complete registration flow including validation, user creation, profile setup,
 * and activity logging.
 * 
 * Key Features:
 * - Form data validation using Zod schema
 * - Duplicate user prevention
 * - Supabase authentication integration
 * - Database profile creation
 * - Comprehensive logging for debugging and monitoring
 * - Error handling with detailed logging
 */

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { registerSchema } from '@/lib/auth/validation'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { checkUserExists } from '@/lib/auth/profile-utils'

/**
 * Handles user registration with comprehensive validation and logging
 * 
 * @param formData - Form data containing email, password, and confirmPassword
 * @throws {Error} When validation fails, user already exists, or Supabase signup fails
 */
export async function register(formData: FormData) {
    // Performance tracking for registration process
    const startTime = Date.now()

    // Log registration initiation with context
    logger.info('User registration initiated', {
        action: 'register',
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server-side'
    })

    // Initialize Supabase client for authentication
    const supabase = await createClient()
    logger.debug('Supabase client created for registration', {
        action: 'register',
        step: 'supabase_client_created'
    })

    // Extract form data with type safety
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
    }

    // Log form data extraction with privacy-conscious email masking
    logger.debug('Form data extracted for registration', {
        action: 'register',
        step: 'form_data_extracted',
        email: data.email ? `${data.email.substring(0, 3)}***@${data.email.split('@')[1]}` : 'null',
        hasEmail: !!data.email,
        hasPassword: !!data.password,
        hasConfirmPassword: !!data.confirmPassword,
        passwordLength: data.password ? data.password.length : 0
    })

    // Validate input data using Zod schema
    // This ensures data integrity and prevents malformed requests
    try {
        const validatedData = registerSchema.parse(data)
        logger.info('Registration data validated successfully', {
            action: 'register',
            step: 'validation_success',
            email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
        })
    } catch (validationError) {
        // Log validation failure with detailed error information
        logger.error('Registration validation failed', {
            action: 'register',
            step: 'validation_failed',
            error: validationError instanceof Error ? validationError.message : 'Unknown validation error',
            stack: validationError instanceof Error ? validationError.stack : undefined,
            inputData: {
                email: data.email ? `${data.email.substring(0, 3)}***@${data.email.split('@')[1]}` : 'null',
                hasPassword: !!data.password,
                hasConfirmPassword: !!data.confirmPassword
            }
        })
        throw validationError
    }

    // Parse validated data (redundant but ensures type safety)
    const validatedData = registerSchema.parse(data)

    // Check if user already exists before attempting registration
    // This prevents duplicate accounts and provides better user experience
    logger.debug('Checking if user already exists', {
        action: 'register',
        step: 'user_existence_check',
        email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
    })

    const userExistsResult = await checkUserExists(validatedData.email)

    // Prevent duplicate user registration
    if (userExistsResult.exists) {
        logger.warn('Registration attempt with existing email', {
            action: 'register',
            step: 'user_already_exists',
            email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null',
            source: userExistsResult.source
        })
        throw new Error('An account with this email address already exists. Please try signing in instead.')
    }

    // User doesn't exist, safe to proceed with registration
    logger.debug('User does not exist, proceeding with registration', {
        action: 'register',
        step: 'user_existence_check_passed',
        email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
    })

    // Initiate Supabase user signup with email confirmation
    logger.debug('Initiating Supabase user signup', {
        action: 'register',
        step: 'supabase_signup_initiated',
        email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null',
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    })

    // Create user account in Supabase Auth
    const { data: signUpData, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    })

    // Handle Supabase signup errors
    if (error) {
        logger.error('Supabase signup failed', {
            action: 'register',
            step: 'supabase_signup_failed',
            error: error.message,
            errorCode: error.status,
            email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null',
            supabaseError: error
        })
        throw new Error(error.message)
    }

    // Log successful Supabase signup
    logger.info('Supabase signup successful', {
        action: 'register',
        step: 'supabase_signup_success',
        userId: signUpData.user?.id ? `${signUpData.user.id.substring(0, 8)}...` : 'null',
        email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null',
        emailConfirmed: signUpData.user?.email_confirmed_at ? true : false
    })

    // Create user profile immediately after signup (even before email confirmation)
    // This ensures the user has a profile record for immediate use
    if (signUpData.user) {
        try {
            // Log profile creation initiation
            logger.debug('Creating user profile after signup', {
                action: 'register',
                step: 'profile_creation_initiated',
                userId: signUpData.user.id ? `${signUpData.user.id.substring(0, 8)}...` : 'null',
                email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
            })

            // Create or update user profile in database
            // Uses upsert to handle potential race conditions
            await prisma.profile.upsert({
                where: { userId: signUpData.user.id },
                update: {
                    email: validatedData.email,
                    updatedAt: new Date()
                },
                create: {
                    userId: signUpData.user.id,
                    email: validatedData.email,
                    fullName: '', // Will be updated later when user provides it
                    preferences: {},
                    subscription: { plan: 'free' }, // JSON object - Prisma will handle serialization
                    isActive: true,
                    isDeleted: false,
                    gdprConsent: false, // Will be updated when user accepts terms
                    loginCount: 0,
                    streakDays: 0,
                    longestStreak: 0,
                    errorCount: 0,
                    warningCount: 0
                }
            })

            // Log successful profile creation
            logger.info('User profile created successfully', {
                action: 'register',
                step: 'profile_creation_success',
                userId: signUpData.user.id ? `${signUpData.user.id.substring(0, 8)}...` : 'null',
                email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
            })

            // Log the registration activity for audit trail
            try {
                await prisma.userActivity.create({
                    data: {
                        userId: signUpData.user.id,
                        action: 'user_registered',
                        resourceType: 'profile',
                        metadata: {
                            email: validatedData.email,
                            registrationMethod: 'email',
                            emailConfirmed: false
                        }
                    }
                })

                // Log activity creation success
                logger.info('User registration activity logged', {
                    action: 'register',
                    step: 'activity_logged',
                    userId: signUpData.user.id ? `${signUpData.user.id.substring(0, 8)}...` : 'null',
                    email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
                })
            } catch (activityError) {
                // Log activity creation error but don't fail registration
                logger.warn('Failed to log user registration activity', {
                    action: 'register',
                    step: 'activity_logging_failed',
                    error: activityError instanceof Error ? activityError.message : 'Unknown activity error',
                    userId: signUpData.user.id ? `${signUpData.user.id.substring(0, 8)}...` : 'null',
                    email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
                })
                // Don't throw - activity logging failure shouldn't break registration
            }
        } catch (profileError) {
            // Log profile creation error
            logger.error('Error creating user profile during registration', {
                action: 'register',
                step: 'profile_creation_failed',
                error: profileError instanceof Error ? profileError.message : 'Unknown profile error',
                stack: profileError instanceof Error ? profileError.stack : undefined,
                userId: signUpData.user.id ? `${signUpData.user.id.substring(0, 8)}...` : 'null',
                email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
            })

            // Re-throw the error so it can be displayed in the modal
            throw new Error(`Failed to create user profile: ${profileError instanceof Error ? profileError.message : 'Unknown error'}`)
        }
    }

    // Revalidate Next.js cache to reflect new user state
    logger.debug('Revalidating paths after registration', {
        action: 'register',
        step: 'path_revalidation'
    })

    revalidatePath('/', 'layout')

    // Calculate and log total registration duration
    const totalDuration = Date.now() - startTime
    logger.info('User registration completed successfully', {
        action: 'register',
        step: 'registration_completed',
        userId: signUpData.user?.id ? `${signUpData.user.id.substring(0, 8)}...` : 'null',
        email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null',
        duration: `${totalDuration}ms`
    })

    // Don't redirect - let the modal close naturally
    // The user will receive an email confirmation link
}
