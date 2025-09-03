'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { cn, validateFile, formatFileSize } from '../lib/utils';
import { CVData } from '../lib/types';
import { UploadProgress } from './upload-progress';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

interface CVUploadProps {
    onFileUpload: (file: File) => Promise<void>;
    onFileRemove: () => void;
    cvData: CVData | null;
    isProcessing: boolean;
    error: string | null;
    className?: string;
    uploadProgress: number;
    isUploading: boolean;
}

export function CVUpload({
    onFileUpload,
    onFileRemove,
    cvData,
    isProcessing,
    error,
    className,
    uploadProgress,
    isUploading
}: CVUploadProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = useCallback(async (file: File) => {
        const validation = validateFile(file);
        if (!validation.isValid) {
            // Handle error through parent component
            // You might want to call an error handler here if available
            console.error('File validation failed:', validation.error);
            return;
        }

        setCurrentFile(file);
        try {
            await onFileUpload(file);
        } catch (err) {
            console.error('File upload failed:', err);
            setCurrentFile(null);
        }
    }, [onFileUpload]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await processFile(files[0]);
        }
    }, [processFile]);

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await processFile(files[0]);
            // Reset the file input to prevent issues with multiple selections
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [processFile]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = () => {
        onFileRemove();
        setCurrentFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={cn("space-y-0.5", className)}>
            {/* Main Header with Title and Description */}
            <div className="text-center mb-0.5">
                <div className="flex justify-center gap-1 mb-0.5">
                    <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>n                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />n                        </svg>

                    </div>
                    <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-0.5">
                    Job Application Enhancer
                </h2>
                <p className="text-gray-600 max-w-lg mx-auto text-xs leading-tight">
                    All tools to create tailored job application kit aligned with your job description
                    and your unique skills.
                </p>
            </div>



            {/* Upload Area - Show when not uploading, processing, or has CV data */}
            {!cvData && !isProcessing && !isUploading && (
                <Card className="overflow-hidden">

                    <div className="flex items-center gap-0.5 ml-5 ">
                        <Upload className="w-2 h-2 text-gray-600" />
                        <span className="text-xs font-medium text-gray-900">Upload CV/Resume</span>
                    </div>


                    <CardContent className="p-2-">
                        <div
                            className={cn(
                                "relative border-2 border-dashed  border-gray-300 p-0.5 text-center transition-colors cursor-pointer",
                                isDragOver
                                    ? "border-blue-400 bg-blue-50"
                                    : "hover:border-gray-400",
                                error && "border-red-300 bg-red-50"
                            )}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={handleClick}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            <div className="flex flex-col items-center gap-0.5">
                                <Upload className={cn(
                                    "w-2 h-2",
                                    isDragOver ? "text-blue-500" : "text-gray-400"
                                )} />

                                <div className="space-y-0.5">
                                    <p className="text-xs font-medium text-gray-900">
                                        {isDragOver ? "Drop your CV here" : "Drop your CV/Resume here"}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        or <span className="text-blue-600 hover:text-blue-700 font-medium">click to browse</span>
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PDF, DOC, DOCX up to 10MB
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Upload Progress - Show when uploading or processing */}
            {(isUploading || (cvData && cvData.status === 'processing')) && currentFile && (
                <UploadProgress
                    progress={uploadProgress}
                    filename={currentFile.name}
                    filesize={currentFile.size}
                    status={isUploading ? 'uploading' : cvData?.status || 'uploading'}
                    className="mb-1"
                />
            )}



            {/* CV Data Display - Show when upload and processing are complete */}
            {cvData && cvData.status === 'completed' && !isUploading && (
                <Card className="overflow-hidden">
                    <CardHeader className="bg-gray-50 px-5 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span className="text-sm font-medium text-gray-900">CV Uploaded Successfully</span>
                        </div>
                        <Button
                            onClick={handleRemove}
                            variant="ghost"
                            size="sm"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </CardHeader>

                    <CardContent className="px-5 ">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{cvData.filename}</p>
                                <p className="text-xs text-gray-600">
                                    {formatFileSize(cvData.size)} • Uploaded {cvData.uploadDate.toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Error Display */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Upload Error</p>
                            <p className="text-sm">{error}</p>
                            <p className="text-xs text-red-600">
                                Please try uploading a different file or contact support if the issue persists.
                            </p>
                        </div>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
