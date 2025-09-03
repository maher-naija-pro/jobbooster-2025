'use client'

import { useState } from 'react'
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
import { logout } from '@/app/auth/logout/actions'
import { AuthModal } from '@/components/auth/auth-modal'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'

export function UserProfile() {
    const { user, signOut } = useAuth()
    const [isSigningOut, setIsSigningOut] = useState(false)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

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

    if (!user) {
        return (
            <>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoginClick}
                    className="text-gray-900 hover:text-blue-600 font-medium whitespace-nowrap"
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
      
                    <div className="flex items-center ">
                        <div className="hidden sm:block">
                     
                                {user.email?.split('@')[0]}
                        
                        </div>
                        <Avatar className="ml-10- h-10 w-10">
                            <AvatarImage src={user.avatar_url} alt={user.email} />
                            <AvatarFallback className="text-xs">
                                {user.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                      
                    </div>
              
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
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
