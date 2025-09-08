'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { useJobData } from '@/hooks/useJobData';
import { Icons } from '../icons';
import { Trash2, Archive, ArchiveRestore, Calendar, MapPin, Building2, ExternalLink } from 'lucide-react';

interface JobOffersDisplayProps {
    className?: string;
}

export function JobOffersDisplay({ className }: JobOffersDisplayProps) {
    const {
        jobData,
        loading,
        error,
        deleteJobData,
        archiveJobData,
        unarchiveJobData,
    } = useJobData({ limit: 1000 });

    // Debug logging
    console.log('JobOffersDisplay - jobData:', jobData);
    console.log('JobOffersDisplay - loading:', loading);
    console.log('JobOffersDisplay - error:', error);

    const handleDeleteJob = async (id: string) => {
        if (confirm('Are you sure you want to delete this job offer?')) {
            try {
                await deleteJobData(id);
            } catch (err) {
                console.error('Failed to delete job offer:', err);
            }
        }
    };

    const handleArchiveJob = async (id: string, isArchived: boolean) => {
        try {
            if (isArchived) {
                await unarchiveJobData(id);
            } else {
                await archiveJobData(id);
            }
        } catch (err) {
            console.error('Failed to archive/unarchive job offer:', err);
        }
    };

    const extractJobTitle = (content: string): string => {
        // Simple extraction - look for common patterns
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

    const extractCompany = (content: string): string => {
        // Look for company name patterns
        const lines = content.split('\n').filter(line => line.trim());

        for (const line of lines.slice(0, 5)) { // Check first 5 lines
            const trimmed = line.trim();
            if (trimmed && trimmed.length < 100 &&
                !trimmed.toLowerCase().includes('job') &&
                !trimmed.toLowerCase().includes('position') &&
                !trimmed.toLowerCase().includes('role')) {
                return trimmed;
            }
        }

        return 'Unknown Company';
    };

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

    if (loading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icons.briefcase className="h-5 w-5" />
                        Saved Job Offers
                    </CardTitle>
                    <CardDescription>Loading your saved job offers...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-16 bg-gray-200 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icons.briefcase className="h-5 w-5" />
                    Saved Job Offers
                </CardTitle>
                <CardDescription>
                    {jobData.length} saved job offers
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Error Display */}
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Job Offers List */}
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
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <div className="flex-shrink-0">
                                        <Icons.briefcase className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-medium truncate">
                                                {job.title || extractJobTitle(job.content)}
                                            </p>
                                            {job.isArchived && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Archived
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Building2 className="h-3 w-3" />
                                                <span className="truncate">
                                                    {job.company || extractCompany(job.content)}
                                                </span>
                                            </div>
                                            {job.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{job.location}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>
                                                    {formatDate(new Date(job.createdAt))}
                                                </span>
                                            </div>
                                        </div>
                                        {job.jobLink && (
                                            <div className="mt-1">
                                                <a
                                                    href={job.jobLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    View Job Posting
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleArchiveJob(job.id, job.isArchived)}
                                        className="h-8 w-8 p-0"
                                    >
                                        {job.isArchived ? (
                                            <ArchiveRestore className="h-4 w-4" />
                                        ) : (
                                            <Archive className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDeleteJob(job.id)}
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </CardContent>
        </Card>
    );
}
