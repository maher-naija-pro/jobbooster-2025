'use client';

import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        setCharacterCount(value.length);
    }, [value]);

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
            <div className="flex items-center justify-between mb-4">
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

            <div className="space-y-4">
                <div className="relative">
                    <textarea
                        value={value}
                        onChange={handleChange}
                        placeholder="Paste your job offer here...&#10;&#10;Include job title, company name, requirements, responsibilities, and any other relevant details from the job posting."
                        className={`w-full min-h-[200px] p-4 border rounded-lg resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                            }`}
                        style={{ minHeight: '200px', maxHeight: '400px' }}
                    />

                    {/* Character count */}
                    <div className="absolute bottom-3 right-3 text-xs">
                        <span className={getCharacterCountColor()}>
                            {characterCount}/{MAX_LENGTH}
                        </span>
                    </div>
                </div>

                {/* Instructions */}
                <div className="text-sm text-gray-600 space-y-1">
                    <p>
                        <strong>Tips:</strong> Include the job title, company information, key responsibilities,
                        required skills, and qualifications from the job posting.
                    </p>
                    <p>
                        Minimum {MIN_LENGTH} characters required for analysis.
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        {error}
                    </div>
                )}

                {/* Success message */}
                {isValidLength && !error && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        Job description ready for analysis
                    </div>
                )}
            </div>
        </div>
    );
}
