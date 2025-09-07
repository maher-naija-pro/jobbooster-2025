'use server'

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export async function signInWithGoogle(redirectTo?: string) {
  const startTime = Date.now()
  logger.info('Google OAuth sign-in initiated', {
    action: 'oauth_google',
    step: 'oauth_initiated',
    redirectTo: redirectTo || '/',
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server-side'
  })

  const supabase = await createClient()
  logger.debug('Supabase client created for Google OAuth', {
    action: 'oauth_google',
    step: 'supabase_client_created'
  })

  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(redirectTo || '/')}`

  logger.debug('Initiating Google OAuth with Supabase', {
    action: 'oauth_google',
    step: 'supabase_oauth_initiated',
    redirectUrl: redirectUrl
  })

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  })

  if (error) {
    logger.error('Google OAuth failed', {
      action: 'oauth_google',
      step: 'supabase_oauth_failed',
      error: error.message,
      errorCode: error.status,
      redirectTo: redirectTo || '/'
    })
    return { error: error.message }
  }

  logger.info('Google OAuth initiated successfully', {
    action: 'oauth_google',
    step: 'supabase_oauth_success',
    hasUrl: !!data.url,
    redirectTo: redirectTo || '/',
    duration: `${Date.now() - startTime}ms`
  })

  return { url: data.url }
}


