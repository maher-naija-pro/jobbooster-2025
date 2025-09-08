'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { signInWithGoogle } from '@/app/auth/oauth/actions'

interface OAuthButtonsProps {
    onError?: (error: string) => void
}

export function OAuthButtons({ onError }: OAuthButtonsProps) {
    const [isLoading, setIsLoading] = useState<string | null>(null)

    const handleOAuthSignIn = async () => {
        setIsLoading('google')

        try {
            const currentPath = window.location.pathname
            const result = await signInWithGoogle(currentPath)

            if (result.error) {
                console.error('OAuth error:', result.error)
                onError?.(result.error)
                return
            }

            if (result.url) {
                window.location.href = result.url
            }
        } catch (error) {
            console.error('OAuth sign in failed:', error)
            const errorMessage = error instanceof Error ? error.message : 'OAuth sign in failed. Please try again.'
            onError?.(errorMessage)
        } finally {
            setIsLoading(null)
        }
    }

    return (
        <div className="w-full">
            <Button
                variant="outline"
                onClick={handleOAuthSignIn}
                disabled={isLoading === 'google'}
                className="w-full h-10 relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-slate-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20"
                aria-label={isLoading === 'google' ? 'Signing in with Google...' : 'Sign in with Google'}
                role="button"
                tabIndex={0}
            >
                {/* Subtle background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />

                <div className="relative flex items-center justify-center space-x-3">
                    {isLoading === 'google' ? (
                        <>
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 dark:border-slate-600 dark:border-t-blue-400"
                                aria-hidden="true" />
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                Connecting...
                            </span>
                        </>
                    ) : (
                        <>
                            <svg
                                className="h-5 w-5 transition-transform group-hover:scale-110"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                                Continue with Google
                            </span>
                        </>
                    )}
                </div>
            </Button>
        </div>
    )
}