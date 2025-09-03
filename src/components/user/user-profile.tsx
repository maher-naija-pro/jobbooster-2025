'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/auth-provider'
import { logout } from '@/app/auth/logout/actions'

export function UserProfile() {
    const { user, signOut } = useAuth()
    const [isSigningOut, setIsSigningOut] = useState(false)

    const handleSignOut = async () => {
        setIsSigningOut(true)
        try {
            await signOut()
            await logout()
        } catch (error) {
            console.error('Sign out error:', error)
        } finally {
            setIsSigningOut(false)
        }
    }

    if (!user) {
        return null
    }

    return (
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                        {user.email?.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="hidden sm:block">
                    <p className="text-sm font-medium">{user.email}</p>
                </div>
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                disabled={isSigningOut}
            >
                {isSigningOut ? 'Signing out...' : 'Sign out'}
            </Button>
        </div>
    )
}
