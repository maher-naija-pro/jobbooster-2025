'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { MetaButton } from '@/components/buttons/meta-button'
import { Icons } from '@/components/icons'
import { EmailInput } from '@/components/auth/email-input'
import { DEFAULT_EMAIL_CONSTRAINTS } from '@/components/auth/email-constraints'
import { requestPasswordReset } from '@/app/auth/reset-password/actions'
import { logger } from '@/lib/logger'
import { toast } from 'sonner'

interface SecuritySettingsProps {
    profile: any
}

export function SecuritySettings({ profile }: SecuritySettingsProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [passwordResetMessage, setPasswordResetMessage] = useState('')
    const [passwordResetError, setPasswordResetError] = useState('')

    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: profile?.preferences?.security?.twoFactorAuth || false,
        loginAlerts: profile?.preferences?.security?.loginAlerts || true,
        sessionTimeout: profile?.preferences?.security?.sessionTimeout || 30,
        requirePasswordChange: profile?.preferences?.security?.requirePasswordChange || false,
        passwordChangeDays: profile?.preferences?.security?.passwordChangeDays || 90
    })

    // Mock data for active sessions
    const activeSessions = [
        {
            id: '1',
            device: 'Chrome on Windows',
            location: 'New York, NY',
            ipAddress: '192.168.1.100',
            lastActive: '2024-01-20 14:30',
            current: true
        },
        {
            id: '2',
            device: 'Safari on iPhone',
            location: 'San Francisco, CA',
            ipAddress: '192.168.1.101',
            lastActive: '2024-01-19 09:15',
            current: false
        }
    ]

    const handleSecuritySettingChange = (key: string, value: boolean | number) => {
        setSecuritySettings(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email.trim()) {
            setPasswordResetError('Email is required')
            return
        }

        setIsPasswordResetLoading(true)
        setPasswordResetError('')
        setPasswordResetMessage('')

        try {
            logger.info('Password reset request initiated from security settings', {
                action: 'securitySettingsPasswordReset',
                step: 'form_submission_started',
                email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null',
                timestamp: new Date().toISOString()
            })

            const formData = new FormData()
            formData.append('email', email)

            const result = await requestPasswordReset(formData)

            if (result.success) {
                setPasswordResetMessage(result.message || 'Password reset email sent! Check your inbox.')
                logger.info('Password reset email sent successfully from security settings', {
                    action: 'securitySettingsPasswordReset',
                    step: 'reset_email_sent',
                    email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null',
                    timestamp: new Date().toISOString()
                })
                toast.success('Password reset email sent!')

                // Clear form after successful submission with delay (matching modal behavior)
                setTimeout(() => {
                    setEmail('')
                    setPasswordResetMessage('')
                    setPasswordResetError('')
                }, 2000)
            } else {
                setPasswordResetError(result.error || 'Failed to send password reset email')
                logger.error('Password reset failed from security settings', {
                    action: 'securitySettingsPasswordReset',
                    step: 'reset_failed',
                    error: result.error,
                    email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null',
                    timestamp: new Date().toISOString()
                })
                toast.error(result.error || 'Failed to send password reset email')
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to send password reset email'
            setPasswordResetError(errorMessage)
            logger.error('Unexpected error in password reset from security settings', {
                action: 'securitySettingsPasswordReset',
                step: 'unexpected_error',
                error: errorMessage,
                email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null',
                timestamp: new Date().toISOString()
            })
            toast.error(errorMessage)
        } finally {
            setIsPasswordResetLoading(false)
        }
    }

    const handleSecuritySettingsSave = async () => {
        setIsLoading(true)
        try {
            // Add actual security settings save logic here
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('Security settings updated successfully')
        } catch (error) {
            toast.error('Failed to update security settings')
        } finally {
            setIsLoading(false)
        }
    }

    const handleTerminateSession = async (sessionId: string) => {
        try {
            // Add actual session termination logic here
            await new Promise(resolve => setTimeout(resolve, 500))
            toast.success('Session terminated successfully')
        } catch (error) {
            toast.error('Failed to terminate session')
        }
    }

    const handleTerminateAllSessions = async () => {
        try {
            // Add actual terminate all sessions logic here
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('All other sessions terminated successfully')
        } catch (error) {
            toast.error('Failed to terminate sessions')
        }
    }

    return (
        <div className="space-y-6">
            {/* Password Reset */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icons.key className="h-5 w-5 text-blue-600" />
                        Change Password
                    </CardTitle>
                    <CardDescription>
                        Reset your password by requesting a secure link via email
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-start gap-3">
                                <Icons.alertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                <div className="space-y-2">
                                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                                        Secure Password Reset
                                    </p>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        For security reasons, password changes require email verification.
                                        Click the button below to receive a secure reset link in your email.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handlePasswordReset} className="space-y-4">
                            {passwordResetMessage && (
                                <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400 rounded-md">
                                    {passwordResetMessage}
                                </div>
                            )}

                            {passwordResetError && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 rounded-md">
                                    {passwordResetError}
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
                                    disabled={isPasswordResetLoading}
                                    autoComplete="email"
                                    constraints={DEFAULT_EMAIL_CONSTRAINTS}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setEmail('')
                                        setPasswordResetMessage('')
                                        setPasswordResetError('')
                                    }}
                                    disabled={isPasswordResetLoading}
                                    className="flex-1"
                                >
                                    Clear
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPasswordResetLoading || !email.trim()}
                                    className="flex-1"
                                >
                                    {isPasswordResetLoading ? (
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
                    </div>
                </CardContent>
            </Card>


        </div>
    )
}
