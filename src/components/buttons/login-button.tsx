"use client"
import { useState, useEffect } from "react"
import { Icons } from "@/components/icons"
import { MetaButton } from "@/components/ui/meta-button"
import { useAuth } from "@/components/auth/auth-provider";
import { AuthModal } from "@/components/auth/auth-modal";
import { UserProfileCard } from "@/components/user-profile-card";

export const LoginButton = () => {
  const { user, loading, refreshAuth } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleLogin = () => {
    setIsButtonDisabled(true);
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    setIsButtonDisabled(false);
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
      <MetaButton
        variant="primary-outline"
        size="md"
        width="sm"
        text="Loading..."
        disabled
        className="text-base font-semibold mr-5 py-2 px-8 w-full"
        icon={Icons.Loader2}
      />
    );
  }

  // If user is not logged in, show login button
  if (!user) {
    return (
      <>
        <MetaButton
          onClick={handleLogin}
          variant="primary"
          size="md"
          width="sm"
          text="Login"
          disabled={isButtonDisabled}
          analyticsEvent="login_button_click"
          analyticsData={{
            location: 'header'
          }}
          className="text-base font-semibold mr-5 py-2 px-8 w-full"
          icon={Icons.next}
        />

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
