'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/app/auth/login/actions'
import { register } from '@/app/auth/register/actions'
import { requestPasswordReset } from '@/app/auth/reset-password/actions'

interface AuthFormProps {
  isLogin: boolean
  isResetPassword?: boolean
  onToggleMode: () => void
  onResetPassword?: () => void
  onBackToLogin?: () => void
  onSuccess: () => void
}

export function AuthForm({ isLogin, isResetPassword = false, onToggleMode, onResetPassword, onBackToLogin, onSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

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

  // Real-time validation
  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = { ...fieldErrors }

    switch (name) {
      case 'email':
        if (!value) {
          errors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address'
        } else {
          delete errors.email
        }
        break
      case 'password':
        if (!value) {
          errors.password = 'Password is required'
        } else if (value.length < 8) {
          errors.password = 'Password must be at least 8 characters'
        } else if (!isLogin && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errors.password = 'Password must contain uppercase, lowercase, and number'
        } else {
          delete errors.password
        }
        break
      case 'confirmPassword':
        const password = formRef.current?.password?.value || ''
        if (!value) {
          errors.confirmPassword = 'Please confirm your password'
        } else if (value !== password) {
          errors.confirmPassword = 'Passwords do not match'
        } else {
          delete errors.confirmPassword
        }
        break
    }

    setFieldErrors(errors)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, value)

    // Clear general error when user starts typing
    if (error) {
      setError('')
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, value)
  }

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Validate all fields before submission
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    validateField('email', email)
    if (!isResetPassword) {
      validateField('password', password)
      if (!isLogin) {
        validateField('confirmPassword', confirmPassword)
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
        await requestPasswordReset(formData)
        setSuccess('Password reset email sent! Please check your inbox and follow the instructions.')
        // Close modal after a short delay to show success message
        setTimeout(() => {
          onSuccess()
        }, 3000)
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
        // Close modal after a short delay to show success message
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (err) {
      // Check if it's a NEXT_REDIRECT error (which is expected behavior for redirects)
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
        // Don't show error for redirects - this is expected behavior
        return
      }

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)

      // If it's a "user not found" error, suggest creating an account
      if (errorMessage.includes('No account found') && isLogin) {
        setError(errorMessage + ' Would you like to create a new account instead?')
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

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div
          className="text-sm text-red-700 dark:text-red-300 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-3 rounded-lg border border-red-200 dark:border-red-800/30 shadow-sm"
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

      {success && (
        <div
          className="text-sm text-green-700 dark:text-green-300 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-3 rounded-lg border border-green-200 dark:border-green-800/30 shadow-sm"
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

      <div className="space-y-1">
        <Label
          htmlFor="email"
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Email
        </Label>
        <Input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          required
          disabled={isLoading}
          onChange={handleInputChange}
          onBlur={handleBlur}
          aria-invalid={isFieldInvalid('email') ? 'true' : 'false'}
          aria-describedby={isFieldInvalid('email') ? 'email-error' : undefined}
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
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password
            </Label>
            <Input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
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
            {!isLogin && !isFieldInvalid('password') && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Must contain uppercase, lowercase, and number
              </p>
            )}
            {isLogin && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={onResetPassword}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 rounded-sm"
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
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Confirm Password
              </Label>
              <Input
                ref={confirmPasswordRef}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
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
          )}
        </>
      )}

      <Button
        type="submit"
        className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        disabled={isLoading || Object.keys(fieldErrors).length > 0}
        aria-describedby={isLoading ? 'loading-text' : undefined}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span id="loading-text">Processing...</span>
          </div>
        ) : (
          isResetPassword
            ? 'Send Reset Link'
            : isLogin
              ? 'Sign In'
              : 'Create Account'
        )}
      </Button>

      <div className="text-center text-xs space-y-1">
        {isResetPassword ? (
          <>
            <span className="text-slate-600 dark:text-slate-400">Remember your password? </span>
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 rounded-sm"
              aria-label="Back to sign in"
            >
              Sign in
            </button>
          </>
        ) : isLogin ? (
          <>
            <span className="text-slate-600 dark:text-slate-400">Don't have an account? </span>
            <button
              type="button"
              onClick={onToggleMode}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 rounded-sm"
              aria-label="Switch to create account mode"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            <span className="text-slate-600 dark:text-slate-400">Already have an account? </span>
            <button
              type="button"
              onClick={onToggleMode}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 rounded-sm"
              aria-label="Switch to sign in mode"
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </form>
  )
}