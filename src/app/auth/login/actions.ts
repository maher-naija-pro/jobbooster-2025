'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { loginSchema } from '@/lib/auth/validation'
import { createUserSession } from '@/lib/auth/session-manager'
import { headers } from 'next/headers'
import { logger } from '@/lib/logger'

export async function login(formData: FormData) {
    const startTime = Date.now()
    logger.info('User login initiated', {
        action: 'login',
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server-side'
    })

    const supabase = await createClient()
    logger.debug('Supabase client created for login', {
        action: 'login',
        step: 'supabase_client_created'
    })

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    logger.debug('Form data extracted for login', {
        action: 'login',
        step: 'form_data_extracted',
        email: data.email ? `${data.email.substring(0, 3)}***@${data.email.split('@')[1]}` : 'null',
        hasEmail: !!data.email,
        hasPassword: !!data.password,
        passwordLength: data.password ? data.password.length : 0
    })

    try {
        // Validate input
        const validatedData = loginSchema.parse(data)
        logger.info('Login data validated successfully', {
            action: 'login',
            step: 'validation_success',
            email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
        })

        logger.debug('Initiating Supabase authentication', {
            action: 'login',
            step: 'supabase_auth_initiated',
            email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
        })

        const { data: authData, error } = await supabase.auth.signInWithPassword(validatedData)

        if (error) {
            logger.warn('Supabase authentication failed', {
                action: 'login',
                step: 'supabase_auth_failed',
                error: error.message,
                errorCode: error.status,
                email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null',
                supabaseError: error
            })
            // Map Supabase errors to user-friendly messages
            const userFriendlyMessage = mapAuthErrorToMessage(error.message)
            throw new Error(userFriendlyMessage)
        }

        logger.info('Supabase authentication successful', {
            action: 'login',
            step: 'supabase_auth_success',
            userId: authData.user?.id ? `${authData.user.id.substring(0, 8)}...` : 'null',
            email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null',
            hasSession: !!authData.session
        })

        // Create session tracking record
        if (authData.user && authData.session?.access_token) {
            try {
                logger.debug('Creating user session tracking', {
                    action: 'login',
                    step: 'session_tracking_initiated',
                    userId: authData.user.id ? `${authData.user.id.substring(0, 8)}...` : 'null'
                })

                const headersList = await headers()
                // Use environment variable for base URL, fallback to localhost for development
                const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000'
                const request = new Request(baseUrl, {
                    headers: headersList
                })
                await createUserSession(authData.user, authData.session.access_token, request)

                logger.info('User session tracking created successfully', {
                    action: 'login',
                    step: 'session_tracking_success',
                    userId: authData.user.id ? `${authData.user.id.substring(0, 8)}...` : 'null'
                })
            } catch (sessionError) {
                logger.error('Error creating session tracking', {
                    action: 'login',
                    step: 'session_tracking_failed',
                    error: sessionError instanceof Error ? sessionError.message : 'Unknown session error',
                    stack: sessionError instanceof Error ? sessionError.stack : undefined,
                    userId: authData.user.id ? `${authData.user.id.substring(0, 8)}...` : 'null'
                })
                // Don't fail login if session tracking fails
            }
        }

        logger.debug('Revalidating paths after login', {
            action: 'login',
            step: 'path_revalidation'
        })

        revalidatePath('/', 'layout')

        const totalDuration = Date.now() - startTime
        logger.info('User login completed successfully', {
            action: 'login',
            step: 'login_completed',
            userId: authData.user?.id ? `${authData.user.id.substring(0, 8)}...` : 'null',
            email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null',
            duration: `${totalDuration}ms`
        })

        return { success: true }
    } catch (error) {
        const duration = Date.now() - startTime
        logger.error('Login failed', {
            action: 'login',
            step: 'login_failed',
            error: error instanceof Error ? error.message : 'Unknown login error',
            stack: error instanceof Error ? error.stack : undefined,
            duration: `${duration}ms`,
            email: data.email ? `${data.email.substring(0, 3)}***@${data.email.split('@')[1]}` : 'null'
        })

        if (error instanceof Error) {
            throw error
        }
        throw new Error('An unexpected error occurred. Please try again.')
    }
}

function mapAuthErrorToMessage(errorMessage: string): string {
    const errorMap: Record<string, string> = {
        'Invalid login credentials': 'The email or password you entered is incorrect. Please check your credentials and try again.',
        'Email not confirmed': 'Please check your email and click the confirmation link before signing in.',
        'Too many requests': 'Too many login attempts. Please wait a few minutes before trying again.',
        'User not found': 'No account found with this email address. Please check your email or create a new account.',
        'Invalid email': 'Please enter a valid email address.',
        'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
        'Signup is disabled': 'Account creation is currently disabled. Please contact support.',
        'Email address not authorized': 'This email address is not authorized to access the system.',
        'Account is disabled': 'Your account has been disabled. Please contact support for assistance.',
    }

    // Check for exact matches first
    if (errorMap[errorMessage]) {
        return errorMap[errorMessage]
    }

    // Check for partial matches for more specific error handling
    if (errorMessage.includes('Invalid login credentials')) {
        return 'The email or password you entered is incorrect. Please check your credentials and try again.'
    }

    if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
        return 'No account found with this email address. Please check your email or create a new account.'
    }

    if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
        return 'Too many login attempts. Please wait a few minutes before trying again.'
    }

    // Default fallback for unknown errors
    return 'Login failed. Please check your credentials and try again.'
}
