'use client';

import { useState, useEffect, useCallback } from 'react';
import { CVData } from '@/lib/types';
import { logger } from '@/lib/logger';

interface DatabaseCVData {
    id: string;
    fileName: string | null;
    fileSize: number | null;
    createdAt: string;
    processingStatus: string;
    fileUrl: string | null;
    processingStartedAt: string | null;
    processingCompletedAt: string | null;
    processingError: string | null;
    viewCount: number | null;
    analysisCount: number | null;
    isActive: boolean | null;
    isArchived: boolean | null;
    isPublic: boolean | null;
    isLatest: boolean | null;
    version: number;
    metadata: Record<string, unknown> | null;
}

interface CvDataStats {
    totalCvs: number;
    cvsThisMonth: number;
    cvsLastMonth: number;
    monthlyChange: number;
    cvsData: CVData[];
    loading: boolean;
    error: string | null;
}

export function useCvData() {
    const [stats, setStats] = useState<CvDataStats>({
        totalCvs: 0,
        cvsThisMonth: 0,
        cvsLastMonth: 0,
        monthlyChange: 0,
        cvsData: [],
        loading: true,
        error: null,
    });

    // Convert database CV data to frontend CVData format
    const convertDatabaseToCVData = useCallback((dbCv: DatabaseCVData): CVData => {
        return {
            id: dbCv.id,
            filename: dbCv.fileName || 'Unknown file',
            size: dbCv.fileSize || 0,
            uploadDate: new Date(dbCv.createdAt),
            processedContent: '', // This would come from extractedText if needed
            status: dbCv.processingStatus === 'COMPLETED' ? 'completed' :
                dbCv.processingStatus === 'PROCESSING' ? 'processing' :
                    dbCv.processingStatus === 'UPLOADED' ? 'completed' : 'completed',
            fileUrl: dbCv.fileUrl || undefined,
            processingStatus: dbCv.processingStatus as CVData['processingStatus'],
            processingStartedAt: dbCv.processingStartedAt ? new Date(dbCv.processingStartedAt) : undefined,
            processingCompletedAt: dbCv.processingCompletedAt ? new Date(dbCv.processingCompletedAt) : undefined,
            processingError: dbCv.processingError || undefined,
            originalFilename: dbCv.fileName || undefined,
            viewCount: dbCv.viewCount || undefined,
            analysisCount: dbCv.analysisCount || undefined,
            isActive: dbCv.isActive || false,
            isArchived: dbCv.isArchived || false,
            isPublic: dbCv.isPublic || false,
        };
    }, []);

    // Calculate monthly statistics
    const calculateMonthlyStats = useCallback((cvs: CVData[]) => {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const cvsThisMonth = cvs.filter(cv => cv.uploadDate >= thisMonth).length;
        const cvsLastMonth = cvs.filter(cv =>
            cv.uploadDate >= lastMonth && cv.uploadDate <= lastMonthEnd
        ).length;

        const monthlyChange = cvsLastMonth > 0
            ? Math.round(((cvsThisMonth - cvsLastMonth) / cvsLastMonth) * 100)
            : cvsThisMonth > 0 ? 100 : 0;

        return {
            totalCvs: cvs.length,
            cvsThisMonth,
            cvsLastMonth,
            monthlyChange,
        };
    }, []);

    // Fetch CVs from database
    const fetchCvData = useCallback(async () => {
        try {
            setStats(prev => ({ ...prev, loading: true, error: null }));

            logger.info('Fetching CV data for dashboard stats');

            const response = await fetch('/api/cv-data');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch CV data');
            }

            const result = await response.json();

            if (result.success && result.data) {
                const convertedCVs = result.data.map(convertDatabaseToCVData);
                const monthlyStats = calculateMonthlyStats(convertedCVs);

                setStats({
                    totalCvs: monthlyStats.totalCvs,
                    cvsThisMonth: monthlyStats.cvsThisMonth,
                    cvsLastMonth: monthlyStats.cvsLastMonth,
                    monthlyChange: monthlyStats.monthlyChange,
                    cvsData: convertedCVs,
                    loading: false,
                    error: null,
                });

                logger.info('CV data fetched successfully for dashboard', {
                    totalCvs: monthlyStats.totalCvs,
                    cvsThisMonth: monthlyStats.cvsThisMonth,
                    cvsLastMonth: monthlyStats.cvsLastMonth,
                    monthlyChange: monthlyStats.monthlyChange,
                    processingTime: result.processingTime
                });
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch CV data';
            setStats(prev => ({
                ...prev,
                loading: false,
                error: errorMessage,
            }));
            logger.error('Failed to fetch CV data for dashboard', { error: errorMessage });
        }
    }, [convertDatabaseToCVData, calculateMonthlyStats]);

    // Refresh function for manual updates
    const refresh = useCallback(() => {
        fetchCvData();
    }, [fetchCvData]);

    // Initial fetch
    useEffect(() => {
        fetchCvData();
    }, [fetchCvData]);

    return {
        ...stats,
        refresh,
    };
}
