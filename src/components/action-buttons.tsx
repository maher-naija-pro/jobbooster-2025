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
                    aria-label={isGeneratingLetter ? "Generating cover letter..." : "Generate cover letter"}
                    className={cn(
                        "w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-offset-1",
                        isDisabled
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                            : isGeneratingLetter
                                ? "bg-indigo-50 text-indigo-700 cursor-not-allowed border border-indigo-200"
                                : "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-lg hover:shadow-xl border border-indigo-600 focus:ring-indigo-500"
                    )}
                >
                    {isGeneratingLetter ? (
                        <>
                            <Loader className="w-2 h-2 animate-spin" />
                            Generating Letter...
                        </>
                    ) : (
                        <>
                            <FileDown className="w-2 h-2" />
                            Generate Cover Letter
                        </>
                    )}
                </button>

                {/* Generate Email Button */}
                <button
                    onClick={handleGenerateMailClick}
                    disabled={isDisabled || isGenerating}
                    aria-label={isGeneratingEmail ? "Generating email..." : "Generate email"}
                    className={cn(
                        "w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-offset-1",
                        isDisabled
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                            : isGeneratingEmail
                                ? "bg-emerald-50 text-emerald-700 cursor-not-allowed border border-emerald-200"
                                : "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-lg hover:shadow-xl border border-emerald-600 focus:ring-emerald-500"
                    )}
                >
                    {isGeneratingEmail ? (
                        <>
                            <Loader className="w-2 h-2 animate-spin" />
                            Generating Email...
                        </>
                    ) : (
                        <>
                            <Mail className="w-2 h-2" />
                            Generate Email
                        </>
                    )}
                </button>

                {/* Analyze CV Button */}
                <button
                    onClick={handleAnalyzeCVClick}
                    disabled={isDisabled || isGenerating}
                    aria-label={isAnalyzingCV ? "Analyzing CV..." : "Analyze CV"}
                    className={cn(
                        "w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-offset-1",
                        isDisabled
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                            : isAnalyzingCV
                                ? "bg-violet-50 text-violet-700 cursor-not-allowed border border-violet-200"
                                : "bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800 shadow-lg hover:shadow-xl border border-violet-600 focus:ring-violet-500"
                    )}
                >
                    {isAnalyzingCV ? (
                        <>
                            <Loader className="w-2 h-2 animate-spin" />
                            Analyzing CV...
                        </>
                    ) : (
                        <>
                            <BarChart3 className="w-2 h-2" />
                            Analyze CV
                        </>
                    )}
                </button>

                {/* Stop Generation Button */}
                {isGenerating && (
                    <button
                        onClick={onStopGeneration}
                        aria-label="Stop current generation process"
                        className="w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-md hover:shadow-lg transition-all duration-300 border border-rose-600 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-rose-500"
                    >
                        <Square className="w-2 h-2" />
                        Stop Generation
                    </button>
                )}
            </div>
        </div>
    );
}
