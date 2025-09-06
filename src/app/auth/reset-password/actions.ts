'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { resetPasswordSchema, updatePasswordSchema } from '@/lib/auth/validation'
import { logger } from '@/lib/logger'

export async function requestPasswordReset(formData: FormData) {
  const startTime = Date.now()
  logger.info('Password reset request initiated', {
    action: 'requestPasswordReset',
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server-side'
  })

  const supabase = await createClient()
  logger.debug('Supabase client created for password reset', {
    action: 'requestPasswordReset',
    step: 'supabase_client_created'
  })

  const data = {
    email: formData.get('email') as string,
  }

  logger.debug('Form data extracted', {
    action: 'requestPasswordReset',
    step: 'form_data_extracted',
    email: data.email ? `${data.email.substring(0, 3)}***@${data.email.split('@')[1]}` : 'null',
    hasEmail: !!data.email
  })

  // Validate input
  try {
    const validatedData = resetPasswordSchema.parse(data)
    logger.info('Password reset data validated successfully', {
      action: 'requestPasswordReset',
      step: 'validation_success',
      email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
    })
  } catch (validationError) {
    logger.error('Password reset validation failed', {
      action: 'requestPasswordReset',
      step: 'validation_failed',
      error: validationError instanceof Error ? validationError.message : 'Unknown validation error',
      stack: validationError instanceof Error ? validationError.stack : undefined,
      inputData: { email: data.email ? `${data.email.substring(0, 3)}***@${data.email.split('@')[1]}` : 'null' }
    })
    throw validationError
  }

  const validatedData = resetPasswordSchema.parse(data)

  try {
    logger.debug('Initiating Supabase password reset email', {
      action: 'requestPasswordReset',
      step: 'supabase_reset_initiated',
      email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null',
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`
    })

    const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
    })

    if (error) {
      logger.error('Password reset error from Supabase', {
        action: 'requestPasswordReset',
        step: 'supabase_reset_failed',
        error: error.message,
        errorCode: error.status,
        email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null',
        supabaseError: error
      })
      redirect('/error?message=' + encodeURIComponent('Failed to send password reset email'))
    }

    const duration = Date.now() - startTime
    logger.info('Password reset email sent successfully', {
      action: 'requestPasswordReset',
      step: 'reset_email_sent',
      email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null',
      duration: `${duration}ms`,
      redirectUrl: '/auth/reset-password?message=Password%20reset%20email%20sent!%20Check%20your%20inbox.'
    })

    redirect('/auth/reset-password?message=' + encodeURIComponent('Password reset email sent! Check your inbox.'))
  } catch (error) {
    const duration = Date.now() - startTime

    // Check if it's a NEXT_REDIRECT error (which is expected behavior)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      logger.debug('NEXT_REDIRECT error caught (expected behavior)', {
        action: 'requestPasswordReset',
        step: 'redirect_handling',
        duration: `${duration}ms`
      })
      throw error // Re-throw to let Next.js handle the redirect
    }

    logger.error('Unexpected error during password reset request', {
      action: 'requestPasswordReset',
      step: 'unexpected_error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`,
      email: validatedData.email ? `${validatedData.email.substring(0, 3)}***@${validatedData.email.split('@')[1]}` : 'null'
    })
    redirect('/error?message=' + encodeURIComponent('Failed to send password reset email'))
  }
}

export async function updatePassword(formData: FormData) {
  const startTime = Date.now()
  logger.info('Password update request initiated', {
    action: 'updatePassword',
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server-side'
  })

  const supabase = await createClient()
  logger.debug('Supabase client created for password update', {
    action: 'updatePassword',
    step: 'supabase_client_created'
  })

  const { data: { user } } = await supabase.auth.getUser()
  logger.debug('User authentication checked', {
    action: 'updatePassword',
    step: 'user_auth_check',
    hasUser: !!user,
    userId: user?.id ? `${user.id.substring(0, 8)}...` : 'null',
    userEmail: user?.email ? `${user.email.substring(0, 3)}***@${user.email.split('@')[1]}` : 'null'
  })

  if (!user) {
    logger.warn('Password update attempted without authenticated user', {
      action: 'updatePassword',
      step: 'no_user_redirect',
      duration: `${Date.now() - startTime}ms`
    })
    redirect('/auth/login')
  }

  const data = {
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    token: formData.get('token') as string,
  }

  logger.debug('Form data extracted for password update', {
    action: 'updatePassword',
    step: 'form_data_extracted',
    hasPassword: !!data.password,
    hasConfirmPassword: !!data.confirmPassword,
    hasToken: !!data.token,
    passwordLength: data.password ? data.password.length : 0,
    confirmPasswordLength: data.confirmPassword ? data.confirmPassword.length : 0,
    tokenLength: data.token ? data.token.length : 0,
    userId: user.id ? `${user.id.substring(0, 8)}...` : 'null'
  })

  // Validate input
  try {
    const validatedData = updatePasswordSchema.parse(data)
    logger.info('Password update data validated successfully', {
      action: 'updatePassword',
      step: 'validation_success',
      userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
      passwordLength: validatedData.password.length,
      passwordsMatch: validatedData.password === validatedData.confirmPassword
    })
  } catch (validationError) {
    logger.error('Password update validation failed', {
      action: 'updatePassword',
      step: 'validation_failed',
      error: validationError instanceof Error ? validationError.message : 'Unknown validation error',
      stack: validationError instanceof Error ? validationError.stack : undefined,
      userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
      inputData: {
        hasPassword: !!data.password,
        hasConfirmPassword: !!data.confirmPassword,
        hasToken: !!data.token,
        passwordLength: data.password ? data.password.length : 0
      }
    })
    throw validationError
  }

  const validatedData = updatePasswordSchema.parse(data)

  try {
    logger.debug('Initiating Supabase password update', {
      action: 'updatePassword',
      step: 'supabase_update_initiated',
      userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
      passwordLength: validatedData.password.length
    })

    const { error } = await supabase.auth.updateUser({
      password: validatedData.password
    })

    if (error) {
      logger.error('Password update error from Supabase', {
        action: 'updatePassword',
        step: 'supabase_update_failed',
        error: error.message,
        errorCode: error.status,
        userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
        supabaseError: error
      })
      redirect('/error?message=' + encodeURIComponent('Failed to update password'))
    }

    logger.info('Password updated successfully in Supabase', {
      action: 'updatePassword',
      step: 'supabase_update_success',
      userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
      duration: `${Date.now() - startTime}ms`
    })

    logger.debug('Revalidating paths after password update', {
      action: 'updatePassword',
      step: 'path_revalidation',
      userId: user.id ? `${user.id.substring(0, 8)}...` : 'null'
    })

    revalidatePath('/', 'layout')

    const totalDuration = Date.now() - startTime
    logger.info('Password update completed successfully', {
      action: 'updatePassword',
      step: 'update_completed',
      userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
      duration: `${totalDuration}ms`,
      redirectUrl: '/profile?message=Password%20updated%20successfully'
    })

    redirect('/profile?message=' + encodeURIComponent('Password updated successfully'))
  } catch (error) {
    const duration = Date.now() - startTime

    // Check if it's a NEXT_REDIRECT error (which is expected behavior)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      logger.debug('NEXT_REDIRECT error caught (expected behavior)', {
        action: 'updatePassword',
        step: 'redirect_handling',
        duration: `${duration}ms`,
        userId: user.id ? `${user.id.substring(0, 8)}...` : 'null'
      })
      throw error // Re-throw to let Next.js handle the redirect
    }

    logger.error('Unexpected error during password update', {
      action: 'updatePassword',
      step: 'unexpected_error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`,
      userId: user.id ? `${user.id.substring(0, 8)}...` : 'null'
    })
    redirect('/error?message=' + encodeURIComponent('Failed to update password'))
  }
}
