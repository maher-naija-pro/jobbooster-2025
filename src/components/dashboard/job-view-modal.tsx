'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Icons } from '../icons';
import { MetaButton } from '../buttons/meta-button';
import {
    Calendar,
    MapPin,
    Building2,
    ExternalLink,
    Eye,
    Copy,
    Download,
    Share2,
    Archive,
    ArchiveRestore,
    Trash2,
    Edit,
    Clock,
    Users,
    DollarSign,
    Briefcase,
    Globe,
    Mail,
    Phone,
    Star,
    CheckCircle,
    AlertCircle,
    Info
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
     * Handles downloading job content as text file
     */
    const handleDownload = () => {
        if (!job?.content) return;

        const blob = new Blob([job.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${job.title || 'job-offer'}-${job.company || 'unknown'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    /**
     * Handles sharing job content
     */
    const handleShare = async () => {
        if (!job) return;

        const shareData = {
            title: job.title || 'Job Offer',
            text: job.content,
            url: job.jobLink || window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            }
        } catch (err) {
            console.error('Failed to share:', err);
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
            <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl ${className}`}>
                <DialogHeader className="pb-6">
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

                <div className="space-y-6">
                    {/* Job Header Information */}
                    <Card className="overflow-hidden border-0 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-slate-900">
                                        {getJobTitle()}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4" />
                                            <span>{getCompanyName()}</span>
                                        </div>
                                        {job.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                <span>{job.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formatRelativeTime(job.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Eye className="h-4 w-4" />
                                            <span>{job.viewCount || 0} views</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {job.jobType && (
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                            {job.jobType.replace('-', ' ').toUpperCase()}
                                        </Badge>
                                    )}
                                    {job.remoteType && (
                                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                                            {job.remoteType.toUpperCase()}
                                        </Badge>
                                    )}
                                    {job.experienceLevel && (
                                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                            {job.experienceLevel.toUpperCase()}
                                        </Badge>
                                    )}
                                    {job.isArchived && (
                                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                            ARCHIVED
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Job Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column - Job Information */}
                        <div className="space-y-4">
                            {/* Basic Information */}
                            <Card className="overflow-hidden border-0 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                        <Info className="h-5 w-5 text-blue-500" />
                                        Job Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {job.jobLink && (
                                        <div className="flex items-center gap-2">
                                            <ExternalLink className="h-4 w-4 text-slate-500" />
                                            <a
                                                href={job.jobLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline truncate"
                                            >
                                                View Original Posting
                                            </a>
                                        </div>
                                    )}
                                    {job.salaryRange && (
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-slate-500" />
                                            <span className="text-slate-700">{job.salaryRange}</span>
                                        </div>
                                    )}
                                    {job.industry && (
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-slate-500" />
                                            <span className="text-slate-700">{job.industry}</span>
                                        </div>
                                    )}
                                    {job.department && (
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-slate-500" />
                                            <span className="text-slate-700">{job.department}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Skills and Qualifications */}
                            {(job.extractedSkills?.length || job.requiredQualifications?.length || job.preferredQualifications?.length) && (
                                <Card className="overflow-hidden border-0 shadow-sm">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                            <Star className="h-5 w-5 text-yellow-500" />
                                            Skills & Qualifications
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {job.extractedSkills?.length && (
                                            <div>
                                                <h4 className="text-sm font-medium text-slate-700 mb-2">Skills</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {job.extractedSkills.map((skill, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {job.requiredQualifications?.length && (
                                            <div>
                                                <h4 className="text-sm font-medium text-slate-700 mb-2">Required</h4>
                                                <ul className="space-y-1">
                                                    {job.requiredQualifications.map((qual, index) => (
                                                        <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                                                            <CheckCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                                            {qual}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {job.preferredQualifications?.length && (
                                            <div>
                                                <h4 className="text-sm font-medium text-slate-700 mb-2">Preferred</h4>
                                                <ul className="space-y-1">
                                                    {job.preferredQualifications.map((qual, index) => (
                                                        <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                                                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                                            {qual}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Right Column - Job Content */}
                        <div className="space-y-4">
                            <Card className="overflow-hidden border-0 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-green-500" />
                                        Job Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-sm max-w-none">
                                        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                                            {job.content}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <Card className="overflow-hidden border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-wrap gap-3 justify-between items-center">
                                <div className="flex flex-wrap gap-2">
                                    <MetaButton
                                        onClick={handleCopyToClipboard}
                                        variant="secondary-outline"
                                        size="sm"
                                        icon={Copy}
                                        text={copySuccess ? "Copied!" : "Copy"}
                                        tooltip="Copy job content to clipboard"
                                        disabled={!job.content}
                                    />
                                    <MetaButton
                                        onClick={handleDownload}
                                        variant="secondary-outline"
                                        size="sm"
                                        icon={Download}
                                        text="Download"
                                        tooltip="Download job content as text file"
                                        disabled={!job.content}
                                    />
                                    <MetaButton
                                        onClick={handleShare}
                                        variant="secondary-outline"
                                        size="sm"
                                        icon={Share2}
                                        text="Share"
                                        tooltip="Share job content"
                                        disabled={!job.content}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {onEdit && (
                                        <MetaButton
                                            onClick={() => onEdit(job)}
                                            variant="primary-outline"
                                            size="sm"
                                            icon={Edit}
                                            text="Edit"
                                            tooltip="Edit job offer"
                                        />
                                    )}
                                    {onArchive && !job.isArchived && (
                                        <MetaButton
                                            onClick={() => onArchive(job)}
                                            variant="warning-outline"
                                            size="sm"
                                            icon={Archive}
                                            text="Archive"
                                            tooltip="Archive job offer"
                                        />
                                    )}
                                    {onUnarchive && job.isArchived && (
                                        <MetaButton
                                            onClick={() => onUnarchive(job)}
                                            variant="success-outline"
                                            size="sm"
                                            icon={ArchiveRestore}
                                            text="Unarchive"
                                            tooltip="Unarchive job offer"
                                        />
                                    )}
                                    {onDelete && (
                                        <MetaButton
                                            onClick={() => onDelete(job)}
                                            variant="danger-outline"
                                            size="sm"
                                            icon={Trash2}
                                            text="Delete"
                                            tooltip="Delete job offer"
                                        />
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metadata Information */}
                    <Card className="overflow-hidden border-0 shadow-sm bg-slate-50">
                        <CardContent className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>Created: {formatDate(job.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Updated: {formatDate(job.updatedAt)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    <span>Views: {job.viewCount || 0}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Status: {job.processingStatus}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
