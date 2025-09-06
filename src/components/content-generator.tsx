'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileText, CheckCircle, Copy, XCircle, TrendingUp, TrendingDown, Star, Target, Award, BookOpen, Briefcase, Users, Lightbulb, AlertTriangle, ChevronDown, ChevronUp, Eye, EyeOff, Building, MapPin, DollarSign, Calendar, GraduationCap, Code, Heart, Globe, Wrench } from 'lucide-react';
import { GeneratedContent, CVAnalysisResult, JobAnalysis } from '../lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { CVAnalysisSkeleton } from './cv-analysis-skeleton';

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
    jobAnalysis?: JobAnalysis | null;
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
    className,
    jobAnalysis
}: ContentGeneratorProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [displayContent, setDisplayContent] = useState('');
    const [localProgress, setLocalProgress] = useState(0);
    const [isCopied, setIsCopied] = useState(false);
    const [copyError, setCopyError] = useState(false);
    const [isMissingSkillsExpanded, setIsMissingSkillsExpanded] = useState(true);
    const [isStrengthsExpanded, setIsStrengthsExpanded] = useState(true);
    const [analysisMode, setAnalysisMode] = useState<'compact' | 'detailed'>('compact');

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

        const renderCompactMode = () => (
            <div className="space-y-6">
                {/* Mode Toggle */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">CV Analysis Results</h2>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <Button
                            onClick={() => setAnalysisMode('compact')}
                            variant={analysisMode === 'compact' ? 'default' : 'ghost'}
                            size="sm"
                            className="gap-1"
                        >
                            <Eye className="w-4 h-4" />
                            Compact
                        </Button>
                        <Button
                            onClick={() => setAnalysisMode('detailed')}
                            variant={analysisMode === 'detailed' ? 'default' : 'ghost'}
                            size="sm"
                            className="gap-1"
                        >
                            <EyeOff className="w-4 h-4" />
                            Detailed
                        </Button>
                    </div>
                </div>

                {/* Overall Match Score - Always visible */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
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
                                    className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
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

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {jobMatch.skillMatches?.filter(s => s.gap === 'none' || s.matchScore >= 0.8).length || 0}
                                </div>
                                <div className="text-sm text-gray-600">Perfect Matches</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-8 h-8 text-yellow-600" />
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {jobMatch.missingSkills?.length || 0}
                                </div>
                                <div className="text-sm text-gray-600">Missing Skills</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-3">
                            <Star className="w-8 h-8 text-blue-600" />
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {jobMatch.strengths?.length || 0}
                                </div>
                                <div className="text-sm text-gray-600">Strengths</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Skills Table */}
                {jobMatch.skillMatches && jobMatch.skillMatches.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Skills Analysis</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-300">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Skill Name</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Job Required</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">CV Level</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Match</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobMatch.skillMatches.map((match, index) => {
                                        const getJobRequiredDisplay = (requirement: string) => {
                                            switch (requirement) {
                                                case 'required': return '✅ Required';
                                                case 'preferred': return '⚠️ Preferred';
                                                case 'optional': return '❌ Optional';
                                                default: return '❌ Not Required';
                                            }
                                        };

                                        const getCVMatchDisplay = (level: string) => {
                                            switch (level) {
                                                case 'expert': return '✅ Expert';
                                                case 'advanced': return '✅ Advanced';
                                                case 'intermediate': return '⚠️ Intermed';
                                                case 'beginner': return '❌ Beginner';
                                                default: return '❌ None';
                                            }
                                        };

                                        const getStatusDisplay = (gap: string, matchScore: number) => {
                                            if (gap === 'none' || matchScore >= 0.8) return '✅ Perfect';
                                            if (gap === 'minor' || matchScore >= 0.6) return '⚠️ Minor';
                                            if (gap === 'moderate') return '❌ Moderate';
                                            if (gap === 'major') return '❌ Major';
                                            if (match.jobRequirement === 'optional' && match.cvLevel !== 'beginner') return '➕ Extra';
                                            return '❌ Gap';
                                        };

                                        const getRowColor = (gap: string, matchScore: number) => {
                                            if (gap === 'none' || matchScore >= 0.8) return 'bg-green-50 border-green-200';
                                            if (gap === 'minor' || matchScore >= 0.6) return 'bg-yellow-50 border-yellow-200';
                                            if (match.jobRequirement === 'optional' && match.cvLevel !== 'beginner') return 'bg-blue-50 border-blue-200';
                                            return 'bg-red-50 border-red-200';
                                        };

                                        return (
                                            <tr key={index} className={`border-b border-gray-200 ${getRowColor(match.gap, match.matchScore)}`}>
                                                <td className="py-3 px-4 font-medium text-gray-900">{match.skill}</td>
                                                <td className="py-3 px-4 text-gray-700">{getJobRequiredDisplay(match.jobRequirement)}</td>
                                                <td className="py-3 px-4 text-gray-700">{getCVMatchDisplay(match.cvLevel)}</td>
                                                <td className="py-3 px-4 text-gray-700">{Math.round(match.matchScore * 100)}%</td>
                                                <td className="py-3 px-4 text-gray-700">{getStatusDisplay(match.gap, match.matchScore)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Soft Skills Table */}
                {jobMatch.skillMatches && jobMatch.skillMatches.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Soft Skills Analysis</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-300">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Skill Name</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Job Required</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">CV Level</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Match</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobMatch.skillMatches.map((match, index) => {
                                        const getJobRequiredDisplay = (requirement: string) => {
                                            switch (requirement) {
                                                case 'required': return '✅ Required';
                                                case 'preferred': return '⚠️ Preferred';
                                                case 'optional': return '❌ Optional';
                                                default: return '❌ Not Required';
                                            }
                                        };

                                        const getCVMatchDisplay = (level: string) => {
                                            switch (level) {
                                                case 'expert': return '✅ Expert';
                                                case 'advanced': return '✅ Advanced';
                                                case 'intermediate': return '⚠️ Intermed';
                                                case 'beginner': return '❌ Beginner';
                                                default: return '❌ None';
                                            }
                                        };

                                        const getStatusDisplay = (gap: string, matchScore: number) => {
                                            if (gap === 'none' || matchScore >= 0.8) return '✅ Perfect';
                                            if (gap === 'minor' || matchScore >= 0.6) return '⚠️ Minor';
                                            if (gap === 'moderate') return '❌ Moderate';
                                            if (gap === 'major') return '❌ Major';
                                            if (match.jobRequirement === 'optional' && match.cvLevel !== 'beginner') return '➕ Extra';
                                            return '❌ Gap';
                                        };

                                        const getRowColor = (gap: string, matchScore: number) => {
                                            if (gap === 'none' || matchScore >= 0.8) return 'bg-green-50 border-green-200';
                                            if (gap === 'minor' || matchScore >= 0.6) return 'bg-yellow-50 border-yellow-200';
                                            if (match.jobRequirement === 'optional' && match.cvLevel !== 'beginner') return 'bg-blue-50 border-blue-200';
                                            return 'bg-red-50 border-red-200';
                                        };

                                        return (
                                            <tr key={`soft-${index}`} className={`border-b border-gray-200 ${getRowColor(match.gap, match.matchScore)}`}>
                                                <td className="py-3 px-4 font-medium text-gray-900">{match.skill}</td>
                                                <td className="py-3 px-4 text-gray-700">{getJobRequiredDisplay(match.jobRequirement)}</td>
                                                <td className="py-3 px-4 text-gray-700">{getCVMatchDisplay(match.cvLevel)}</td>
                                                <td className="py-3 px-4 text-gray-700">{Math.round(match.matchScore * 100)}%</td>
                                                <td className="py-3 px-4 text-gray-700">{getStatusDisplay(match.gap, match.matchScore)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Key Recommendations */}
                {jobMatch.recommendations && jobMatch.recommendations.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Lightbulb className="w-6 h-6 text-purple-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Key Recommendations</h3>
                        </div>
                        <div className="space-y-2">
                            {jobMatch.recommendations.slice(0, 3).map((recommendation, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-gray-700 text-sm">{recommendation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );

        const renderDetailedMode = () => (
            <div className="space-y-6">
                {/* Mode Toggle */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Detailed CV Analysis</h2>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <Button
                            onClick={() => setAnalysisMode('compact')}
                            variant={analysisMode === 'compact' ? 'default' : 'ghost'}
                            size="sm"
                            className="gap-1"
                        >
                            <Eye className="w-4 h-4" />
                            Compact
                        </Button>
                        <Button
                            onClick={() => setAnalysisMode('detailed')}
                            variant={analysisMode === 'detailed' ? 'default' : 'ghost'}
                            size="sm"
                            className="gap-1"
                        >
                            <EyeOff className="w-4 h-4" />
                            Detailed
                        </Button>
                    </div>
                </div>

                {/* Overall Match Score - First in detailed mode */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
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
                                    className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
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

                {/* Technical Skills Table - Detailed Mode */}
                {jobMatch.skillMatches && jobMatch.skillMatches.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Skills Analysis</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-300">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Skill Name</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Job Required</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">CV Level</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Match</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobMatch.skillMatches.map((match, index) => {
                                        const getJobRequiredDisplay = (requirement: string) => {
                                            switch (requirement) {
                                                case 'required': return '✅ Required';
                                                case 'preferred': return '⚠️ Preferred';
                                                case 'optional': return '❌ Optional';
                                                default: return '❌ Not Required';
                                            }
                                        };

                                        const getCVMatchDisplay = (level: string) => {
                                            switch (level) {
                                                case 'expert': return '✅ Expert';
                                                case 'advanced': return '✅ Advanced';
                                                case 'intermediate': return '⚠️ Intermed';
                                                case 'beginner': return '❌ Beginner';
                                                default: return '❌ None';
                                            }
                                        };

                                        const getStatusDisplay = (gap: string, matchScore: number) => {
                                            if (gap === 'none' || matchScore >= 0.8) return '✅ Perfect';
                                            if (gap === 'minor' || matchScore >= 0.6) return '⚠️ Minor';
                                            if (gap === 'moderate') return '❌ Moderate';
                                            if (gap === 'major') return '❌ Major';
                                            if (match.jobRequirement === 'optional' && match.cvLevel !== 'beginner') return '➕ Extra';
                                            return '❌ Gap';
                                        };

                                        const getRowColor = (gap: string, matchScore: number) => {
                                            if (gap === 'none' || matchScore >= 0.8) return 'bg-green-50 border-green-200';
                                            if (gap === 'minor' || matchScore >= 0.6) return 'bg-yellow-50 border-yellow-200';
                                            if (match.jobRequirement === 'optional' && match.cvLevel !== 'beginner') return 'bg-blue-50 border-blue-200';
                                            return 'bg-red-50 border-red-200';
                                        };

                                        return (
                                            <tr key={`detailed-tech-${index}`} className={`border-b border-gray-200 ${getRowColor(match.gap, match.matchScore)}`}>
                                                <td className="py-3 px-4 font-medium text-gray-900">{match.skill}</td>
                                                <td className="py-3 px-4 text-gray-700">{getJobRequiredDisplay(match.jobRequirement)}</td>
                                                <td className="py-3 px-4 text-gray-700">{getCVMatchDisplay(match.cvLevel)}</td>
                                                <td className="py-3 px-4 text-gray-700">{Math.round(match.matchScore * 100)}%</td>
                                                <td className="py-3 px-4 text-gray-700">{getStatusDisplay(match.gap, match.matchScore)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Soft Skills Table - Detailed Mode */}
                {jobMatch.skillMatches && jobMatch.skillMatches.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Soft Skills Analysis</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-300">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Skill Name</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Job Required</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">CV Level</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Match</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobMatch.skillMatches.map((match, index) => {
                                        const getJobRequiredDisplay = (requirement: string) => {
                                            switch (requirement) {
                                                case 'required': return '✅ Required';
                                                case 'preferred': return '⚠️ Preferred';
                                                case 'optional': return '❌ Optional';
                                                default: return '❌ Not Required';
                                            }
                                        };

                                        const getCVMatchDisplay = (level: string) => {
                                            switch (level) {
                                                case 'expert': return '✅ Expert';
                                                case 'advanced': return '✅ Advanced';
                                                case 'intermediate': return '⚠️ Intermed';
                                                case 'beginner': return '❌ Beginner';
                                                default: return '❌ None';
                                            }
                                        };

                                        const getStatusDisplay = (gap: string, matchScore: number) => {
                                            if (gap === 'none' || matchScore >= 0.8) return '✅ Perfect';
                                            if (gap === 'minor' || matchScore >= 0.6) return '⚠️ Minor';
                                            if (gap === 'moderate') return '❌ Moderate';
                                            if (gap === 'major') return '❌ Major';
                                            if (match.jobRequirement === 'optional' && match.cvLevel !== 'beginner') return '➕ Extra';
                                            return '❌ Gap';
                                        };

                                        const getRowColor = (gap: string, matchScore: number) => {
                                            if (gap === 'none' || matchScore >= 0.8) return 'bg-green-50 border-green-200';
                                            if (gap === 'minor' || matchScore >= 0.6) return 'bg-yellow-50 border-yellow-200';
                                            if (match.jobRequirement === 'optional' && match.cvLevel !== 'beginner') return 'bg-blue-50 border-blue-200';
                                            return 'bg-red-50 border-red-200';
                                        };

                                        return (
                                            <tr key={`detailed-soft-${index}`} className={`border-b border-gray-200 ${getRowColor(match.gap, match.matchScore)}`}>
                                                <td className="py-3 px-4 font-medium text-gray-900">{match.skill}</td>
                                                <td className="py-3 px-4 text-gray-700">{getJobRequiredDisplay(match.jobRequirement)}</td>
                                                <td className="py-3 px-4 text-gray-700">{getCVMatchDisplay(match.cvLevel)}</td>
                                                <td className="py-3 px-4 text-gray-700">{Math.round(match.matchScore * 100)}%</td>
                                                <td className="py-3 px-4 text-gray-700">{getStatusDisplay(match.gap, match.matchScore)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Job Analysis Section */}
                {jobAnalysis && (
                    <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-lg p-6 border border-indigo-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Building className="w-6 h-6 text-indigo-600" />
                            <h3 className="text-xl font-semibold text-gray-900">Job Analysis</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-4 border border-indigo-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Building className="w-4 h-4 text-indigo-600" />
                                    <span className="text-sm font-medium text-gray-600">Company</span>
                                </div>
                                <p className="text-gray-900 font-semibold">{jobAnalysis.companyName}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-indigo-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Target className="w-4 h-4 text-indigo-600" />
                                    <span className="text-sm font-medium text-gray-600">Level</span>
                                </div>
                                <p className="text-gray-900 font-semibold capitalize">{jobAnalysis.experienceLevel}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-indigo-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-4 h-4 text-indigo-600" />
                                    <span className="text-sm font-medium text-gray-600">Location</span>
                                </div>
                                <p className="text-gray-900 font-semibold">{jobAnalysis.location}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-indigo-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-4 h-4 text-indigo-600" />
                                    <span className="text-sm font-medium text-gray-600">Company Size</span>
                                </div>
                                <p className="text-gray-900 font-semibold capitalize">{jobAnalysis.companySize}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-indigo-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Briefcase className="w-4 h-4 text-indigo-600" />
                                    <span className="text-sm font-medium text-gray-600">Industry</span>
                                </div>
                                <p className="text-gray-900 font-semibold">{jobAnalysis.industry}</p>
                            </div>
                            {jobAnalysis.salaryRange && (
                                <div className="bg-white rounded-lg p-4 border border-indigo-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-indigo-600" />
                                        <span className="text-sm font-medium text-gray-600">Salary Range</span>
                                    </div>
                                    <p className="text-gray-900 font-semibold">{jobAnalysis.salaryRange}</p>
                                </div>
                            )}
                        </div>
                        {jobAnalysis.requirements && jobAnalysis.requirements.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Requirements:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {jobAnalysis.requirements.map((req, index) => (
                                        <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                                            {req}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Skills Analysis */}
                {analysis.skills && analysis.skills.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                            <BookOpen className="w-6 h-6 text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Extracted Skills Analysis</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {analysis.skills.map((skill, index) => (
                                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900">{skill.name}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${skill.category === 'technical' ? 'bg-blue-100 text-blue-800' :
                                            skill.category === 'soft' ? 'bg-green-100 text-green-800' :
                                                skill.category === 'language' ? 'bg-purple-100 text-purple-800' :
                                                    skill.category === 'certification' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {skill.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>Level: {skill.level}</span>
                                        <span>Confidence: {Math.round(skill.confidence * 100)}%</span>
                                    </div>
                                    {skill.yearsOfExperience && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {skill.yearsOfExperience} years experience
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience Analysis */}
                {analysis.experience && analysis.experience.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                            <Briefcase className="w-6 h-6 text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Experience Analysis</h3>
                        </div>
                        <div className="space-y-4">
                            {analysis.experience.map((exp, index) => (
                                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                                            <p className="text-gray-600">{exp.company}</p>
                                            <p className="text-sm text-gray-500">{exp.duration}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-gray-900">
                                                Relevance: {Math.round(exp.relevanceScore * 100)}%
                                            </div>
                                            <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                                                <div
                                                    className="bg-primary h-2 rounded-full"
                                                    style={{ width: `${exp.relevanceScore * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-3">{exp.description}</p>
                                    {exp.skills && exp.skills.length > 0 && (
                                        <div className="mb-3">
                                            <h5 className="text-sm font-medium text-gray-900 mb-1">Skills:</h5>
                                            <div className="flex flex-wrap gap-1">
                                                {exp.skills.map((skill, skillIndex) => (
                                                    <span key={skillIndex} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {exp.achievements && exp.achievements.length > 0 && (
                                        <div>
                                            <h5 className="text-sm font-medium text-gray-900 mb-1">Key Achievements:</h5>
                                            <ul className="text-sm text-gray-700 space-y-1">
                                                {exp.achievements.map((achievement, achIndex) => (
                                                    <li key={achIndex} className="flex items-start gap-2">
                                                        <Award className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                                        {achievement}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education Analysis */}
                {analysis.education && analysis.education.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                            <GraduationCap className="w-6 h-6 text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Education Analysis</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {analysis.education.map((edu, index) => (
                                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                                            <p className="text-gray-600">{edu.institution}</p>
                                            <p className="text-sm text-gray-500">{edu.year}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${edu.relevance === 'high' ? 'bg-green-100 text-green-800' :
                                            edu.relevance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {edu.relevance} relevance
                                        </span>
                                    </div>
                                    {edu.skills && edu.skills.length > 0 && (
                                        <div>
                                            <h5 className="text-sm font-medium text-gray-900 mb-1">Skills:</h5>
                                            <div className="flex flex-wrap gap-1">
                                                {edu.skills.map((skill, skillIndex) => (
                                                    <span key={skillIndex} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}



                {/* Strengths */}
                {jobMatch.strengths && jobMatch.strengths.length > 0 && (
                    <div className="bg-green-50 rounded-lg border border-green-200">
                        <Button
                            onClick={() => setIsStrengthsExpanded(!isStrengthsExpanded)}
                            variant="ghost"
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-green-100 h-auto"
                        >
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
                                <Badge variant="secondary" className="bg-green-200 text-green-800">
                                    {jobMatch.strengths.length}
                                </Badge>
                            </div>
                            {isStrengthsExpanded ? (
                                <ChevronUp className="w-5 h-5 text-green-600" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-green-600" />
                            )}
                        </Button>
                        {isStrengthsExpanded && (
                            <div className="px-6 pb-6">
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
                    </div>
                )}

                {/* Missing Skills */}
                {jobMatch.missingSkills && jobMatch.missingSkills.length > 0 && (
                    <div className="bg-orange-50 rounded-lg border border-orange-200">
                        <Button
                            onClick={() => setIsMissingSkillsExpanded(!isMissingSkillsExpanded)}
                            variant="ghost"
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-orange-100 h-auto"
                        >
                            <div className="flex items-center gap-3">
                                <TrendingDown className="w-6 h-6 text-orange-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Missing Skills</h3>
                                <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                                    {jobMatch.missingSkills.length}
                                </Badge>
                            </div>
                            {isMissingSkillsExpanded ? (
                                <ChevronUp className="w-5 h-5 text-orange-600" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-orange-600" />
                            )}
                        </Button>
                        {isMissingSkillsExpanded && (
                            <div className="px-6 pb-6">
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
                    </div>
                )}

                {/* All Recommendations */}
                {jobMatch.recommendations && jobMatch.recommendations.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Lightbulb className="w-6 h-6 text-purple-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Detailed Recommendations</h3>
                        </div>
                        <div className="space-y-3">
                            {jobMatch.recommendations.map((recommendation, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-gray-700">{recommendation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Analysis Metadata */}
                {analysis.metadata && (
                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Analysis Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                                <span className="font-medium">Processing Time:</span> {analysis.metadata.processingTime}ms
                            </div>
                            <div>
                                <span className="font-medium">Confidence:</span> {Math.round(analysis.metadata.confidence * 100)}%
                            </div>
                            <div>
                                <span className="font-medium">Version:</span> {analysis.metadata.version}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );

        return analysisMode === 'compact' ? renderCompactMode() : renderDetailedMode();
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
                const textToCopy = content.content;

                // Try modern clipboard API first
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(textToCopy);
                } else {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    textArea.remove();
                }

                setIsCopied(true);
                setCopyError(false);
                // Reset the copied state after 3 seconds
                setTimeout(() => {
                    setIsCopied(false);
                }, 3000);
            } catch (err) {
                console.error('Failed to copy content:', err);
                setCopyError(true);
                setIsCopied(false);
                // Reset the error state after 3 seconds
                setTimeout(() => {
                    setCopyError(false);
                }, 3000);
            }
        }
    };

    if (!content && !isGenerating) {
        return null;
    }

    return (
        <div className={`h-full flex flex-col ${className}`}>
            {/* Content Area */}
            <Card className="flex-1 overflow-hidden">
                {/* Content Header */}
                {content && !isGenerating && (
                    <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-900">
                                {content.type === 'cover-letter' ? 'Cover Letter' :
                                    content.type === 'email' ? 'Email' : 'CV Analysis'} Generated Successfully
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleCopyContent}
                                variant="ghost"
                                size="sm"
                                className={`group gap-1.5 h-8 px-3 transition-all duration-200 ease-in-out ${isCopied
                                    ? 'text-green-600 bg-green-50 hover:bg-green-100 border border-green-200'
                                    : copyError
                                        ? 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                                    }`}
                                disabled={!content}
                                title={isCopied ? 'Content copied to clipboard!' : copyError ? 'Failed to copy content' : 'Copy content to clipboard'}
                            >
                                {isCopied ? (
                                    <CheckCircle className="w-3.5 h-3.5 animate-pulse" />
                                ) : copyError ? (
                                    <XCircle className="w-3.5 h-3.5 animate-pulse" />
                                ) : (
                                    <Copy className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />
                                )}
                                <span className="text-xs font-medium">
                                    {isCopied ? 'Copied!' : copyError ? 'Failed' : 'Copy'}
                                </span>
                            </Button>
                            <div className="text-xs text-gray-600 flex items-center h-8">
                                {content.metadata.wordCount} words • {content.metadata.estimatedReadTime} min read
                            </div>
                        </div>
                    </CardHeader>
                )}

                {/* Main Content */}
                <CardContent
                    ref={contentRef}
                    className="flex-1 p-6 overflow-y-auto"
                >
                    {isGenerating ? (
                        <div className="space-y-6">
                            {generationType === 'cv-analysis' ? (
                                // Show CV Analysis Skeleton for CV analysis generation
                                <CVAnalysisSkeleton progress={currentProgress} />
                            ) : (
                                // Show regular generation card for other content types
                                <>
                                    {/* Generating Content Card */}
                                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-base font-medium text-gray-900">
                                                {generationType === 'cover-letter' ? 'Generating Cover Letter' :
                                                    generationType === 'email' ? 'Generating Email' : 'Analyzing CV'}
                                            </h4>
                                            {/* LED Indicator */}
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`w-3 h-3 rounded-full shadow-sm ${isGenerating
                                                        ? (generationType as string) === 'cv-analysis'
                                                            ? 'bg-violet-500 animate-pulse'
                                                            : generationType === 'email'
                                                                ? 'bg-emerald-500 animate-pulse'
                                                                : 'bg-indigo-500 animate-pulse'
                                                        : content
                                                            ? 'bg-emerald-500'
                                                            : 'bg-slate-400'
                                                        }`}
                                                    title={isGenerating ? 'Generating...' : content ? 'Generation Complete' : 'Ready'}
                                                    aria-label={isGenerating ? 'Generating content' : content ? 'Generation complete' : 'Ready to generate'}
                                                ></div>
                                                {isGenerating && (
                                                    <span className="text-xs text-gray-500">Generating...</span>
                                                )}
                                            </div>
                                        </div>
                                        <Progress
                                            value={currentProgress}
                                            className="w-full h-2"
                                        />
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-sm text-gray-600">
                                                {(generationType as string) === 'cv-analysis'
                                                    ? 'AI is analyzing your CV and matching it against job requirements'
                                                    : 'AI is analyzing your CV and job requirements to create personalized content'
                                                }
                                            </p>
                                            <span className="text-sm text-blue-600 font-medium">
                                                {Math.round(currentProgress)}% Complete
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Preview or Skeleton */}
                                    {displayContent ? (
                                        <div className="text-gray-900 leading-relaxed">
                                            {formatContent(displayContent)}
                                            <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-1"></span>
                                        </div>
                                    ) : (
                                        // Skeleton loader while waiting for first word of stream - full page space
                                        <div className="space-y-4 py-8">
                                            {generationType === 'email' ? (
                                                // Email skeleton structure
                                                <>
                                                    {/* Email header skeleton */}
                                                    <div className="space-y-2">
                                                        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                                                    </div>

                                                    {/* Email content skeleton */}
                                                    <div className="space-y-3">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                                                    </div>

                                                    {/* Email footer skeleton */}
                                                    <div className="space-y-2 pt-4">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                                                    </div>
                                                </>
                                            ) : (
                                                // Cover letter skeleton structure
                                                <>
                                                    {/* Cover letter header skeleton */}
                                                    <div className="space-y-2">
                                                        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/5"></div>
                                                    </div>

                                                    {/* Cover letter greeting skeleton */}
                                                    <div className="space-y-2 pt-4">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/6"></div>
                                                    </div>

                                                    {/* Cover letter body skeleton - multiple paragraphs */}
                                                    <div className="space-y-3 pt-4">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                    </div>

                                                    {/* Cover letter closing skeleton */}
                                                    <div className="space-y-2 pt-4">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/6"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/5"></div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </>
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
                </CardContent>
            </Card>
        </div>
    );
}
