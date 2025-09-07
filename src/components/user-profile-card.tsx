"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth/auth-provider"
import { useProfile } from "@/components/auth/profile-provider"
import { logout } from "@/app/auth/logout/actions"
import { cn } from "@/lib/utils"
import { isPricingEnabled } from "@/lib/feature-flags"

interface UserProfileCardProps {
    className?: string
}

export const UserProfileCard = ({ className }: UserProfileCardProps) => {
    const { user, signOut, loading } = useAuth()
    const { profile } = useProfile()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    const handleLogout = async () => {
        console.log('🚀 UserProfileCard: Logout clicked')
        setIsOpen(false) // Close immediately for better UX
        try {
            await signOut()
            await logout() // This will handle the redirect to home
        } catch (error) {
            console.error('Sign out error:', error)
        }
        console.log('🚀 UserProfileCard: Logout completed')
    }

    const handleProfile = () => {
        router.push("/profile")
        setIsOpen(false)
    }

    const handleSettings = () => {
        router.push("/settings")
        setIsOpen(false)
    }

    const handleDashboard = () => {
        router.push("/dashboard")
        setIsOpen(false)
    }

    // Close the card when user logs out
    useEffect(() => {
        if (!user) {
            setIsOpen(false)
        }
    }, [user])

    if (loading) {
        return (
            <Button
                variant="outline"
                className="text-base font-semibold mr-5 py-2 px-8 w-full"
                disabled
            >
                <Icons.Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
            </Button>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className={cn("relative", className)}>
            {/* Trigger Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="outline"
                className="text-sm font-medium mr-3 py-1.5 px-2 w-auto h-auto hover:bg-gray-50 transition-all duration-200"
            >
                <Avatar className="h-6 w-6 mr-1.5">
                    <AvatarImage
                        src={profile?.avatarUrl || user.user_metadata?.avatar_url || user.user_metadata?.picture}
                        alt={profile?.fullName || user.user_metadata?.full_name || user.email || "User"}
                    />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {profile?.fullName?.charAt(0) || user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm">
                    {profile?.username || profile?.fullName || user.user_metadata?.full_name || user.email?.split('@')[0] || "User"}
                </span>
                <Icons.down className={cn("h-3 w-3 ml-1.5 transition-transform duration-200", isOpen && "rotate-180")} />
            </Button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Profile Card */}
            <div
                className={cn(
                    "fixed top-14 right-4 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-300 ease-out",
                    isOpen
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
                )}
            >
                <Card className="border-0 shadow-none">
                    <CardHeader className="pb-2">
                        <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={profile?.avatarUrl || user.user_metadata?.avatar_url || user.user_metadata?.picture}
                                    alt={profile?.fullName || user.user_metadata?.full_name || user.email || "User"}
                                />
                                <AvatarFallback className="text-sm bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                    {profile?.fullName?.charAt(0) || user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate text-sm">
                                    {profile?.username || profile?.fullName || user.user_metadata?.full_name || "User"}
                                </h3>
                                <p className="text-xs text-gray-500 truncate">
                                    {user.email}
                                </p>
                                <Badge variant="secondary" className="mt-0.5 text-xs px-1.5 py-0.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                                    Online
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-0 pb-2">
                        <div className="space-y-0.5">
                            {/* Quick Actions */}
                            <Button
                                variant="ghost"
                                onClick={handleDashboard}
                                className="w-full justify-start h-8 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm"
                            >
                                <Icons.user className="mr-2 h-3.5 w-3.5" />
                                Dashboard
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={handleProfile}
                                className="w-full justify-start h-8 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm"
                            >
                                <Icons.profile className="mr-2 h-3.5 w-3.5" />
                                Profile
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={handleSettings}
                                className="w-full justify-start h-8 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm"
                            >
                                <Icons.settings className="mr-2 h-3.5 w-3.5" />
                                Preferences
                            </Button>

                            <Separator className="my-1.5" />

                            {/* Account Info - Only show if pricing is enabled */}
                            {isPricingEnabled() && (
                                <>
                                    <div className="px-2 py-1.5 bg-gray-50 rounded-md">
                                        <p className="text-xs text-gray-500 mb-0.5">Account Type</p>
                                        <p className="text-xs font-medium text-gray-900">Free Plan</p>
                                    </div>
                                    <Separator className="my-1.5" />
                                </>
                            )}

                            {/* Logout */}
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="w-full justify-start h-8 text-red-600 hover:bg-red-50 hover:text-red-700 text-sm"
                            >
                                <Icons.login className="mr-2 h-3.5 w-3.5" />
                                Sign Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
