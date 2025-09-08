'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { FileText, CheckCircle, Copy, XCircle, Download, Edit, RotateCcw, Square } from 'lucide-react';
import { GeneratedContent, CVData, Language } from '../lib/types';

interface CoverLetterGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    cvData: CVData | null;
    jobOffer: string;
    language: Language;
    onGenerate: () => void;
    onEdit: () => void;
    onRegenerate: () => void;
    onDownload: (format: 'pdf' | 'docx' | 'txt') => void;
    content: GeneratedContent | null;
    isGenerating: boolean;
    generationProgress: number;
    streamingContent: string;
}

export function CoverLetterGeneratorModal({
    isOpen,
    onClose,
    cvData,
    jobOffer,
    language,
    onGenerate,
    onEdit,
    onRegenerate,
    onDownload,
    content,
    isGenerating,
    generationProgress,
    streamingContent
}: CoverLetterGeneratorModalProps) {
    const [copied, setCopied] = useState(false);

    // Reset copied state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setCopied(false);
        }
    }, [isOpen]);

    const handleCopy = async () => {
        if (!content?.content) return;

        try {
            await navigator.clipboard.writeText(content.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleGenerate = () => {
        onGenerate();
    };

    const handleStopGeneration = () => {
        // This would need to be passed as a prop or handled in parent
        window.location.reload(); // Temporary solution
    };

    const displayContent = content?.content || streamingContent;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Cover Letter Generator
                    </DialogTitle>
                    <DialogDescription>
                        Generate a personalized cover letter based on your CV and job offer
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col h-full max-h-[70vh]">
                    {/* Status and Progress */}
                    {isGenerating && (
                        <div className="mb-4 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Generating cover letter...</span>
                                <span className="text-gray-500">{generationProgress}%</span>
                            </div>
                            <Progress value={generationProgress} className="h-2" />
                        </div>
                    )}

                    {/* Content Display */}
                    <Card className="flex-1 overflow-hidden">
                        <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {content && !isGenerating ? (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <FileText className="w-4 h-4 text-blue-600" />
                                    )}
                                    <span className="text-sm font-medium text-gray-900">
                                        {content && !isGenerating ? 'Cover Letter Generated' : 'Generating Cover Letter...'}
                                    </span>
                                </div>

                                {content && !isGenerating && (
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-xs">
                                            {content.metadata?.wordCount || 0} words
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {content.metadata?.estimatedReadTime || 0} min read
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="p-0 h-full overflow-hidden">
                            {displayContent ? (
                                <div className="h-full overflow-y-auto p-4">
                                    <div className="prose prose-sm max-w-none">
                                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
                                            {displayContent}
                                        </pre>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center p-8">
                                    <div className="text-center space-y-4">
                                        <FileText className="w-12 h-12 text-gray-400 mx-auto" />
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Ready to Generate Your Cover Letter
                                            </h3>
                                            <p className="text-gray-600 text-sm max-w-md">
                                                Click the generate button below to create a personalized cover letter
                                                based on your CV and the job offer you provided.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            {!content && !isGenerating && (
                                <Button
                                    onClick={handleGenerate}
                                    disabled={!cvData || !jobOffer}
                                    className="gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Generate Cover Letter
                                </Button>
                            )}

                            {isGenerating && (
                                <Button
                                    onClick={handleStopGeneration}
                                    variant="destructive"
                                    className="gap-2"
                                >
                                    <Square className="w-4 h-4" />
                                    Stop Generation
                                </Button>
                            )}

                            {content && !isGenerating && (
                                <>
                                    <Button
                                        onClick={onEdit}
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </Button>

                                    <Button
                                        onClick={onRegenerate}
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Regenerate
                                    </Button>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {content && !isGenerating && (
                                <>
                                    <Button
                                        onClick={handleCopy}
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        {copied ? (
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </Button>

                                    <div className="flex items-center gap-1">
                                        <Button
                                            onClick={() => onDownload('pdf')}
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            PDF
                                        </Button>
                                        <Button
                                            onClick={() => onDownload('docx')}
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            DOCX
                                        </Button>
                                        <Button
                                            onClick={() => onDownload('txt')}
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            TXT
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
