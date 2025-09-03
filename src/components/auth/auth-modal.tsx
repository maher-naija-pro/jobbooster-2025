'use client'

import { useState } from 'react'
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
  const [oauthError, setOauthError] = useState('')

  const handleClose = () => {
    setIsLogin(true)
    setOauthError('')
    onClose()
  }

  const handleOAuthError = (error: string) => {
    setOauthError(error)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </DialogTitle>
          <DialogDescription>
            {feature
              ? `Sign in to access ${feature} features`
              : isLogin
                ? 'Enter your email and password to sign in'
                : 'Enter your details to create a new account'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <OAuthButtons onError={handleOAuthError} />

          {oauthError && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              <div className="flex items-start space-x-2">
                <svg className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p>{oauthError}</p>
              </div>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <AuthForm
            isLogin={isLogin}
            onToggleMode={() => setIsLogin(!isLogin)}
            onSuccess={handleClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
