'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ModernLoginButton } from '@/components/ui/modern-login-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/app/auth/login/actions'
import { register } from '@/app/auth/register/actions'

interface AuthFormProps {
  isLogin: boolean
  onToggleMode: () => void
  onSuccess: () => void
}

export function AuthForm({ isLogin, onToggleMode, onSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isLogin) {
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

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
          <div className="flex items-start space-x-2">
            <svg className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p>{error}</p>
              {error.includes('No account found') && isLogin && (
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Create a new account instead
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
          {success}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
          disabled={isLoading}
        />
      </div>

      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
            disabled={isLoading}
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
      </Button>

      <div className="text-center text-sm">
        {isLogin ? (
          <>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-primary hover:underline"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-primary hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </form>
  )
}
