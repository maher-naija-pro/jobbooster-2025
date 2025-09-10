'use client'

import React, { useState } from 'react'
import { MetaButton } from '@/components/buttons/meta-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/icons'
import { requestPasswordReset } from './actions'

interface ResetPasswordPageProps {
    searchParams: Promise<{
        message?: string
    }>
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<string>('')
    const [error, setError] = useState<string>('')

    // Handle URL message parameter
    const [urlMessage, setUrlMessage] = useState<string>('')

    // Effect to handle URL message parameter
    React.useEffect(() => {
        searchParams.then(params => {
            if (params.message) {
                setUrlMessage(params.message)
            }
        })
    }, [searchParams])

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        setError('')
        setMessage('')

        try {
            const result = await requestPasswordReset(formData)

            if (result.success) {
                setMessage(result.message || 'Password reset email sent! Please check your inbox and follow the instructions.')
            } else {
                setError(result.error || 'Failed to send password reset email')
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to send password reset email'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Reset your password</CardTitle>
                    <CardDescription>
                        Enter your email address and we'll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {(message || urlMessage) && (
                        <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 rounded-md">
                            {message || urlMessage}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">
                            {error}
                        </div>
                    )}

                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <MetaButton
                            type="submit"
                            variant="primary"
                            size="lg"
                            width="full"
                            isLoading={isLoading}
                            loadingText="Sending reset link..."
                            showLoadingText={true}
                            loadingTextAnimation="pulse"
                            loadingIconType="spinner"
                            showLoadingIcon={true}
                            loadingSpeed="normal"
                            icon={Icons.mail}
                            disabled={isLoading}
                            text="Send reset link"
                            tooltip="Send password reset link to your email"
                            tooltipPosition="top"
                            analyticsEvent="password_reset_attempt"
                            analyticsData={{
                                formType: 'reset_password',
                                timestamp: new Date().toISOString()
                            }}
                        />
                    </form>

                    <div className="mt-4 text-center text-sm">
                        <a href="/auth/login" className="text-primary hover:underline">
                            Back to sign in
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
