'use client'

import { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/icons'
import { EmailInput } from '@/components/auth/email-input'
import { DEFAULT_EMAIL_CONSTRAINTS } from '@/components/auth/email-constraints'
import { requestPasswordReset } from '@/app/auth/reset-password/actions'
import { logger } from '@/lib/logger'
import { toast } from 'sonner'

interface ResetPasswordModalProps {
    children: React.ReactNode
}

export function ResetPasswordModal({ children }: ResetPasswordModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email.trim()) {
            setError('Email is required')
            return
        }

        setIsLoading(true)
        setError('')
        setMessage('')

        try {
            logger.info('Password reset request initiated from modal', {
                action: 'resetPasswordModal',
                step: 'form_submission_started',
                email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null',
                timestamp: new Date().toISOString()
            })

            const formData = new FormData()
            formData.append('email', email)

            const result = await requestPasswordReset(formData)

            if (result.success) {
                setMessage(result.message || 'Password reset email sent! Check your inbox.')
                logger.info('Password reset email sent successfully from modal', {
                    action: 'resetPasswordModal',
                    step: 'reset_email_sent',
                    email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null',
                    timestamp: new Date().toISOString()
                })
                toast.success('Password reset email sent!')

                // Close modal after successful submission
                setTimeout(() => {
                    setIsOpen(false)
                    setEmail('')
                    setMessage('')
                    setError('')
                }, 2000)
            } else {
                setError(result.error || 'Failed to send password reset email')
                logger.error('Password reset failed from modal', {
                    action: 'resetPasswordModal',
                    step: 'reset_failed',
                    error: result.error,
                    email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null',
                    timestamp: new Date().toISOString()
                })
                toast.error(result.error || 'Failed to send password reset email')
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to send password reset email'
            setError(errorMessage)
            logger.error('Unexpected error in password reset modal', {
                action: 'resetPasswordModal',
                step: 'unexpected_error',
                error: errorMessage,
                email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null',
                timestamp: new Date().toISOString()
            })
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }, [email])

    const handleOpenChange = useCallback((open: boolean) => {
        setIsOpen(open)
        if (!open) {
            // Reset form when closing
            setEmail('')
            setMessage('')
            setError('')
        }
    }, [])

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icons.lock className="h-5 w-5" />
                        Reset Password
                    </DialogTitle>
                    <DialogDescription>
                        Enter your email address and we'll send you a link to reset your password.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {message && (
                        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <EmailInput
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                            disabled={isLoading}
                            autoComplete="email"
                            constraints={DEFAULT_EMAIL_CONSTRAINTS}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !email.trim()}
                            className="flex-1"
                        >
                            {isLoading ? (
                                <>
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Icons.mail className="mr-2 h-4 w-4" />
                                    Send Reset Link
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
