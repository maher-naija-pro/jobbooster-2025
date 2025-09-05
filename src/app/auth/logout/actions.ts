'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { endUserSession } from '@/lib/auth/session-manager'

export async function logout() {
  const supabase = await createClient()

  // Get current session before signing out
  const { data: { session } } = await supabase.auth.getSession()

  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/error?message=' + encodeURIComponent(error.message))
  }

  // End session tracking
  if (session?.user && session?.access_token) {
    try {
      await endUserSession(session.user.id, session.access_token)
    } catch (sessionError) {
      console.error('Error ending session tracking:', sessionError)
      // Don't fail logout if session tracking fails
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
