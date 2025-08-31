'use client';

import React from 'react';
import { FileText } from 'lucide-react';
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
    return (
        <div className={className}>
            <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Generate Content</h3>
            </div>

            {/* All buttons have been removed */}
        </div>
    );
}
