'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { resetPasswordSchema, updatePasswordSchema } from '@/lib/auth/validation'

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
  }

  // Validate input
  const validatedData = resetPasswordSchema.parse(data)

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
    })

    if (error) {
      console.error('Password reset error:', error)
      redirect('/error?message=' + encodeURIComponent('Failed to send password reset email'))
    }

    redirect('/auth/reset-password?message=' + encodeURIComponent('Password reset email sent! Check your inbox.'))
  } catch (error) {
    // Check if it's a NEXT_REDIRECT error (which is expected behavior)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error // Re-throw to let Next.js handle the redirect
    }

    console.error('Error requesting password reset:', error)
    redirect('/error?message=' + encodeURIComponent('Failed to send password reset email'))
  }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const data = {
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    token: formData.get('token') as string,
  }

  // Validate input
  const validatedData = updatePasswordSchema.parse(data)

  try {
    const { error } = await supabase.auth.updateUser({
      password: validatedData.password
    })

    if (error) {
      console.error('Password update error:', error)
      redirect('/error?message=' + encodeURIComponent('Failed to update password'))
    }

    revalidatePath('/', 'layout')
    redirect('/profile?message=' + encodeURIComponent('Password updated successfully'))
  } catch (error) {
    // Check if it's a NEXT_REDIRECT error (which is expected behavior)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error // Re-throw to let Next.js handle the redirect
    }

    console.error('Error updating password:', error)
    redirect('/error?message=' + encodeURIComponent('Failed to update password'))
  }
}
