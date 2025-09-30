'use client';

import { useEffect, useRef } from 'react';

interface UseTabProgressEnhancedProps {
    isGenerating: boolean;
    generationType: 'cover-letter' | 'email' | 'cv-analysis' | null;
    progress: number;
    baseTitle?: string;
    showFaviconProgress?: boolean;
}

export function useTabProgressEnhanced({
    isGenerating,
    generationType,
    progress,
    baseTitle = 'JobBooster',
    showFaviconProgress = true
}: UseTabProgressEnhancedProps) {
    const originalTitleRef = useRef<string>('');
    const originalFaviconRef = useRef<string>('');

    useEffect(() => {
        // Store original title and favicon on first render
        if (!originalTitleRef.current) {
            originalTitleRef.current = document.title;
        }
        if (!originalFaviconRef.current) {
            const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
            originalFaviconRef.current = favicon?.href || '';
        }

        if (isGenerating && generationType) {
            const progressBar = createProgressBar(progress);
            const typeLabel = getGenerationTypeLabel(generationType);
            const emoji = getGenerationTypeEmoji(generationType);

            // Update title with progress
            document.title = `${emoji} ${progressBar} ${typeLabel} - ${baseTitle}`;

            // Update favicon with progress if enabled
            if (showFaviconProgress) {
                updateFaviconWithProgress(progress, generationType);
            }
        } else {
            // Reset to original title and favicon when not generating
            document.title = originalTitleRef.current;
            if (showFaviconProgress) {
                resetFavicon(originalFaviconRef);
            }
        }

        // Cleanup function to restore original title and favicon
        return () => {
            document.title = originalTitleRef.current;
            if (showFaviconProgress) {
                resetFavicon(originalFaviconRef);
            }
        };
    }, [isGenerating, generationType, progress, baseTitle, showFaviconProgress]);
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

function updateFaviconWithProgress(progress: number, type: 'cover-letter' | 'email' | 'cv-analysis') {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 32, 32);

    // Background circle
    ctx.fillStyle = '#f3f4f6';
    ctx.beginPath();
    ctx.arc(16, 16, 15, 0, 2 * Math.PI);
    ctx.fill();

    // Progress arc
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (2 * Math.PI * progress / 100);

    ctx.strokeStyle = getProgressColor(type);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(16, 16, 12, startAngle, endAngle);
    ctx.stroke();

    // Center icon
    ctx.fillStyle = getProgressColor(type);
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(getFaviconIcon(type), 16, 16);

    // Convert canvas to data URL and update favicon
    const dataURL = canvas.toDataURL('image/png');
    updateFavicon(dataURL);
}

function getProgressColor(type: 'cover-letter' | 'email' | 'cv-analysis'): string {
    switch (type) {
        case 'cover-letter':
            return '#3b82f6'; // blue
        case 'email':
            return '#10b981'; // emerald
        case 'cv-analysis':
            return '#8b5cf6'; // violet
        default:
            return '#6b7280'; // gray
    }
}

function getFaviconIcon(type: 'cover-letter' | 'email' | 'cv-analysis'): string {
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

function updateFavicon(href: string) {
    let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = href;
}

function resetFavicon(originalFaviconRef: React.MutableRefObject<string>) {
    const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (link && originalFaviconRef.current) {
        link.href = originalFaviconRef.current;
    }
}

// Simple version without favicon updates
export function useTabProgressSimple({
    isGenerating,
    generationType,
    progress,
    baseTitle = 'JobBooster'
}: Omit<UseTabProgressEnhancedProps, 'showFaviconProgress'>) {
    return useTabProgressEnhanced({
        isGenerating,
        generationType,
        progress,
        baseTitle,
        showFaviconProgress: false
    });
}
