'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileText, CheckCircle, Copy, TrendingUp, TrendingDown, Star, Target, Award, BookOpen, Briefcase, Users, Lightbulb, AlertTriangle } from 'lucide-react';
import { GeneratedContent, CVAnalysisResult } from '../lib/types';

interface ContentGeneratorProps {
    content: GeneratedContent | null;
    isGenerating: boolean;
    generationType: 'cover-letter' | 'email' | 'cv-analysis' | null;
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
    const [isCopied, setIsCopied] = useState(false);

    // Clear display content and reset progress when generation type changes (new generation starts)
    useEffect(() => {
        if (generationType) {
            setDisplayContent('');
            setLocalProgress(0);
        }
    }, [generationType]);

    // Also clear when generation starts and reset progress
    useEffect(() => {
        if (isGenerating && !content) {
            setDisplayContent('');
            setLocalProgress(0);
        }
    }, [isGenerating, content]);

    // Immediate progress reset when content is cleared (not generating)
    useEffect(() => {
        if (!isGenerating && !content) {
            setLocalProgress(0);
        }
    }, [isGenerating, content]);

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
            // When not generating, set progress to 0 (not 100) to avoid confusion
            setLocalProgress(0);
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

    const renderCVAnalysis = (analysisData: CVAnalysisResult) => {
        const { analysis, jobMatch } = analysisData;

        return (
            <div className="space-y-6">
                {/* Overall Match Score */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Target className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-semibold text-gray-900">Overall Match Score</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-blue-600">
                            {jobMatch.overallMatch}%
                        </div>
                        <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${jobMatch.overallMatch}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                {jobMatch.overallMatch >= 80 ? 'Excellent match!' :
                                    jobMatch.overallMatch >= 60 ? 'Good match' :
                                        jobMatch.overallMatch >= 40 ? 'Moderate match' : 'Needs improvement'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Strengths */}
                {jobMatch.strengths && jobMatch.strengths.length > 0 && (
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
                        </div>
                        <div className="grid gap-3">
                            {jobMatch.strengths.map((strength, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-700">{strength}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Missing Skills */}
                {jobMatch.missingSkills && jobMatch.missingSkills.length > 0 && (
                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingDown className="w-6 h-6 text-orange-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Missing Skills</h3>
                        </div>
                        <div className="grid gap-3">
                            {jobMatch.missingSkills.map((skill, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-700">{skill}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skill Matches */}
                {jobMatch.skillMatches && jobMatch.skillMatches.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Star className="w-6 h-6 text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Skill Analysis</h3>
                        </div>
                        <div className="space-y-4">
                            {jobMatch.skillMatches.slice(0, 10).map((match, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{match.skill}</p>
                                        <p className="text-sm text-gray-600">
                                            Your level: {match.cvLevel} • Required: {match.jobRequirement}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm font-medium text-gray-900">
                                            {match.matchScore}%
                                        </div>
                                        <div className={`w-16 h-2 rounded-full ${match.matchScore >= 80 ? 'bg-green-500' :
                                                match.matchScore >= 60 ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                            }`}>
                                            <div
                                                className="h-2 rounded-full bg-white opacity-30"
                                                style={{ width: `${100 - match.matchScore}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommendations */}
                {jobMatch.recommendations && jobMatch.recommendations.length > 0 && (
                    <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Lightbulb className="w-6 h-6 text-purple-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
                        </div>
                        <div className="space-y-3">
                            {jobMatch.recommendations.map((recommendation, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-gray-700">{recommendation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const getContentTypeLabel = () => {
        if (generationType === 'cover-letter') return 'Cover Letter';
        if (generationType === 'email') return 'Email';
        if (generationType === 'cv-analysis') return 'CV Analysis';
        return 'Content';
    };

    const handleCopyContent = async () => {
        if (content) {
            try {
                await navigator.clipboard.writeText(content.content);
                setIsCopied(true);
                // Reset the copied state after 2 seconds
                setTimeout(() => {
                    setIsCopied(false);
                }, 2000);
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
                                {content.type === 'cover-letter' ? 'Cover Letter' :
                                    content.type === 'email' ? 'Email' : 'CV Analysis'} Generated Successfully
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleCopyContent}
                                className="flex items-center gap-1.5 px-2 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
                                title="Copy content to clipboard"
                            >
                                {isCopied ? (
                                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                )}
                                <span className="text-xs font-medium">
                                    {isCopied ? 'Copied!' : 'Copy'}
                                </span>
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
                                        {generationType === 'cover-letter' ? 'Generating Cover Letter' :
                                            generationType === 'email' ? 'Generating Email' : 'Analyzing CV'}
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
                                        className={`h-2 rounded-full transition-all duration-300 ${generationType === 'cv-analysis' ? 'bg-orange-500' : 'bg-blue-500'
                                            }`}
                                        style={{ width: `${currentProgress}%` }}
                                    ></div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-sm text-gray-600">
                                        {generationType === 'cv-analysis'
                                            ? 'AI is analyzing your CV and matching it against job requirements'
                                            : 'AI is analyzing your CV and job requirements to create personalized content'
                                        }
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
                            {content.type === 'cv-analysis' && content.analysisData ? (
                                renderCVAnalysis(content.analysisData)
                            ) : (
                                formatContent(displayContent)
                            )}
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
