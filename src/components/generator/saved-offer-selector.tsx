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

    // Don't show if no job offers available
    if (!offerLoading && (!jobData || jobData.length === 0)) {
        return null;
    }

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Header with toggle button */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Saved Job Offers ({jobData?.length || 0})
                </h3>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="h-8 w-8 p-0"
                    >
                        {isRefreshing ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                            <Briefcase className="h-3 w-3" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="h-8 w-8 p-0"
                    >
                        {isExpanded ? (
                            <ChevronUp className="h-3 w-3" />
                        ) : (
                            <ChevronDown className="h-3 w-3" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Error state */}
            {offerError && (
                <div className="rounded-md bg-gray-50 p-3">
                    <div className="flex">
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                        <div className="ml-2">
                            <p className="text-sm text-gray-800">
                                Failed to load saved job offers: {offerError}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Job Offers List */}
            {isExpanded && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {offerLoading ? (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2 text-sm text-gray-500">Loading job offers...</span>
                        </div>
                    ) : (
                        jobData?.map((offer) => {
                            const isSelected = selectedOffer?.id === offer.id;
                            const jobTitle = getJobTitle(offer);
                            const companyName = getCompanyName(offer);
                            const contentPreview = getContentPreview(offer.content);

                            return (
                                <Card
                                    key={offer.id}
                                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected
                                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                    onClick={() => handleOfferSelect(offer)}
                                >
                                    <CardContent className="p-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Briefcase className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                        {jobTitle}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                    <Building2 className="h-3 w-3" />
                                                    <span className="truncate">{companyName}</span>
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{formatDate(offer.createdAt)}</span>
                                                </div>

                                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                                    {contentPreview}
                                                </p>

                                                <div className="flex items-center gap-2 mt-2">
                                                    {offer.jobLink && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <LinkIcon className="h-3 w-3 mr-1" />
                                                            Has Link
                                                        </Badge>
                                                    )}

                                                    <Badge variant="secondary" className="text-xs">
                                                        {offer.content.length} chars
                                                    </Badge>
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
