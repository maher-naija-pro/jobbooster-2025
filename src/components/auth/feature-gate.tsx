'use client'

import { useState } from 'react'
import { AuthModal } from './auth-modal'
import { useAuth } from './auth-provider'
import { useApp } from '@/lib/app-context'

interface FeatureGateProps {
    children: React.ReactNode
    feature: string
    fallback?: React.ReactNode
}

export function FeatureGate({ children, feature, fallback }: FeatureGateProps) {
    const [showAuthModal, setShowAuthModal] = useState(false)
    const { user, loading } = useAuth()
    const { state, dispatch } = useApp()
    const { isTestMode } = state

    // Check if test mode is enabled via environment variable
    const isTestModeEnabled = process.env.NEXT_PUBLIC_ENABLE_TEST_MODE !== 'false'

    const handleFeatureAccess = () => {
        if (!user && !isTestMode) {
            setShowAuthModal(true)
            return
        }

        // User is authenticated or in test mode, allow access
    }

    const handleTestModeToggle = () => {
        // Only allow test mode if enabled in environment
        if (isTestModeEnabled) {
            dispatch({ type: 'TOGGLE_TEST_MODE' })
            if (showAuthModal) {
                setShowAuthModal(false)
            }
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            </div>
        )
    }

    if (!user && !isTestMode) {
        return (
            <>
                <div onClick={handleFeatureAccess} className="cursor-pointer">
                    {fallback || children}
                </div>

                {showAuthModal && (
                    <AuthModal
                        isOpen={showAuthModal}
                        onClose={() => setShowAuthModal(false)}
                        feature={feature}
                        onTestModeToggle={handleTestModeToggle}
                    />
                )}
            </>
        )
    }

    return <>{children}</>
}
