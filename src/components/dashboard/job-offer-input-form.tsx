'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { JobOfferInput } from '../job-offer-input';
import { useJobData } from '@/hooks/useJobData';
import { Icons } from '../icons';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AlertCircle, CheckCircle, Building2, Link, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobOfferInputFormProps {
    className?: string;
}

interface FieldValidation {
    isValid: boolean;
    error?: string;
    success?: string;
}

interface FormValidation {
    title: FieldValidation;
    company: FieldValidation;
    jobLink: FieldValidation;
    content: FieldValidation;
}

export function JobOfferInputForm({ className }: JobOfferInputFormProps) {
    const [newJobContent, setNewJobContent] = useState('');
    const [newJobTitle, setNewJobTitle] = useState('');
    const [newJobCompany, setNewJobCompany] = useState('');
    const [newJobLink, setNewJobLink] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FormValidation>({
        title: { isValid: true },
        company: { isValid: true },
        jobLink: { isValid: true },
        content: { isValid: true }
    });
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

    const { createJobData } = useJobData({ limit: 1 });

    // Validation functions
    const validateTitle = useCallback((value: string): FieldValidation => {
        if (!value.trim()) {
            return { isValid: true }; // Optional field
        }
        if (value.trim().length < 2) {
            return { isValid: false, error: 'Job title must be at least 2 characters long' };
        }
        if (value.trim().length > 100) {
            return { isValid: false, error: 'Job title must be less than 100 characters' };
        }
        return { isValid: true, success: 'Valid job title' };
    }, []);

    const validateCompany = useCallback((value: string): FieldValidation => {
        if (!value.trim()) {
            return { isValid: true }; // Optional field
        }
        if (value.trim().length < 2) {
            return { isValid: false, error: 'Company name must be at least 2 characters long' };
        }
        if (value.trim().length > 100) {
            return { isValid: false, error: 'Company name must be less than 100 characters' };
        }
        return { isValid: true, success: 'Valid company name' };
    }, []);

    const validateJobLink = useCallback((value: string): FieldValidation => {
        if (!value.trim()) {
            return { isValid: true }; // Optional field
        }
        const urlPattern = /^https?:\/\/.+\..+/;
        if (!urlPattern.test(value.trim())) {
            return { isValid: false, error: 'Please enter a valid URL (e.g., https://company.com/jobs/123)' };
        }
        return { isValid: true, success: 'Valid job link' };
    }, []);

    const validateContent = useCallback((value: string): FieldValidation => {
        if (!value.trim()) {
            return { isValid: false, error: 'Job content is required' };
        }
        if (value.trim().length < 100) {
            return { isValid: false, error: `Job content must be at least 100 characters long (${value.trim().length}/100)` };
        }
        if (value.trim().length > 10000) {
            return { isValid: false, error: 'Job content must be less than 10,000 characters' };
        }
        return { isValid: true, success: 'Valid job content' };
    }, []);

    // Field change handlers with validation
    const handleFieldChange = useCallback((field: keyof FormValidation, value: string, validator: (value: string) => FieldValidation) => {
        const validation = validator(value);
        setFieldErrors(prev => ({
            ...prev,
            [field]: validation
        }));
    }, []);

    const handleFieldBlur = useCallback((field: keyof FormValidation) => {
        setTouchedFields(prev => new Set(prev).add(field));
    }, []);

    const handleSaveJobOffer = async () => {
        // Validate all fields
        const titleValidation = validateTitle(newJobTitle);
        const companyValidation = validateCompany(newJobCompany);
        const linkValidation = validateJobLink(newJobLink);
        const contentValidation = validateContent(newJobContent);

        setFieldErrors({
            title: titleValidation,
            company: companyValidation,
            jobLink: linkValidation,
            content: contentValidation
        });

        // Mark all fields as touched
        setTouchedFields(new Set(['title', 'company', 'jobLink', 'content']));

        // Check if form is valid
        if (!contentValidation.isValid) {
            setSaveError('Please fix the validation errors before saving');
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
            setFieldErrors({
                title: { isValid: true },
                company: { isValid: true },
                jobLink: { isValid: true },
                content: { isValid: true }
            });
            setTouchedFields(new Set());

            // Trigger refresh of job offers display
            window.dispatchEvent(new CustomEvent('jobOfferCreated'));
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : 'Failed to save job offer');
        } finally {
            setIsSaving(false);
        }
    };

    // Helper function to render field validation message
    const renderFieldMessage = (field: keyof FormValidation, fieldName: string) => {
        const validation = fieldErrors[field];
        const isTouched = touchedFields.has(field);

        if (!isTouched && !validation.error) return null;

        return (
            <div className="mt-1">
                {validation.error && (
                    <div className="flex items-center text-sm text-red-600" role="alert" aria-live="polite">
                        <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
                        <span>{validation.error}</span>
                    </div>
                )}
                {validation.success && !validation.error && (
                    <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
                        <span>{validation.success}</span>
                    </div>
                )}
            </div>
        );
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
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Job Title Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="job-title"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                            <Briefcase className="w-4 h-4 text-gray-500" aria-hidden="true" />
                            Job Title (Optional)
                        </Label>
                        <div className="relative">
                            <Input
                                id="job-title"
                                type="text"
                                value={newJobTitle}
                                onChange={(e) => {
                                    setNewJobTitle(e.target.value);
                                    handleFieldChange('title', e.target.value, validateTitle);
                                }}
                                onBlur={() => handleFieldBlur('title')}
                                placeholder="e.g., Senior Frontend Developer"
                                className={cn(
                                    "pl-10 transition-all duration-200",
                                    fieldErrors.title.error && touchedFields.has('title') && "border-red-300 focus:border-red-500 focus:ring-red-500",
                                    fieldErrors.title.success && !fieldErrors.title.error && "border-green-300 focus:border-green-500 focus:ring-green-500"
                                )}
                                aria-invalid={fieldErrors.title.error ? 'true' : 'false'}
                                aria-describedby={fieldErrors.title.error ? 'job-title-error' : fieldErrors.title.success ? 'job-title-success' : undefined}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Briefcase className="w-4 h-4 text-gray-400" aria-hidden="true" />
                            </div>
                        </div>
                        {renderFieldMessage('title', 'Job Title')}
                    </div>

                    {/* Company Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="company"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                            <Building2 className="w-4 h-4 text-gray-500" aria-hidden="true" />
                            Company (Optional)
                        </Label>
                        <div className="relative">
                            <Input
                                id="company"
                                type="text"
                                value={newJobCompany}
                                onChange={(e) => {
                                    setNewJobCompany(e.target.value);
                                    handleFieldChange('company', e.target.value, validateCompany);
                                }}
                                onBlur={() => handleFieldBlur('company')}
                                placeholder="e.g., Tech Corp"
                                className={cn(
                                    "pl-10 transition-all duration-200",
                                    fieldErrors.company.error && touchedFields.has('company') && "border-red-300 focus:border-red-500 focus:ring-red-500",
                                    fieldErrors.company.success && !fieldErrors.company.error && "border-green-300 focus:border-green-500 focus:ring-green-500"
                                )}
                                aria-invalid={fieldErrors.company.error ? 'true' : 'false'}
                                aria-describedby={fieldErrors.company.error ? 'company-error' : fieldErrors.company.success ? 'company-success' : undefined}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building2 className="w-4 h-4 text-gray-400" aria-hidden="true" />
                            </div>
                        </div>
                        {renderFieldMessage('company', 'Company')}
                    </div>
                </div>

                {/* Job Link Field */}
                <div className="space-y-2">
                    <Label
                        htmlFor="job-link"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                        <Link className="w-4 h-4 text-gray-500" aria-hidden="true" />
                        Job Link (Optional)
                    </Label>
                    <div className="relative">
                        <Input
                            id="job-link"
                            type="url"
                            value={newJobLink}
                            onChange={(e) => {
                                setNewJobLink(e.target.value);
                                handleFieldChange('jobLink', e.target.value, validateJobLink);
                            }}
                            onBlur={() => handleFieldBlur('jobLink')}
                            placeholder="e.g., https://company.com/jobs/123"
                            className={cn(
                                "pl-10 transition-all duration-200",
                                fieldErrors.jobLink.error && touchedFields.has('jobLink') && "border-red-300 focus:border-red-500 focus:ring-red-500",
                                fieldErrors.jobLink.success && !fieldErrors.jobLink.error && "border-green-300 focus:border-green-500 focus:ring-green-500"
                            )}
                            aria-invalid={fieldErrors.jobLink.error ? 'true' : 'false'}
                            aria-describedby={fieldErrors.jobLink.error ? 'job-link-error' : fieldErrors.jobLink.success ? 'job-link-success' : undefined}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Link className="w-4 h-4 text-gray-400" aria-hidden="true" />
                        </div>
                    </div>
                    {renderFieldMessage('jobLink', 'Job Link')}
                </div>

                {/* Job Content Field */}
                <div className="space-y-2">
                    <JobOfferInput
                        value={newJobContent}
                        onChange={(value) => {
                            setNewJobContent(value);
                            handleFieldChange('content', value, validateContent);
                        }}
                        onClear={() => {
                            setNewJobContent('');
                            handleFieldChange('content', '', validateContent);
                        }}
                        error={fieldErrors.content.error && touchedFields.has('content') ? fieldErrors.content.error : saveError}
                        onSave={handleSaveJobOffer}
                        isSaving={isSaving}
                        showSaveButton={true}
                        className="w-full"
                    />
                    {fieldErrors.content.success && !fieldErrors.content.error && (
                        <div className="flex items-center text-sm text-green-600">
                            <CheckCircle className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
                            <span>{fieldErrors.content.success}</span>
                        </div>
                    )}
                </div>

                {/* Error Display */}
                {saveError && (
                    <Alert variant="destructive" role="alert" aria-live="polite">
                        <AlertCircle className="h-4 w-4" aria-hidden="true" />
                        <AlertDescription>{saveError}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
