'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { endUserSession } from '@/lib/auth/session-manager'
import { logger } from '@/lib/logger'

export async function logout() {
  const startTime = Date.now()
  logger.info('User logout initiated', {
    action: 'logout',
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server-side'
  })

  const supabase = await createClient()
  logger.debug('Supabase client created for logout', {
    action: 'logout',
    step: 'supabase_client_created'
  })

  // Get current session before signing out
  const { data: { session } } = await supabase.auth.getSession()

  logger.debug('Current session retrieved for logout', {
    action: 'logout',
    step: 'session_retrieved',
    hasSession: !!session,
    hasUser: !!session?.user,
    userId: session?.user?.id ? `${session.user.id.substring(0, 8)}...` : 'null'
  })

  logger.debug('Initiating Supabase signout', {
    action: 'logout',
    step: 'supabase_signout_initiated',
    userId: session?.user?.id ? `${session.user.id.substring(0, 8)}...` : 'null'
  })

  const { error } = await supabase.auth.signOut()

  if (error) {
    logger.error('Supabase signout failed', {
      action: 'logout',
      step: 'supabase_signout_failed',
      error: error.message,
      errorCode: error.status,
      userId: session?.user?.id ? `${session.user.id.substring(0, 8)}...` : 'null'
    })
    redirect('/error?message=' + encodeURIComponent(error.message))
  }

  logger.info('Supabase signout successful', {
    action: 'logout',
    step: 'supabase_signout_success',
    userId: session?.user?.id ? `${session.user.id.substring(0, 8)}...` : 'null'
  })

  // End session tracking
  if (session?.user && session?.access_token) {
    try {
      logger.debug('Ending user session tracking', {
        action: 'logout',
        step: 'session_tracking_end_initiated',
        userId: session.user.id ? `${session.user.id.substring(0, 8)}...` : 'null'
      })

      await endUserSession(session.user.id, session.access_token)

      logger.info('User session tracking ended successfully', {
        action: 'logout',
        step: 'session_tracking_end_success',
        userId: session.user.id ? `${session.user.id.substring(0, 8)}...` : 'null'
      })
    } catch (sessionError) {
      logger.error('Error ending session tracking', {
        action: 'logout',
        step: 'session_tracking_end_failed',
        error: sessionError instanceof Error ? sessionError.message : 'Unknown session error',
        stack: sessionError instanceof Error ? sessionError.stack : undefined,
        userId: session.user.id ? `${session.user.id.substring(0, 8)}...` : 'null'
      })
      // Don't fail logout if session tracking fails
    }
  }

  logger.debug('Revalidating paths after logout', {
    action: 'logout',
    step: 'path_revalidation'
  })

  revalidatePath('/', 'layout')

  const totalDuration = Date.now() - startTime
  logger.info('User logout completed successfully', {
    action: 'logout',
    step: 'logout_completed',
    userId: session?.user?.id ? `${session.user.id.substring(0, 8)}...` : 'null',
    duration: `${totalDuration}ms`,
    redirectUrl: '/'
  })

  redirect('/')
}
