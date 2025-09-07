import { ZodError } from 'zod'

export interface ErrorInfo {
    title: string
    message: string
    details?: string
}

export function getHumanReadableError(error: unknown): ErrorInfo {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
        const firstError = error.errors[0]

        switch (firstError.path[0]) {
            case 'password':
                if (firstError.code === 'too_small') {
                    return {
                        title: 'Password Too Short',
                        message: 'Your password must be at least 6 characters long. Please choose a longer password.',
                        details: `Minimum length: ${firstError.minimum} characters`
                    }
                }
                break
            case 'confirmPassword':
                if (firstError.code === 'custom') {
                    return {
                        title: 'Passwords Don\'t Match',
                        message: 'The passwords you entered don\'t match. Please make sure both password fields are identical.',
                        details: 'Please check that both password fields contain the same text'
                    }
                }
                break
            default:
                return {
                    title: 'Validation Error',
                    message: firstError.message || 'Please check your input and try again.',
                    details: `Field: ${firstError.path.join('.')}`
                }
        }
    }

    // Handle regular Error objects
    if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase()

        // Supabase auth errors
        if (errorMessage.includes('password')) {
            if (errorMessage.includes('weak') || errorMessage.includes('strength')) {
                return {
                    title: 'Password Too Weak',
                    message: 'Your password doesn\'t meet the security requirements. Please choose a stronger password with a mix of letters, numbers, and symbols.',
                    details: error.message
                }
            }
            if (errorMessage.includes('same')) {
                return {
                    title: 'Same Password',
                    message: 'You\'re trying to use the same password as your current one. Please choose a different password.',
                    details: error.message
                }
            }
            if (errorMessage.includes('recent')) {
                return {
                    title: 'Recently Used Password',
                    message: 'This password was recently used. Please choose a different password for security reasons.',
                    details: error.message
                }
            }
        }

        if (errorMessage.includes('session') || errorMessage.includes('token')) {
            return {
                title: 'Session Expired',
                message: 'Your session has expired. Please request a new password reset link from your email.',
                details: error.message
            }
        }

        if (errorMessage.includes('network') || errorMessage.includes('connection')) {
            return {
                title: 'Connection Error',
                message: 'Unable to connect to our servers. Please check your internet connection and try again.',
                details: error.message
            }
        }

        if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
            return {
                title: 'Too Many Attempts',
                message: 'You\'ve made too many attempts. Please wait a few minutes before trying again.',
                details: error.message
            }
        }

        // Generic error handling
        return {
            title: 'Update Failed',
            message: 'We couldn\'t update your password. Please try again or contact support if the problem persists.',
            details: error.message
        }
    }

    // Fallback for unknown error types
    return {
        title: 'Unexpected Error',
        message: 'Something went wrong while updating your password. Please try again.',
        details: typeof error === 'string' ? error : 'Unknown error occurred'
    }
}
