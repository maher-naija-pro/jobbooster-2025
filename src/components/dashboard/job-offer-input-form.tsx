'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { JobOfferInput } from '../job-offer-input';
import { useJobData } from '@/hooks/useJobData';
import { Icons } from '../icons';

interface JobOfferInputFormProps {
    className?: string;
}

export function JobOfferInputForm({ className }: JobOfferInputFormProps) {
    const [newJobContent, setNewJobContent] = useState('');
    const [newJobTitle, setNewJobTitle] = useState('');
    const [newJobCompany, setNewJobCompany] = useState('');
    const [newJobLink, setNewJobLink] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const { createJobData } = useJobData({ limit: 1 });

    const handleSaveJobOffer = async () => {
        if (!newJobContent.trim() || newJobContent.length < 100) {
            setSaveError('Job content must be at least 100 characters long');
            return;
        }

        try {
            setIsSaving(true);
            setSaveError(null);

            await createJobData({
                content: newJobContent.trim(),
                title: newJobTitle.trim() || undefined,
                company: newJobCompany.trim() || undefined,
                jobLink: newJobLink.trim() || undefined,
            });

            // Reset form
            setNewJobContent('');
            setNewJobTitle('');
            setNewJobCompany('');
            setNewJobLink('');
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : 'Failed to save job offer');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className={`h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm ${className}`}>
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
                        <Icons.briefcase className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    Add Job Offer
                </CardTitle>
                <CardDescription className="text-slate-600 text-base">
                    Save a new job offer for analysis
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Job Title (Optional)
                        </label>
                        <input
                            type="text"
                            value={newJobTitle}
                            onChange={(e) => setNewJobTitle(e.target.value)}
                            placeholder="e.g., Senior Frontend Developer"
                            className="w-full p-2 border rounded-md text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Company (Optional)
                        </label>
                        <input
                            type="text"
                            value={newJobCompany}
                            onChange={(e) => setNewJobCompany(e.target.value)}
                            placeholder="e.g., Tech Corp"
                            className="w-full p-2 border rounded-md text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Job Link (Optional)
                        </label>
                        <input
                            type="url"
                            value={newJobLink}
                            onChange={(e) => setNewJobLink(e.target.value)}
                            placeholder="e.g., https://company.com/jobs/123"
                            className="w-full p-2 border rounded-md text-sm"
                        />
                    </div>
                </div>

                <JobOfferInput
                    value={newJobContent}
                    onChange={setNewJobContent}
                    onClear={() => setNewJobContent('')}
                    error={saveError}
                    onSave={handleSaveJobOffer}
                    isSaving={isSaving}
                    showSaveButton={true}
                    className="w-full"
                />

                {/* Error Display */}
                {saveError && (
                    <Alert variant="destructive">
                        <AlertDescription>{saveError}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
