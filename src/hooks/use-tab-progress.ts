'use client';

import { useEffect } from 'react';

interface UseTabProgressProps {
    isGenerating: boolean;
    generationType: 'cover-letter' | 'email' | 'cv-analysis' | null;
    progress: number;
    baseTitle?: string;
}

export function useTabProgress({
    isGenerating,
    generationType,
    progress,
    baseTitle = 'JobBooster'
}: UseTabProgressProps) {
    useEffect(() => {
        const originalTitle = document.title;

        if (isGenerating && generationType) {
            const progressBar = createProgressBar(progress);
            const typeLabel = getGenerationTypeLabel(generationType);
            document.title = `${progressBar} ${typeLabel} - ${baseTitle}`;
        } else {
            // Reset to original title when not generating
            document.title = originalTitle;
        }

        // Cleanup function to restore original title
        return () => {
            document.title = originalTitle;
        };
    }, [isGenerating, generationType, progress, baseTitle]);
}

function createProgressBar(progress: number): string {
    const totalBars = 10;
    const filledBars = Math.round((progress / 100) * totalBars);
    const emptyBars = totalBars - filledBars;

    const filled = '█'.repeat(filledBars);
    const empty = '░'.repeat(emptyBars);

    return `[${filled}${empty}] ${Math.round(progress)}%`;
}

function getGenerationTypeLabel(type: 'cover-letter' | 'email' | 'cv-analysis'): string {
    switch (type) {
        case 'cover-letter':
            return 'Generating Cover Letter';
        case 'email':
            return 'Generating Email';
        case 'cv-analysis':
            return 'Analyzing CV';
        default:
            return 'Generating';
    }
}

// Alternative hook with emoji progress bar
export function useTabProgressWithEmoji({
    isGenerating,
    generationType,
    progress,
    baseTitle = 'JobBooster'
}: UseTabProgressProps) {
    useEffect(() => {
        const originalTitle = document.title;

        if (isGenerating && generationType) {
            const progressBar = createEmojiProgressBar(progress);
            const typeLabel = getGenerationTypeLabel(generationType);
            const emoji = getGenerationTypeEmoji(generationType);
            document.title = `${emoji} ${progressBar} ${typeLabel} - ${baseTitle}`;
        } else {
            // Reset to original title when not generating
            document.title = originalTitle;
        }

        // Cleanup function to restore original title
        return () => {
            document.title = originalTitle;
        };
    }, [isGenerating, generationType, progress, baseTitle]);
}

function createEmojiProgressBar(progress: number): string {
    const totalBars = 8;
    const filledBars = Math.round((progress / 100) * totalBars);
    const emptyBars = totalBars - filledBars;

    const filled = '🟩'.repeat(filledBars);
    const empty = '⬜'.repeat(emptyBars);

    return `${filled}${empty} ${Math.round(progress)}%`;
}

function getGenerationTypeEmoji(type: 'cover-letter' | 'email' | 'cv-analysis'): string {
    switch (type) {
        case 'cover-letter':
            return '📝';
        case 'email':
            return '📧';
        case 'cv-analysis':
            return '📊';
        default:
            return '⚙️';
    }
}

// Simple progress hook with just percentage
export function useTabProgressSimple({
    isGenerating,
    generationType,
    progress,
    baseTitle = 'JobBooster'
}: UseTabProgressProps) {
    useEffect(() => {
        const originalTitle = document.title;

        if (isGenerating && generationType) {
            const typeLabel = getGenerationTypeLabel(generationType);
            document.title = `${typeLabel} (${Math.round(progress)}%) - ${baseTitle}`;
        } else {
            // Reset to original title when not generating
            document.title = originalTitle;
        }

        // Cleanup function to restore original title
        return () => {
            document.title = originalTitle;
        };
    }, [isGenerating, generationType, progress, baseTitle]);
}
