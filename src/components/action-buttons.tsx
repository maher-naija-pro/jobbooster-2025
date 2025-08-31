'use client';

import React from 'react';
import { FileText, Mail, Loader, Square } from 'lucide-react';
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
    const canGenerate = isCVUploaded && isJobOfferProvided && !isGenerating;

    const handleGenerateLetter = () => {
        if (canGenerate) {
            onGenerateLetter();
        }
    };

    const handleGenerateMail = () => {
        if (canGenerate) {
            onGenerateMail();
        }
    };

    return (
        <div className={className}>
            <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Generate Content</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Generate Cover Letter Button / Stop Generation Button */}
                <button
                    onClick={isGenerating && generationType === 'cover-letter' ? onStopGeneration : handleGenerateLetter}
                    disabled={!isCVUploaded || !isJobOfferProvided || (isGenerating && generationType !== 'cover-letter')}
                    className={cn(
                        "flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-medium transition-all duration-200",
                        isGenerating && generationType === 'cover-letter'
                            ? "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            : isCVUploaded && isJobOfferProvided && generationType !== 'cover-letter'
                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                >
                    {isGenerating && generationType === 'cover-letter' ? (
                        <>
                            <Square className="w-5 h-5 fill-current" />
                            Stop Generation
                        </>
                    ) : (
                        <>
                            <FileText className="w-5 h-5" />
                            Generate Letter
                        </>
                    )}
                </button>

                {/* Generate Email Button / Stop Generation Button */}
                <button
                    onClick={isGenerating && generationType === 'email' ? onStopGeneration : handleGenerateMail}
                    disabled={!isCVUploaded || !isJobOfferProvided || (isGenerating && generationType !== 'email')}
                    className={cn(
                        "flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-medium transition-all duration-200",
                        isGenerating && generationType === 'email'
                            ? "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            : isCVUploaded && isJobOfferProvided && generationType !== 'email'
                                ? "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                >
                    {isGenerating && generationType === 'email' ? (
                        <>
                            <Square className="w-5 h-5 fill-current" />
                            Stop Generation
                        </>
                    ) : (
                        <>
                            <Mail className="w-5 h-5" />
                            Generate Mail
                        </>
                    )}
                </button>
            </div>



            {/* Progress Indicator */}
            {isGenerating && (
                <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="relative">
                            <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                            <div className="absolute inset-0 w-5 h-5 border-2 border-blue-300 rounded-full animate-ping opacity-20"></div>
                        </div>
                        <p className="text-lg font-semibold text-blue-800">
                            {generationType === 'cover-letter' ? '✍️ Crafting your cover letter...' : '📧 Composing your email...'}
                        </p>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full animate-pulse transition-all duration-1000" style={{ width: '70%' }}></div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-blue-700">
                            AI is analyzing your CV and job requirements to create personalized content
                        </p>
                        <div className="text-xs text-blue-600 font-medium">
                            Please wait...
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
