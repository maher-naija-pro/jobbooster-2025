'use client';

import React from 'react';
import { FileText, FileDown, Mail, Loader, Square, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ActionButtonsProps {
    isCVUploaded: boolean;
    isJobOfferProvided: boolean;
    onGenerateLetter: () => void;
    onGenerateMail: () => void;
    onAnalyzeCV: () => void;
    onStopGeneration: () => void;
    isGenerating: boolean;
    generationType: 'cover-letter' | 'email' | 'cv-analysis' | null;
    className?: string;
}

export function ActionButtons({
    isCVUploaded,
    isJobOfferProvided,
    onGenerateLetter,
    onGenerateMail,
    onAnalyzeCV,
    onStopGeneration,
    isGenerating,
    generationType,
    className
}: ActionButtonsProps) {
    const isDisabled = !isCVUploaded || !isJobOfferProvided;
    const isGeneratingLetter = isGenerating && generationType === 'cover-letter';
    const isGeneratingEmail = isGenerating && generationType === 'email';
    const isAnalyzingCV = isGenerating && generationType === 'cv-analysis';

    const handleGenerateLetterClick = () => {
        // Clear any existing content immediately before starting generation
        onGenerateLetter();
    };

    const handleGenerateMailClick = () => {
        // Clear any existing content immediately before starting generation
        onGenerateMail();
    };

    const handleAnalyzeCVClick = () => {
        // Clear any existing content immediately before starting analysis
        onAnalyzeCV();
    };

    return (
        <div className={className}>


            {/* Generate Buttons */}
            <div className="space-y-2">
                {/* Generate Cover Letter Button */}
                <button
                    onClick={handleGenerateLetterClick}
                    disabled={isDisabled || isGenerating}
                    className={cn(
                        "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        isDisabled
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
                            : isGeneratingLetter
                                ? "bg-blue-100 text-blue-700 cursor-not-allowed border border-blue-200"
                                : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md border border-blue-600"
                    )}
                >
                    {isGeneratingLetter ? (
                        <>
                            <Loader className="w-3 h-3 animate-spin" />
                            Generating Letter...
                        </>
                    ) : (
                        <>
                            <FileDown className="w-3 h-3" />
                            Generate Cover Letter
                        </>
                    )}
                </button>

                {/* Generate Email Button */}
                <button
                    onClick={handleGenerateMailClick}
                    disabled={isDisabled || isGenerating}
                    className={cn(
                        "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        isDisabled
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
                            : isGeneratingEmail
                                ? "bg-green-100 text-green-700 cursor-not-allowed border border-green-200"
                                : "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm hover:shadow-md border border-green-600"
                    )}
                >
                    {isGeneratingEmail ? (
                        <>
                            <Loader className="w-3 h-3 animate-spin" />
                            Generating Email...
                        </>
                    ) : (
                        <>
                            <Mail className="w-3 h-3" />
                            Generate Email
                        </>
                    )}
                </button>

                {/* Analyze CV Button */}
                <button
                    onClick={handleAnalyzeCVClick}
                    disabled={isDisabled || isGenerating}
                    className={cn(
                        "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        isDisabled
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
                            : isAnalyzingCV
                                ? "bg-purple-100 text-purple-700 cursor-not-allowed border border-purple-200"
                                : "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 shadow-sm hover:shadow-md border border-purple-600"
                    )}
                >
                    {isAnalyzingCV ? (
                        <>
                            <Loader className="w-3 h-3 animate-spin" />
                            Analyzing CV...
                        </>
                    ) : (
                        <>
                            <BarChart3 className="w-3 h-3" />
                            Analyze CV
                        </>
                    )}
                </button>

                {/* Stop Generation Button */}
                {isGenerating && (
                    <button
                        onClick={onStopGeneration}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow-md transition-all duration-200 border border-red-600"
                    >
                        <Square className="w-3 h-3" />
                        Stop Generation
                    </button>
                )}
            </div>
        </div>
    );
}
