import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../lib/app-context";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ProfileProvider } from "@/components/auth/profile-provider";
import { GDPRProvider } from "@/components/gdpr/GDPRProvider";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobBooster - Job Application Enhancer",
  description: "Create tailored job application materials with AI-powered content generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        <AppProvider>
          <AuthProvider>
            <ProfileProvider>
              <GDPRProvider>
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
                <ScrollToTop />
                <Toaster position="top-right" richColors />
              </GDPRProvider>
            </ProfileProvider>
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
