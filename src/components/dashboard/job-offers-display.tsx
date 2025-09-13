'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { useJobData } from '@/hooks/useJobData';
import { Icons } from '../icons';
import { RefreshButton } from '../buttons/refresh-button';
import { Trash2, Archive, ArchiveRestore, Calendar, MapPin, Building2, ExternalLink, Eye, Plus } from 'lucide-react';
import { JobOffersDisplaySkeleton } from './job-offer-skeleton';
import { AddJobOfferModal } from './add-job-offer-modal';
import { MetaButton } from '../buttons/meta-button';
import { DeleteConfirmationModal } from '../ui/delete-confirmation-modal';

/**
 * Props interface for the JobOffersDisplay component
 */
interface JobOffersDisplayProps {
    className?: string; // Optional CSS class name for styling
}

/**
 * JobOffersDisplay Component
 * 
 * A React component that displays a list of saved job offers with functionality to:
 * - View job offers in a card-based layout
 * - Archive/unarchive job offers
 * - Delete job offers
 * - Refresh the job offers list
 * - Extract job titles and company names from content
 * - Display job metadata (location, date, company, etc.)
 * 
 * @param className - Optional CSS class name for styling
 * @returns JSX element containing the job offers display
 */
export function JobOffersDisplay({ className }: JobOffersDisplayProps) {
    // Modal state
    const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
    const [resetAddButton, setResetAddButton] = useState(false);

    // Delete confirmation modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Custom hook to manage job data state and operations
    const {
        jobData,           // Array of job offer objects
        loading,           // Boolean indicating if data is being fetched
        error,             // Error message if data fetching fails
        refetch,           // Function to refresh job data
        deleteJobData,     // Function to delete a job offer
        archiveJobData,    // Function to archive a job offer
        unarchiveJobData,  // Function to unarchive a job offer
    } = useJobData({ limit: 1000 });

    // Debug logging for development purposes
    console.log('JobOffersDisplay - jobData:', jobData);
    console.log('JobOffersDisplay - loading:', loading);
    console.log('JobOffersDisplay - error:', error);
    console.log('JobOffersDisplay - isAddJobModalOpen:', isAddJobModalOpen);

    /**
     * Effect hook to listen for job offer creation events
     * Automatically refreshes the job offers list when a new job offer is created
     */
    useEffect(() => {
        const handleJobOfferCreated = () => {
            refetch();
        };

        // Add event listener for custom 'jobOfferCreated' event
        window.addEventListener('jobOfferCreated', handleJobOfferCreated);

        // Cleanup: remove event listener when component unmounts
        return () => {
            window.removeEventListener('jobOfferCreated', handleJobOfferCreated);
        };
    }, [refetch]);

    /**
     * Handles opening the delete confirmation modal for a job offer
     * 
     * @param job - The job offer object to delete
     */
    const handleDeleteClick = (job: any) => {
        setJobToDelete(job);
        setDeleteModalOpen(true);
    };

    /**
     * Handles the actual deletion of a job offer
     * Called when user confirms deletion in the modal
     */
    const handleConfirmDelete = async () => {
        if (!jobToDelete) return;

        try {
            setIsDeleting(true);
            await deleteJobData(jobToDelete.id);
            setDeleteModalOpen(false);
            setJobToDelete(null);
        } catch (err) {
            console.error('Failed to delete job offer:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    /**
     * Handles closing the delete confirmation modal
     */
    const handleCloseDeleteModal = () => {
        if (!isDeleting) {
            setDeleteModalOpen(false);
            setJobToDelete(null);
        }
    };

    /**
     * Handles viewing job offer details
     * Opens a modal or navigates to detailed view
     * 
     * @param job - The job offer object to view
     */
    const handleViewJob = (job: any) => {
        // For now, we'll just log the job details
        // In a real implementation, this would open a modal or navigate to a detail page
        console.log('Viewing job offer:', job);
        // You can implement modal opening or navigation here
        // Example: setSelectedJob(job); setShowModal(true);
    };

    /**
     * Handles closing the add job offer modal and resets button state
     */
    const handleCloseAddJobModal = () => {
        setIsAddJobModalOpen(false);
        // Reset the button clicked state after a short delay to allow the modal to close
        setTimeout(() => {
            setResetAddButton(true);
            // Reset the reset flag after a brief moment
            setTimeout(() => setResetAddButton(false), 100);
        }, 100);
    };

    /**
     * Extracts a job title from the job content
     * Uses simple pattern matching to identify likely job titles
     * 
     * @param content - The raw content of the job offer
     * @returns Extracted job title or default 'Job Offer' if not found
     */
    const extractJobTitle = (content: string): string => {
        // Split content into lines and filter out empty lines
        const lines = content.split('\n').filter(line => line.trim());
        const firstLine = lines[0]?.trim();

        // Check if first line looks like a title (not too long, contains common job title words)
        if (firstLine && firstLine.length < 100 &&
            (firstLine.toLowerCase().includes('developer') ||
                firstLine.toLowerCase().includes('engineer') ||
                firstLine.toLowerCase().includes('manager') ||
                firstLine.toLowerCase().includes('analyst') ||
                firstLine.toLowerCase().includes('specialist'))) {
            return firstLine;
        }

        return 'Job Offer';
    };

    /**
     * Extracts a company name from the job content
     * Looks for company name patterns in the first few lines
     * 
     * @param content - The raw content of the job offer
     * @returns Extracted company name or default 'Unknown Company' if not found
     */
    const extractCompany = (content: string): string => {
        // Split content into lines and filter out empty lines
        const lines = content.split('\n').filter(line => line.trim());

        // Check first 5 lines for potential company names
        for (const line of lines.slice(0, 5)) {
            const trimmed = line.trim();
            // Look for lines that don't contain job-related keywords and are reasonably short
            if (trimmed && trimmed.length < 100 &&
                !trimmed.toLowerCase().includes('job') &&
                !trimmed.toLowerCase().includes('position') &&
                !trimmed.toLowerCase().includes('role')) {
                return trimmed;
            }
        }

        return 'Unknown Company';
    };

    /**
     * Formats a date into a human-readable relative time string
     * Shows relative time for recent dates, absolute date for older ones
     * 
     * @param date - The date to format
     * @returns Formatted date string (e.g., "Today", "2 days ago", "12/25/2023")
     */
    const formatDate = (date: Date): string => {
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return 'Today';
        } else if (diffInDays === 1) {
            return 'Yesterday';
        } else if (diffInDays < 7) {
            return `${diffInDays} days ago`;
        } else if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    // Show loading state with skeleton component
    if (loading) {
        return (
            <Card className={`h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm ${className}`}>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500">
                            <Icons.briefcase className="h-6 w-6 text-white" aria-hidden="true" />
                        </div>
                        Saved Job Offers
                    </CardTitle>
                    <CardDescription className="text-slate-600 text-base">Loading your saved job offers...</CardDescription>
                </CardHeader>
                <CardContent>
                    <JobOffersDisplaySkeleton />
                </CardContent>
            </Card>
        );
    }

    // Main component render
    return (
        <Card className={`h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm ${className}`}>
            {/* Card Header with title and refresh button */}
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500">
                        <Icons.briefcase className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    Saved Job Offers
                </CardTitle>
                <CardDescription className="text-slate-600 text-base">
                    {jobData.length} saved job offers
                </CardDescription>
                <div className="flex justify-end items-center gap-2 mt-3">
                    <MetaButton
                        onClick={() => {
                            console.log('Add Job Offer button clicked');
                            setIsAddJobModalOpen(true);
                        }}
                        variant="primary"
                        size="sm"
                        icon={Plus}
                        text="Add Job Offer"
                        tooltip="Add a new job offer to your collection"
                        width="auto"
                        disabled={false}
                        resetClicked={resetAddButton}
                    />
                    <RefreshButton
                        onRefresh={refetch}
                        isLoading={loading}
                        text="Refresh"
                        size="sm"
                        variant="primary-outline"
                        tooltip="Refresh job offers list"
                    />
                </div>
            </CardHeader>

            {/* Card Content with job offers list */}
            <CardContent className="space-y-4">
                {/* Error Display - shows if there's an error fetching data */}
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Job Offers List - main content area */}
                <div className="space-y-3">
                    {jobData.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Icons.briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-sm">No job offers saved yet</p>
                            <p className="text-xs text-gray-400">Add your first job offer to get started</p>
                        </div>
                    ) : (
                        jobData.map((job) => (
                            <div
                                key={job.id}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {/* Left: Icon and details */}
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <Icons.briefcase className="h-5 w-5 text-muted-foreground mt-1" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate mb-1">
                                            {job.title || extractJobTitle(job.content)}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1 min-w-0">
                                                <Building2 className="h-3 w-3" />
                                                <span className="truncate">{job.company || extractCompany(job.content)}</span>
                                            </span>
                                            {job.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{job.location}</span>
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>{formatDate(new Date(job.createdAt))}</span>
                                            </span>
                                        </div>
                                        {job.jobLink && (
                                            <a
                                                href={job.jobLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 mt-1 text-xs text-blue-600 hover:text-blue-800"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                View Job Posting
                                            </a>
                                        )}
                                    </div>
                                </div>
                                {/* Right: Actions */}
                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleViewJob(job)}
                                        className="h-8 px-3 flex items-center gap-2"
                                        title="View job details"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span>View</span>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDeleteClick(job)}
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        title="Delete job"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </CardContent>

            {/* Add Job Offer Modal */}
            <AddJobOfferModal
                isOpen={isAddJobModalOpen}
                onClose={handleCloseAddJobModal}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                itemTitle={jobToDelete?.title || jobToDelete?.company || 'Job Offer'}
                itemType="Job Offer"
                isDeleting={isDeleting}
            />
        </Card>
    );
}
