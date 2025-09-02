'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileText, Trash2 } from 'lucide-react';

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
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setCharacterCount(value.length);
    }, [value]);

    const handleMouseEnter = () => {
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
        }
        setShowTooltip(true);
        tooltipTimeoutRef.current = setTimeout(() => {
            setShowTooltip(false);
        }, 3000);
    };

    const handleMouseLeave = () => {
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
        }
        setShowTooltip(false);
    };

    useEffect(() => {
        return () => {
            if (tooltipTimeoutRef.current) {
                clearTimeout(tooltipTimeoutRef.current);
            }
        };
    }, []);

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
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Job Offer Input</h3>
                </div>
                {value && (
                    <button
                        onClick={onClear}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Clear content"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="space-y-3">
                <div className="relative">
                    <textarea
                        value={value}
                        onChange={handleChange}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        placeholder="Paste your job offer here...&#10;&#10;Include job title, company name, requirements, responsibilities, and any other relevant details from the job posting."
                        className={`w-full min-h-[120px] p-3 border rounded-lg resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out hover:min-h-[250px] hover:shadow-lg ${error
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                            }`}
                        style={{ minHeight: '120px', maxHeight: '400px' }}
                    />

                    {/* Tooltip */}
                    {showTooltip && (
                        <div className="absolute top-full left-0 mt-2 w-80 bg-gray-900 text-white text-sm rounded-lg p-4 shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-white mb-2">Analysis Tips:</h4>
                                <ul className="space-y-1 text-gray-200">
                                    <li>• <strong>Job Title:</strong> Include the specific position name</li>
                                    <li>• <strong>Company Information:</strong> Company name, size, industry</li>
                                    <li>• <strong>Key Responsibilities:</strong> Main duties and tasks</li>
                                    <li>• <strong>Required Skills:</strong> Technical and soft skills needed</li>
                                    <li>• <strong>Qualifications:</strong> Education, experience, certifications</li>
                                </ul>
                                <p className="text-xs text-gray-300 mt-3 pt-2 border-t border-gray-700">
                                    Minimum {MIN_LENGTH} characters required for analysis.
                                </p>
                            </div>
                            {/* Tooltip arrow */}
                            <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                    )}

                    {/* Character count */}
                    <div className="absolute bottom-3 right-3 text-xs">
                        <span className={getCharacterCountColor()}>
                            {characterCount}/{MAX_LENGTH}
                        </span>
                    </div>
                </div>



                {/* Error message */}
                {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        {error}
                    </div>
                )}


            </div>
        </div>
    );
}
