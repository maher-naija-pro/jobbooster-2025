'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MetaButton } from '@/components/buttons/meta-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/icons'
import { updatePassword } from '../reset-password/actions'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'
import { getHumanReadableError, ErrorInfo } from '@/lib/auth/error-messages'
import { updatePasswordSchema } from '@/lib/auth/validation'

interface UpdatePasswordPageProps {
  searchParams: Promise<{
    message?: string
    token?: string
    test?: string
  }>
}

export default function UpdatePasswordPage({ searchParams }: UpdatePasswordPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null)
  const [token, setToken] = useState<string>('')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isTestMode, setIsTestMode] = useState<boolean>(false)

  // Form state management
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const formRef = useRef<HTMLFormElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  // Check authentication status
  useEffect(() => {
    // Skip authentication check in test mode
    if (isTestMode) {
      return
    }

    const checkAuth = async () => {
      const startTime = Date.now()
      logger.info('Checking authentication for password update', {
        action: 'checkPasswordUpdateAuth',
        step: 'auth_check_initiated',
        timestamp: new Date().toISOString()
      })

      try {
        const supabase = createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
          logger.error('Error checking authentication for password update', {
            action: 'checkPasswordUpdateAuth',
            step: 'auth_check_failed',
            error: error.message,
            duration: `${Date.now() - startTime}ms`
          })
          const errorInfo = getHumanReadableError(error)
          setErrorInfo(errorInfo)
          setIsAuthenticated(false)
          return
        }

        setIsAuthenticated(!!user)

        if (!user) {
          logger.warn('No authenticated user found for password update', {
            action: 'checkPasswordUpdateAuth',
            step: 'no_user_found',
            duration: `${Date.now() - startTime}ms`
          })
          const errorInfo: ErrorInfo = {
            title: 'Authentication Required',
            message: 'You must be authenticated to update your password. Please use the password reset link from your email.',
            details: 'No authenticated user found'
          }
          setErrorInfo(errorInfo)
        } else {
          logger.info('User authenticated successfully for password update', {
            action: 'checkPasswordUpdateAuth',
            step: 'user_authenticated',
            userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
            userEmail: user.email ? `${user.email.substring(0, 3)}***@${user.email.split('@')[1]}` : 'null',
            duration: `${Date.now() - startTime}ms`
          })
        }
      } catch (err) {
        logger.error('Unexpected error during authentication check for password update', {
          action: 'checkPasswordUpdateAuth',
          step: 'unexpected_error',
          error: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
          duration: `${Date.now() - startTime}ms`
        })
        const errorInfo = getHumanReadableError(err)
        setErrorInfo(errorInfo)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [isTestMode])

  // Handle search params on client side
  useEffect(() => {
    searchParams.then(params => {
      if (params.message) {
        setMessage(decodeURIComponent(params.message))
      }
      if (params.token) {
        setToken(params.token)
      }
      if (params.test === 'true') {
        setIsTestMode(true)
        setIsAuthenticated(true)
        setMessage('Test mode enabled - you can test the password update form')
        // Clear any existing errors in test mode
        setErrorInfo(null)
      }
    })
  }, [searchParams])

  // Real-time validation
  const validateField = useCallback((fieldName: string, value: string) => {
    try {
      const data = {
        password: formValues.password || '',
        confirmPassword: formValues.confirmPassword || '',
        token: token || null
      }

      // Update the field being validated
      if (fieldName === 'password') {
        data.password = value
      } else if (fieldName === 'confirmPassword') {
        data.confirmPassword = value
      }

      // Validate using the schema
      updatePasswordSchema.parse(data)

      // Clear error if validation passes
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })

      return true
    } catch (error: any) {
      if (error.errors && error.errors.length > 0) {
        const fieldError = error.errors.find((e: any) => e.path.includes(fieldName))
        if (fieldError) {
          setFieldErrors(prev => ({
            ...prev,
            [fieldName]: fieldError.message
          }))
        }
      }
      return false
    }
  }, [formValues, token])

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues(prev => ({ ...prev, [name]: value }))

    // Clear message when user starts typing
    if (message) {
      setMessage('')
    }
    if (errorInfo) {
      setErrorInfo(null)
    }

    // Validate field if it's been touched
    if (touched[name]) {
      validateField(name, value)
    }
  }, [message, errorInfo, touched, validateField])

  // Handle input blur
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, value)
  }, [validateField])

  // Check if a field is invalid
  const isFieldInvalid = (fieldName: string) => {
    return touched[fieldName] && fieldErrors[fieldName]
  }

  // Get field error message
  const getFieldError = (fieldName: string) => {
    return fieldErrors[fieldName] || ''
  }

  // Check if form is valid for submission
  const isFormValid = () => {
    // Check if there are any validation errors
    if (Object.keys(fieldErrors).length > 0) {
      return false
    }

    // Check if required fields are filled
    const password = formValues.password || formRef.current?.password?.value || ''
    const confirmPassword = formValues.confirmPassword || formRef.current?.confirmPassword?.value || ''

    // Both password fields are required
    if (!password.trim() || !confirmPassword.trim()) {
      return false
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return false
    }

    // Check minimum length
    if (password.length < 6) {
      return false
    }

    return true
  }

  const handleSubmit = async (formData: FormData) => {
    logger.info('Password update form submitted', {
      action: 'handleSubmit',
      step: 'form_submission_started',
      timestamp: new Date().toISOString(),
      isTestMode
    })

    setIsLoading(true)
    setMessage('')
    setErrorInfo(null)

    try {
      // In test mode, simulate the form submission
      if (isTestMode) {
        logger.info('Test mode: simulating password update', {
          action: 'handleSubmit',
          step: 'test_mode_simulation',
          timestamp: new Date().toISOString()
        })

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Simulate success or error based on password
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
          throw new Error('Passwords do not match')
        }

        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long')
        }

        setMessage('Test mode: Password updated successfully! (This is a simulation)')
        return
      }

      logger.debug('Calling updatePassword action', {
        action: 'handleSubmit',
        step: 'calling_update_password',
        timestamp: new Date().toISOString()
      })

      const result = await updatePassword(formData)

      if (result.success) {
        logger.info('Password update action completed successfully', {
          action: 'handleSubmit',
          step: 'update_password_success',
          timestamp: new Date().toISOString()
        })
        setMessage(result.message || 'Password updated successfully! You can now use your new password.')
      } else {
        logger.error('Password update action failed', {
          action: 'handleSubmit',
          step: 'update_password_failed',
          error: result.error,
          timestamp: new Date().toISOString()
        })
        setErrorInfo({
          title: 'Password Update Failed',
          message: result.error || 'Failed to update password. Please try again.',
          details: 'Please check your password and try again.'
        })
      }
    } catch (err) {
      logger.error('Error in password update form submission', {
        action: 'handleSubmit',
        step: 'form_submission_error',
        error: err instanceof Error ? err.message : 'Unknown error',
        errorType: err instanceof Error ? err.constructor.name : 'Unknown',
        timestamp: new Date().toISOString(),
        isTestMode
      })

      // Check if it's a NEXT_REDIRECT error (which is expected behavior for redirects)
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
        logger.info('NEXT_REDIRECT error caught (expected behavior)', {
          action: 'handleSubmit',
          step: 'redirect_handling',
          timestamp: new Date().toISOString()
        })
        // Don't show error for redirects - this is expected behavior
        // The loading state will be reset when the component unmounts due to redirect
        return
      }

      const errorInfo = getHumanReadableError(err)
      setErrorInfo(errorInfo)
    } finally {
      logger.debug('Password update form submission completed, resetting loading state', {
        action: 'handleSubmit',
        step: 'form_submission_completed',
        timestamp: new Date().toISOString()
      })
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <span className="ml-2">Verifying authentication...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Update your password</CardTitle>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 rounded-md">
              {message}
            </div>
          )}

          {errorInfo && (
            <div className="mb-4 p-4 text-sm bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errorInfo.title}
                  </h3>
                  <div className="mt-1 text-sm text-red-700">
                    {errorInfo.message}
                  </div>
                  {errorInfo.details && (
                    <div className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded font-mono">
                      {errorInfo.details}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          {isAuthenticated ? (
            <form ref={formRef} action={handleSubmit} className="space-y-4">
              {token && (
                <input type="hidden" name="token" value={token} />
              )}
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  aria-invalid={isFieldInvalid('password') ? 'true' : 'false'}
                  aria-describedby={isFieldInvalid('password') ? 'password-error' : undefined}
                  className={`transition-all duration-200 ${isFieldInvalid('password')
                    ? 'border-red-300 dark:border-red-600 focus-visible:ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-600 focus-visible:ring-blue-500/20'
                    }`}
                />
                {isFieldInvalid('password') && (
                  <p id="password-error" className="text-sm text-red-600 dark:text-red-400 mt-1" role="alert">
                    {getFieldError('password')}
                  </p>
                )}
                {!isFieldInvalid('password') && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Must be at least 6 characters long
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  ref={confirmPasswordRef}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  aria-invalid={isFieldInvalid('confirmPassword') ? 'true' : 'false'}
                  aria-describedby={isFieldInvalid('confirmPassword') ? 'confirmPassword-error' : undefined}
                  className={`transition-all duration-200 ${isFieldInvalid('confirmPassword')
                    ? 'border-red-300 dark:border-red-600 focus-visible:ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-600 focus-visible:ring-blue-500/20'
                    }`}
                />
                {isFieldInvalid('confirmPassword') && (
                  <p id="confirmPassword-error" className="text-sm text-red-600 dark:text-red-400 mt-1" role="alert">
                    {getFieldError('confirmPassword')}
                  </p>
                )}
              </div>

              <MetaButton
                type="submit"
                variant="primary"
                size="lg"
                width="full"
                isLoading={isLoading}
                loadingText="Updating password..."
                showLoadingText={true}
                loadingTextAnimation="pulse"
                loadingIconType="spinner"
                showLoadingIcon={true}
                loadingSpeed="normal"
                icon={Icons.settings}
                disabled={isLoading || !isFormValid()}
                text="Update password"
                tooltip="Update your account password"
                tooltipPosition="top"
                analyticsEvent="password_update_attempt"
                analyticsData={{
                  formType: 'update_password',
                  timestamp: new Date().toISOString()
                }}
                onClick={() => {
                  if (formRef.current && !isLoading && isFormValid()) {
                    setIsLoading(true)
                    formRef.current.requestSubmit()
                  }
                }}
              />
            </form>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Please use the password reset link from your email to access this page.
              </p>
              <a href="/auth/reset-password" className="text-primary hover:underline">
                Request new password reset
              </a>
            </div>
          )}


          <div className="mt-4 text-center text-sm">
            <a href="/profile" className="text-primary hover:underline">
              Back to profile
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
