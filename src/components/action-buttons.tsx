'use client';

import React from 'react';
import { FileDown, Mail, Square, BarChart3 } from 'lucide-react';
import { MetaButton } from './buttons/meta-button';
import { FeatureGate } from './auth/feature-gate';
import {
    isCoverLetterGenerationEnabled,
    isEmailGenerationEnabled,
    isCVAnalysisEnabled
} from '@/lib/feature-flags';

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
    // Check if basic requirements are met
    const hasBasicRequirements = isCVUploaded && isJobOfferProvided;
    // Disable buttons only when missing basic requirements AND not currently generating
    const isDisabled = !hasBasicRequirements && !isGenerating;
    const isGeneratingLetter = isGenerating && generationType === 'cover-letter';
    const isGeneratingEmail = isGenerating && generationType === 'email';
    const isAnalyzingCV = isGenerating && generationType === 'cv-analysis';

    // Debug logging
    console.log('ActionButtons Debug:', {
        isCVUploaded,
        isJobOfferProvided,
        hasBasicRequirements,
        isGenerating,
        generationType,
        isDisabled,
        isGeneratingLetter,
        isGeneratingEmail,
        isAnalyzingCV,
        coverLetterDisabled: isDisabled || (isGenerating && !isGeneratingLetter),
        emailDisabled: isDisabled || (isGenerating && !isGeneratingEmail)
    });

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
            {/* Modern Action Buttons */}
            <div className="space-y-1.5">
                {/* Generate Cover Letter Button - Feature Flag Controlled */}
                {isCoverLetterGenerationEnabled() && (
                    <MetaButton
                        onClick={handleGenerateLetterClick}
                        disabled={isDisabled || (isGenerating && !isGeneratingLetter)}
                        variant={isDisabled ? "secondary" : isGeneratingLetter ? "danger" : "primary"}
                        size="sm"
                        width="full"
                        isLoading={false}
                        showLoadingIcon={false}
                        resetClicked={isGeneratingLetter}
                        icon={isGeneratingLetter ? Square : FileDown}
                        className="gap-1.5 text-xs font-medium rounded transition-all duration-300 hover:shadow-sm hover:scale-[1.005] focus:ring-1 focus:ring-blue-500/20"
                    >
                        {isGeneratingLetter ? "Stop Generation" : "Generate Cover Letter"}
                    </MetaButton>
                )}

                {/* Generate Email Button - Feature Flag Controlled */}
                {isEmailGenerationEnabled() && (
                    <MetaButton
                        onClick={handleGenerateMailClick}
                        disabled={isDisabled || (isGenerating && !isGeneratingEmail)}
                        variant={isDisabled ? "secondary" : isGeneratingEmail ? "danger" : "success"}
                        size="sm"
                        width="full"
                        isLoading={false}
                        showLoadingIcon={false}
                        resetClicked={isGeneratingEmail}
                        icon={isGeneratingEmail ? Square : Mail}
                        className="gap-1.5 text-xs font-medium rounded transition-all duration-300 hover:shadow-sm hover:scale-[1.005] focus:ring-1 focus:ring-green-500/20"
                    >
                        {isGeneratingEmail ? "Stop Generation" : "Generate Email"}
                    </MetaButton>
                )}

                {/* Analyze CV Button - Feature Flag Controlled + Protected Feature */}
                {isCVAnalysisEnabled() && (
                    <FeatureGate feature="CV Analysis">
                        <MetaButton
                            onClick={handleAnalyzeCVClick}
                            disabled={isDisabled || (isGenerating && !isAnalyzingCV)}
                            variant={isDisabled ? "secondary" : isAnalyzingCV ? "danger" : "primary"}
                            size="sm"
                            width="full"
                            isLoading={false}
                            showLoadingIcon={false}
                            resetClicked={isAnalyzingCV}
                            icon={isAnalyzingCV ? Square : BarChart3}
                            className="gap-1.5 text-xs font-medium rounded transition-all duration-300 hover:shadow-sm hover:scale-[1.005] focus:ring-1 focus:ring-purple-500/20"
                        >
                            {isAnalyzingCV ? "Stop Analysis" : "Analyze CV"}
                        </MetaButton>
                    </FeatureGate>
                )}
            </div>
        </div>
    );
}
