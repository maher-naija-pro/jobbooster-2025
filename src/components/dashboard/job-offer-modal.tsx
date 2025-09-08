'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { JobOfferInput } from '../job-offer-input';
import { useJobData } from '@/hooks/useJobData';
import { Icons } from '../icons';

interface JobOfferModalProps {
    children: React.ReactNode;
    className?: string;
}

export function JobOfferModal({ children, className }: JobOfferModalProps) {
    const [newJobContent, setNewJobContent] = useState('');
    const [newJobTitle, setNewJobTitle] = useState('');
    const [newJobCompany, setNewJobCompany] = useState('');
    const [newJobLink, setNewJobLink] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const { createJobData } = useJobData();

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

            // Reset form and close modal
            setNewJobContent('');
            setNewJobTitle('');
            setNewJobCompany('');
            setNewJobLink('');
            setIsOpen(false);
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : 'Failed to save job offer');
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            // Reset form when closing
            setNewJobContent('');
            setNewJobTitle('');
            setNewJobCompany('');
            setNewJobLink('');
            setSaveError(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="p-2 bg-purple-500 rounded-lg">
                            <Icons.briefcase className="h-5 w-5 text-white" />
                        </div>
                        Add Job Offer
                    </DialogTitle>
                    <DialogDescription className="text-slate-600 mt-1">
                        Save a new job offer for AI-powered analysis and content generation
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="job-title"
                                className="text-sm font-semibold text-slate-700 mb-2 block"
                            >
                                Job Title (Optional)
                            </label>
                            <input
                                id="job-title"
                                type="text"
                                value={newJobTitle}
                                onChange={(e) => setNewJobTitle(e.target.value)}
                                placeholder="e.g., Senior Frontend Developer"
                                className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                aria-describedby="job-title-help"
                            />
                            <p id="job-title-help" className="text-xs text-slate-500 mt-1">
                                Enter the specific job title or role
                            </p>
                        </div>
                        <div>
                            <label
                                htmlFor="company"
                                className="text-sm font-semibold text-slate-700 mb-2 block"
                            >
                                Company (Optional)
                            </label>
                            <input
                                id="company"
                                type="text"
                                value={newJobCompany}
                                onChange={(e) => setNewJobCompany(e.target.value)}
                                placeholder="e.g., Tech Corp"
                                className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                aria-describedby="company-help"
                            />
                            <p id="company-help" className="text-xs text-slate-500 mt-1">
                                Name of the hiring company
                            </p>
                        </div>
                        <div>
                            <label
                                htmlFor="job-link"
                                className="text-sm font-semibold text-slate-700 mb-2 block"
                            >
                                Job Link (Optional)
                            </label>
                            <input
                                id="job-link"
                                type="url"
                                value={newJobLink}
                                onChange={(e) => setNewJobLink(e.target.value)}
                                placeholder="e.g., https://company.com/jobs/123"
                                className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                aria-describedby="job-link-help"
                            />
                            <p id="job-link-help" className="text-xs text-slate-500 mt-1">
                                Direct link to the job posting
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Icons.fileText className="h-4 w-4" />
                            Job Offer Content
                        </label>
                        <JobOfferInput
                            value={newJobContent}
                            onChange={setNewJobContent}
                            onClear={() => setNewJobContent('')}
                            error={saveError}
                            className="w-full"
                            onSave={handleSaveJobOffer}
                            isSaving={isSaving}
                            showSaveButton={false}
                        />
                    </div>

                    {saveError && (
                        <Alert variant="destructive">
                            <AlertDescription>{saveError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveJobOffer}
                            disabled={isSaving || !newJobContent.trim() || newJobContent.length < 100}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            {isSaving ? (
                                <>
                                    <Icons.loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Icons.zap className="h-4 w-4 mr-2" />
                                    Save Job Offer
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
