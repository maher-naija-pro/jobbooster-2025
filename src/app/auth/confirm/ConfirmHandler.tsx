'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TokenData {
    access_token: string
    expires_at: number
    expires_in: number
    refresh_token: string
    token_type: string
    type: string
}

export default function ConfirmHandler() {
    const [isProcessing, setIsProcessing] = useState(true)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Parse URL fragment to extract token data
        const parseFragment = (): TokenData | null => {
            if (typeof window === 'undefined') return null

            const fragment = window.location.hash.substring(1) // Remove the #
            if (!fragment) return null

            const params = new URLSearchParams(fragment)
            const access_token = params.get('access_token')
            const expires_at = params.get('expires_at')
            const expires_in = params.get('expires_in')
            const refresh_token = params.get('refresh_token')
            const token_type = params.get('token_type')
            const type = params.get('type')

            if (!access_token || !expires_at || !expires_in || !refresh_token || !token_type || !type) {
                return null
            }

            return {
                access_token,
                expires_at: parseInt(expires_at),
                expires_in: parseInt(expires_in),
                refresh_token,
                token_type,
                type
            }
        }

        const processToken = async () => {
            try {
                const tokenData = parseFragment()

                if (!tokenData) {
                    setError('Invalid token data in URL')
                    setIsProcessing(false)
                    return
                }

                // Validate token type
                if (tokenData.type !== 'signup') {
                    setError('Invalid token type')
                    setIsProcessing(false)
                    return
                }

                // Check if token is expired
                const currentTime = Math.floor(Date.now() / 1000)
                if (tokenData.expires_at <= currentTime) {
                    setError('Token has expired')
                    setIsProcessing(false)
                    return
                }

                // Store tokens in localStorage for the app to use
                localStorage.setItem('access_token', tokenData.access_token)
                localStorage.setItem('refresh_token', tokenData.refresh_token)
                localStorage.setItem('token_expires_at', tokenData.expires_at.toString())

                // Clear the URL fragment for security
                window.history.replaceState({}, document.title, window.location.pathname)

                setIsSuccess(true)
                setIsProcessing(false)

                // Redirect to homepage after a short delay
                setTimeout(() => {
                    router.push('/')
                }, 2000)

            } catch (err) {
                console.error('Error processing token:', err)
                setError('Failed to process authentication token')
                setIsProcessing(false)
            }
        }

        processToken()
    }, [router])

    if (isProcessing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                            <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Verifying your email...
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please wait while we confirm your email address.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Verification Failed
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {error}
                        </p>
                    </div>

                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <div className="text-center">
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                Unable to verify email
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                There was an issue verifying your email address. Please try again or contact support.
                            </p>
                            <div className="mt-6 space-y-3">
                                <Link
                                    href="/auth/signup"
                                    className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Try Again
                                </Link>
                                <Link
                                    href="/"
                                    className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    Return to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Email Verified!
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Your email has been successfully verified.
                        </p>
                    </div>

                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                Verification Complete
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Your account is now active. Redirecting you to the homepage...
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Go to Homepage
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
