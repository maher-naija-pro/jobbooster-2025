import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../lib/app-context";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >

        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  🚀 TheJobBooster.com
                </h1>
              </div>
              <nav className="flex space-x-8">
                <Link href="/" className="text-gray-900 hover:text-blue-600 font-medium">
                  Home
                </Link>
                <Link href="/support" className="text-gray-600 hover:text-blue-600">
                  Support
                </Link>
                <Link href="/pricing" className="text-gray-600 hover:text-blue-600">
                  Pricing
                </Link>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Login
                </button>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1">
          <AppProvider>
            {children}
          </AppProvider>
        </main>

      </body>
    </html>
  );
}
