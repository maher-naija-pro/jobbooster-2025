'use client';

import React from 'react';
import { FileText, RefreshCw } from 'lucide-react';

/**
 * UploadHeader Component
 * 
 * A modern header component for the Job Application Enhancer feature.
 * Displays two modern icons representing document processing and enhancement capabilities.
 * 
 * Features:
 * - Modern Lucide React icons for better consistency
 * - Proper accessibility attributes
 * - Responsive design with proper spacing
 * - Clean, professional appearance
 * 
 * @returns JSX element containing the upload header
 */
export function UploadHeader() {
    return (
        <div className="text-center mb-2">
            {/* Modern icon display with improved spacing and accessibility */}
            <div className="flex justify-center gap-3 mb-3">
                {/* Document/File icon representing job application materials */}
                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center shadow-sm border border-blue-100">
                    <FileText
                        className="w-5 h-5 text-blue-600"
                        aria-hidden="true"
                        strokeWidth={2.5}
                    />
                </div>
                {/* Enhancement/Refresh icon representing the enhancement process */}
                <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center shadow-sm border border-emerald-100">
                    <RefreshCw
                        className="w-5 h-5 text-emerald-600"
                        aria-hidden="true"
                        strokeWidth={2.5}
                    />
                </div>
            </div>

            {/* Main heading with improved typography */}
            <h2 className="text-xl font-bold text-slate-900 mb-2">
                Job Application Enhancer
            </h2>

            {/* Description with better readability */}
            <p className="text-slate-600 max-w-lg mx-auto text-sm leading-relaxed">
                All tools to create tailored job application kit aligned with your job description
                and your unique skills.
            </p>
        </div>
    );
}
