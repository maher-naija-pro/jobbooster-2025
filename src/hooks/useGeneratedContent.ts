'use client';

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface DatabaseGeneratedContent {
    id: string;
    type: string;
    title: string | null;
    content: string | null;
    createdAt: string;
    viewCount: number;
    copyCount: number;
    confidenceScore: number | null;
    qualityScore: number | null;
    wordCount: number | null;
    readingTime: number | null;
    isActive: boolean;
    isArchived: boolean;
    isPublic: boolean;
    isLatest: boolean;
    metadata: any;
}

interface GeneratedContentStats {
    totalContent: number;
    contentThisMonth: number;
    contentLastMonth: number;
    monthlyChange: number;
    contentByType: Record<string, number>;
    contentData: DatabaseGeneratedContent[];
    loading: boolean;
    error: string | null;
}

export function useGeneratedContent() {
    const [stats, setStats] = useState<GeneratedContentStats>({
        totalContent: 0,
        contentThisMonth: 0,
        contentLastMonth: 0,
        monthlyChange: 0,
        contentByType: {},
        contentData: [],
        loading: true,
        error: null,
    });

    // Calculate monthly statistics
    const calculateMonthlyStats = useCallback((content: DatabaseGeneratedContent[]) => {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const contentThisMonth = content.filter(item =>
            new Date(item.createdAt) >= thisMonth
        ).length;

        const contentLastMonth = content.filter(item => {
            const itemDate = new Date(item.createdAt);
            return itemDate >= lastMonth && itemDate <= lastMonthEnd;
        }).length;

        const monthlyChange = contentLastMonth > 0
            ? Math.round(((contentThisMonth - contentLastMonth) / contentLastMonth) * 100)
            : contentThisMonth > 0 ? 100 : 0;

        // Calculate content by type
        const contentByType = content.reduce((acc, item) => {
            const type = item.type.toLowerCase().replace('_', '-');
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalContent: content.length,
            contentThisMonth,
            contentLastMonth,
            monthlyChange,
            contentByType,
        };
    }, []);

    // Fetch generated content from database
    const fetchGeneratedContent = useCallback(async () => {
        try {
            setStats(prev => ({ ...prev, loading: true, error: null }));

            logger.info('Fetching generated content for dashboard stats');

            const response = await fetch('/api/generated-content');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch generated content');
            }

            const result = await response.json();

            if (result.success && result.data) {
                const monthlyStats = calculateMonthlyStats(result.data);

                setStats({
                    totalContent: monthlyStats.totalContent,
                    contentThisMonth: monthlyStats.contentThisMonth,
                    contentLastMonth: monthlyStats.contentLastMonth,
                    monthlyChange: monthlyStats.monthlyChange,
                    contentByType: monthlyStats.contentByType,
                    contentData: result.data,
                    loading: false,
                    error: null,
                });

                logger.info('Generated content fetched successfully for dashboard', {
                    totalContent: monthlyStats.totalContent,
                    contentThisMonth: monthlyStats.contentThisMonth,
                    contentLastMonth: monthlyStats.contentLastMonth,
                    monthlyChange: monthlyStats.monthlyChange,
                    contentByType: monthlyStats.contentByType,
                    processingTime: result.processingTime
                });
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch generated content';
            setStats(prev => ({
                ...prev,
                loading: false,
                error: errorMessage,
            }));
            logger.error('Failed to fetch generated content for dashboard', { error: errorMessage });
        }
    }, [calculateMonthlyStats]);

    // Refresh function for manual updates
    const refresh = useCallback(() => {
        fetchGeneratedContent();
    }, [fetchGeneratedContent]);

    // Initial fetch
    useEffect(() => {
        fetchGeneratedContent();
    }, [fetchGeneratedContent]);

    return {
        ...stats,
        refresh,
    };
}
