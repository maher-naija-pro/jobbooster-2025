'use client';

import React from 'react';
import { FileText, FileDown, Mail, Loader, Square } from 'lucide-react';
import { cn } from '../lib/utils';

interface ActionButtonsProps {
    isCVUploaded: boolean;
    isJobOfferProvided: boolean;
    onGenerateLetter: () => void;
    onGenerateMail: () => void;
    onStopGeneration: () => void;
    isGenerating: boolean;
    generationType: 'cover-letter' | 'email' | null;
    className?: string;
}

export function ActionButtons({
    isCVUploaded,
    isJobOfferProvided,
    onGenerateLetter,
    onGenerateMail,
    onStopGeneration,
    isGenerating,
    generationType,
    className
}: ActionButtonsProps) {
    const isDisabled = !isCVUploaded || !isJobOfferProvided;
    const isGeneratingLetter = isGenerating && generationType === 'cover-letter';
    const isGeneratingEmail = isGenerating && generationType === 'email';

    const handleGenerateLetterClick = () => {
        // Clear any existing content immediately before starting generation
        onGenerateLetter();
    };

    const handleGenerateMailClick = () => {
        // Clear any existing content immediately before starting generation
        onGenerateMail();
    };

    return (
        <div className={className}>
            <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Generate Content</h3>
            </div>

            {/* Generate Buttons */}
            <div className="space-y-3">
                {/* Generate Cover Letter Button */}
                <button
                    onClick={handleGenerateLetterClick}
                    disabled={isDisabled || isGenerating}
                    className={cn(
                        "w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                        isDisabled
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : isGeneratingLetter
                                ? "bg-blue-100 text-blue-700 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md"
                    )}
                >
                    {isGeneratingLetter ? (
                        <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Generating Letter...
                        </>
                    ) : (
                        <>
                            <FileDown className="w-4 h-4" />
                            Generate Cover Letter
                        </>
                    )}
                </button>

                {/* Generate Email Button */}
                <button
                    onClick={handleGenerateMailClick}
                    disabled={isDisabled || isGenerating}
                    className={cn(
                        "w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                        isDisabled
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : isGeneratingEmail
                                ? "bg-green-100 text-green-700 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm hover:shadow-md"
                    )}
                >
                    {isGeneratingEmail ? (
                        <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Generating Email...
                        </>
                    ) : (
                        <>
                            <Mail className="w-4 h-4" />
                            Generate Email
                        </>
                    )}
                </button>

                {/* Stop Generation Button */}
                {isGenerating && (
                    <button
                        onClick={onStopGeneration}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <Square className="w-4 h-4" />
                        Stop Generation
                    </button>
                )}
            </div>

            {/* Status Messages */}
            {isDisabled && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600 text-center">
                        {!isCVUploaded && !isJobOfferProvided
                            ? "Upload your CV and provide a job description to get started"
                            : !isCVUploaded
                                ? "Upload your CV to enable content generation"
                                : "Provide a job description (min. 100 characters) to enable content generation"}
                    </p>
                </div>
            )}
        </div>
    );
}
