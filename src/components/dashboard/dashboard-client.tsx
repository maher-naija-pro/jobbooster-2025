'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
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
    const [announcement, setAnnouncement] = useState<string>('');
    const mainContentRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    // Get job data for stats
    const { jobData: savedJobOffers, loading: jobOffersLoading, error: jobOffersError } = useJobData({ limit: 1000 });

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
        setAnnouncement('CV removed successfully');
    }, [refreshCvData]);

    // Announce changes to screen readers
    useEffect(() => {
        if (announcement) {
            const timer = setTimeout(() => setAnnouncement(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [announcement]);

    // Focus management for accessibility
    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.focus();
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            {/* Screen reader announcements */}
            <div
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {announcement}
            </div>

            <div className="container mx-auto py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-12">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
                            <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                                <AvatarImage
                                    src={profile?.avatarUrl}
                                    alt={`Profile picture of ${profile?.fullName || user.email}`}
                                />
                                <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                                    Welcome back, {profile?.fullName || user.email?.split('@')[0]}!
                                </h1>
                                <p className="text-lg text-slate-600 max-w-2xl">
                                    Here's what's happening with your account today. Manage your CVs, generate content, and track your progress.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Badge
                                variant={subscription.plan === 'free' ? 'secondary' : 'default'}
                                className="px-4 py-2 text-sm font-medium"
                            >
                                {subscription.plan.toUpperCase()} Plan
                            </Badge>
                            <span className="text-sm text-slate-500 flex items-center gap-2">
                                <Icons.calendar className="h-4 w-4" />
                                Member since {new Date(profile?.createdAt || user.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <section
                        ref={statsRef}
                        aria-labelledby="stats-heading"
                        className="mb-12"
                    >
                        <h2 id="stats-heading" className="sr-only">
                            Account Statistics
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                    <CardTitle className="text-sm font-semibold text-slate-700">
                                        CVs Uploaded
                                    </CardTitle>
                                    <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                                        <Icons.fileText className="h-5 w-5 text-blue-600" aria-hidden="true" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">
                                        {cvLoading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            totalCvs
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        {cvLoading ? 'Loading...' :
                                            monthlyChange > 0 ? `+${monthlyChange}% from last month` :
                                                monthlyChange < 0 ? `${monthlyChange}% from last month` :
                                                    'No change from last month'}
                                    </p>
                                    {cvError && (
                                        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                            <Icons.alertCircle className="h-4 w-4" aria-hidden="true" />
                                            Error loading data
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                    <CardTitle className="text-sm font-semibold text-slate-700">
                                        Content Generated
                                    </CardTitle>
                                    <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                                        <Icons.mail className="h-5 w-5 text-green-600" aria-hidden="true" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">
                                        {contentLoading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            totalContent
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        {contentLoading ? 'Loading...' :
                                            contentMonthlyChange > 0 ? `+${contentMonthlyChange}% from last month` :
                                                contentMonthlyChange < 0 ? `${contentMonthlyChange}% from last month` :
                                                    'No change from last month'}
                                    </p>
                                    {contentError && (
                                        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                            <Icons.alertCircle className="h-4 w-4" aria-hidden="true" />
                                            Error loading data
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                    <CardTitle className="text-sm font-semibold text-slate-700">
                                        Saved Offers
                                    </CardTitle>
                                    <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                                        <Icons.bookmark className="h-5 w-5 text-purple-600" aria-hidden="true" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">
                                        {jobOffersLoading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            savedJobOffers.length
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        {jobOffersLoading ? 'Loading...' : 'Job offers saved'}
                                    </p>
                                    {jobOffersError && (
                                        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                            <Icons.alertCircle className="h-4 w-4" aria-hidden="true" />
                                            Error loading data
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                    <CardTitle className="text-sm font-semibold text-slate-700">
                                        Account Status
                                    </CardTitle>
                                    <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">
                                        <Icons.user className="h-5 w-5 text-orange-600" aria-hidden="true" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">
                                        {user.email_confirmed_at ? 'Verified' : 'Pending'}
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        {subscription.plan} plan
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section aria-labelledby="quick-actions-heading" className="mb-12">
                        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                                        <Icons.zap className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    Quick Actions
                                </CardTitle>
                                <CardDescription className="text-slate-600 text-base">
                                    Common tasks and shortcuts to help you get started
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Button
                                        className="w-full justify-start h-12 text-left group hover:shadow-md transition-all duration-200"
                                        variant="outline"
                                        aria-label="Generate a cover letter for job applications"
                                    >
                                        <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors mr-3">
                                            <Icons.mail className="h-5 w-5 text-blue-600" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">Generate Cover Letter</div>
                                            <div className="text-sm text-slate-500">Create personalized cover letters</div>
                                        </div>
                                    </Button>
                                    <Button
                                        className="w-full justify-start h-12 text-left group hover:shadow-md transition-all duration-200"
                                        variant="outline"
                                        aria-label="Generate professional emails"
                                    >
                                        <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors mr-3">
                                            <Icons.mail className="h-5 w-5 text-green-600" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">Generate Email</div>
                                            <div className="text-sm text-slate-500">Professional email templates</div>
                                        </div>
                                    </Button>
                                    <Button
                                        className="w-full justify-start h-12 text-left group hover:shadow-md transition-all duration-200"
                                        variant="outline"
                                        aria-label="Analyze your CV for improvements"
                                    >
                                        <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors mr-3">
                                            <Icons.search className="h-5 w-5 text-purple-600" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">Analyze CV</div>
                                            <div className="text-sm text-slate-500">Get CV improvement suggestions</div>
                                        </div>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Main Content */}
                    <main
                        ref={mainContentRef}
                        tabIndex={-1}
                        aria-label="Main dashboard content"
                        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8"
                    >


                        {/* CV Display Form */}
                        <section aria-labelledby="cv-display-heading" className="lg:col-span-1">
                            <CVDisplay
                                onFileRemove={handleFileRemove}
                                onFileUpload={handleFileUpload}
                                refreshTrigger={Date.now()}
                                cvData={cvDataList.find(cv => cv.status === 'processing') || null}
                                isProcessing={isProcessing}
                                error={error}
                                uploadProgress={uploadProgress}
                                isUploading={isUploading}
                            />
                        </section>


                        {/* Saved Job Offers */}
                        <section aria-labelledby="saved-offers-heading" className="lg:col-span-1">
                            <JobOffersDisplay />
                        </section>
                    </main>

                </div>
            </div>
        </div>
    );
}
