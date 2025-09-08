"use client"
import { useState, useEffect } from "react"
import { Icons } from "@/components/icons"
import { MetaButton } from "@/components/buttons/meta-button"
import { useAuth } from "@/components/auth/auth-provider";
import { AuthModal } from "@/components/auth/auth-modal";
import { UserProfileCard } from "@/components/user-profile-card";

export const LoginButton = () => {
  const { user, loading, refreshAuth } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [resetButton, setResetButton] = useState(false);

  const handleLogin = () => {

    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    console.log('handleAuthModalClose called');
    setIsAuthModalOpen(false);

    // Reset scroll position to top when modal closes
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Reset button state when modal closes
    setResetButton(true);
    setTimeout(() => setResetButton(false), 100);

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
          analyticsEvent="login_button_click"
          analyticsData={{
            location: 'header'
          }}
          className="text-base font-semibold mr-5 py-2 px-8 w-full"
          icon={Icons.next}
          resetClicked={resetButton}
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
