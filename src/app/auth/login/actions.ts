'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { loginSchema } from '@/lib/auth/validation'
import { createUserSession } from '@/lib/auth/session-manager'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    try {
        // Validate input
        const validatedData = loginSchema.parse(data)

        const { data: authData, error } = await supabase.auth.signInWithPassword(validatedData)

        if (error) {
            // Map Supabase errors to user-friendly messages
            const userFriendlyMessage = mapAuthErrorToMessage(error.message)
            throw new Error(userFriendlyMessage)
        }

        // Create session tracking record
        if (authData.user && authData.session?.access_token) {
            try {
                const headersList = await headers()
                const request = new Request('http://localhost', {
                    headers: headersList
                })
                await createUserSession(authData.user, authData.session.access_token, request)
            } catch (sessionError) {
                console.error('Error creating session tracking:', sessionError)
                // Don't fail login if session tracking fails
            }
        }

        revalidatePath('/', 'layout')
        return { success: true }
    } catch (error) {
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
