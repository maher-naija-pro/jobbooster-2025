'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/auth-provider';
import { useJobData } from '../../hooks/useJobData';
import { JobData } from '../../lib/types';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
    Briefcase,
    Calendar,
    CheckCircle,
    Building2,
    Link as LinkIcon,
    ChevronDown,
    ChevronUp,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { logger } from '../../lib/logger';

interface SavedOfferSelectorProps {
    /** Callback when a job offer is selected */
    onOfferSelect: (offerData: JobData) => void;
    /** Currently selected job offer data */
    selectedOffer?: JobData | null;
    /** Additional CSS classes */
    className?: string;
    /** Whether to show the selector in expanded state by default */
    defaultExpanded?: boolean;
}

/**
 * SavedOfferSelector Component
 * 
 * A component that displays saved job offers for authenticated users and allows them to select one.
 * Only shows when user is authenticated and has saved job offers.
 * 
 * @param onOfferSelect - Callback function when a job offer is selected
 * @param selectedOffer - Currently selected job offer data
 * @param className - Additional CSS classes
 * @param defaultExpanded - Whether to show expanded by default
 */
export function SavedOfferSelector({
    onOfferSelect,
    selectedOffer,
    className = '',
    defaultExpanded = false
}: SavedOfferSelectorProps) {
    const { user, loading: authLoading } = useAuth();
    const { jobData, loading: offerLoading, error: offerError, refetch } = useJobData({ limit: 1000 });
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Refresh job offer data
    const handleRefresh = useCallback(async () => {
        try {
            setIsRefreshing(true);
            await refetch();
            logger.info('Job offer data refreshed successfully');
        } catch (error) {
            logger.error('Failed to refresh job offer data', { error });
        } finally {
            setIsRefreshing(false);
        }
    }, [refetch]);

    // Handle job offer selection
    const handleOfferSelect = useCallback((offer: JobData) => {
        onOfferSelect(offer);
        setIsExpanded(false); // Close the list after selection
        logger.info('Job offer selected', { offerId: offer.id, title: offer.title });
    }, [onOfferSelect]);

    // Format date for display
    const formatDate = useCallback((date: Date | string) => {
        try {
            // Convert to Date object if it's a string
            const dateObj = typeof date === 'string' ? new Date(date) : date;

            // Check if the date is valid
            if (isNaN(dateObj.getTime())) {
                logger.warn('Invalid date provided to formatDate', { date });
                return 'Invalid Date';
            }

            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(dateObj);
        } catch (error) {
            logger.error('Error formatting date', { error, date });
            return 'Invalid Date';
        }
    }, []);

    // Extract job title from content or use stored title
    const getJobTitle = useCallback((offer: JobData) => {
        if (offer.title) return offer.title;

        // Try to extract title from content (first line or first 50 chars)
        const firstLine = offer.content.split('\n')[0].trim();
        if (firstLine.length > 0 && firstLine.length <= 100) {
            return firstLine;
        }

        return 'Untitled Job Offer';
    }, []);

    // Extract company name from content or use stored company
    const getCompanyName = useCallback((offer: JobData) => {
        if (offer.company) return offer.company;

        // Try to extract company from content (look for common patterns)
        const content = offer.content.toLowerCase();
        const companyPatterns = [
            /company:\s*([^\n]+)/i,
            /at\s+([^\n]+)/i,
            /position\s+at\s+([^\n]+)/i,
        ];

        for (const pattern of companyPatterns) {
            const match = content.match(pattern);
            if (match && match[1]) {
                return match[1].trim();
            }
        }

        return 'Unknown Company';
    }, []);

    // Get content preview (first 100 characters)
    const getContentPreview = useCallback((content: string) => {
        const cleanContent = content.replace(/\n/g, ' ').trim();
        return cleanContent.length > 100
            ? cleanContent.substring(0, 100) + '...'
            : cleanContent;
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

    // Don't show if no job offers available
    if (!offerLoading && (!jobData || jobData.length === 0)) {
        return null;
    }

    return (
        <div className={`space-y-1.5 ${className}`}>
            {/* Header with toggle button */}
            <div
                className={`flex items-center justify-between p-1.5 rounded border transition-all duration-200 cursor-pointer group ${isExpanded
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-1">
                    <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                        Saved Job Offers ({jobData?.length || 0})
                    </h3>
                    <Badge variant="outline" className="text-xs group-hover:border-blue-400 group-hover:text-blue-600">
                        {isExpanded ? 'Hide' : 'Select'}
                    </Badge>
                </div>
                <div className="flex items-center gap-0.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRefresh();
                        }}
                        disabled={isRefreshing}
                        className="h-5 w-5 p-0"
                        title="Refresh job offers list"
                    >
                        {isRefreshing ? (
                            <Loader2 className="h-2.5 w-2.5 animate-spin" />
                        ) : (
                            <Briefcase className="h-2.5 w-2.5" />
                        )}
                    </Button>
                    <div className="h-5 w-5 flex items-center justify-center">
                        {isExpanded ? (
                            <ChevronUp className="h-2.5 w-2.5 text-gray-500 group-hover:text-blue-500" />
                        ) : (
                            <ChevronDown className="h-2.5 w-2.5 text-gray-500 group-hover:text-blue-500" />
                        )}
                    </div>
                </div>
            </div>

            {/* Error state */}
            {offerError && (
                <div className="rounded bg-gray-50 p-1.5">
                    <div className="flex">
                        <AlertCircle className="h-2.5 w-2.5 text-gray-400" />
                        <div className="ml-1">
                            <p className="text-xs text-gray-800">
                                Failed to load saved job offers: {offerError}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Job Offers List */}
            {isExpanded && (
                <div className="space-y-0.5 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded p-1 bg-gray-50 dark:bg-gray-800/50">
                    {offerLoading ? (
                        <div className="flex items-center justify-center p-1.5">
                            <Loader2 className="h-2.5 w-2.5 animate-spin" />
                            <span className="ml-1 text-xs text-gray-500">Loading job offers...</span>
                        </div>
                    ) : (
                        <>
                            {/* Instructions */}
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5 px-1 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded border-l-2 border-blue-300 dark:border-blue-600">
                                💡 Click on any job offer below to select it
                            </div>

                            {jobData?.map((offer) => {
                                const isSelected = selectedOffer?.id === offer.id;
                                const jobTitle = getJobTitle(offer);
                                const companyName = getCompanyName(offer);
                                const contentPreview = getContentPreview(offer.content);

                                return (
                                    <Card
                                        key={offer.id}
                                        className={`cursor-pointer transition-all duration-200 hover:shadow-sm hover:scale-[1.005] group ${isSelected
                                            ? 'ring-1 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                                            : 'hover:bg-white dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                                            }`}
                                        onClick={() => handleOfferSelect(offer)}
                                    >
                                        <CardContent className="p-1.5">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1 mb-0.5">
                                                        <Briefcase className={`h-2.5 w-2.5 flex-shrink-0 transition-colors ${isSelected ? 'text-blue-500' : 'text-gray-500 group-hover:text-blue-500'}`} />
                                                        <p className={`text-xs font-medium truncate transition-colors ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-900 dark:group-hover:text-blue-100'}`}>
                                                            {jobTitle}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                                                        <Building2 className="h-2.5 w-2.5" />
                                                        <span className="truncate">{companyName}</span>
                                                    </div>

                                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                                                        <Calendar className="h-2.5 w-2.5" />
                                                        <span>{formatDate(offer.createdAt)}</span>
                                                    </div>

                                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                                                        {contentPreview}
                                                    </p>

                                                    <div className="flex items-center gap-0.5 mt-0.5">
                                                        {offer.jobLink && (
                                                            <Badge variant="outline" className="text-xs">
                                                                <LinkIcon className="h-2 w-2 mr-0.5" />
                                                                Link
                                                            </Badge>
                                                        )}

                                                        <Badge variant="secondary" className="text-xs">
                                                            {offer.content.length} chars
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-0.5">
                                                    {isSelected && (
                                                        <CheckCircle className="h-2.5 w-2.5 text-blue-500 flex-shrink-0" />
                                                    )}
                                                    <div className={`w-1 h-1 rounded-full transition-colors ${isSelected ? 'bg-blue-500' : 'bg-gray-300 group-hover:bg-blue-400'}`} />
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
