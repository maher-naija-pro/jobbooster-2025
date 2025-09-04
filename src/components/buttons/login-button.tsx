"use client"
import { useState } from "react"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider";
import { AuthModal } from "@/components/auth/auth-modal";

export const LoginButton = () => {
  const { user, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => (user ? signOut() : handleLogin())}
        className="hover:border text-slate-50 bg-slate-900 hover:bg-slate-50 hover:text-slate-900 border-slate-700 text-base font-semibold mr-5 py-2 px-8 w-full"
      >
        {user ? "Logout" : "Login"}
        <Icons.next className="h-6 w-4 ml-2" />
      </Button>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
      />
    </>
  )
}
