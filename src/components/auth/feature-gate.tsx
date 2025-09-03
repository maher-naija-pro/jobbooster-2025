'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthModal } from './auth-modal'
import type { User } from '@supabase/supabase-js'

interface FeatureGateProps {
    children: React.ReactNode
    feature: string
    fallback?: React.ReactNode
}

export function FeatureGate({ children, feature, fallback }: FeatureGateProps) {
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setIsLoading(false)
        }

        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null)
                setIsLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    const handleFeatureAccess = () => {
        if (!user) {
            setShowAuthModal(true)
            return
        }

        // User is authenticated, allow access
    }

    if (isLoading) {
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
