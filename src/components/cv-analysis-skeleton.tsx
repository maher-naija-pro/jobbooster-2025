'use client';

import React from 'react';
import { Target, CheckCircle, AlertTriangle, Star, Lightbulb, Eye, EyeOff } from 'lucide-react';

interface CVAnalysisSkeletonProps {
    progress: number;
    className?: string;
}

export function CVAnalysisSkeleton({ progress, className = '' }: CVAnalysisSkeletonProps) {
    // Determine which sections to show based on progress
    const showHeader = progress >= 20;
    const showScore = progress >= 30;
    const showCards = progress >= 40;
    const showTechnicalTable = progress >= 60;
    const showSoftSkillsTable = progress >= 70;
    const showRecommendations = progress >= 80;

    const SkeletonBox = ({ className: boxClassName = '', children }: { className?: string; children: React.ReactNode }) => (
        <div className={`animate-pulse ${boxClassName}`}>
            {children}
        </div>
    );

    const SkeletonText = ({ width = 'w-full', height = 'h-4' }: { width?: string; height?: string }) => (
        <div className={`bg-gray-200 rounded ${width} ${height} shimmer`}></div>
    );

    const SkeletonButton = () => (
        <div className="bg-gray-200 rounded-lg px-3 py-2 w-20 h-8 shimmer"></div>
    );

    const SkeletonCard = ({ children, bgColor = 'bg-gray-50', borderColor = 'border-gray-200' }: {
        children: React.ReactNode;
        bgColor?: string;
        borderColor?: string;
    }) => (
        <div className={`${bgColor} rounded-lg p-4 border ${borderColor}`}>
            {children}
        </div>
    );

    const SkeletonTable = ({ title, bgColor = 'bg-gray-50', borderColor = 'border-gray-200' }: {
        title: string;
        bgColor?: string;
        borderColor?: string;
    }) => (
        <div className={`${bgColor} rounded-lg p-6 border ${borderColor}`}>
            <SkeletonText width="w-48" height="h-6" className="mb-4" />
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-300">
                            {['Skill Name', 'Job Required', 'CV Level', 'Match', 'Status'].map((header, index) => (
                                <th key={index} className="text-left py-3 px-4">
                                    <SkeletonText width="w-20" height="h-4" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3].map((row) => (
                            <tr key={row} className="border-b border-gray-200">
                                {[1, 2, 3, 4, 5].map((cell) => (
                                    <td key={cell} className="py-3 px-4">
                                        <SkeletonText width="w-16" height="h-4" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Progress Bar - Always visible during generation */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Analyzing CV</h3>
                            <p className="text-sm text-gray-600">AI is analyzing your CV and matching it against job requirements</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-500">Generating...</span>
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                        className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                        {progress < 20 && 'Initializing analysis...'}
                        {progress >= 20 && progress < 40 && 'Analyzing CV structure...'}
                        {progress >= 40 && progress < 60 && 'Processing skills data...'}
                        {progress >= 60 && progress < 80 && 'Generating recommendations...'}
                        {progress >= 80 && 'Finalizing results...'}
                    </span>
                    <span className="text-blue-600 font-medium">{Math.round(progress)}% Complete</span>
                </div>
            </div>

            {/* Header Skeleton */}
            {showHeader && (
                <SkeletonBox className="opacity-100">
                    <div className="flex items-center justify-between">
                        <SkeletonText width="w-64" height="h-8" />
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <SkeletonButton />
                            <SkeletonButton />
                        </div>
                    </div>
                </SkeletonBox>
            )}

            {/* Overall Match Score Card Skeleton */}
            {showScore && (
                <SkeletonBox className="opacity-100">
                    <SkeletonCard bgColor="bg-gradient-to-r from-blue-50 to-purple-50" borderColor="border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-6 bg-gray-200 rounded shimmer"></div>
                            <SkeletonText width="w-40" height="h-6" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-12 bg-gray-200 rounded shimmer"></div>
                            <div className="flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-3 shimmer"></div>
                                <SkeletonText width="w-32" height="h-4" className="mt-2" />
                            </div>
                        </div>
                    </SkeletonCard>
                </SkeletonBox>
            )}

            {/* Summary Cards Skeleton */}
            {showCards && (
                <SkeletonBox className="opacity-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Perfect Matches Card */}
                        <SkeletonCard bgColor="bg-green-50" borderColor="border-green-200">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 rounded shimmer"></div>
                                <div>
                                    <SkeletonText width="w-8" height="h-8" className="mb-1" />
                                    <SkeletonText width="w-24" height="h-4" />
                                </div>
                            </div>
                        </SkeletonCard>

                        {/* Missing Skills Card */}
                        <SkeletonCard bgColor="bg-yellow-50" borderColor="border-yellow-200">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 rounded shimmer"></div>
                                <div>
                                    <SkeletonText width="w-8" height="h-8" className="mb-1" />
                                    <SkeletonText width="w-24" height="h-4" />
                                </div>
                            </div>
                        </SkeletonCard>

                        {/* Strengths Card */}
                        <SkeletonCard bgColor="bg-blue-50" borderColor="border-blue-200">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 rounded shimmer"></div>
                                <div>
                                    <SkeletonText width="w-8" height="h-8" className="mb-1" />
                                    <SkeletonText width="w-24" height="h-4" />
                                </div>
                            </div>
                        </SkeletonCard>
                    </div>
                </SkeletonBox>
            )}

            {/* Technical Skills Table Skeleton */}
            {showTechnicalTable && (
                <SkeletonBox className="opacity-100">
                    <SkeletonTable title="Technical Skills Analysis" />
                </SkeletonBox>
            )}

            {/* Soft Skills Table Skeleton */}
            {showSoftSkillsTable && (
                <SkeletonBox className="opacity-100">
                    <SkeletonTable title="Soft Skills Analysis" bgColor="bg-blue-50" borderColor="border-blue-200" />
                </SkeletonBox>
            )}

            {/* Key Recommendations Skeleton */}
            {showRecommendations && (
                <SkeletonBox className="opacity-100">
                    <SkeletonCard bgColor="bg-purple-50" borderColor="border-purple-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-6 bg-gray-200 rounded shimmer"></div>
                            <SkeletonText width="w-40" height="h-6" />
                        </div>
                        <div className="space-y-2">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0 shimmer"></div>
                                    <SkeletonText width="w-full" height="h-4" />
                                </div>
                            ))}
                        </div>
                    </SkeletonCard>
                </SkeletonBox>
            )}


            <style jsx>{`
        .shimmer {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
        </div>
    );
}

// Progressive loading component that shows different phases
export function CVAnalysisProgressiveSkeleton({ progress, className = '' }: CVAnalysisSkeletonProps) {
    const getPhase = (progress: number) => {
        if (progress < 20) return 'initializing';
        if (progress < 40) return 'structure';
        if (progress < 60) return 'skills';
        if (progress < 80) return 'tables';
        return 'finalizing';
    };

    const phase = getPhase(progress);

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Phase 1: Initializing (0-20%) */}
            {phase === 'initializing' && (
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Analyzing CV</h3>
                                <p className="text-sm text-gray-600">AI is analyzing your CV and matching it against job requirements</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-500">Generating...</span>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Processing your CV data...</span>
                        <span className="text-blue-600 font-medium">{Math.round(progress)}% Complete</span>
                    </div>
                </div>
            )}

            {/* Phase 2: Structure Analysis (20-40%) */}
            {phase === 'structure' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <SkeletonText width="w-64" height="h-8" />
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <SkeletonButton />
                            <SkeletonButton />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-6 bg-gray-200 rounded shimmer"></div>
                            <SkeletonText width="w-40" height="h-6" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-12 bg-gray-200 rounded shimmer"></div>
                            <div className="flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-3 shimmer"></div>
                                <SkeletonText width="w-32" height="h-4" className="mt-2" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Phase 3: Skills Processing (40-60%) */}
            {phase === 'skills' && (
                <CVAnalysisSkeleton progress={progress} />
            )}

            {/* Phase 4: Tables Generation (60-80%) */}
            {phase === 'tables' && (
                <CVAnalysisSkeleton progress={progress} />
            )}

            {/* Phase 5: Finalizing (80-100%) */}
            {phase === 'finalizing' && (
                <CVAnalysisSkeleton progress={progress} />
            )}

            <style jsx>{`
        .shimmer {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
        </div>
    );
}

// Helper component for skeleton text
function SkeletonText({ width = 'w-full', height = 'h-4', className = '' }: {
    width?: string;
    height?: string;
    className?: string;
}) {
    return (
        <div className={`bg-gray-200 rounded ${width} ${height} shimmer ${className}`}></div>
    );
}
