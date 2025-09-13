'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
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
    CheckCircle,
    Save,
    X
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
    onUpdate?: (id: string, data: Partial<JobData>) => Promise<JobData>;
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
    onUpdate,
    className
}: JobViewModalProps) {
    // State for copy functionality
    const [copySuccess, setCopySuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // State for edit mode
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState<Partial<JobData>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

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
     * Maps Prisma enum values to form values
     */
    const mapPrismaValuesToForm = (data: Partial<JobData>): Partial<JobData> => {
        const mappedData = { ...data };

        // Map jobType values
        if (mappedData.jobType) {
            const jobTypeMap: Record<string, string> = {
                'FULL_TIME': 'full-time',
                'PART_TIME': 'part-time',
                'CONTRACT': 'contract',
                'TEMPORARY': 'temporary',
                'INTERNSHIP': 'internship',
                'FREELANCE': 'freelance',
                'VOLUNTEER': 'volunteer'
            };
            mappedData.jobType = jobTypeMap[mappedData.jobType] || 'full-time';
        }

        // Map remoteType values
        if (mappedData.remoteType) {
            const remoteTypeMap: Record<string, string> = {
                'ONSITE': 'onsite',
                'REMOTE': 'remote',
                'HYBRID': 'hybrid',
                'FLEXIBLE': 'flexible'
            };
            mappedData.remoteType = remoteTypeMap[mappedData.remoteType] || 'onsite';
        }

        // Map experienceLevel values
        if (mappedData.experienceLevel) {
            const experienceLevelMap: Record<string, string> = {
                'ENTRY_LEVEL': 'entry',
                'JUNIOR': 'junior',
                'MID_LEVEL': 'mid',
                'SENIOR': 'senior',
                'LEAD': 'lead',
                'EXECUTIVE': 'executive'
            };
            mappedData.experienceLevel = experienceLevelMap[mappedData.experienceLevel] || 'mid';
        }

        return mappedData;
    };

    /**
     * Handles entering edit mode
     */
    const handleEnterEditMode = () => {
        if (!job) return;

        // Initialize edit data with current job data
        const initialData = {
            title: job.title || '',
            company: job.company || '',
            jobLink: job.jobLink || '',
            content: job.content || '',
            location: job.location || '',
            jobType: job.jobType || 'full-time',
            remoteType: job.remoteType || 'onsite',
            salaryRange: job.salaryRange || '',
            experienceLevel: job.experienceLevel || 'mid',
            industry: job.industry || '',
            department: job.department || '',
            employmentType: job.employmentType || ''
        };

        // Map Prisma enum values to form values
        const mappedData = mapPrismaValuesToForm(initialData);

        setEditData(mappedData);
        setIsEditMode(true);
        setSaveError(null);
        setSaveSuccess(false);
    };

    /**
     * Handles canceling edit mode
     */
    const handleCancelEdit = () => {
        setIsEditMode(false);
        setEditData({});
        setSaveError(null);
        setSaveSuccess(false);
    };

    /**
     * Maps form values to Prisma enum values
     */
    const mapFormValuesToPrisma = (data: Partial<JobData>): Partial<JobData> => {
        const mappedData = { ...data };

        // Map jobType values
        if (mappedData.jobType) {
            const jobTypeMap: Record<string, string> = {
                'full-time': 'FULL_TIME',
                'part-time': 'PART_TIME',
                'contract': 'CONTRACT',
                'temporary': 'TEMPORARY',
                'internship': 'INTERNSHIP',
                'freelance': 'FREELANCE',
                'volunteer': 'VOLUNTEER'
            };
            mappedData.jobType = jobTypeMap[mappedData.jobType] || mappedData.jobType;
        }

        // Map remoteType values
        if (mappedData.remoteType) {
            const remoteTypeMap: Record<string, string> = {
                'onsite': 'ONSITE',
                'remote': 'REMOTE',
                'hybrid': 'HYBRID',
                'flexible': 'FLEXIBLE'
            };
            mappedData.remoteType = remoteTypeMap[mappedData.remoteType] || mappedData.remoteType;
        }

        // Map experienceLevel values
        if (mappedData.experienceLevel) {
            const experienceLevelMap: Record<string, string> = {
                'entry': 'ENTRY_LEVEL',
                'junior': 'JUNIOR',
                'mid': 'MID_LEVEL',
                'senior': 'SENIOR',
                'lead': 'LEAD',
                'executive': 'EXECUTIVE'
            };
            mappedData.experienceLevel = experienceLevelMap[mappedData.experienceLevel] || mappedData.experienceLevel;
        }

        return mappedData;
    };

    /**
     * Handles saving changes
     */
    const handleSaveChanges = async () => {
        if (!job || !onUpdate) return;

        try {
            setIsSaving(true);
            setSaveError(null);

            // Filter out empty strings and undefined values
            const filteredData = Object.fromEntries(
                Object.entries(editData).filter(([_, value]) => value !== '' && value !== undefined)
            );

            // Map form values to Prisma enum values
            const mappedData = mapFormValuesToPrisma(filteredData);

            await onUpdate(job.id, mappedData);

            setSaveSuccess(true);
            setIsEditMode(false);
            setEditData({});

            // Close modal after successful save
            setTimeout(() => {
                onClose();
            }, 1000); // Close after 1 second to show success message

        } catch (err) {
            console.error('Failed to save changes:', err);
            setSaveError(err instanceof Error ? err.message : 'Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Handles input changes in edit mode
     */
    const handleInputChange = (field: keyof JobData, value: string) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
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
        if (isEditMode && editData.title !== undefined) return editData.title;
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
        if (isEditMode && editData.company !== undefined) return editData.company;
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

    /**
     * Gets job link for display
     */
    const getJobLink = (): string => {
        if (isEditMode && editData.jobLink !== undefined) return editData.jobLink;
        return job?.jobLink || '';
    };

    /**
     * Gets job content for display
     */
    const getJobContent = (): string => {
        if (isEditMode && editData.content !== undefined) return editData.content;
        return job?.content || '';
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
                                    {isEditMode ? (
                                        <Input
                                            value={editData.title || ''}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            placeholder="Enter job title"
                                            className="text-base lg:text-lg font-semibold min-h-[3rem]"
                                        />
                                    ) : (
                                        <div className="text-base lg:text-lg font-semibold text-slate-900 bg-white p-3 rounded-lg border min-h-[3rem] flex items-center">
                                            <span className="truncate">{getJobTitle()}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Company Name */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                        Company
                                    </div>
                                    {isEditMode ? (
                                        <Input
                                            value={editData.company || ''}
                                            onChange={(e) => handleInputChange('company', e.target.value)}
                                            placeholder="Enter company name"
                                            className="text-base lg:text-lg font-semibold min-h-[3rem]"
                                        />
                                    ) : (
                                        <div className="text-base lg:text-lg font-semibold text-slate-900 bg-white p-3 rounded-lg border min-h-[3rem] flex items-center">
                                            <span className="truncate">{getCompanyName()}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Job Link - Always display */}
                                <div className="space-y-2 lg:col-span-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <ExternalLink className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                        Job Link
                                    </div>
                                    {isEditMode ? (
                                        <Input
                                            value={editData.jobLink || ''}
                                            onChange={(e) => handleInputChange('jobLink', e.target.value)}
                                            placeholder="Enter job link URL"
                                            className="min-h-[3rem]"
                                        />
                                    ) : (
                                        <div className="bg-white p-3 rounded-lg border min-h-[3rem] flex items-center">
                                            {getJobLink() ? (
                                                <a
                                                    href={getJobLink()}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm break-all block"
                                                >
                                                    {getJobLink()}
                                                </a>
                                            ) : (
                                                <span className="text-slate-400 italic text-sm">
                                                    No job link provided
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Additional fields in edit mode */}
                                {isEditMode && (
                                    <>
                                        {/* Location */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                Location
                                            </div>
                                            <Input
                                                value={editData.location || ''}
                                                onChange={(e) => handleInputChange('location', e.target.value)}
                                                placeholder="Enter job location"
                                                className="min-h-[3rem]"
                                            />
                                        </div>

                                        {/* Job Type */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <Briefcase className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                Job Type
                                            </div>
                                            <select
                                                value={editData.jobType || 'full-time'}
                                                onChange={(e) => handleInputChange('jobType', e.target.value)}
                                                className="w-full min-h-[3rem] px-3 py-2 border border-gray-300 rounded-lg text-base font-semibold text-slate-900 bg-white"
                                            >
                                                <option value="full-time">Full-time</option>
                                                <option value="part-time">Part-time</option>
                                                <option value="contract">Contract</option>
                                                <option value="temporary">Temporary</option>
                                                <option value="internship">Internship</option>
                                                <option value="freelance">Freelance</option>
                                                <option value="volunteer">Volunteer</option>
                                            </select>
                                        </div>

                                        {/* Remote Type */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                Remote Type
                                            </div>
                                            <select
                                                value={editData.remoteType || 'onsite'}
                                                onChange={(e) => handleInputChange('remoteType', e.target.value)}
                                                className="w-full min-h-[3rem] px-3 py-2 border border-gray-300 rounded-lg text-base font-semibold text-slate-900 bg-white"
                                            >
                                                <option value="onsite">Onsite</option>
                                                <option value="remote">Remote</option>
                                                <option value="hybrid">Hybrid</option>
                                                <option value="flexible">Flexible</option>
                                            </select>
                                        </div>

                                        {/* Salary Range */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <Briefcase className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                Salary Range
                                            </div>
                                            <Input
                                                value={editData.salaryRange || ''}
                                                onChange={(e) => handleInputChange('salaryRange', e.target.value)}
                                                placeholder="Enter salary range"
                                                className="min-h-[3rem]"
                                            />
                                        </div>

                                        {/* Experience Level */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                Experience Level
                                            </div>
                                            <select
                                                value={editData.experienceLevel || 'mid'}
                                                onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                                                className="w-full min-h-[3rem] px-3 py-2 border border-gray-300 rounded-lg text-base font-semibold text-slate-900 bg-white"
                                            >
                                                <option value="entry">Entry Level</option>
                                                <option value="junior">Junior</option>
                                                <option value="mid">Mid Level</option>
                                                <option value="senior">Senior</option>
                                                <option value="lead">Lead</option>
                                                <option value="executive">Executive</option>
                                            </select>
                                        </div>

                                        {/* Industry */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <Briefcase className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                Industry
                                            </div>
                                            <Input
                                                value={editData.industry || ''}
                                                onChange={(e) => handleInputChange('industry', e.target.value)}
                                                placeholder="Enter industry"
                                                className="min-h-[3rem]"
                                            />
                                        </div>

                                        {/* Department */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                Department
                                            </div>
                                            <Input
                                                value={editData.department || ''}
                                                onChange={(e) => handleInputChange('department', e.target.value)}
                                                placeholder="Enter department"
                                                className="min-h-[3rem]"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardHeader>
                    </Card>


                    {/* Job Content */}
                    <Card className="overflow-hidden border-0 shadow-sm">
                        <CardContent className="p-6">
                            {isEditMode ? (
                                <Textarea
                                    value={getJobContent()}
                                    onChange={(e) => handleInputChange('content', e.target.value)}
                                    placeholder="Enter job description and details..."
                                    className="min-h-[300px] text-slate-700 leading-relaxed resize-none"
                                />
                            ) : (
                                <div className="prose prose-sm max-w-none max-h-96 overflow-y-auto">
                                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                                        {getJobContent()}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <Card className="overflow-hidden border-0 shadow-sm flex-shrink-0">
                        <CardContent className="p-4 lg:p-6">
                            {/* Success/Error Messages */}
                            {saveSuccess && (
                                <Alert className="mb-4 border-green-200 bg-green-50">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        Job offer updated successfully!
                                    </AlertDescription>
                                </Alert>
                            )}

                            {saveError && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertDescription>
                                        {saveError}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="flex flex-wrap gap-3 justify-center">
                                {isEditMode ? (
                                    <>
                                        {/* Save Button */}
                                        <MetaButton
                                            onClick={handleSaveChanges}
                                            variant="primary"
                                            size="sm"
                                            icon={Save}
                                            text={isSaving ? "Saving..." : "Save Changes"}
                                            tooltip="Save changes to job offer"
                                            disabled={isSaving}
                                            width="auto"
                                        />

                                        {/* Cancel Button */}
                                        <MetaButton
                                            onClick={handleCancelEdit}
                                            variant="secondary-outline"
                                            size="sm"
                                            icon={X}
                                            text="Cancel"
                                            tooltip="Cancel editing"
                                            disabled={isSaving}
                                            width="auto"
                                        />
                                    </>
                                ) : (
                                    <>
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
                                        <MetaButton
                                            onClick={handleEnterEditMode}
                                            variant="primary-outline"
                                            size="sm"
                                            icon={Edit}
                                            text="Edit"
                                            tooltip="Edit job offer"
                                            width="auto"
                                        />

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
                                    </>
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
