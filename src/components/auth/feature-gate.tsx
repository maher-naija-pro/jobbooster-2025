'use client'

import { useState } from 'react'
import { AuthModal } from './auth-modal'
import { useAuth } from './auth-provider'

interface FeatureGateProps {
    children: React.ReactNode
    feature: string
    fallback?: React.ReactNode
}

export function FeatureGate({ children, feature, fallback }: FeatureGateProps) {
    const [showAuthModal, setShowAuthModal] = useState(false)
    const { user, loading } = useAuth()

    const handleFeatureAccess = () => {
        if (!user) {
            setShowAuthModal(true)
            return
        }

        // User is authenticated, allow access
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            </div>
        )
    }

    if (!user) {
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
                    />
                )}
            </>
        )
    }

    return <>{children}</>
}
