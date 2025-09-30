'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MetaButton } from '@/components/buttons/meta-button'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/icons'
import { login } from '@/app/auth/login/actions'
import { register } from '@/app/auth/register/actions'
import { requestPasswordReset } from '@/app/auth/reset-password/actions'
import { PasswordInput } from './password-input'
import { EmailInput } from './email-input'
import { validatePassword, validatePasswordConfirmation, DEFAULT_PASSWORD_CONSTRAINTS } from './password-constraints'
import { DEFAULT_EMAIL_CONSTRAINTS } from './email-constraints'

interface AuthFormProps {
  isLogin: boolean
  isResetPassword?: boolean
  onToggleMode: () => void
  onResetPassword?: () => void
  onBackToLogin?: () => void
  onSuccess: () => void
  onSwitchToLogin?: () => void
}

export function AuthForm({ isLogin, isResetPassword = false, onToggleMode, onResetPassword, onBackToLogin, onSuccess, onSwitchToLogin }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resetSuccess, setResetSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [formValues, setFormValues] = useState<Record<string, string>>({})

  const formRef = useRef<HTMLFormElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  // Focus management
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus()
    }
  }, [isLogin, isResetPassword])

  // Clear success message when switching modes (but preserve registration success message)
  useEffect(() => {
    // Don't clear success message if it's a registration success message and we're switching to login
    if (!(success.includes('Registration successful') && isLogin)) {
      setSuccess('')
    }
    setError('')
    setFormValues({})
    setFieldErrors({})
    setTouched({})
    // Clear reset success when switching away from login form
    if (!isLogin) {
      setResetSuccess('')
    }
  }, [isLogin, isResetPassword, success])

  // Real-time validation
  const validateField = useCallback((name: string, value: string, isSubmit = false) => {
    const errors: Record<string, string> = { ...fieldErrors }

    switch (name) {
      case 'email':
        if (!value) {
          errors.email = isSubmit ? 'Email is required' : ''
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address'
        } else {
          delete errors.email
        }
        break
      case 'password':
        if (!value) {
          errors.password = isSubmit ? 'Password is required' : ''
        } else {
          // Use centralized password validation
          const passwordResult = validatePassword(value, DEFAULT_PASSWORD_CONSTRAINTS)
          if (!passwordResult.isValid) {
            errors.password = passwordResult.errors[0] // Show first error
          } else {
            delete errors.password
          }
        }
        break
      case 'confirmPassword':
        const password = formRef.current?.password?.value || ''
        if (!value) {
          errors.confirmPassword = isSubmit ? 'Please confirm your password' : ''
        } else {
          // Use centralized password confirmation validation
          const confirmationResult = validatePasswordConfirmation(password, value, DEFAULT_PASSWORD_CONSTRAINTS)
          if (!confirmationResult.isValid) {
            errors.confirmPassword = confirmationResult.errors.find(e => e.includes('match')) || confirmationResult.errors[0]
          } else {
            delete errors.confirmPassword
          }
        }
        break
    }

    setFieldErrors(errors)
  }, [fieldErrors])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setFormValues(prev => ({ ...prev, [name]: value }))

    // Only validate if user has actually typed something
    if (value.length > 0) {
      validateField(name, value)
    }

    // Clear general error when user starts typing
    if (error) {
      setError('')
    }
  }, [validateField, error])

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))

    // Only validate on blur if user has actually typed something
    if (value.length > 0) {
      validateField(name, value)
    }
  }, [validateField])

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Validate all fields before submission
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    validateField('email', email, true)
    if (!isResetPassword) {
      validateField('password', password, true)
      if (!isLogin) {
        validateField('confirmPassword', confirmPassword, true)
      }
    }

    // Check if there are any validation errors
    const hasErrors = Object.keys(fieldErrors).length > 0
    if (hasErrors) {
      setIsLoading(false)
      return
    }

    try {
      if (isResetPassword) {
        const result = await requestPasswordReset(formData)
        if (result.success) {
          // Set reset success message and switch to login form
          setResetSuccess('Mail sent successfully! Please check your mail to reset password.')
          if (onSwitchToLogin) {
            onSwitchToLogin()
          }
        } else {
          setError(result.error || 'Failed to send password reset email')
        }
      } else if (isLogin) {
        const result = await login(formData)
        if (result?.success) {
          // Add a small delay to ensure the auth state has time to update
          setTimeout(() => {
            onSuccess()
          }, 100)
        }
      } else {
        await register(formData)
        setSuccess('Registration successful! Please check your email for confirmation.')
        // Switch to login mode and show confirmation message instead of closing modal
        if (onSwitchToLogin) {
          onSwitchToLogin()
        }
      }
    } catch (err) {
      // Check if it's a NEXT_REDIRECT error (which is expected behavior for redirects)
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
        // Don't show error for redirects - this is expected behavior
        return
      }

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'

      // TEMPORARILY DISABLED: Error fallback display
      // setError(errorMessage)
      console.log('Auth form error (fallback disabled):', { errorMessage, err })

      // If it's a "user not found" error, suggest creating an account
      if (errorMessage.includes('No account found') && isLogin) {
        // TEMPORARILY DISABLED: setError(errorMessage + ' Would you like to create a new account instead?')
        console.log('User not found error (fallback disabled):', errorMessage + ' Would you like to create a new account instead?')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getFieldError = (fieldName: string) => {
    return touched[fieldName] ? fieldErrors[fieldName] : ''
  }

  const isFieldInvalid = (fieldName: string) => {
    return touched[fieldName] && fieldErrors[fieldName]
  }

  // Check if form is valid for submission
  const isFormValid = () => {
    // Check if there are any validation errors
    if (Object.keys(fieldErrors).length > 0) {
      console.log('Form invalid: field errors', fieldErrors)
      return false
    }

    // Check if required fields are filled - try state first, then DOM as fallback
    const email = formValues.email || formRef.current?.email?.value || ''
    const password = formValues.password || formRef.current?.password?.value || ''
    const confirmPassword = formValues.confirmPassword || formRef.current?.confirmPassword?.value || ''

    console.log('Form validation check:', {
      email,
      password: password ? '***' : '',
      confirmPassword: confirmPassword ? '***' : '',
      isLogin,
      isResetPassword,
      fieldErrors: Object.keys(fieldErrors),
      formValues,
      domValues: {
        email: formRef.current?.email?.value || '',
        password: formRef.current?.password?.value || '',
        confirmPassword: formRef.current?.confirmPassword?.value || ''
      }
    })

    // Email is always required
    if (!email.trim()) {
      console.log('Form invalid: email empty')
      return false
    }

    // Password is required for login and register (not for reset password)
    if (!isResetPassword && !password.trim()) {
      console.log('Form invalid: password empty')
      return false
    }

    // Confirm password is required for register only
    if (!isLogin && !isResetPassword && !confirmPassword.trim()) {
      console.log('Form invalid: confirm password empty')
      return false
    }

    console.log('Form is valid!')
    return true
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div
          className="text-sm text-red-700 dark:text-red-300 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-2 rounded-lg border border-red-200 dark:border-red-800/30 shadow-sm"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start space-x-3">
            <svg
              className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="font-medium">Authentication Error</p>
              <p className="mt-1 text-red-600 dark:text-red-400">{error}</p>
              {error.includes('No account found') && isLogin && (
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
                  aria-label="Switch to create account mode"
                >
                  Create a new account instead
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {success && (isResetPassword || (isLogin && success.includes('Registration successful'))) && (
        <div
          className="text-sm text-green-700 dark:text-green-300 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-2 rounded-lg border border-green-200 dark:border-green-800/30 shadow-sm"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center space-x-3">
            <svg
              className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="font-medium">{success}</p>
          </div>
        </div>
      )}

      {resetSuccess && isLogin && (
        <div className="mb-3 p-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800/30">
          <p className="font-medium">{resetSuccess}</p>
        </div>
      )}

      <div className="space-y-1">
        <Label
          htmlFor="email"
          className="text-base font-semibold text-slate-700 dark:text-slate-300"
        >
          Email
        </Label>
        <EmailInput
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          value={formValues.email || ''}
          placeholder="Enter your email address"
          autoComplete="email"
          required
          disabled={isLoading}
          onChange={handleInputChange}
          onBlur={handleBlur}
          aria-invalid={isFieldInvalid('email') ? 'true' : 'false'}
          aria-describedby={isFieldInvalid('email') ? 'email-error' : undefined}
          constraints={DEFAULT_EMAIL_CONSTRAINTS}
          className={`transition-all duration-200 ${isFieldInvalid('email')
            ? 'border-red-300 dark:border-red-600 focus-visible:ring-red-500/20'
            : 'border-slate-300 dark:border-slate-600 focus-visible:ring-blue-500/20'
            }`}
        />
        {isFieldInvalid('email') && (
          <p id="email-error" className="text-sm text-red-600 dark:text-red-400 mt-1" role="alert">
            {getFieldError('email')}
          </p>
        )}
      </div>

      {!isResetPassword && (
        <>
          <div className="space-y-1">
            <Label
              htmlFor="password"
              className="text-base font-semibold text-slate-700 dark:text-slate-300"
            >
              Password
            </Label>
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
                if (error) {
                  setError('')
                }
              }}
              onBlur={() => {
                setTouched(prev => ({ ...prev, password: true }))
                if (formValues.password && formValues.password.length > 0) {
                  validateField('password', formValues.password)
                }
              }}
              placeholder="Enter your password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              disabled={isLoading}
              required
              constraints={DEFAULT_PASSWORD_CONSTRAINTS}
            />
            {isFieldInvalid('password') && (
              <p id="password-error" className="text-sm text-red-600 dark:text-red-400 mt-1" role="alert">
                {getFieldError('password')}
              </p>
            )}
            {isLogin && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={onResetPassword}
                  className="text-base text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 rounded-sm "
                  aria-label="Reset password"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <Label
                htmlFor="confirmPassword"
                className="text-base font-semibold text-slate-700 dark:text-slate-300"
              >
                Confirm Password
              </Label>
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
                  if (error) {
                    setError('')
                  }
                }}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, confirmPassword: true }))
                  if (formValues.confirmPassword && formValues.confirmPassword.length > 0) {
                    validateField('confirmPassword', formValues.confirmPassword)
                  }
                }}
                placeholder="Confirm your password"
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
          )}
        </>
      )}

      {/* Toggle section above submit button */}
      {!isResetPassword && (
        <div className="text-center py-1 border-t border-slate-200 dark:border-slate-700">
          {isLogin ? (
            <div className="space-y-1">
              <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
                Don't have an account?
              </p>
              <button
                type="button"
                onClick={onToggleMode}
                className="text-base font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 rounded-sm "
                aria-label="Switch to create account mode"
              >
                Sign up
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
                Already have an account?
              </p>
              <button
                type="button"
                onClick={onToggleMode}
                className="text-base font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 rounded-sm"
                aria-label="Switch to sign in mode"
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      )}

      <MetaButton
        type="submit"
        variant="primary"
        size="lg"
        width="full"
        isLoading={isLoading}
        loadingText={
          isResetPassword
            ? 'Sending reset link...'
            : isLogin
              ? 'Signing in...'
              : 'Creating account...'
        }
        showLoadingText={true}
        loadingTextAnimation="pulse"
        loadingIconType="spinner"
        showLoadingIcon={true}
        loadingSpeed="normal"
        icon={
          isResetPassword
            ? Icons.arrowRight
            : isLogin
              ? Icons.login
              : Icons.user
        }
        disabled={isLoading}
        onClick={() => {
          if (formRef.current && !isLoading) {
            setIsLoading(true)
            formRef.current.requestSubmit()
          }
        }}
        text={
          isResetPassword
            ? 'Send Reset Link'
            : isLogin
              ? 'Sign In'
              : 'Create Account'
        }
        tooltip={
          isResetPassword
            ? 'Send password reset link to your email'
            : isLogin
              ? 'Sign in to your account'
              : 'Create a new account'
        }
        tooltipPosition="top"
        analyticsEvent={
          isResetPassword
            ? 'password_reset_attempt'
            : isLogin
              ? 'login_attempt'
              : 'registration_attempt'
        }
        analyticsData={{
          formType: isResetPassword ? 'reset' : isLogin ? 'login' : 'register',
          timestamp: new Date().toISOString()
        }}
        className=""
      />

      {/* Reset password back to login link */}
      {isResetPassword && (
        <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="space-y-1">
            <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
              Remember your password?
            </p>
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-base text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 rounded-sm"
              aria-label="Back to sign in"
            >
              Sign in
            </button>
          </div>
        </div>
      )}
    </form>
  )
}