'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { registerSchema } from '@/lib/auth/validation'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function register(formData: FormData) {
    const startTime = Date.now()
    logger.info('User registration initiated', {
        action: 'register',
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server-side'
    })

    const supabase = await createClient()
    logger.debug('Supabase client created for registration', {
        action: 'register',
        step: 'supabase_client_created'
    })

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
    }

    logger.debug('Form data extracted for registration', {
        action: 'register',
        step: 'form_data_extracted',
        email: data.email ? `${data.email.substring(0, 3)}***@${data.email.split('@')[1]}` : 'null',
        hasEmail: !!data.email,
        hasPassword: !!data.password,
        hasConfirmPassword: !!data.confirmPassword,
        passwordLength: data.password ? data.password.length : 0
    })

    // Validate input
    try {
        const validatedData = registerSchema.parse(data)
        logger.info('Registration data validated successfully', {
            action: 'register',
            step: 'validation_success',
            email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
        })
    } catch (validationError) {
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

    const validatedData = registerSchema.parse(data)

    logger.debug('Initiating Supabase user signup', {
        action: 'register',
        step: 'supabase_signup_initiated',
        email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null',
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    })

    const { data: signUpData, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    })

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

    logger.info('Supabase signup successful', {
        action: 'register',
        step: 'supabase_signup_success',
        userId: signUpData.user?.id ? `${signUpData.user.id.substring(0, 8)}...` : 'null',
        email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null',
        emailConfirmed: signUpData.user?.email_confirmed_at ? true : false
    })

    // Create user profile immediately after signup (even before email confirmation)
    if (signUpData.user) {
        try {
            logger.debug('Creating user profile after signup', {
                action: 'register',
                step: 'profile_creation_initiated',
                userId: signUpData.user.id ? `${signUpData.user.id.substring(0, 8)}...` : 'null',
                email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
            })

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
                    subscription: { plan: 'free' }
                }
            })

            logger.info('User profile created successfully', {
                action: 'register',
                step: 'profile_creation_success',
                userId: signUpData.user.id ? `${signUpData.user.id.substring(0, 8)}...` : 'null',
                email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
            })

            // Log the registration activity
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

            logger.info('User registration activity logged', {
                action: 'register',
                step: 'activity_logged',
                userId: signUpData.user.id ? `${signUpData.user.id.substring(0, 8)}...` : 'null',
                email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
            })
        } catch (profileError) {
            logger.error('Error creating user profile during registration', {
                action: 'register',
                step: 'profile_creation_failed',
                error: profileError instanceof Error ? profileError.message : 'Unknown profile error',
                stack: profileError instanceof Error ? profileError.stack : undefined,
                userId: signUpData.user.id ? `${signUpData.user.id.substring(0, 8)}...` : 'null',
                email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
            })
            // Don't fail the registration if profile creation fails
            // The profile will be created in the callback as a fallback
        }
    }

    logger.debug('Revalidating paths after registration', {
        action: 'register',
        step: 'path_revalidation'
    })

    revalidatePath('/', 'layout')

    const totalDuration = Date.now() - startTime
    logger.info('User registration completed successfully', {
        action: 'register',
        step: 'registration_completed',
        userId: signUpData.user?.id ? `${signUpData.user.id.substring(0, 8)}...` : 'null',
        email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null',
        duration: `${totalDuration}ms`
    })

    // Don't redirect - let the modal close naturally
}
