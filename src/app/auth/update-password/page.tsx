'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updatePassword } from '../reset-password/actions'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'
import { getHumanReadableError, ErrorInfo } from '@/lib/auth/error-messages'

interface UpdatePasswordPageProps {
  searchParams: Promise<{
    message?: string
    token?: string
  }>
}

export default function UpdatePasswordPage({ searchParams }: UpdatePasswordPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null)
  const [token, setToken] = useState<string>('')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // Check authentication status
  useEffect(() => {
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
  }, [])

  // Handle search params on client side
  useEffect(() => {
    searchParams.then(params => {
      if (params.message) {
        setMessage(decodeURIComponent(params.message))
      }
      if (params.token) {
        setToken(params.token)
      }
    })
  }, [searchParams])

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setMessage('')
    setErrorInfo(null)

    try {
      await updatePassword(formData)
      setMessage('Password updated successfully! You can now use your new password.')
    } catch (err) {
      const errorInfo = getHumanReadableError(err)
      setErrorInfo(errorInfo)
    } finally {
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
            <form action={handleSubmit} className="space-y-4">
              {token && (
                <input type="hidden" name="token" value={token} />
              )}
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update password'
                )}
              </Button>
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
