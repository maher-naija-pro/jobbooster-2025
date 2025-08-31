'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Edit, RotateCcw, CheckCircle, Copy, Check } from 'lucide-react';
import { GeneratedContent } from '../lib/types';

interface ContentGeneratorProps {
    content: GeneratedContent | null;
    isGenerating: boolean;
    generationType: 'cover-letter' | 'email' | null;
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
    streamingContent,
    onEdit,
    onRegenerate,
    onDownload,
    className
}: ContentGeneratorProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [displayContent, setDisplayContent] = useState('');
    const [copied, setCopied] = useState(false);

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

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(displayContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
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
                            {/* Copy Button */}
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-3 py-1 text-xs bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3 h-3 text-green-600" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3 h-3" />
                                        Copy
                                    </>
                                )}
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
                    className="p-6 min-h-[400px] max-h-[600px] overflow-y-auto"
                >
                    {isGenerating ? (
                        <div className="space-y-6">
                            {/* Generating Cover Letter Card */}
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-base font-medium text-gray-900">
                                        {generationType === 'cover-letter' ? 'Generating Cover Letter' : 'Generating Email'}
                                    </h4>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div className="bg-blue-500 h-2 rounded-full animate-pulse transition-all duration-1000" style={{ width: '70%' }}></div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    AI is analyzing your CV and job requirements to create personalized content
                                </p>
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

                {/* Footer with Actions */}
                {content && !isGenerating && (
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">Download as:</span>
                                <div className="flex gap-2">
                                    {content.exportOptions.map((option) => (
                                        <button
                                            key={option.type}
                                            onClick={() => onDownload(option.type)}
                                            className="flex items-center gap-1 px-3 py-1 text-xs bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                                        >
                                            <Download className="w-3 h-3" />
                                            {option.type.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={onEdit}
                                    className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                >
                                    <Edit className="w-3 h-3" />
                                    Edit
                                </button>
                                <button
                                    onClick={onRegenerate}
                                    className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Regenerate
                                </button>
                            </div>
                        </div>
                        {content.metadata.atsOptimized && (
                            <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
                                <CheckCircle className="w-3 h-3" />
                                ATS Optimized
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
