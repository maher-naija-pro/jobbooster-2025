'use client';

import React from 'react';
import { FileDown, Mail, Square, BarChart3 } from 'lucide-react';
import { MetaButton } from './buttons/meta-button';
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
            {/* Modern Action Buttons */}
            <div className="space-y-3">
                {/* Generate Cover Letter Button */}
                <MetaButton
                    onClick={handleGenerateLetterClick}
                    disabled={isDisabled || (isGenerating && !isGeneratingLetter)}
                    variant={isDisabled ? "secondary" : isGeneratingLetter ? "danger" : "primary"}
                    size="lg"
                    width="full"
                    isLoading={false}
                    showLoadingIcon={false}
                    icon={isGeneratingLetter ? Square : FileDown}
                    className="gap-3 text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:ring-4 focus:ring-blue-500/20"
                >
                    {isGeneratingLetter ? "Stop Generation" : "Generate Cover Letter"}
                </MetaButton>

                {/* Generate Email Button */}
                <MetaButton
                    onClick={handleGenerateMailClick}
                    disabled={isDisabled || (isGenerating && !isGeneratingEmail)}
                    variant={isDisabled ? "secondary" : isGeneratingEmail ? "danger" : "success"}
                    size="lg"
                    width="full"
                    isLoading={false}
                    showLoadingIcon={false}
                    icon={isGeneratingEmail ? Square : Mail}
                    className="gap-3 text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:ring-4 focus:ring-green-500/20"
                >
                    {isGeneratingEmail ? "Stop Generation" : "Generate Email"}
                </MetaButton>

                {/* Analyze CV Button - Protected Feature */}
                <FeatureGate feature="CV Analysis">
                    <MetaButton
                        onClick={handleAnalyzeCVClick}
                        disabled={isDisabled || (isGenerating && !isAnalyzingCV)}
                        variant={isDisabled ? "secondary" : isAnalyzingCV ? "danger" : "primary"}
                        size="lg"
                        width="full"
                        isLoading={false}
                        showLoadingIcon={false}
                        icon={isAnalyzingCV ? Square : BarChart3}
                        className="gap-3 text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:ring-4 focus:ring-purple-500/20"
                    >
                        {isAnalyzingCV ? "Stop Analysis" : "Analyze CV"}
                    </MetaButton>
                </FeatureGate>
            </div>
        </div>
    );
}
