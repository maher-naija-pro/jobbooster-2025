'use client';

import React from 'react';
import { FileText, Mail, Loader } from 'lucide-react';
import { cn } from '../lib/utils';

interface ActionButtonsProps {
    isCVUploaded: boolean;
    isJobOfferProvided: boolean;
    onGenerateLetter: () => void;
    onGenerateMail: () => void;
    isGenerating: boolean;
    generationType: 'cover-letter' | 'email' | null;
    className?: string;
}

export function ActionButtons({
    isCVUploaded,
    isJobOfferProvided,
    onGenerateLetter,
    onGenerateMail,
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
                {/* Generate Cover Letter Button */}
                <button
                    onClick={handleGenerateLetter}
                    disabled={!canGenerate || generationType === 'cover-letter'}
                    className={cn(
                        "flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-medium transition-all duration-200",
                        canGenerate && generationType !== 'cover-letter'
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                >
                    {isGenerating && generationType === 'cover-letter' ? (
                        <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Generating Letter...
                        </>
                    ) : (
                        <>
                            <FileText className="w-5 h-5" />
                            Generate Letter
                        </>
                    )}
                </button>

                {/* Generate Email Button */}
                <button
                    onClick={handleGenerateMail}
                    disabled={!canGenerate || generationType === 'email'}
                    className={cn(
                        "flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-medium transition-all duration-200",
                        canGenerate && generationType !== 'email'
                            ? "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                >
                    {isGenerating && generationType === 'email' ? (
                        <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Generating Email...
                        </>
                    ) : (
                        <>
                            <Mail className="w-5 h-5" />
                            Generate Mail
                        </>
                    )}
                </button>
            </div>

            {/* Requirements Message */}
            {(!isCVUploaded || !isJobOfferProvided) && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                        <strong>Requirements:</strong>
                        {!isCVUploaded && !isJobOfferProvided && " Upload your CV and provide a job offer description"}
                        {!isCVUploaded && isJobOfferProvided && " Upload your CV to get started"}
                        {isCVUploaded && !isJobOfferProvided && " Provide a job offer description to continue"}
                    </p>
                </div>
            )}

            {/* Progress Indicator */}
            {isGenerating && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                        <p className="text-sm font-medium text-blue-800">
                            {generationType === 'cover-letter' ? 'Creating your cover letter...' : 'Composing your email...'}
                        </p>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                        AI is analyzing your CV and job requirements to create personalized content
                    </p>
                </div>
            )}
        </div>
    );
}
