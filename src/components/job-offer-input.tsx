'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface JobOfferInputProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
    error: string | null;
    className?: string;
}

const MAX_LENGTH = 5000;
const MIN_LENGTH = 100;

export function JobOfferInput({
    value,
    onChange,
    onClear,
    error,
    className
}: JobOfferInputProps) {
    const [characterCount, setCharacterCount] = useState(0);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

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

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (newValue.length <= MAX_LENGTH) {
            onChange(newValue);
        }
    };

    const getCharacterCountColor = () => {
        if (characterCount < MIN_LENGTH) return 'text-red-600';
        if (characterCount > MAX_LENGTH * 0.9) return 'text-orange-600';
        return 'text-gray-600';
    };

    const isValidLength = characterCount >= MIN_LENGTH && characterCount <= MAX_LENGTH;

    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                    <FileText className="w-2 h-2 text-gray-600" />
                    <h3 className="text-xs font-semibold text-gray-900">Job Offer Input</h3>
                </div>
                {value && (
                    <Button
                        onClick={onClear}
                        variant="ghost"
                        size="sm"
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                <div className="relative">
                    <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                        <TooltipTrigger asChild>
                            <textarea
                                value={value}
                                onChange={handleChange}
                                onMouseEnter={() => setIsTooltipOpen(true)}
                                onMouseLeave={() => setIsTooltipOpen(false)}
                                placeholder="Paste your job offer here...&#10;&#10;Include job title, company name, requirements, responsibilities, and any other relevant details from the job posting."
                                className={`w-full min-h-[80px] p-2 border rounded-md resize-vertical focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out hover:min-h-[120px] hover:shadow-md text-sm ${error
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:border-blue-500'
                                    }`}
                                style={{ minHeight: '80px', maxHeight: '200px' }}
                            />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-sm">
                            <div className="space-y-2">
                                <h4 className="font-semibold mb-2">Analysis Tips:</h4>
                                <ul className="space-y-1">
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

                    {/* Character count */}
                    <div className="absolute bottom-2 right-2 text-xs">
                        <span className={`text-xs ${getCharacterCountColor()}`}>
                            {characterCount}/{MAX_LENGTH}
                        </span>
                    </div>
                </div>



                {/* Error message */}
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                )}


            </div>
        </div>
    );
}
