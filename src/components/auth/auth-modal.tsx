'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AuthForm } from './auth-form'
import { OAuthButtons } from './oauth-buttons'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  feature?: string
}

export function AuthModal({ isOpen, onClose, feature }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [isResetPassword, setIsResetPassword] = useState(false)
  const [oauthError, setOauthError] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      if (firstElement) {
        firstElement.focus()
      }
    }
  }, [isOpen])

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsLogin(true)
    setIsResetPassword(false)
    setOauthError('')
    onClose()
  }

  const handleOAuthError = (error: string) => {
    setOauthError(error)
  }

  const handleToggleMode = () => {
    setIsLogin(!isLogin)
    setIsResetPassword(false)
    setOauthError('')
  }

  const handleResetPassword = () => {
    setIsResetPassword(true)
    setIsLogin(false)
    setOauthError('')
  }

  const handleBackToLogin = () => {
    setIsResetPassword(false)
    setIsLogin(true)
    setOauthError('')
  }

  const handleSwitchToLogin = () => {
    setIsResetPassword(false)
    setIsLogin(true)
    setOauthError('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        ref={modalRef}
        className="sm:max-w-xs relative overflow-hidden"
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-description"
        role="dialog"
        aria-modal="true"
      >
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20" />

        {/* Content container with proper z-index */}
        <div className="relative z-10">
          <DialogHeader className="space-y-2">
            <DialogTitle
              id="auth-modal-title"
              className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-100 dark:via-blue-100 dark:to-slate-100 bg-clip-text text-transparent"
            >
              {isResetPassword
                ? 'Reset password'
                : isLogin
                  ? 'Welcome back'
                  : 'Create account'
              }
            </DialogTitle>
            <DialogDescription
              id="auth-modal-description"
              className="text-slate-600 dark:text-slate-400 text-sm"
            >
              {isResetPassword
                ? 'Enter your email to reset your password'
                : feature
                  ? `Sign in to access ${feature}`
                  : isLogin
                    ? 'Enter your credentials'
                    : 'Join us today'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {!isResetPassword && (
              <>
                <OAuthButtons onError={handleOAuthError} />

                {oauthError && (
                  <div
                    className="text-sm text-red-700 dark:text-red-300 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-xl border border-red-200 dark:border-red-800/30 shadow-sm"
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
                        <p className="mt-1 text-red-600 dark:text-red-400">{oauthError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative" role="separator" aria-label="Authentication options">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white dark:bg-slate-800 px-4 py-1 text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Or continue with
                    </span>
                  </div>
                </div>
              </>
            )}

            <AuthForm
              isLogin={isLogin}
              isResetPassword={isResetPassword}
              onToggleMode={handleToggleMode}
              onResetPassword={handleResetPassword}
              onBackToLogin={handleBackToLogin}
              onSuccess={handleClose}
              onSwitchToLogin={handleSwitchToLogin}
            />
          </div>
        </div>

        {/* Subtle animation indicator */}
        {isAnimating && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 animate-pulse pointer-events-none" />
        )}
      </DialogContent>
    </Dialog>
  )
}