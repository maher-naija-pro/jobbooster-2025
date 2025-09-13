'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { JobOfferInput } from '../job-offer-input';
import { useJobData } from '@/hooks/useJobData';
import { Icons } from '../icons';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AlertCircle, CheckCircle, Building2, Link, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props interface for the AddJobOfferModal component
 */
interface AddJobOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

/**
 * Field validation interface
 */
interface FieldValidation {
    isValid: boolean;
    error?: string;
    success?: string;
}

/**
 * Form validation interface
 */
interface FormValidation {
    title: FieldValidation;
    company: FieldValidation;
    jobLink: FieldValidation;
    content: FieldValidation;
}

/**
 * AddJobOfferModal Component
 * 
 * A modal component that allows users to add new job offers.
 * Uses the same form logic as JobOfferInputForm but in a modal dialog.
 * 
 * @param isOpen - Whether the modal is open
 * @param onClose - Function to call when modal should be closed
 * @param className - Optional CSS class name for styling
 * @returns JSX element containing the modal dialog
 */
export function AddJobOfferModal({ isOpen, onClose, className }: AddJobOfferModalProps) {
    // Form state
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

    // Custom hook for job data operations
    const { createJobData } = useJobData({ limit: 1 });

    /**
     * Validates job title field
     * @param value - The title value to validate
     * @returns Validation result
     */
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

    /**
     * Validates company field
     * @param value - The company value to validate
     * @returns Validation result
     */
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

    /**
     * Validates job link field
     * @param value - The job link value to validate
     * @returns Validation result
     */
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

    /**
     * Validates job content field
     * @param value - The content value to validate
     * @returns Validation result
     */
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

    /**
     * Handles field changes with validation
     * @param field - The field being changed
     * @param value - The new value
     * @param validator - The validation function to use
     */
    const handleFieldChange = useCallback((field: keyof FormValidation, value: string, validator: (value: string) => FieldValidation) => {
        const validation = validator(value);
        setFieldErrors(prev => ({
            ...prev,
            [field]: validation
        }));
    }, []);

    /**
     * Handles field blur events
     * @param field - The field that lost focus
     */
    const handleFieldBlur = useCallback((field: keyof FormValidation) => {
        setTouchedFields(prev => new Set(prev).add(field));
    }, []);

    /**
     * Handles saving the job offer
     */
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

            // Close modal
            onClose();
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : 'Failed to save job offer');
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Handles modal close with form reset
     */
    const handleClose = useCallback(() => {
        // Reset form when closing
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
        setSaveError(null);
        setIsSaving(false);
        onClose();
    }, [onClose]);

    /**
     * Renders field validation message
     * @param field - The field to render message for
     * @param fieldName - The display name of the field
     * @returns JSX element with validation message
     */
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
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${className}`}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
                            <Icons.briefcase className="h-6 w-6 text-white" aria-hidden="true" />
                        </div>
                        Add Job Offer
                    </DialogTitle>
                    <DialogDescription className="text-slate-600 text-base">
                        Save a new job offer for analysis and tracking
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Job Title Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="modal-job-title"
                                className="text-sm font-medium text-gray-700 flex items-center gap-2"
                            >
                                <Briefcase className="w-4 h-4 text-gray-500" aria-hidden="true" />
                                Job Title (Optional)
                            </Label>
                            <div className="relative">
                                <Input
                                    id="modal-job-title"
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
                                    aria-describedby={fieldErrors.title.error ? 'modal-job-title-error' : fieldErrors.title.success ? 'modal-job-title-success' : undefined}
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
                                htmlFor="modal-company"
                                className="text-sm font-medium text-gray-700 flex items-center gap-2"
                            >
                                <Building2 className="w-4 h-4 text-gray-500" aria-hidden="true" />
                                Company (Optional)
                            </Label>
                            <div className="relative">
                                <Input
                                    id="modal-company"
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
                                    aria-describedby={fieldErrors.company.error ? 'modal-company-error' : fieldErrors.company.success ? 'modal-company-success' : undefined}
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
                            htmlFor="modal-job-link"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                            <Link className="w-4 h-4 text-gray-500" aria-hidden="true" />
                            Job Link (Optional)
                        </Label>
                        <div className="relative">
                            <Input
                                id="modal-job-link"
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
                                aria-describedby={fieldErrors.jobLink.error ? 'modal-job-link-error' : fieldErrors.jobLink.success ? 'modal-job-link-success' : undefined}
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
                            showSaveButton={false}
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

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-3 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSaveJobOffer}
                            disabled={isSaving || !newJobContent.trim()}
                            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                        >
                            {isSaving ? 'Saving...' : 'Save Job Offer'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
