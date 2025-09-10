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
        <header className="text-center mb-4" role="banner">
            {/* Modern icon display with improved spacing and accessibility */}
            <div className="flex justify-center gap-3 mb-3" role="img" aria-label="Job application enhancement tools">
                {/* Document/File icon representing job application materials */}
                <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center shadow-md border border-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <FileText
                        className="w-4 h-4 text-blue-700"
                        aria-hidden="true"
                        strokeWidth={2.5}
                    />
                </div>
                {/* Enhancement/Refresh icon representing the enhancement process */}
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center shadow-md border border-emerald-200 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <RefreshCw
                        className="w-4 h-4 text-emerald-700"
                        aria-hidden="true"
                        strokeWidth={2.5}
                    />
                </div>
                {/* AI/Enhancement icon representing AI-powered features */}
                <div className="w-8 h-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center shadow-md border border-purple-200 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <Sparkles
                        className="w-4 h-4 text-purple-700"
                        aria-hidden="true"
                        strokeWidth={2.5}
                    />
                </div>
            </div>

            {/* Main heading with improved typography and accessibility */}
            <h1 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
                Job Application Enhancer
            </h1>

            {/* Description with better readability and accessibility */}
            <p className="text-gray-700 text-sm leading-relaxed max-w-2xl mx-auto">
                All tools to create tailored job application kit aligned with your job description
                and your unique skills.
            </p>
        </header>
    );
}
