'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Icons } from '../icons';
import { MetaButton } from '../buttons/meta-button';
import {
    Building2,
    ExternalLink,
    Eye,
    Copy,
    Trash2,
    Edit,
    Clock,
    Calendar,
    Briefcase,
    CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { JobData } from '@/lib/types';

/**
 * Props interface for the JobViewModal component
 */
interface JobViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: JobData | null;
    onEdit?: (job: JobData) => void;
    onDelete?: (job: JobData) => void;
    onArchive?: (job: JobData) => void;
    onUnarchive?: (job: JobData) => void;
    className?: string;
}

/**
 * JobViewModal Component
 * 
 * A comprehensive modal component that displays detailed information about a job offer.
 * Features include:
 * - Complete job details display
 * - Action buttons for editing, deleting, archiving
 * - Copy to clipboard functionality
 * - External link handling
 * - Responsive design
 * - Accessibility features
 * 
 * @param isOpen - Whether the modal is open
 * @param onClose - Function to call when modal should be closed
 * @param job - The job data object to display
 * @param onEdit - Optional function to handle edit action
 * @param onDelete - Optional function to handle delete action
 * @param onArchive - Optional function to handle archive action
 * @param onUnarchive - Optional function to handle unarchive action
 * @param className - Optional CSS class name for styling
 * @returns JSX element containing the job view modal
 */
export function JobViewModal({
    isOpen,
    onClose,
    job,
    onEdit,
    onDelete,
    onArchive,
    onUnarchive,
    className
}: JobViewModalProps) {
    // State for copy functionality
    const [copySuccess, setCopySuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handles copying job content to clipboard
     */
    const handleCopyToClipboard = async () => {
        if (!job?.content) return;

        try {
            await navigator.clipboard.writeText(job.content);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };


    /**
     * Formats a date into a human-readable string
     */
    const formatDate = (date: Date | string): string => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    /**
     * Formats relative time
     */
    const formatRelativeTime = (date: Date | string): string => {
        const now = new Date();
        const jobDate = new Date(date);
        const diffInMs = now.getTime() - jobDate.getTime();
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
            return formatDate(date);
        }
    };

    /**
     * Extracts job title from content if not provided
     */
    const getJobTitle = (): string => {
        if (job?.title) return job.title;
        if (job?.content) {
            const lines = job.content.split('\n').filter(line => line.trim());
            const firstLine = lines[0]?.trim();
            if (firstLine && firstLine.length < 100) {
                return firstLine;
            }
        }
        return 'Job Offer';
    };

    /**
     * Extracts company name from content if not provided
     */
    const getCompanyName = (): string => {
        if (job?.company) return job.company;
        if (job?.content) {
            const lines = job.content.split('\n').filter(line => line.trim());
            for (const line of lines.slice(0, 5)) {
                const trimmed = line.trim();
                if (trimmed && trimmed.length < 100 &&
                    !trimmed.toLowerCase().includes('job') &&
                    !trimmed.toLowerCase().includes('position')) {
                    return trimmed;
                }
            }
        }
        return 'Unknown Company';
    };

    // Don't render if no job data
    if (!job) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`max-w-5xl w-[95vw] h-[95vh] flex flex-col bg-white/95 backdrop-blur-sm border-0 shadow-2xl ${className}`}>
                <DialogHeader className="pb-6 flex-shrink-0">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
                            <Icons.briefcase className="h-7 w-7 text-white" aria-hidden="true" />
                        </div>
                        {getJobTitle()}
                    </DialogTitle>
                    <DialogDescription className="text-slate-600 text-lg mt-2">
                        Job offer details and information
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 overflow-y-auto flex-1 min-h-0">
                    {/* Form Fields Information - Prominently displayed */}
                    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
                                <Briefcase className="h-5 w-5 text-blue-500" />
                                Job Offer Details
                            </CardTitle>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Job Title */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <Briefcase className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                        Job Title
                                    </div>
                                    <div className="text-base lg:text-lg font-semibold text-slate-900 bg-white p-3 rounded-lg border min-h-[3rem] flex items-center">
                                        <span className="truncate">{getJobTitle()}</span>
                                    </div>
                                </div>

                                {/* Company Name */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                        Company
                                    </div>
                                    <div className="text-base lg:text-lg font-semibold text-slate-900 bg-white p-3 rounded-lg border min-h-[3rem] flex items-center">
                                        <span className="truncate">{getCompanyName()}</span>
                                    </div>
                                </div>

                                {/* Job Link */}
                                {job.jobLink && (
                                    <div className="space-y-2 lg:col-span-2">
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                            <ExternalLink className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                            Job Link
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border">
                                            <a
                                                href={job.jobLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm break-all block"
                                            >
                                                {job.jobLink}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                    </Card>


                    {/* Job Content */}
                    <Card className="overflow-hidden border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="prose prose-sm max-w-none max-h-96 overflow-y-auto">
                                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                                    {job.content}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <Card className="overflow-hidden border-0 shadow-sm flex-shrink-0">
                        <CardContent className="p-4 lg:p-6">
                            <div className="flex flex-wrap gap-3 justify-center">
                                {/* Copy Button */}
                                <MetaButton
                                    onClick={handleCopyToClipboard}
                                    variant="secondary-outline"
                                    size="sm"
                                    icon={Copy}
                                    text={copySuccess ? "Copied!" : "Copy"}
                                    tooltip="Copy job content to clipboard"
                                    disabled={!job.content}
                                    width="auto"
                                />

                                {/* Edit Button */}
                                {onEdit && (
                                    <MetaButton
                                        onClick={() => onEdit(job)}
                                        variant="primary-outline"
                                        size="sm"
                                        icon={Edit}
                                        text="Edit"
                                        tooltip="Edit job offer"
                                        width="auto"
                                    />
                                )}

                                {/* Delete Button */}
                                {onDelete && (
                                    <MetaButton
                                        onClick={() => onDelete(job)}
                                        variant="danger-outline"
                                        size="sm"
                                        icon={Trash2}
                                        text="Delete"
                                        tooltip="Delete job offer"
                                        width="auto"
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metadata Information */}
                    <Card className="overflow-hidden border-0 shadow-sm bg-slate-50 flex-shrink-0">
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-slate-600">
                                <div className="flex items-center gap-2 min-w-0">
                                    <Clock className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">Created: {formatDate(job.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2 min-w-0">
                                    <Calendar className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">Updated: {formatDate(job.updatedAt)}</span>
                                </div>
                                <div className="flex items-center gap-2 min-w-0">
                                    <Eye className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">Views: {job.viewCount || 0}</span>
                                </div>
                                <div className="flex items-center gap-2 min-w-0">
                                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">Status: {job.processingStatus}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
