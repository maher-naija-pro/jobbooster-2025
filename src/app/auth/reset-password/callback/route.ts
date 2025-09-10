import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
    const startTime = Date.now()
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type')
    const error = searchParams.get('error')
    const errorCode = searchParams.get('error_code')
    const errorDescription = searchParams.get('error_description')

    logger.info('Password reset callback initiated', {
        action: 'passwordResetCallback',
        step: 'callback_received',
        hasCode: !!code,
        hasTokenHash: !!token_hash,
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
            duration: `${Date.now() - startTime}ms`,
            requestUrl: request.url,
            userAgent: request.headers.get('user-agent'),
            ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        })

        let errorMessage = 'An error occurred during password reset'

        if (errorCode === 'otp_expired') {
            errorMessage = 'Password reset link has expired. Please request a new one.'
            logger.info('OTP expired error handled', {
                action: 'passwordResetCallback',
                step: 'otp_expired_handled',
                errorCode: errorCode,
                duration: `${Date.now() - startTime}ms`
            })
        } else if (errorCode === 'access_denied') {
            errorMessage = 'Access denied. Please request a new password reset link.'
            logger.info('Access denied error handled', {
                action: 'passwordResetCallback',
                step: 'access_denied_handled',
                errorCode: errorCode,
                duration: `${Date.now() - startTime}ms`
            })
        } else if (errorDescription) {
            errorMessage = decodeURIComponent(errorDescription.replace(/\+/g, ' '))
            logger.info('Custom error description handled', {
                action: 'passwordResetCallback',
                step: 'custom_error_handled',
                errorCode: errorCode,
                originalErrorDescription: errorDescription,
                decodedErrorDescription: errorMessage,
                duration: `${Date.now() - startTime}ms`
            })
        } else {
            logger.warn('Unknown error code received', {
                action: 'passwordResetCallback',
                step: 'unknown_error_code',
                errorCode: errorCode,
                error: error,
                duration: `${Date.now() - startTime}ms`
            })
        }

        logger.info('Redirecting to reset password page with error message', {
            action: 'passwordResetCallback',
            step: 'error_redirect',
            errorMessage: errorMessage,
            redirectUrl: `${origin}/auth/reset-password?message=${encodeURIComponent(errorMessage)}`,
            duration: `${Date.now() - startTime}ms`
        })

        return NextResponse.redirect(`${origin}/auth/reset-password?message=${encodeURIComponent(errorMessage)}`)
    }

    // Check if we have either code or token_hash
    if (!code && !token_hash) {
        logger.warn('Invalid password reset callback parameters - no code or token_hash provided', {
            action: 'passwordResetCallback',
            step: 'invalid_parameters',
            type: type,
            hasCode: !!code,
            hasTokenHash: !!token_hash,
            duration: `${Date.now() - startTime}ms`,
            requestUrl: request.url,
            searchParams: Object.fromEntries(searchParams.entries()),
            userAgent: request.headers.get('user-agent'),
            ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        })

        return NextResponse.redirect(`${origin}/auth/reset-password?message=Invalid reset link`)
    }

    // If type is provided, it must be 'recovery'
    if (type && type !== 'recovery') {
        logger.warn('Invalid password reset callback parameters - wrong type', {
            action: 'passwordResetCallback',
            step: 'invalid_parameters',
            type: type,
            hasCode: !!code,
            hasTokenHash: !!token_hash,
            duration: `${Date.now() - startTime}ms`,
            requestUrl: request.url,
            searchParams: Object.fromEntries(searchParams.entries()),
            userAgent: request.headers.get('user-agent'),
            ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        })

        return NextResponse.redirect(`${origin}/auth/reset-password?message=Invalid reset link`)
    }

    try {
        logger.debug('Attempting to create Supabase client', {
            action: 'passwordResetCallback',
            step: 'creating_supabase_client',
            duration: `${Date.now() - startTime}ms`
        })

        const supabase = await createClient()
        logger.debug('Supabase client created for password reset callback', {
            action: 'passwordResetCallback',
            step: 'supabase_client_created',
            duration: `${Date.now() - startTime}ms`
        })

        let authError = null

        // Handle PKCE flow with token_hash
        if (token_hash) {
            logger.debug('Attempting to verify OTP with token_hash (PKCE flow)', {
                action: 'passwordResetCallback',
                step: 'verifying_otp_pkce',
                hasTokenHash: !!token_hash,
                tokenHashLength: token_hash.length,
                type: type || 'recovery',
                duration: `${Date.now() - startTime}ms`
            })

            const { error } = await supabase.auth.verifyOtp({
                type: (type as any) || 'recovery',
                token_hash,
            })
            authError = error
        }
        // Handle implicit flow with code
        else if (code) {
            logger.debug('Attempting to exchange code for session (implicit flow)', {
                action: 'passwordResetCallback',
                step: 'exchanging_code_for_session',
                hasCode: !!code,
                codeLength: code.length,
                duration: `${Date.now() - startTime}ms`
            })

            const { error } = await supabase.auth.exchangeCodeForSession(code)
            authError = error
        }

        if (authError) {
            logger.error('Password reset authentication failed', {
                action: 'passwordResetCallback',
                step: 'authentication_failed',
                error: authError.message,
                errorCode: authError.status,
                errorName: authError.name,
                errorStack: authError.stack,
                flowType: token_hash ? 'PKCE' : 'implicit',
                hasTokenHash: !!token_hash,
                hasCode: !!code,
                duration: `${Date.now() - startTime}ms`,
                requestUrl: request.url,
                userAgent: request.headers.get('user-agent'),
                ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
            })

            logger.info('Redirecting to reset password page due to authentication failure', {
                action: 'passwordResetCallback',
                step: 'auth_error_redirect',
                errorMessage: 'Invalid or expired reset link',
                flowType: token_hash ? 'PKCE' : 'implicit',
                redirectUrl: `${origin}/auth/reset-password?message=Invalid or expired reset link`,
                duration: `${Date.now() - startTime}ms`
            })

            return NextResponse.redirect(`${origin}/auth/reset-password?message=Invalid or expired reset link`)
        }

        logger.debug('Password reset authentication successful', {
            action: 'passwordResetCallback',
            step: 'authentication_success',
            flowType: token_hash ? 'PKCE' : 'implicit',
            duration: `${Date.now() - startTime}ms`
        })

        // Get the user to verify they're authenticated
        logger.debug('Attempting to get user after session exchange', {
            action: 'passwordResetCallback',
            step: 'getting_user_after_session',
            duration: `${Date.now() - startTime}ms`
        })

        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError) {
            logger.error('Failed to get user after session exchange', {
                action: 'passwordResetCallback',
                step: 'get_user_failed',
                error: userError.message,
                errorCode: userError.status,
                errorName: userError.name,
                errorStack: userError.stack,
                duration: `${Date.now() - startTime}ms`,
                requestUrl: request.url,
                userAgent: request.headers.get('user-agent'),
                ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
            })

            logger.info('Redirecting to reset password page due to user retrieval failure', {
                action: 'passwordResetCallback',
                step: 'get_user_error_redirect',
                errorMessage: 'Authentication failed',
                redirectUrl: `${origin}/auth/reset-password?message=Authentication failed`,
                duration: `${Date.now() - startTime}ms`
            })

            return NextResponse.redirect(`${origin}/auth/reset-password?message=Authentication failed`)
        }

        if (!user) {
            logger.warn('No user found after successful session exchange', {
                action: 'passwordResetCallback',
                step: 'no_user_found',
                duration: `${Date.now() - startTime}ms`,
                requestUrl: request.url,
                userAgent: request.headers.get('user-agent'),
                ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
            })

            logger.info('Redirecting to reset password page due to missing user', {
                action: 'passwordResetCallback',
                step: 'no_user_error_redirect',
                errorMessage: 'Authentication failed',
                redirectUrl: `${origin}/auth/reset-password?message=Authentication failed`,
                duration: `${Date.now() - startTime}ms`
            })

            return NextResponse.redirect(`${origin}/auth/reset-password?message=Authentication failed`)
        }

        logger.debug('User retrieved successfully after session exchange', {
            action: 'passwordResetCallback',
            step: 'user_retrieved_successfully',
            userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
            userEmail: user.email ? `${user.email.substring(0, 3)}***@${user.email.split('@')[1]}` : 'null',
            userCreatedAt: user.created_at,
            userUpdatedAt: user.updated_at,
            userConfirmedAt: user.email_confirmed_at,
            duration: `${Date.now() - startTime}ms`
        })

        logger.info('Password reset callback successful, redirecting to update password page', {
            action: 'passwordResetCallback',
            step: 'redirect_to_update_password',
            userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
            userEmail: user.email ? `${user.email.substring(0, 3)}***@${user.email.split('@')[1]}` : 'null',
            duration: `${Date.now() - startTime}ms`,
            redirectUrl: `${origin}/auth/update-password?message=Please enter your new password`,
            requestUrl: request.url,
            userAgent: request.headers.get('user-agent'),
            ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        })

        // Redirect to the update password page with success message
        return NextResponse.redirect(`${origin}/auth/update-password?message=Please enter your new password`)

    } catch (error) {
        const duration = Date.now() - startTime
        logger.error('Unexpected error in password reset callback', {
            action: 'passwordResetCallback',
            step: 'unexpected_error',
            error: error instanceof Error ? error.message : 'Unknown error',
            errorName: error instanceof Error ? error.name : 'UnknownError',
            stack: error instanceof Error ? error.stack : undefined,
            duration: `${duration}ms`,
            requestUrl: request.url,
            userAgent: request.headers.get('user-agent'),
            ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
            searchParams: Object.fromEntries(searchParams.entries()),
            code: code,
            type: type,
            errorParam: error,
            errorCode: errorCode,
            errorDescription: errorDescription
        })

        logger.info('Redirecting to reset password page due to unexpected error', {
            action: 'passwordResetCallback',
            step: 'unexpected_error_redirect',
            errorMessage: 'An error occurred during password reset',
            redirectUrl: `${origin}/auth/reset-password?message=An error occurred during password reset`,
            duration: `${duration}ms`
        })

        return NextResponse.redirect(`${origin}/auth/reset-password?message=An error occurred during password reset`)
    }
}
