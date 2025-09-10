'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
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
import { PasswordInput } from '@/components/auth/password-input'
import { validatePassword, validatePasswordConfirmation, DEFAULT_PASSWORD_CONSTRAINTS } from '@/components/auth/password-constraints'

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
  const initialMessageProcessed = useRef<boolean>(false)

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
      // Only process initial message from URL once to avoid overriding success messages
      if (params.message && !initialMessageProcessed.current) {
        setMessage(decodeURIComponent(params.message))
        initialMessageProcessed.current = true
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
        initialMessageProcessed.current = true
      }
    })
  }, [searchParams])

  // Real-time validation
  const validateField = useCallback((fieldName: string, value: string) => {
    try {
      const errors: Record<string, string> = { ...fieldErrors }

      if (fieldName === 'password') {
        if (!value) {
          errors.password = 'Password is required'
        } else {
          // Use centralized password validation
          const passwordResult = validatePassword(value, DEFAULT_PASSWORD_CONSTRAINTS)
          if (!passwordResult.isValid) {
            errors.password = passwordResult.errors[0] // Show first error
          } else {
            delete errors.password
          }
        }
      } else if (fieldName === 'confirmPassword') {
        const password = formValues.password || ''
        if (!value) {
          errors.confirmPassword = 'Please confirm your password'
        } else {
          // Use centralized password confirmation validation
          const confirmationResult = validatePasswordConfirmation(password, value, DEFAULT_PASSWORD_CONSTRAINTS)
          if (!confirmationResult.isValid) {
            errors.confirmPassword = confirmationResult.errors.find(e => e.includes('match')) || confirmationResult.errors[0]
          } else {
            delete errors.confirmPassword
          }
        }
      }

      setFieldErrors(errors)
      return Object.keys(errors).length === 0
    } catch (error) {
      logger.error('Validation error in update password', { error, fieldName, value })
      return false
    }
  }, [fieldErrors, formValues.password])

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

  // Check if a field is invalid - memoized to prevent unnecessary recalculations
  const isFieldInvalid = useCallback((fieldName: string) => {
    return touched[fieldName] && fieldErrors[fieldName]
  }, [touched, fieldErrors])

  // Get field error message - memoized to prevent unnecessary recalculations
  const getFieldError = useCallback((fieldName: string) => {
    return fieldErrors[fieldName] || ''
  }, [fieldErrors])

  // Check if form is valid for submission - memoized to prevent unnecessary recalculations
  const isFormValid = useCallback(() => {
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

    // Check minimum length using centralized validation
    const passwordResult = validatePassword(password, DEFAULT_PASSWORD_CONSTRAINTS)
    if (!passwordResult.isValid) {
      return false
    }

    return true
  }, [fieldErrors, formValues.password, formValues.confirmPassword])

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

        const passwordResult = validatePassword(password, DEFAULT_PASSWORD_CONSTRAINTS)
        if (!passwordResult.isValid) {
          throw new Error(passwordResult.errors[0] || 'Password does not meet requirements')
        }

        setMessage('Test mode: Password updated successfully! (This is a simulation)')

        // Redirect to home page in test mode as well
        setTimeout(() => {
          logger.info('Redirecting to home page after test mode password update', {
            action: 'handleSubmit',
            step: 'redirect_to_home_test_mode',
            timestamp: new Date().toISOString()
          })
          window.location.href = '/'
        }, 3000) // 3 second delay to show success message

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

        // Clear form fields after successful password update with a small delay
        // to ensure the success message is visible to the user
        // Use React's automatic batching to minimize rerenders
        setTimeout(() => {
          // React 18+ automatically batches these state updates in a single render
          setFormValues({})
          setFieldErrors({})
          setTouched({})
          // Reset the initial message processed flag so new messages can be processed
          initialMessageProcessed.current = false

          logger.debug('Form cleared after successful password update', {
            action: 'handleSubmit',
            step: 'form_cleared',
            timestamp: new Date().toISOString()
          })

          // Redirect to home page after clearing form (reduced delay)
          setTimeout(() => {
            logger.info('Redirecting to home page after successful password update', {
              action: 'handleSubmit',
              step: 'redirect_to_home',
              timestamp: new Date().toISOString()
            })
            window.location.href = '/'
          }, 1500) // 1.5 second delay after form clear
        }, 1500) // 1.5 second delay to show success message
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
                <PasswordInput
                  id="password"
                  name="password"
                  value={formValues.password || ''}
                  onChange={(value) => {
                    setFormValues(prev => ({ ...prev, password: value }))
                    setTouched(prev => ({ ...prev, password: true }))
                    if (value.length > 0) {
                      validateField('password', value)
                    }
                    if (message) {
                      setMessage('')
                    }
                    if (errorInfo) {
                      setErrorInfo(null)
                    }
                  }}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, password: true }))
                    if (formValues.password && formValues.password.length > 0) {
                      validateField('password', formValues.password)
                    }
                  }}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                  constraints={DEFAULT_PASSWORD_CONSTRAINTS}
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
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formValues.confirmPassword || ''}
                  onChange={(value) => {
                    setFormValues(prev => ({ ...prev, confirmPassword: value }))
                    setTouched(prev => ({ ...prev, confirmPassword: true }))
                    if (value.length > 0) {
                      validateField('confirmPassword', value)
                    }
                    if (message) {
                      setMessage('')
                    }
                    if (errorInfo) {
                      setErrorInfo(null)
                    }
                  }}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, confirmPassword: true }))
                    if (formValues.confirmPassword && formValues.confirmPassword.length > 0) {
                      validateField('confirmPassword', formValues.confirmPassword)
                    }
                  }}
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                  constraints={DEFAULT_PASSWORD_CONSTRAINTS}
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
                tooltip={isLoading ? "Please wait while we update your password..." : "Update your account password"}
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
