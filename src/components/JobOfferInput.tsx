'use client';

import { useCallback } from 'react';
import { FileText, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../lib/context';
import type { JobAnalysis } from '../lib/types';

interface JobOfferInputProps {
    jobContent?: string;
    jobAnalysis?: JobAnalysis | null;
    jobAnalysisState?: 'idle' | 'analyzing' | 'complete' | 'error';
    jobAnalysisError?: string | null;
    maxLength?: number;
    minLength?: number;
}

export function JobOfferInput({
    jobContent = '',
    jobAnalysis = null,
    jobAnalysisState = 'idle',
    jobAnalysisError = null,
    maxLength = 5000,
    minLength = 100
}: JobOfferInputProps) {
    const { setJobContent, clearJobContent, setJobAnalysisState, setJobAnalysis } = useApp();

    const handleContentChange = useCallback((value: string) => {
        setJobContent(value);
    }, [setJobContent]);

    const handleClear = useCallback(() => {
        clearJobContent();
    }, [clearJobContent]);

    const handleAnalyze = useCallback(async () => {
        if (jobContent.trim().length < minLength) {
            setJobAnalysisState('error', `Please provide at least ${minLength} characters`);
            return;
        }

        setJobAnalysisState('analyzing');

        try {
            // Call the job analysis API
            const response = await fetch('/api/analyze-job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobContent,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Analysis failed');
            }

            const result = await response.json();

            // Use the actual API response data
            setJobAnalysis(result.analysis);
        } catch (err) {
            console.error('Analysis failed:', err);
            setJobAnalysisState('error', err instanceof Error ? err.message : 'Analysis failed. Please try again.');
        }
    }, [jobContent, minLength, setJobAnalysisState, setJobAnalysis]);

    const getCharacterCountColor = () => {
        if (jobContent.length > maxLength * 0.9) return 'text-red-600';
        if (jobContent.length > maxLength * 0.8) return 'text-yellow-600';
        return 'text-gray-500';
    };

    const getProgressBarColor = () => {
        if (jobContent.length > maxLength * 0.9) return 'bg-red-500';
        if (jobContent.length > maxLength * 0.8) return 'bg-yellow-500';
        return 'bg-blue-500';
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Job Offer Input</h3>
                </div>

                {jobContent.trim().length > 0 && (
                    <button
                        onClick={handleClear}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        title="Clear content"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {/* Textarea */}
                <div className="relative">
                    <textarea
                        value={jobContent}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder="Your job offer..."
                        className={`
              w-full h-48 p-4 border rounded-lg resize-vertical focus:outline-none focus:ring-2 transition-colors
              ${jobAnalysisState === 'error'
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }
              ${jobAnalysisState === 'analyzing' ? 'opacity-75 cursor-not-allowed' : ''}
            `}
                        disabled={jobAnalysisState === 'analyzing'}
                    />

                    {/* Analyzing overlay */}
                    {jobAnalysisState === 'analyzing' && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                            <div className="text-center">
                                <div className="animate-spin mx-auto h-8 w-8 text-blue-500 mb-2">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <p className="text-sm font-medium text-gray-700">
                                    🔍 Analyzing job requirements...
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Character count and progress */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className={`text-sm ${getCharacterCountColor()}`}>
                            Character count: {jobContent.length}/{maxLength}
                        </span>

                        {/* Progress bar */}
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${getProgressBarColor()} transition-all duration-300`}
                                style={{ width: `${Math.min((jobContent.length / maxLength) * 100, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Analyze button */}
                    {jobContent.trim().length >= minLength && jobAnalysisState !== 'analyzing' && (
                        <button
                            onClick={handleAnalyze}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Analyze Job
                        </button>
                    )}
                </div>

                {/* Status messages */}
                <div className="min-h-[24px]"> {/* Fixed height to prevent layout shift */}
                    {jobContent.trim().length === 0 && (
                        <p className="text-sm text-gray-500">
                            Paste your job offer here. Minimum {minLength} characters required.
                        </p>
                    )}

                    {jobContent.length >= minLength && jobAnalysisState === 'idle' && (
                        <p className="text-sm text-gray-600">
                            ✅ Ready for analysis. Click &quot;Analyze Job&quot; to extract requirements and skills.
                        </p>
                    )}

                    {jobAnalysisState === 'complete' && jobAnalysis && (
                        <div className="flex items-center text-sm text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            ✅ Skills identified: {jobAnalysis.skills.join(', ')}
                        </div>
                    )}

                    {jobAnalysisState === 'error' && jobAnalysisError && (
                        <div className="flex items-center text-sm text-red-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            ❌ {jobAnalysisError}
                        </div>
                    )}
                </div>

                {/* Help text */}
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <p>
                        💡 <strong>Tip:</strong> Copy and paste the complete job description from the job posting.
                        Include details about requirements, responsibilities, and company information for better analysis.
                    </p>
                </div>
            </div>
        </div>
    );
}
