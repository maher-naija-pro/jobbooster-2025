import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
    const startTime = Date.now()
    const { searchParams, origin } = new URL(request.url)
    const token = searchParams.get('token')
    const type = searchParams.get('type')
    const error = searchParams.get('error')
    const errorCode = searchParams.get('error_code')
    const errorDescription = searchParams.get('error_description')

    logger.info('Auth confirm callback initiated', {
        action: 'authConfirmCallback',
        step: 'callback_received',
        hasToken: !!token,
        type: type,
        error: error,
        errorCode: errorCode,
        origin: origin,
        timestamp: new Date().toISOString()
    })

    // Handle Supabase errors
    if (error) {
        logger.warn('Auth confirm callback received error from Supabase', {
            action: 'authConfirmCallback',
            step: 'supabase_error',
            error: error,
            errorCode: errorCode,
            errorDescription: errorDescription,
            duration: `${Date.now() - startTime}ms`
        })

        let errorMessage = 'An error occurred during authentication'

        if (errorCode === 'otp_expired') {
            errorMessage = 'Verification link has expired. Please request a new one.'
        } else if (errorCode === 'access_denied') {
            errorMessage = 'Access denied. Please request a new verification link.'
        } else if (errorDescription) {
            errorMessage = decodeURIComponent(errorDescription.replace(/\+/g, ' '))
        }

        // Redirect based on type
        if (type === 'recovery') {
            return NextResponse.redirect(`${origin}/auth/reset-password?message=${encodeURIComponent(errorMessage)}`)
        } else {
            return NextResponse.redirect(`${origin}/auth/confirm?message=${encodeURIComponent(errorMessage)}`)
        }
    }

    // Check if we have a token
    if (!token) {
        logger.warn('Invalid auth confirm callback parameters', {
            action: 'authConfirmCallback',
            step: 'invalid_parameters',
            type: type,
            hasToken: !!token,
            duration: `${Date.now() - startTime}ms`
        })

        const errorMessage = 'Invalid verification link'
        if (type === 'recovery') {
            return NextResponse.redirect(`${origin}/auth/reset-password?message=${encodeURIComponent(errorMessage)}`)
        } else {
            return NextResponse.redirect(`${origin}/auth/confirm?message=${encodeURIComponent(errorMessage)}`)
        }
    }

    try {
        const supabase = await createClient()
        logger.debug('Supabase client created for auth confirm callback', {
            action: 'authConfirmCallback',
            step: 'supabase_client_created'
        })

        // Exchange the token for a session
        const { error } = await supabase.auth.exchangeCodeForSession(token)

        if (error) {
            logger.error('Auth confirm session exchange failed', {
                action: 'authConfirmCallback',
                step: 'session_exchange_failed',
                error: error.message,
                errorCode: error.status,
                duration: `${Date.now() - startTime}ms`
            })

            const errorMessage = 'Invalid or expired verification link'
            if (type === 'recovery') {
                return NextResponse.redirect(`${origin}/auth/reset-password?message=${encodeURIComponent(errorMessage)}`)
            } else {
                return NextResponse.redirect(`${origin}/auth/confirm?message=${encodeURIComponent(errorMessage)}`)
            }
        }

        logger.debug('Auth confirm session exchanged successfully', {
            action: 'authConfirmCallback',
            step: 'session_exchanged',
            type: type
        })

        // Get the user to verify they're authenticated
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError) {
            logger.error('Failed to get user after session exchange', {
                action: 'authConfirmCallback',
                step: 'get_user_failed',
                error: userError.message,
                duration: `${Date.now() - startTime}ms`
            })

            const errorMessage = 'Authentication failed'
            if (type === 'recovery') {
                return NextResponse.redirect(`${origin}/auth/reset-password?message=${encodeURIComponent(errorMessage)}`)
            } else {
                return NextResponse.redirect(`${origin}/auth/confirm?message=${encodeURIComponent(errorMessage)}`)
            }
        }

        if (!user) {
            logger.warn('No user found after successful session exchange', {
                action: 'authConfirmCallback',
                step: 'no_user_found',
                duration: `${Date.now() - startTime}ms`
            })

            const errorMessage = 'Authentication failed'
            if (type === 'recovery') {
                return NextResponse.redirect(`${origin}/auth/reset-password?message=${encodeURIComponent(errorMessage)}`)
            } else {
                return NextResponse.redirect(`${origin}/auth/confirm?message=${encodeURIComponent(errorMessage)}`)
            }
        }

        // Handle different types of confirmation
        if (type === 'recovery') {
            logger.info('Password recovery callback successful, redirecting to update password page', {
                action: 'authConfirmCallback',
                step: 'redirect_to_update_password',
                userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
                userEmail: user.email ? `${user.email.substring(0, 3)}***@${user.email.split('@')[1]}` : 'null',
                duration: `${Date.now() - startTime}ms`,
                redirectUrl: `${origin}/auth/update-password?message=Please enter your new password`
            })

            // Redirect to the update password page with success message
            return NextResponse.redirect(`${origin}/auth/update-password?message=Please enter your new password`)
        } else {
            // Default email verification
            logger.info('Email verification callback successful, redirecting to dashboard', {
                action: 'authConfirmCallback',
                step: 'redirect_to_dashboard',
                userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
                userEmail: user.email ? `${user.email.substring(0, 3)}***@${user.email.split('@')[1]}` : 'null',
                duration: `${Date.now() - startTime}ms`,
                redirectUrl: `${origin}/dashboard`
            })

            // Redirect to dashboard with success message
            return NextResponse.redirect(`${origin}/dashboard?message=Email verified successfully!`)
        }

    } catch (error) {
        const duration = Date.now() - startTime
        logger.error('Unexpected error in auth confirm callback', {
            action: 'authConfirmCallback',
            step: 'unexpected_error',
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            duration: `${duration}ms`
        })

        const errorMessage = 'An error occurred during authentication'
        if (type === 'recovery') {
            return NextResponse.redirect(`${origin}/auth/reset-password?message=${encodeURIComponent(errorMessage)}`)
        } else {
            return NextResponse.redirect(`${origin}/auth/confirm?message=${encodeURIComponent(errorMessage)}`)
        }
    }
}
