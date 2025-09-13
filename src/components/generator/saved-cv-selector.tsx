'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/auth-provider';
import { useCvData } from '../../hooks/useCvData';
import { CVData } from '../../lib/types';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
    FileText,
    Calendar,
    CheckCircle,
    Clock,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Loader2
} from 'lucide-react';
import { logger } from '../../lib/logger';

interface SavedCVSelectorProps {
    /** Callback when a CV is selected */
    onCVSelect: (cvData: CVData) => void;
    /** Currently selected CV data */
    selectedCV?: CVData | null;
    /** Additional CSS classes */
    className?: string;
    /** Whether to show the selector in expanded state by default */
    defaultExpanded?: boolean;
}

/**
 * SavedCVSelector Component
 * 
 * A component that displays saved CVs for authenticated users and allows them to select one.
 * Only shows when user is authenticated and has saved CVs.
 * 
 * @param onCVSelect - Callback function when a CV is selected
 * @param selectedCV - Currently selected CV data
 * @param className - Additional CSS classes
 * @param defaultExpanded - Whether to show expanded by default
 */
export function SavedCVSelector({
    onCVSelect,
    selectedCV,
    className = '',
    defaultExpanded = false
}: SavedCVSelectorProps) {
    const { user, loading: authLoading } = useAuth();
    const { cvsData, loading: cvLoading, error: cvError, refresh: refreshCvData } = useCvData();
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Refresh CV data
    const handleRefresh = useCallback(async () => {
        try {
            setIsRefreshing(true);
            await refreshCvData();
            logger.info('CV data refreshed successfully');
        } catch (error) {
            logger.error('Failed to refresh CV data', { error });
        } finally {
            setIsRefreshing(false);
        }
    }, [refreshCvData]);

    // Handle CV selection
    const handleCVSelect = useCallback((cv: CVData) => {
        onCVSelect(cv);
        setIsExpanded(false); // Close the list after selection
        logger.info('CV selected', { cvId: cv.id, filename: cv.filename });
    }, [onCVSelect]);

    // Format date for display
    const formatDate = useCallback((date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }, []);

    // Get status icon and color
    const getStatusInfo = useCallback((status: string) => {
        switch (status) {
            case 'completed':
                return { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-50' };
            case 'processing':
                return { icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-50' };
            case 'failed':
                return { icon: AlertCircle, color: 'text-gray-500', bgColor: 'bg-gray-50' };
            default:
                return { icon: Clock, color: 'text-gray-500', bgColor: 'bg-gray-50' };
        }
    }, []);

    // Don't render if user is not authenticated
    if (authLoading) {
        return (
            <div className={`flex items-center justify-center p-4 ${className}`}>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-gray-500">Loading...</span>
            </div>
        );
    }

    if (!user) {
        return null; // Don't show for unauthenticated users
    }

    // Don't show if no CVs available
    if (!cvLoading && (!cvsData || cvsData.length === 0)) {
        return null;
    }

    return (
        <div className={`space-y-3 ${className}`}>
            {/* Header with toggle button */}
            <div
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer group ${isExpanded
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                        Saved CVs ({cvsData?.length || 0})
                    </h3>
                    <Badge variant="outline" className="text-xs group-hover:border-blue-400 group-hover:text-blue-600">
                        {isExpanded ? 'Click to hide' : 'Click to select'}
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRefresh();
                        }}
                        disabled={isRefreshing}
                        className="h-8 w-8 p-0"
                        title="Refresh CV list"
                    >
                        {isRefreshing ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                            <FileText className="h-3 w-3" />
                        )}
                    </Button>
                    <div className="h-8 w-8 flex items-center justify-center">
                        {isExpanded ? (
                            <ChevronUp className="h-3 w-3 text-gray-500 group-hover:text-blue-500" />
                        ) : (
                            <ChevronDown className="h-3 w-3 text-gray-500 group-hover:text-blue-500" />
                        )}
                    </div>
                </div>
            </div>

            {/* Error state */}
            {cvError && (
                <div className="rounded-md bg-gray-50 p-3">
                    <div className="flex">
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                        <div className="ml-2">
                            <p className="text-sm text-gray-800">
                                Failed to load saved CVs: {cvError}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* CV List */}
            {isExpanded && (
                <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-800/50">
                    {cvLoading ? (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2 text-sm text-gray-500">Loading CVs...</span>
                        </div>
                    ) : (
                        <>
                            {/* Instructions */}
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded border-l-2 border-blue-300 dark:border-blue-600">
                                💡 Click on any CV below to select it
                            </div>

                            {cvsData?.map((cv) => {
                                const isSelected = selectedCV?.id === cv.id;
                                const statusInfo = getStatusInfo(cv.status);
                                const StatusIcon = statusInfo.icon;

                                return (
                                    <Card
                                        key={cv.id}
                                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group ${isSelected
                                            ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                                            : 'hover:bg-white dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                                            }`}
                                        onClick={() => handleCVSelect(cv)}
                                    >
                                        <CardContent className="p-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <FileText className={`h-4 w-4 flex-shrink-0 transition-colors ${isSelected ? 'text-blue-500' : 'text-gray-500 group-hover:text-blue-500'}`} />
                                                        <p className={`text-sm font-medium truncate transition-colors ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-900 dark:group-hover:text-blue-100'}`}>
                                                            {cv.filename}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{formatDate(cv.uploadDate)}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge
                                                            variant="secondary"
                                                            className={`text-xs ${statusInfo.bgColor} ${statusInfo.color}`}
                                                        >
                                                            <StatusIcon className="h-3 w-3 mr-1" />
                                                            {cv.status}
                                                        </Badge>

                                                        {cv.size && (
                                                            <span className="text-xs text-gray-500">
                                                                {(cv.size / 1024).toFixed(1)} KB
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {isSelected && (
                                                        <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                    )}
                                                    <div className={`w-2 h-2 rounded-full transition-colors ${isSelected ? 'bg-blue-500' : 'bg-gray-300 group-hover:bg-blue-400'}`} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
