'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FileText, Trash2, Upload, Sparkles, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { MetaButton } from './buttons/meta-button';
import { Alert, AlertDescription } from './ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

interface JobOfferInputProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
    error: string | null;
    className?: string;
    onSave?: () => void;
    isSaving?: boolean;
    showSaveButton?: boolean;
    onBlur?: () => void;
    onFocus?: () => void;
}

const MIN_LENGTH = 100;
const MAX_LENGTH = 10000;

export function JobOfferInput({
    value,
    onChange,
    onClear,
    error,
    className,
    onSave,
    isSaving = false,
    showSaveButton = false,
    onBlur,
    onFocus
}: JobOfferInputProps) {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [showValidation, setShowValidation] = useState(false);

    // Memoized validation state
    const validationState = useMemo(() => {
        const trimmedLength = value.trim().length;
        const isValid = trimmedLength >= MIN_LENGTH && trimmedLength <= MAX_LENGTH;
        const isError = trimmedLength > MAX_LENGTH || (isTouched && trimmedLength < MIN_LENGTH);

        return {
            isValid,
            isError
        };
    }, [value, isTouched]);


    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isTooltipOpen) {
            timer = setTimeout(() => {
                setIsTooltipOpen(false);
            }, 3000);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [isTooltipOpen]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        // Show validation after user starts typing
        if (!showValidation && newValue.length > 0) {
            setShowValidation(true);
        }
    }, [onChange, showValidation]);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
        onFocus?.();
    }, [onFocus]);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        setIsTouched(true);
        onBlur?.();
    }, [onBlur]);

    const handleClear = useCallback(() => {
        onClear();
        setIsTouched(false);
        setShowValidation(false);
    }, [onClear]);

    const getValidationMessage = useCallback(() => {
        if (!showValidation && !isTouched) return null;

        const trimmedLength = value.trim().length;

        if (trimmedLength === 0) {
            return {
                type: 'info',
                message: 'Paste your job offer content here',
                icon: FileText
            };
        }

        if (trimmedLength < MIN_LENGTH) {
            return {
                type: 'error',
                message: `Minimum ${MIN_LENGTH} characters required (${trimmedLength}/${MIN_LENGTH})`,
                icon: AlertCircle
            };
        }

        if (trimmedLength > MAX_LENGTH) {
            return {
                type: 'error',
                message: `Maximum ${MAX_LENGTH} characters exceeded (${trimmedLength}/${MAX_LENGTH})`,
                icon: AlertCircle
            };
        }


        return {
            type: 'success',
            message: 'Content looks good for analysis',
            icon: CheckCircle
        };
    }, [showValidation, isTouched, value, validationState]);

    const validationMessage = getValidationMessage();

    return (
        <div className={className}>
            {/* Modern Header with Label and Clear Button */}
            <div className="flex items-center justify-between mb-1.5">
                <Label
                    htmlFor="job-content"
                    className="text-xs font-semibold text-gray-900 flex items-center gap-1"
                >
                    <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                        <FileText className="w-2.5 h-2.5 text-blue-600" aria-hidden="true" />
                    </div>
                    Job Offer Content
                </Label>
                {value && (
                    <MetaButton
                        onClick={handleClear}
                        variant="danger-ghost"
                        size="sm"
                        width="fit"
                        showIcon={false}
                        className="px-1.5 py-0.5 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded font-medium text-xs"
                        tooltip="Clear content"
                    />
                )}
            </div>

            <div className="space-y-1.5">
                {/* Textarea with Enhanced Styling */}
                <div className="relative">
                    <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                        <TooltipTrigger asChild>
                            <textarea
                                id="job-content"
                                value={value}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onMouseEnter={() => setIsTooltipOpen(true)}
                                onMouseLeave={() => setIsTooltipOpen(false)}
                                placeholder="Paste your job offer here...&#10;&#10;Include job title, company name, requirements, responsibilities, and any other relevant details from the job posting."
                                className={cn(
                                    "w-full min-h-[80px] p-1.5 border rounded resize-vertical transition-all duration-300",
                                    "focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none",
                                    "hover:shadow-sm hover:border-gray-400",
                                    "text-xs leading-relaxed font-medium",
                                    "placeholder:text-gray-400 placeholder:font-normal",
                                    // Validation states
                                    validationState.isError && "border-red-400 focus:ring-red-500/20 focus:border-red-500",
                                    validationState.isValid && !validationState.isError && "border-green-400 focus:ring-green-500/20 focus:border-green-500",
                                    !validationState.isError && !validationState.isValid && "border-gray-300 focus:border-blue-500"
                                )}
                                style={{ minHeight: '80px', maxHeight: '150px' }}
                                aria-invalid={validationState.isError ? 'true' : 'false'}
                                aria-describedby={validationMessage ? 'job-content-validation' : undefined}
                            />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-sm">
                            <div className="space-y-2">
                                <h4 className="font-semibold mb-2">Analysis Tips:</h4>
                                <ul className="space-y-1 text-sm">
                                    <li>• <strong>Job Title:</strong> Include the specific position name</li>
                                    <li>• <strong>Company Information:</strong> Company name, size, industry</li>
                                    <li>• <strong>Key Responsibilities:</strong> Main duties and tasks</li>
                                    <li>• <strong>Required Skills:</strong> Technical and soft skills needed</li>
                                    <li>• <strong>Qualifications:</strong> Education, experience, certifications</li>
                                </ul>
                                <p className="text-xs mt-3 pt-2 border-t">
                                    Minimum {MIN_LENGTH} characters required for analysis.
                                </p>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </div>


                {/* Modern Validation Message */}
                {validationMessage && (
                    <div
                        id="job-content-validation"
                        className={cn(
                            "flex items-center gap-1.5 text-xs p-1.5 rounded transition-all duration-300 shadow-sm",
                            validationMessage.type === 'error' && "bg-red-50 text-red-800 border border-red-200",
                            validationMessage.type === 'success' && "bg-green-50 text-green-800 border border-green-200",
                            validationMessage.type === 'info' && "bg-blue-50 text-blue-800 border border-blue-200"
                        )}
                        role="alert"
                        aria-live="polite"
                    >
                        <div className={cn(
                            "w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0",
                            validationMessage.type === 'error' && "bg-red-100",
                            validationMessage.type === 'success' && "bg-green-100",
                            validationMessage.type === 'info' && "bg-blue-100"
                        )}>
                            <validationMessage.icon className="w-2.5 h-2.5" aria-hidden="true" />
                        </div>
                        <span className="font-medium">{validationMessage.message}</span>
                    </div>
                )}

                {/* Save Button */}
                {showSaveButton && onSave && (
                    <div className="flex justify-end pt-2">
                        <MetaButton
                            onClick={onSave}
                            disabled={!validationState.isValid || isSaving}
                            isLoading={isSaving}
                            loadingText="Saving..."
                            size="sm"
                            width="fit"
                            variant="primary"
                            showIcon={false}
                            text="Save Job Offer"
                            className="min-w-[120px]"
                        />
                    </div>
                )}

                {/* Error message (for external errors) */}
                {error && !validationMessage && (
                    <Alert variant="destructive" role="alert" aria-live="polite">
                        <AlertCircle className="h-4 w-4" aria-hidden="true" />
                        <AlertDescription id="job-content-error">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}
