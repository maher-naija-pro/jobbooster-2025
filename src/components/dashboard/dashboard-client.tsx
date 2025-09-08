'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CVDisplay } from './cv-display'
import { CVUpload } from '../cv-upload'
import { JobOfferInputForm } from './job-offer-input-form'
import { JobOffersDisplay } from './job-offers-display'
import { CVData } from '@/lib/types'
import { validateFile } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { useJobData } from '@/hooks/useJobData'
import { useCvData } from '@/hooks/useCvData'
import { useGeneratedContent } from '@/hooks/useGeneratedContent'

interface DashboardClientProps {
    profile: any;
    user: any;
    subscription: any;
    preferences: any;
    initials: string;
}

export function DashboardClient({ profile, user, subscription, preferences, initials }: DashboardClientProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // Get job data for stats
    const { jobData: savedJobOffers } = useJobData({ limit: 1 });

    // Get CV data for stats
    const {
        totalCvs,
        cvsThisMonth,
        cvsLastMonth,
        monthlyChange,
        cvsData: cvDataList,
        loading: cvLoading,
        error: cvError,
        refresh: refreshCvData
    } = useCvData();

    // Get generated content data for stats
    const {
        totalContent,
        contentThisMonth,
        contentLastMonth,
        monthlyChange: contentMonthlyChange,
        contentByType,
        loading: contentLoading,
        error: contentError,
        refresh: refreshContent
    } = useGeneratedContent();

    const handleFileUpload = useCallback(async (file: File) => {
        try {
            setError(null);
            setIsUploading(true);
            setUploadProgress(0);

            // Validate file
            const validation = validateFile(file);
            if (!validation.isValid) {
                setError(validation.error || 'Invalid file');
                return;
            }

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 200);

            // Create FormData
            const formData = new FormData();
            formData.append('file', file);

            // Upload file
            const response = await fetch('/api/upload-cv', {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const result = await response.json();

            // Refresh CV data from database
            refreshCvData();
            setIsUploading(false);

            // Simulate processing
            setIsProcessing(true);
            setTimeout(() => {
                setIsProcessing(false);
                // Refresh again after processing simulation
                refreshCvData();
                // Also refresh content data in case new content was generated
                refreshContent();
            }, 2000);

        } catch (err) {
            console.error('File upload failed:', err);
            setError(err instanceof Error ? err.message : 'Upload failed');
            setIsUploading(false);
            setUploadProgress(0);
        }
    }, []);

    const handleFileRemove = useCallback((cvId: string) => {
        // Refresh CV data from database after removal
        refreshCvData();
        setError(null);
        setUploadProgress(0);
        setIsUploading(false);
        setIsProcessing(false);
    }, [refreshCvData]);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={profile?.avatarUrl} alt={profile?.fullName || user.email} />
                            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold">
                                Welcome back, {profile?.fullName || user.email?.split('@')[0]}!
                            </h1>
                            <p className="text-muted-foreground">
                                Here's what's happening with your account today.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Badge variant={subscription.plan === 'free' ? 'secondary' : 'default'}>
                            {subscription.plan.toUpperCase()} Plan
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            Member since {new Date(profile?.createdAt || user.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">CVs Uploaded</CardTitle>
                            <Icons.fileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {cvLoading ? '...' : totalCvs}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {cvLoading ? 'Loading...' :
                                    monthlyChange > 0 ? `+${monthlyChange}% from last month` :
                                        monthlyChange < 0 ? `${monthlyChange}% from last month` :
                                            'No change from last month'}
                            </p>
                            {cvError && (
                                <p className="text-xs text-red-500 mt-1">
                                    Error loading data
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
                            <Icons.mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {contentLoading ? '...' : totalContent}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {contentLoading ? 'Loading...' :
                                    contentMonthlyChange > 0 ? `+${contentMonthlyChange}% from last month` :
                                        contentMonthlyChange < 0 ? `${contentMonthlyChange}% from last month` :
                                            'No change from last month'}
                            </p>
                            {contentError && (
                                <p className="text-xs text-red-500 mt-1">
                                    Error loading data
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saved Offers</CardTitle>
                            <Icons.bookmark className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {savedJobOffers.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Job offers saved
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                            <Icons.user className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {user.email_confirmed_at ? 'Verified' : 'Pending'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {subscription.plan} plan
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Common tasks and shortcuts
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Button className="w-full justify-start" variant="outline">
                                    <Icons.mail className="mr-2 h-4 w-4" />
                                    Generate Cover Letter
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <Icons.mail className="mr-2 h-4 w-4" />
                                    Generate Email
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <Icons.search className="mr-2 h-4 w-4" />
                                    Analyze CV
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* CV Upload Card */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Icons.fileText className="h-5 w-5" />
                                    Upload CV
                                </CardTitle>
                                <CardDescription>
                                    Upload a new CV or resume
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CVUpload
                                    onFileUpload={handleFileUpload}
                                    onFileRemove={() => { }} // Not used for individual CV removal
                                    cvData={cvDataList.find(cv => cv.status === 'processing') || null}
                                    isProcessing={isProcessing}
                                    error={error}
                                    uploadProgress={uploadProgress}
                                    isUploading={isUploading}
                                    className="w-full"
                                    cvDataList={cvDataList}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* CV Display Form */}
                    <CVDisplay
                        onFileRemove={handleFileRemove}
                        refreshTrigger={Date.now()}
                    />

                    {/* Add Job Offer */}
                    <JobOfferInputForm />

                    {/* Saved Job Offers */}
                    <JobOffersDisplay />
                </div>

            </div>
        </div>
    );
}
