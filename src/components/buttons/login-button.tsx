"use client"
import { useState, useEffect } from "react"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider";
import { AuthModal } from "@/components/auth/auth-modal";
import { UserProfileCard } from "@/components/user-profile-card";

export const LoginButton = () => {
  const { user, loading, refreshAuth } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    // Refresh auth state after modal closes to ensure real-time updates
    refreshAuth();
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

  // If user is logged in, show the new profile card
  return <UserProfileCard />;
}
