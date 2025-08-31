'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileText, CheckCircle, Copy } from 'lucide-react';
import { GeneratedContent } from '../lib/types';

interface ContentGeneratorProps {
    content: GeneratedContent | null;
    isGenerating: boolean;
    generationType: 'cover-letter' | 'email' | null;
    generationProgress: number;
    streamingContent: string;
    onEdit: () => void;
    onRegenerate: () => void;
    onDownload: (format: 'pdf' | 'docx' | 'txt') => void;
    className?: string;
}

export function ContentGenerator({
    content,
    isGenerating,
    generationType,
    generationProgress,
    streamingContent,
    onEdit,
    onRegenerate,
    onDownload,
    className
}: ContentGeneratorProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [displayContent, setDisplayContent] = useState('');
    const [localProgress, setLocalProgress] = useState(0);

    // Simulate progress when generating
    useEffect(() => {
        let progressInterval: NodeJS.Timeout;

        if (isGenerating) {
            setLocalProgress(0);
            progressInterval = setInterval(() => {
                setLocalProgress(prev => {
                    if (prev >= 90) return prev; // Cap at 90% until complete
                    return prev + Math.random() * 15; // Random increment
                });
            }, 5000);
        } else {
            setLocalProgress(100);
        }

        return () => {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
        };
    }, [isGenerating]);

    // Use local progress if generation progress is not provided
    const currentProgress = generationProgress > 0 ? generationProgress : localProgress;

    // Handle streaming content updates
    useEffect(() => {
        if (streamingContent) {
            setDisplayContent(streamingContent);
        }
    }, [streamingContent]);

    // Handle completed content
    useEffect(() => {
        if (content && !isGenerating) {
            setDisplayContent(content.content);
        }
    }, [content, isGenerating]);

    // Auto-scroll to bottom during streaming
    useEffect(() => {
        if (contentRef.current && isGenerating) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [displayContent, isGenerating]);

    const formatContent = (text: string) => {
        return text.split('\n').map((line, index) => {
            if (line.trim() === '') {
                return <br key={index} />;
            }
            return <p key={index} className="mb-3 leading-relaxed">{line}</p>;
        });
    };

    const getContentTypeLabel = () => {
        if (generationType === 'cover-letter') return 'Cover Letter';
        if (generationType === 'email') return 'Email';
        return 'Content';
    };

    const handleCopyContent = async () => {
        if (content) {
            try {
                await navigator.clipboard.writeText(content.content);
                // You could add a toast notification here if desired
            } catch (err) {
                console.error('Failed to copy content:', err);
            }
        }
    };

    if (!content && !isGenerating) {
        return null;
    }

    return (
        <div className={`h-full flex flex-col ${className}`}>
            {/* Content Area */}
            <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {/* Content Header */}
                {content && !isGenerating && (
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-900">
                                {content.type === 'cover-letter' ? 'Cover Letter' : 'Email'} Generated Successfully
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleCopyContent}
                                className="flex items-center gap-1.5 px-2 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
                                title="Copy content to clipboard"
                            >
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Copy</span>
                            </button>
                            <div className="text-xs text-gray-600">
                                {content.metadata.wordCount} words • {content.metadata.estimatedReadTime} min read
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div
                    ref={contentRef}
                    className="flex-1 p-6 overflow-y-auto"
                >
                    {isGenerating ? (
                        <div className="space-y-6">
                            {/* Generating Cover Letter Card */}
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-base font-medium text-gray-900">
                                        {generationType === 'cover-letter' ? 'Generating Cover Letter' : 'Generating Email'}
                                    </h4>
                                    {/* LED Indicator */}
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-3 h-3 rounded-full shadow-sm ${isGenerating
                                                ? 'bg-orange-500 animate-pulse'
                                                : content
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-400'
                                                }`}
                                            title={isGenerating ? 'Generating...' : content ? 'Generation Complete' : 'Ready'}
                                        ></div>
                                        {isGenerating && (
                                            <span className="text-xs text-gray-500">Generating...</span>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-5000"
                                        style={{ width: `${currentProgress}%` }}
                                    ></div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-sm text-gray-600">
                                        AI is analyzing your CV and job requirements to create personalized content
                                    </p>
                                    <span className="text-sm text-blue-600 font-medium">
                                        {Math.round(currentProgress)}% Complete
                                    </span>
                                </div>
                            </div>

                            {/* Content Preview */}
                            {displayContent && (
                                <div className="text-gray-900 leading-relaxed">
                                    {formatContent(displayContent)}
                                    <span className="inline-block w-2 h-5 bg-blue-600 animate-pulse ml-1"></span>
                                </div>
                            )}
                        </div>
                    ) : content ? (
                        <div className="text-gray-900 leading-relaxed">
                            {formatContent(displayContent)}
                        </div>
                    ) : null}
                </div>

                {/* Action Buttons at Bottom */}
                {content && !isGenerating && (
                    <div className="px-6 pb-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            {/* Left side - ATS status */}
                            <div className="flex items-center gap-3">
                                {content.metadata.atsOptimized && (
                                    <div className="flex items-center gap-1 text-xs text-green-600">
                                        <CheckCircle className="w-3 h-3" />
                                        ATS Optimized
                                    </div>
                                )}
                                <div className="text-xs text-gray-500">
                                    {content.metadata.wordCount} words • {content.metadata.estimatedReadTime} min read
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
