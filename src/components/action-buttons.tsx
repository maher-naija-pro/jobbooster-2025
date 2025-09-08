'use client';

import React from 'react';
import { FileDown, Mail, Square, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { FeatureGate } from './auth/feature-gate';

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
        if (isGeneratingLetter) {
            // If currently generating letter, stop it
            onStopGeneration();
        } else {
            // Clear any existing content immediately before starting generation
            onGenerateLetter();
        }
    };

    const handleGenerateMailClick = () => {
        if (isGeneratingEmail) {
            // If currently generating email, stop it
            onStopGeneration();
        } else {
            // Clear any existing content immediately before starting generation
            onGenerateMail();
        }
    };

    const handleAnalyzeCVClick = () => {
        if (isAnalyzingCV) {
            // If currently analyzing CV, stop it
            onStopGeneration();
        } else {
            // Clear any existing content immediately before starting analysis
            onAnalyzeCV();
        }
    };

    return (
        <div className={className}>


            {/* Generate Buttons */}
            <div className="space-y-2">
                {/* Generate Cover Letter Button */}
                <Button
                    onClick={handleGenerateLetterClick}
                    disabled={isDisabled || (isGenerating && !isGeneratingLetter)}
                    variant={isDisabled ? "secondary" : isGeneratingLetter ? "destructive" : "default"}
                    size="sm"
                    className="w-full gap-1 text-xs font-semibold"
                >
                    {isGeneratingLetter ? (
                        <>
                            <Square className="w-2 h-2" />
                            Stop Generation
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
                    disabled={isDisabled || (isGenerating && !isGeneratingEmail)}
                    variant={isDisabled ? "secondary" : isGeneratingEmail ? "destructive" : "success"}
                    size="sm"
                    className="w-full gap-1 text-xs font-semibold"
                >
                    {isGeneratingEmail ? (
                        <>
                            <Square className="w-2 h-2" />
                            Stop Generation
                        </>
                    ) : (
                        <>
                            <Mail className="w-2 h-2" />
                            Generate Email
                        </>
                    )}
                </Button>

                {/* Analyze CV Button - Protected Feature */}
                <FeatureGate feature="CV Analysis">
                    <Button
                        onClick={handleAnalyzeCVClick}
                        disabled={isDisabled || (isGenerating && !isAnalyzingCV)}
                        variant={isDisabled ? "secondary" : isAnalyzingCV ? "destructive" : "accent"}
                        size="sm"
                        className="w-full gap-1 text-xs font-semibold"
                    >
                        {isAnalyzingCV ? (
                            <>
                                <Square className="w-2 h-2" />
                                Stop Generation
                            </>
                        ) : (
                            <>
                                <BarChart3 className="w-2 h-2" />
                                Analyze CV
                            </>
                        )}
                    </Button>
                </FeatureGate>

            </div>
        </div>
    );
}
