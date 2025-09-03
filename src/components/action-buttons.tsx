'use client';

import React from 'react';
import { FileText, FileDown, Mail, Loader, Square, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

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
                <Button
                    onClick={handleGenerateLetterClick}
                    disabled={isDisabled || isGenerating}
                    variant={isDisabled ? "secondary" : isGeneratingLetter ? "secondary" : "default"}
                    size="sm"
                    className="w-full gap-1 text-xs font-semibold"
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
                </Button>

                {/* Generate Email Button */}
                <Button
                    onClick={handleGenerateMailClick}
                    disabled={isDisabled || isGenerating}
                    variant={isDisabled ? "secondary" : isGeneratingEmail ? "secondary" : "default"}
                    size="sm"
                    className="w-full gap-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
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
                </Button>

                {/* Analyze CV Button */}
                <Button
                    onClick={handleAnalyzeCVClick}
                    disabled={isDisabled || isGenerating}
                    variant={isDisabled ? "secondary" : isAnalyzingCV ? "secondary" : "default"}
                    size="sm"
                    className="w-full gap-1 text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white"
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
                </Button>

                {/* Stop Generation Button */}
                {isGenerating && (
                    <Button
                        onClick={onStopGeneration}
                        variant="destructive"
                        size="sm"
                        className="w-full gap-1 text-xs font-semibold"
                    >
                        <Square className="w-2 h-2" />
                        Stop Generation
                    </Button>
                )}
            </div>
        </div>
    );
}
