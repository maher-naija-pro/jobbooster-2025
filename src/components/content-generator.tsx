'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Edit, RotateCcw, CheckCircle } from 'lucide-react';
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
            return <p key={index} className="mb-2">{line}</p>;
        });
    };

    const getContentTypeLabel = () => {
        if (generationType === 'cover-letter') return 'Cover Letter';
        if (generationType === 'email') return 'Email';
        return 'Content';
    };

    if (!content && !isGenerating) {
        return null;
    }

    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        {isGenerating ? `Generating ${getContentTypeLabel()}` : 'Generated Content'}
                    </h3>
                </div>

                {content && !isGenerating && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                        <button
                            onClick={onRegenerate}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Regenerate
                        </button>
                    </div>
                )}
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                {content && !isGenerating && (
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-900">
                                {content.type === 'cover-letter' ? 'Cover Letter' : 'Email'} Generated Successfully
                            </span>
                        </div>
                        <div className="text-xs text-gray-600">
                            {content.metadata.wordCount} words • {content.metadata.estimatedReadTime} min read
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div
                    ref={contentRef}
                    className="p-6 bg-white min-h-[300px] max-h-[500px] overflow-y-auto"
                >
                    {isGenerating ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-600">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">Generating content...</span>
                            </div>
                            <div className="text-gray-900 leading-relaxed">
                                {formatContent(displayContent)}
                                <span className="inline-block w-2 h-5 bg-blue-600 animate-pulse ml-1"></span>
                            </div>
                        </div>
                    ) : content ? (
                        <div className="text-gray-900 leading-relaxed">
                            {formatContent(displayContent)}
                        </div>
                    ) : null}
                </div>

                {/* Footer with Download Options */}
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
                            {content.metadata.atsOptimized && (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                    <CheckCircle className="w-3 h-3" />
                                    ATS Optimized
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
