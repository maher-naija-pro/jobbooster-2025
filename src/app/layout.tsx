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

        <header className="bg-white border-b border-gray-200 shadow-sm overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 min-w-0 w-full">
              {/* Logo on the left */}
              <div className="flex items-center min-w-0 flex-shrink-0 max-w-[50%]">
                <h1 className="text-xl font-bold text-gray-900 truncate">
                  🚀 TheJobBooster.com
                </h1>
              </div>

              {/* Navigation and login button grouped on the right */}
              <div className="flex items-center space-x-4 sm:space-x-8 min-w-0 flex-shrink-0 max-w-[50%] justify-end">
                <nav className="flex space-x-4 sm:space-x-8">
                  <Link href="/" className="text-gray-900 hover:text-blue-600 font-medium whitespace-nowrap">
                    Home
                  </Link>
                </nav>

                <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap text-sm sm:text-base flex-shrink-0">
                  Login
                </button>
              </div>
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
