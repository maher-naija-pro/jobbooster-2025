"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth/auth-provider";
import { AuthModal } from "@/components/auth/auth-modal";

export const LoginButton = () => {
  const { user, signOut, loading, refreshAuth } = useAuth();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    // Refresh auth state after modal closes to ensure real-time updates
    refreshAuth();
  };

  const handleLogout = async () => {
    await signOut();
    // The auth state will update automatically via the auth provider
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  // Debug: Log user state changes
  useEffect(() => {
    console.log('LoginButton: User state changed:', { user: user?.id, loading });
  }, [user, loading]);

  // Show loading state while checking auth
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
    );
  }

  // If user is not logged in, show login button
  if (!user) {
    return (
      <>
        <Button
          onClick={handleLogin}
          variant="outline"
          className="text-base font-semibold mr-5 py-2 px-8 w-full"
        >
          Login
          <Icons.next className="h-6 w-4 ml-2" />
        </Button>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={handleAuthModalClose}
        />
      </>
    );
  }

  // If user is logged in, show avatar with dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="text-base font-semibold mr-5 py-2 px-4 w-auto h-auto"
        >
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage
              src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
              alt={user.user_metadata?.full_name || user.email || "User"}
            />
            <AvatarFallback className="text-sm">
              {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline">
            {user.user_metadata?.full_name || user.email?.split('@')[0] || "User"}
          </span>
          <Icons.down className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">
              {user.user_metadata?.full_name || "User"}
            </p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
          <Icons.profile className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
          <Icons.settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <Icons.login className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
