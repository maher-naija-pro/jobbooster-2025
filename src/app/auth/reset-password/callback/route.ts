import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
    const startTime = Date.now()
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const type = searchParams.get('type')
    const error = searchParams.get('error')
    const errorCode = searchParams.get('error_code')
    const errorDescription = searchParams.get('error_description')

    logger.info('Password reset callback initiated', {
        action: 'passwordResetCallback',
        step: 'callback_received',
        hasCode: !!code,
        type: type,
        error: error,
        errorCode: errorCode,
        origin: origin,
        timestamp: new Date().toISOString()
    })

    // Handle Supabase errors (like expired OTP)
    if (error) {
        logger.warn('Password reset callback received error from Supabase', {
            action: 'passwordResetCallback',
            step: 'supabase_error',
            error: error,
            errorCode: errorCode,
            errorDescription: errorDescription,
            duration: `${Date.now() - startTime}ms`
        })

        let errorMessage = 'An error occurred during password reset'

        if (errorCode === 'otp_expired') {
            errorMessage = 'Password reset link has expired. Please request a new one.'
        } else if (errorCode === 'access_denied') {
            errorMessage = 'Access denied. Please request a new password reset link.'
        } else if (errorDescription) {
            errorMessage = decodeURIComponent(errorDescription.replace(/\+/g, ' '))
        }

        return NextResponse.redirect(`${origin}/auth/reset-password?message=${encodeURIComponent(errorMessage)}`)
    }

    // Only handle password recovery - allow null type if code is present (Supabase behavior)
    if (!code || (type && type !== 'recovery')) {
        logger.warn('Invalid password reset callback parameters', {
            action: 'passwordResetCallback',
            step: 'invalid_parameters',
            type: type,
            hasCode: !!code,
            duration: `${Date.now() - startTime}ms`
        })
        return NextResponse.redirect(`${origin}/auth/reset-password?message=Invalid reset link`)
    }

    try {
        const supabase = await createClient()
        logger.debug('Supabase client created for password reset callback', {
            action: 'passwordResetCallback',
            step: 'supabase_client_created'
        })

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            logger.error('Password reset session exchange failed', {
                action: 'passwordResetCallback',
                step: 'session_exchange_failed',
                error: error.message,
                errorCode: error.status,
                duration: `${Date.now() - startTime}ms`
            })
            return NextResponse.redirect(`${origin}/auth/reset-password?message=Invalid or expired reset link`)
        }

        logger.debug('Password reset session exchanged successfully', {
            action: 'passwordResetCallback',
            step: 'session_exchanged'
        })

        // Get the user to verify they're authenticated
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError) {
            logger.error('Failed to get user after session exchange', {
                action: 'passwordResetCallback',
                step: 'get_user_failed',
                error: userError.message,
                duration: `${Date.now() - startTime}ms`
            })
            return NextResponse.redirect(`${origin}/auth/reset-password?message=Authentication failed`)
        }

        if (!user) {
            logger.warn('No user found after successful session exchange', {
                action: 'passwordResetCallback',
                step: 'no_user_found',
                duration: `${Date.now() - startTime}ms`
            })
            return NextResponse.redirect(`${origin}/auth/reset-password?message=Authentication failed`)
        }

        logger.info('Password reset callback successful, redirecting to update password page', {
            action: 'passwordResetCallback',
            step: 'redirect_to_update_password',
            userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
            userEmail: user.email ? `${user.email.substring(0, 3)}***@${user.email.split('@')[1]}` : 'null',
            duration: `${Date.now() - startTime}ms`,
            redirectUrl: `${origin}/auth/update-password?message=Please enter your new password`
        })

        // Redirect to the update password page with success message
        return NextResponse.redirect(`${origin}/auth/update-password?message=Please enter your new password`)

    } catch (error) {
        const duration = Date.now() - startTime
        logger.error('Unexpected error in password reset callback', {
            action: 'passwordResetCallback',
            step: 'unexpected_error',
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            duration: `${duration}ms`
        })
        return NextResponse.redirect(`${origin}/auth/reset-password?message=An error occurred during password reset`)
    }
}
