'use client';

import Link from "next/link";
import { useApp } from "../lib/app-context";
import { UserProfile } from "./user/user-profile";
import { AuthProvider } from "./auth/auth-provider";

export function Header() {
    const { dispatch } = useApp();

    const handleLogoClick = () => {
        // Reset all generator state
        dispatch({ type: 'CLEAR_CV_DATA' });
        dispatch({ type: 'CLEAR_JOB_OFFER' });
        dispatch({ type: 'CLEAR_CV_ANALYSIS' });
        dispatch({ type: 'CLEAR_GENERATED_CONTENT' });
        dispatch({ type: 'STOP_GENERATION' });
        dispatch({ type: 'STOP_CV_ANALYSIS' });
        dispatch({ type: 'STOP_JOB_ANALYSIS' });
        dispatch({ type: 'CLEAR_ERROR' });
    };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 min-w-0 w-full">
                    {/* Logo on the left */}
                    <div className="flex items-center min-w-0 flex-shrink-0 max-w-[50%]">
                        <Link
                            href="/"
                            onClick={handleLogoClick}
                            className="text-xl font-bold text-gray-900 truncate hover:text-blue-600 transition-colors"
                        >
                            🚀 TheJobBooster.com
                        </Link>
                    </div>

                    {/* Navigation and login button grouped on the right */}
                    <div className="flex items-center space-x-4 sm:space-x-8 min-w-0 flex-shrink-0 max-w-[50%] justify-end">
                        <AuthProvider>
                            <UserProfile />
                        </AuthProvider>
                    </div>
                </div>
            </div>
        </header>
    );
}
