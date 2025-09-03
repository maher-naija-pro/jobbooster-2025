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

  const handleClose = () => {
    setIsLogin(true)
    onClose()
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
          <OAuthButtons />

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
