'use client';

import React from 'react';
import { FileText, RefreshCw, Sparkles } from 'lucide-react';

/**
 * UploadHeader Component
 * 
 * A modern, accessible header component for the Job Application Enhancer feature.
 * Displays modern icons and clear typography with proper semantic structure.
 * 
 * Features:
 * - Semantic HTML structure for accessibility
 * - Modern gradient design with subtle animations
 * - Proper focus management and screen reader support
 * - Responsive design that fits both centered and sidebar layouts
 * - High contrast colors for accessibility compliance
 * 
 * @returns JSX element containing the upload header
 */
export function UploadHeader() {
    return (
        <header className="text-center mb-6" role="banner">
            {/* Modern icon display with improved spacing and accessibility */}
            <div className="flex justify-center gap-4 mb-4" role="img" aria-label="Job application enhancement tools">
                {/* Document/File icon representing job application materials */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center shadow-lg border border-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <FileText
                        className="w-5 h-5 text-blue-700"
                        aria-hidden="true"
                        strokeWidth={2.5}
                    />
                </div>
                {/* Enhancement/Refresh icon representing the enhancement process */}
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl flex items-center justify-center shadow-lg border border-emerald-200 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <RefreshCw
                        className="w-5 h-5 text-emerald-700"
                        aria-hidden="true"
                        strokeWidth={2.5}
                    />
                </div>
                {/* AI/Enhancement icon representing AI-powered features */}
                <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg border border-purple-200 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <Sparkles
                        className="w-5 h-5 text-purple-700"
                        aria-hidden="true"
                        strokeWidth={2.5}
                    />
                </div>
            </div>

            {/* Main heading with improved typography and accessibility */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                Job Application Enhancer
            </h1>

            {/* Description with better readability and accessibility */}
            <p className="text-gray-700 text-base leading-relaxed max-w-2xl mx-auto">
                All tools to create tailored job application kit aligned with your job description
                and your unique skills.
            </p>
        </header>
    );
}
