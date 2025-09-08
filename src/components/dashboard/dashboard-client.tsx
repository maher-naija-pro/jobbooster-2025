'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CVDisplay } from './cv-display'
import { CVData } from '@/lib/types'
import { validateFile } from '@/lib/utils'
import { Icons } from '@/components/icons'

interface DashboardClientProps {
    profile: any;
    user: any;
    subscription: any;
    preferences: any;
    initials: string;
}

export function DashboardClient({ profile, user, subscription, preferences, initials }: DashboardClientProps) {
    const [cvData, setCvData] = useState<CVData | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

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

            // Create CVData object
            const newCvData: CVData = {
                ...result.cvData,
                uploadDate: new Date(result.cvData.uploadDate),
                status: 'processing' as const,
            };

            setCvData(newCvData);
            setIsUploading(false);

            // Simulate processing
            setIsProcessing(true);
            setTimeout(() => {
                setCvData(prev => prev ? { ...prev, status: 'completed' as const } : null);
                setIsProcessing(false);
            }, 2000);

        } catch (err) {
            console.error('File upload failed:', err);
            setError(err instanceof Error ? err.message : 'Upload failed');
            setIsUploading(false);
            setUploadProgress(0);
        }
    }, []);

    const handleFileRemove = useCallback(() => {
        setCvData(null);
        setError(null);
        setUploadProgress(0);
        setIsUploading(false);
        setIsProcessing(false);
    }, []);

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
                            <div className="text-2xl font-bold">{profile?.cvData?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                +2 from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
                            <Icons.mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{profile?.generatedContent?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                +12 from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saved Offers</CardTitle>
                            <Icons.bookmark className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                0
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Job offers saved
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* CV Display Form */}
                    <CVDisplay
                        cvData={cvData}
                        onFileUpload={handleFileUpload}
                        onFileRemove={handleFileRemove}
                        isProcessing={isProcessing}
                        error={error}
                        uploadProgress={uploadProgress}
                        isUploading={isUploading}
                    />

                    {/* Offers Display Form */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Icons.briefcase className="h-5 w-5" />
                                    Job Offers
                                </CardTitle>
                                <CardDescription>
                                    Browse and manage job opportunities
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Icons.briefcase className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">Frontend Developer</p>
                                                    <p className="text-xs text-muted-foreground">Tech Corp • Remote</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline">
                                                View
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Icons.briefcase className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">Full Stack Engineer</p>
                                                    <p className="text-xs text-muted-foreground">StartupXYZ • Hybrid</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline">
                                                View
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Icons.briefcase className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">React Developer</p>
                                                    <p className="text-xs text-muted-foreground">BigTech Inc • On-site</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline">
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                    <Button className="w-full" variant="outline">
                                        Browse More Offers
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
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
                                    <Icons.fileText className="mr-2 h-4 w-4" />
                                    Upload New CV
                                </Button>
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
                                <Button className="w-full justify-start" variant="outline">
                                    <Icons.user className="mr-2 h-4 w-4" />
                                    Update Profile
                                </Button>
                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <a href="/user/sessions">
                                        <Icons.bookmark className="mr-2 h-4 w-4" />
                                        View Saved Offers
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Account Status */}
                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Email Verified</span>
                                <Badge variant={user.email_confirmed_at ? 'default' : 'destructive'}>
                                    {user.email_confirmed_at ? 'Verified' : 'Pending'}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Plan</span>
                                <Badge variant={subscription.plan === 'free' ? 'secondary' : 'default'}>
                                    {subscription.plan}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Language</span>
                                <span className="text-sm text-muted-foreground">
                                    {preferences.language || 'English'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
