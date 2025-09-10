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
const WARNING_THRESHOLD = 8000; // Show warning when approaching max length

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
    const [characterCount, setCharacterCount] = useState(0);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [showValidation, setShowValidation] = useState(false);

    // Memoized validation state
    const validationState = useMemo(() => {
        const trimmedLength = value.trim().length;
        const isValid = trimmedLength >= MIN_LENGTH && trimmedLength <= MAX_LENGTH;
        const isWarning = trimmedLength > WARNING_THRESHOLD && trimmedLength < MAX_LENGTH;
        const isError = trimmedLength > MAX_LENGTH || (isTouched && trimmedLength < MIN_LENGTH);

        return {
            isValid,
            isWarning,
            isError,
            progress: Math.min((trimmedLength / MIN_LENGTH) * 100, 100),
            remaining: MAX_LENGTH - trimmedLength,
            isNearLimit: trimmedLength > WARNING_THRESHOLD
        };
    }, [value, isTouched]);

    useEffect(() => {
        setCharacterCount(value.length);
    }, [value]);

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

        if (validationState.isNearLimit) {
            return {
                type: 'warning',
                message: `${validationState.remaining} characters remaining`,
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
            <div className="flex items-center justify-between mb-4">
                <Label
                    htmlFor="job-content"
                    className="text-sm font-semibold text-gray-900 flex items-center gap-2"
                >
                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                        <FileText className="w-3 h-3 text-blue-600" aria-hidden="true" />
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
                        className="px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg font-medium"
                        tooltip="Clear content"
                    />
                )}
            </div>

            <div className="space-y-4">
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
                                    "w-full min-h-[200px] p-4 border-2 rounded-lg resize-vertical transition-all duration-300",
                                    "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none",
                                    "hover:shadow-md hover:border-gray-400",
                                    "text-sm leading-relaxed font-medium",
                                    "placeholder:text-gray-400 placeholder:font-normal",
                                    // Validation states
                                    validationState.isError && "border-red-400 focus:ring-red-500/20 focus:border-red-500",
                                    validationState.isWarning && !validationState.isError && "border-yellow-400 focus:ring-yellow-500/20 focus:border-yellow-500",
                                    validationState.isValid && !validationState.isWarning && "border-green-400 focus:ring-green-500/20 focus:border-green-500",
                                    !validationState.isError && !validationState.isWarning && !validationState.isValid && "border-gray-300 focus:border-blue-500"
                                )}
                                style={{ minHeight: '200px', maxHeight: '400px' }}
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

                {/* Modern Progress Bar and Character Count */}
                {value && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-700">
                            <span className="font-medium">Character count: {characterCount}</span>
                            <span className={cn(
                                "font-semibold",
                                validationState.isNearLimit && "text-yellow-600",
                                validationState.isError && "text-red-600"
                            )}>
                                {validationState.remaining < 0 ? `Over by ${Math.abs(validationState.remaining)}` : `${validationState.remaining} remaining`}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className={cn(
                                    "h-3 rounded-full transition-all duration-500 ease-out",
                                    validationState.isError && "bg-gradient-to-r from-red-500 to-red-600",
                                    validationState.isWarning && !validationState.isError && "bg-gradient-to-r from-yellow-500 to-yellow-600",
                                    validationState.isValid && !validationState.isWarning && "bg-gradient-to-r from-green-500 to-green-600",
                                    !validationState.isError && !validationState.isWarning && !validationState.isValid && "bg-gradient-to-r from-blue-500 to-blue-600"
                                )}
                                style={{ width: `${Math.min(validationState.progress, 100)}%` }}
                                role="progressbar"
                                aria-valuenow={validationState.progress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`Character count progress: ${Math.round(validationState.progress)}%`}
                            />
                        </div>
                    </div>
                )}

                {/* Modern Validation Message */}
                {validationMessage && (
                    <div
                        id="job-content-validation"
                        className={cn(
                            "flex items-center gap-3 text-sm p-4 rounded-xl transition-all duration-300 shadow-sm",
                            validationMessage.type === 'error' && "bg-red-50 text-red-800 border-2 border-red-200",
                            validationMessage.type === 'warning' && "bg-yellow-50 text-yellow-800 border-2 border-yellow-200",
                            validationMessage.type === 'success' && "bg-green-50 text-green-800 border-2 border-green-200",
                            validationMessage.type === 'info' && "bg-blue-50 text-blue-800 border-2 border-blue-200"
                        )}
                        role="alert"
                        aria-live="polite"
                    >
                        <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                            validationMessage.type === 'error' && "bg-red-100",
                            validationMessage.type === 'warning' && "bg-yellow-100",
                            validationMessage.type === 'success' && "bg-green-100",
                            validationMessage.type === 'info' && "bg-blue-100"
                        )}>
                            <validationMessage.icon className="w-4 h-4" aria-hidden="true" />
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
