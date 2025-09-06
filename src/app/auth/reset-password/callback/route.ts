import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const type = searchParams.get('type')

    // Only handle password recovery
    if (type !== 'recovery' || !code) {
        return NextResponse.redirect(`${origin}/auth/reset-password?message=Invalid reset link`)
    }

    try {
        const supabase = await createClient()

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Password reset error:', error)
            return NextResponse.redirect(`${origin}/auth/reset-password?message=Invalid or expired reset link`)
        }

        // Get the user to verify they're authenticated
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.redirect(`${origin}/auth/reset-password?message=Authentication failed`)
        }

        // Redirect to the update password page with success message
        return NextResponse.redirect(`${origin}/auth/update-password?message=Please enter your new password`)

    } catch (error) {
        console.error('Password reset callback error:', error)
        return NextResponse.redirect(`${origin}/auth/reset-password?message=An error occurred during password reset`)
    }
}
