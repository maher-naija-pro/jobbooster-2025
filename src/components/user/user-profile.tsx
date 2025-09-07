'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/components/auth/auth-provider'
import { useProfile } from '@/components/auth/profile-provider'
import { logout } from '@/app/auth/logout/actions'
import { AuthModal } from '@/components/auth/auth-modal'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export function UserProfile() {
    const { user, signOut } = useAuth()
    const { profile } = useProfile()
    const [isSigningOut, setIsSigningOut] = useState(false)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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

    const handleLoginClick = () => {
        setIsAuthModalOpen(true)
    }

    const handleAuthModalClose = () => {
        setIsAuthModalOpen(false)
    }

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setIsDropdownOpen(true)
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false)
        }, 150) // Small delay to prevent flickering
    }

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    if (!user) {
        return (
            <>
                <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleLoginClick}
                    className="text-gray-900 hover:text-blue-600 hover:bg-transparent font-medium whitespace-nowrap text-lg px-6 py-3"
                >
                    Login
                </Button>
                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={handleAuthModalClose}
                />
            </>
        )
    }

    return (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
                <div
                    className="flex items-center cursor-pointer"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="hidden sm:block">
                        {profile?.username || profile?.fullName || user.email?.split('@')[0]}
                    </div>
                    <Avatar className="ml-2 h-10 w-10">
                        <AvatarImage
                            src={profile?.avatarUrl || user.user_metadata?.avatar_url || user.user_metadata?.picture}
                            alt={profile?.fullName || user.user_metadata?.full_name || user.email || "User"}
                        />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {profile?.fullName?.charAt(0) || user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56"
                align="end"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {profile?.username || profile?.fullName || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center w-full">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center w-full">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Preferences</span>
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="text-red-600 focus:text-red-600"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isSigningOut ? 'Signing out...' : 'Log out'}</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
