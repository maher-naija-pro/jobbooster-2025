'use client';

import { useState } from 'react';
import { FileText, Mail, Loader2, CheckCircle, AlertCircle, Download, Edit } from 'lucide-react';
import { useApp } from '../lib/context';
import type { GeneratedContent } from '../lib/types';

interface ActionButtonsProps {
    isCVUploaded?: boolean;
    isJobOfferProvided?: boolean;
    generationState?: 'idle' | 'generating' | 'success' | 'error';
    generationType?: 'letter' | 'email' | null;
    generationProgress?: number;
    generationError?: string | null;
    generatedContent?: GeneratedContent | null;
}

export function ActionButtons({
    isCVUploaded = false,
    isJobOfferProvided = false,
    generationState = 'idle',
    generationType = null,
    generationProgress = 0,
    generatedContent = null
}: ActionButtonsProps) {
    const { state, setGenerationState, setGeneratedContent, clearGeneratedContent } = useApp();
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopyToClipboard = async () => {
        if (!generatedContent) return;

        try {
            await navigator.clipboard.writeText(generatedContent.content);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    const canGenerate = isCVUploaded && isJobOfferProvided;

    const handleGenerateLetter = async () => {
        if (!canGenerate || generationState === 'generating') return;

        setGenerationState('generating', 'letter', 0);

        try {
            let accumulatedContent = '';

            // Call the letter generation API with streaming
            const response = await fetch('/api/generate-letter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cvData: state.cvData,
                    jobAnalysis: state.jobAnalysis,
                    language: state.selectedLanguage.code,
                    tone: 'professional'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Generation failed');
            }

            // Handle streaming response
            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Failed to get stream reader');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');

                    // Process complete lines
                    for (let i = 0; i < lines.length - 1; i++) {
                        const line = lines[i].trim();
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') continue;

                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.choices && parsed.choices[0]?.delta?.content) {
                                    accumulatedContent += parsed.choices[0].delta.content;

                                    // Update progress and show partial content
                                    const progress = Math.min(90, (accumulatedContent.length / 1000) * 100);
                                    setGenerationState('generating', 'letter', progress);

                                    // Update the content in real-time
                                    setGeneratedContent({
                                        id: `letter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                                        type: 'cover-letter',
                                        language: state.selectedLanguage.code,
                                        content: accumulatedContent,
                                        metadata: {
                                            wordCount: accumulatedContent.split(/\s+/).length,
                                            estimatedReadTime: Math.ceil(accumulatedContent.split(/\s+/).length / 200),
                                            skillsHighlighted: state.cvData?.extractedSkills?.slice(0, 5) || ['JavaScript', 'React', 'TypeScript'],
                                            atsOptimized: true
                                        },
                                        exportOptions: [
                                            {
                                                type: 'pdf',
                                                filename: `cover-letter-${Date.now()}.pdf`,
                                                downloadUrl: '#'
                                            },
                                            {
                                                type: 'docx',
                                                filename: `cover-letter-${Date.now()}.docx`,
                                                downloadUrl: '#'
                                            }
                                        ],
                                        generatedAt: new Date().toISOString(),
                                        processingTime: Date.now() - Date.now() // Will be calculated properly later
                                    });
                                }
                            } catch (e) {
                                // Skip invalid JSON chunks
                            }
                        }
                    }

                    buffer = lines[lines.length - 1]; // Keep incomplete line for next iteration
                }
            } finally {
                reader.releaseLock();
            }

            // Finalize the content
            setGenerationState('success', 'letter', 100);

        } catch (error) {
            console.error('Letter generation failed:', error);
            setGenerationState('error', 'letter', 0, 'Letter generation failed. Please try again.');
        }
    };

    const handleGenerateMail = async () => {
        if (!canGenerate || generationState === 'generating') return;

        setGenerationState('generating', 'email', 0);

        try {
            let accumulatedContent = '';

            // Call the email generation API with streaming
            const response = await fetch('/api/generate-mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cvData: state.cvData,
                    jobAnalysis: state.jobAnalysis,
                    language: state.selectedLanguage.code,
                    type: 'application'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Generation failed');
            }

            // Handle streaming response
            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Failed to get stream reader');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');

                    // Process complete lines
                    for (let i = 0; i < lines.length - 1; i++) {
                        const line = lines[i].trim();
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') continue;

                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.choices && parsed.choices[0]?.delta?.content) {
                                    accumulatedContent += parsed.choices[0].delta.content;

                                    // Update progress and show partial content
                                    const progress = Math.min(90, (accumulatedContent.length / 800) * 100);
                                    setGenerationState('generating', 'email', progress);

                                    // Update the content in real-time
                                    setGeneratedContent({
                                        id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                                        type: 'email',
                                        language: state.selectedLanguage.code,
                                        content: accumulatedContent,
                                        metadata: {
                                            wordCount: accumulatedContent.split(/\s+/).length,
                                            estimatedReadTime: Math.ceil(accumulatedContent.split(/\s+/).length / 200),
                                            skillsHighlighted: state.cvData?.extractedSkills?.slice(0, 4) || ['JavaScript', 'React', 'TypeScript'],
                                            atsOptimized: false,
                                            type: 'application',
                                            subject: 'Application for Software Developer Position'
                                        },
                                        exportOptions: [
                                            {
                                                type: 'txt',
                                                filename: `application-email-${Date.now()}.txt`,
                                                downloadUrl: '#'
                                            }
                                        ],
                                        generatedAt: new Date().toISOString(),
                                        processingTime: Date.now() - Date.now() // Will be calculated properly later
                                    });
                                }
                            } catch (e) {
                                // Skip invalid JSON chunks
                            }
                        }
                    }

                    buffer = lines[lines.length - 1]; // Keep incomplete line for next iteration
                }
            } finally {
                reader.releaseLock();
            }

            // Finalize the content
            setGenerationState('success', 'email', 100);

        } catch (error) {
            console.error('Mail generation failed:', error);
            setGenerationState('error', 'email', 0, 'Email generation failed. Please try again.');
        }
    };

    const getButtonClasses = (isGenerating: boolean, isSuccess: boolean, isError: boolean, disabled: boolean) => {
        const baseClasses = "flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

        if (disabled) {
            return `${baseClasses} bg-gray-100 text-gray-400 cursor-not-allowed`;
        }

        if (isGenerating) {
            return `${baseClasses} bg-blue-600 text-white cursor-wait`;
        }

        if (isSuccess) {
            return `${baseClasses} bg-green-600 text-white hover:bg-green-700`;
        }

        if (isError) {
            return `${baseClasses} bg-red-600 text-white hover:bg-red-700`;
        }

        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
    };

    const getButtonContent = (
        icon: React.ReactNode,
        label: string,
        isGenerating: boolean,
        isSuccess: boolean,
        isError: boolean,
        progress: number
    ) => {
        if (isGenerating) {
            return (
                <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating {label}...
                    <span className="ml-2 text-xs">({progress}%)</span>
                </>
            );
        }

        if (isSuccess) {
            return (
                <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {label} Generated!
                </>
            );
        }

        if (isError) {
            return (
                <>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Generation Failed
                </>
            );
        }

        return (
            <>
                {icon}
                Generate {label}
            </>
        );
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Action Buttons</h3>
            </div>

            <div className="space-y-4">
                {/* Prerequisites Check */}
                {!canGenerate && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex">
                            <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                            <div className="text-sm text-yellow-800">
                                <p className="font-medium">Prerequisites not met</p>
                                <ul className="mt-1 list-disc list-inside space-y-1">
                                    {!isCVUploaded && <li>Upload your CV/Resume</li>}
                                    {!isJobOfferProvided && <li>Provide job offer description</li>}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress Bars */}
                {generationState === 'generating' && (
                    <div className="space-y-2">
                        {generationType === 'letter' && (
                            <div>
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Generating Cover Letter</span>
                                    <span>{generationProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${generationProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                        {generationType === 'email' && (
                            <div>
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Generating Email</span>
                                    <span>{generationProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${generationProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                        onClick={handleGenerateLetter}
                        disabled={!canGenerate || generationState === 'generating'}
                        className={getButtonClasses(
                            generationState === 'generating' && generationType === 'letter',
                            generationState === 'success' && generationType === 'letter',
                            generationState === 'error' && generationType === 'letter',
                            !canGenerate
                        )}
                    >
                        {getButtonContent(
                            <FileText className="h-4 w-4 mr-2" />,
                            'Letter',
                            generationState === 'generating' && generationType === 'letter',
                            generationState === 'success' && generationType === 'letter',
                            generationState === 'error' && generationType === 'letter',
                            generationProgress
                        )}
                    </button>

                    <button
                        onClick={handleGenerateMail}
                        disabled={!canGenerate || generationState === 'generating'}
                        className={getButtonClasses(
                            generationState === 'generating' && generationType === 'email',
                            generationState === 'success' && generationType === 'email',
                            generationState === 'error' && generationType === 'email',
                            !canGenerate
                        )}
                    >
                        {getButtonContent(
                            <Mail className="h-4 w-4 mr-2" />,
                            'Mail',
                            generationState === 'generating' && generationType === 'email',
                            generationState === 'success' && generationType === 'email',
                            generationState === 'error' && generationType === 'email',
                            generationProgress
                        )}
                    </button>
                </div>

                {/* Generated Content Display */}
                {generationState === 'success' && generatedContent && (
                    <div className="mt-6 space-y-4">
                        {/* Content Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FileText className="h-5 w-5 text-green-600 mr-2" />
                                <h4 className="text-lg font-semibold text-gray-900">
                                    {generatedContent.type === 'cover-letter' ? 'Generated Cover Letter' : 'Generated Email'}
                                </h4>
                            </div>
                            <div className="text-sm text-gray-500">
                                {generatedContent.metadata.wordCount} words • {generatedContent.metadata.estimatedReadTime} min read
                            </div>
                        </div>

                        {/* Content Display */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                                {generatedContent.content}
                            </div>
                        </div>

                        {/* Content Metadata */}
                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                Language: {generatedContent.language.toUpperCase()}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800">
                                Skills highlighted: {generatedContent.metadata.skillsHighlighted.length}
                            </span>
                            {generatedContent.type === 'cover-letter' && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                                    ATS Optimized: {generatedContent.metadata.atsOptimized ? 'Yes' : 'No'}
                                </span>
                            )}
                            {generatedContent.type === 'email' && generatedContent.metadata.type && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                                    Type: {generatedContent.metadata.type}
                                </span>
                            )}
                        </div>

                        {/* Success Actions */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                            {generatedContent.exportOptions.map((option, index) => (
                                <button
                                    key={index}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download {option.type.toUpperCase()}
                                </button>
                            ))}
                            <button
                                onClick={clearGeneratedContent}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Content
                            </button>
                            <button
                                onClick={handleCopyToClipboard}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {copySuccess ? (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <FileText className="h-4 w-4 mr-2" />
                                        Copy to Clipboard
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Help Text */}
                <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                    <p>
                        💡 <strong>Tip:</strong> Generate both a cover letter and email for a complete application package.
                        The AI will tailor the content based on your CV and the job description.
                    </p>
                    {!generatedContent && generationState !== 'generating' && (
                        <p className="mt-2 text-gray-600">
                            📝 <strong>Note:</strong> Generated content will appear below the buttons once ready.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
