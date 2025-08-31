'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { cn, validateFile, formatFileSize } from '../lib/utils';
import { CVData } from '../lib/types';
import { UploadProgress } from './upload-progress';

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
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">CV/Resume Upload</h3>
            </div>

            {/* Upload Area - Show when not uploading, processing, or has CV data */}
            {!cvData && !isProcessing && !isUploading && (
                <div
                    className={cn(
                        "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                        isDragOver
                            ? "border-blue-400 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400",
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
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="flex flex-col items-center gap-4">
                        <Upload className={cn(
                            "w-12 h-12",
                            isDragOver ? "text-blue-500" : "text-gray-400"
                        )} />

                        <div className="space-y-2">
                            <p className="text-lg font-medium text-gray-900">
                                {isDragOver ? "Drop your CV here" : "Drop your CV/Resume here"}
                            </p>
                            <p className="text-sm text-gray-600">
                                or <span className="text-blue-600 hover:text-blue-700 font-medium">click to browse</span>
                            </p>
                            <p className="text-xs text-gray-500">
                                Supports PDF, DOC, DOCX files up to 10MB
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Progress - Show when uploading */}
            {isUploading && currentFile && (
                <UploadProgress
                    progress={uploadProgress}
                    filename={currentFile.name}
                    filesize={currentFile.size}
                    status="uploading"
                    className="mb-4"
                />
            )}

            {/* Processing State - Show when processing after upload */}
            {isProcessing && (
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">Processing document...</p>
                            <p className="text-sm text-gray-600">Extracting information from your CV</p>
                        </div>
                    </div>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                </div>
            )}

            {/* CV Data Display - Show when upload and processing are complete */}
            {cvData && !isProcessing && !isUploading && (
                <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="font-medium text-gray-900">{cvData.filename}</p>
                                <p className="text-sm text-gray-600">
                                    {formatFileSize(cvData.size)} • Uploaded {cvData.uploadDate.toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleRemove}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Remove file"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
