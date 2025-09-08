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
            {/* Header with Label and Clear Button */}
            <div className="flex items-center justify-between mb-3">
                <Label
                    htmlFor="job-content"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                    <FileText className="w-4 h-4 text-gray-500" aria-hidden="true" />
                    Job Offer Content
                </Label>
                {value && (
                    <MetaButton
                        onClick={handleClear}
                        variant="danger-ghost"
                        size="sm"
                        width="fit"
                        showIcon={false}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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
                                    "w-full min-h-[300px] p-4 border rounded-lg resize-vertical transition-all duration-200",
                                    "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                    "hover:shadow-md hover:border-gray-400",
                                    "text-sm leading-relaxed",
                                    // Validation states
                                    validationState.isError && "border-red-300 focus:ring-red-500",
                                    validationState.isWarning && !validationState.isError && "border-yellow-300 focus:ring-yellow-500",
                                    validationState.isValid && !validationState.isWarning && "border-green-300 focus:ring-green-500",
                                    !validationState.isError && !validationState.isWarning && !validationState.isValid && "border-gray-300 focus:border-blue-500"
                                )}
                                style={{ minHeight: '200px', maxHeight: '600px' }}
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

                {/* Progress Bar and Character Count */}
                {value && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Character count: {characterCount}</span>
                            <span className={cn(
                                validationState.isNearLimit && "text-yellow-600 font-medium",
                                validationState.isError && "text-red-600 font-medium"
                            )}>
                                {validationState.remaining < 0 ? `Over by ${Math.abs(validationState.remaining)}` : `${validationState.remaining} remaining`}
                            </span>
                        </div>
                        <Progress
                            value={validationState.progress}
                            className={cn(
                                "h-2",
                                validationState.isError && "bg-red-100",
                                validationState.isWarning && !validationState.isError && "bg-yellow-100",
                                validationState.isValid && !validationState.isWarning && "bg-green-100"
                            )}
                        />
                    </div>
                )}

                {/* Validation Message */}
                {validationMessage && (
                    <div
                        id="job-content-validation"
                        className={cn(
                            "flex items-center gap-2 text-sm p-3 rounded-md transition-all duration-200",
                            validationMessage.type === 'error' && "bg-red-50 text-red-700 border border-red-200",
                            validationMessage.type === 'warning' && "bg-yellow-50 text-yellow-700 border border-yellow-200",
                            validationMessage.type === 'success' && "bg-green-50 text-green-700 border border-green-200",
                            validationMessage.type === 'info' && "bg-blue-50 text-blue-700 border border-blue-200"
                        )}
                        role="alert"
                        aria-live="polite"
                    >
                        <validationMessage.icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                        <span>{validationMessage.message}</span>
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
