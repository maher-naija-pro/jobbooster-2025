'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, Loader, Eye, Target, Shield, FileCheck } from 'lucide-react';
import { cn, validateFile, formatFileSize } from '../lib/utils';
import { CVData } from '../lib/types';

import { MetaButton } from './buttons/meta-button';
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
    cvDataList?: CVData[];
}

export function CVUpload({
    onFileUpload,
    onFileRemove,
    cvData,
    isProcessing,
    error,
    className,
    uploadProgress,
    isUploading,
    cvDataList = []
}: CVUploadProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = useCallback(async (file: File) => {
        const validation = validateFile(file);
        if (!validation.isValid) {
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

    const getFileExtension = (filename: string) => {
        return filename.split('.').pop()?.toUpperCase() || 'FILE';
    };

    return (
        <div className={cn("space-y-1.5", className)}>
            {/* Modern Upload Area - Show when not uploading or processing */}
            {!isProcessing && !isUploading && (
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-sm transition-all duration-300">
                    <CardContent className="p-2">
                        <div
                            className={cn(
                                "relative border border-dashed rounded text-center transition-all duration-300 cursor-pointer min-h-[45px] flex flex-col items-center justify-center group hover:scale-[1.005] hover:shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:ring-offset-1",
                                isDragOver
                                    ? "border-blue-500 bg-blue-50 scale-[1.005] shadow-sm"
                                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30",
                                error && "border-red-400 bg-red-50"
                            )}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={handleClick}
                            role="button"
                            tabIndex={0}
                            aria-label="Upload CV or Resume file"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleClick();
                                }
                            }}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileSelect}
                                className="hidden"
                                aria-label="File input for CV upload"
                            />

                            <div className="flex flex-col items-center gap-0.5">
                                <div className={cn(
                                    "w-5 h-5 rounded flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                                    isDragOver
                                        ? "bg-blue-100 scale-110 shadow-sm"
                                        : "bg-gray-100 group-hover:bg-blue-100"
                                )}>
                                    <Target className={cn(
                                        "w-2.5 h-2.5 transition-all duration-300",
                                        isDragOver ? "text-blue-600 scale-110" : "text-gray-600 group-hover:text-blue-600"
                                    )} />
                                </div>

                                <div className="space-y-0">
                                    <h3 className={cn(
                                        "text-xs font-medium transition-colors duration-300",
                                        isDragOver ? "text-blue-700" : "text-gray-900 group-hover:text-blue-700"
                                    )}>
                                        {isDragOver ? "Drop to Upload" : cvDataList.length > 0 ? "Upload Another CV" : "Drop to Upload CV/Resume"}
                                    </h3>
                                    <p className="text-xs text-gray-600 group-hover:text-gray-700">
                                        or <span className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors underline decoration-1 underline-offset-1">click to browse</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-1.5 flex items-center justify-center gap-2 text-xs text-gray-600">
                            <div className="flex items-center gap-0.5">
                                <FileCheck className="w-2.5 h-2.5 text-green-600" />
                                <span className="font-medium">PDF, DOC, DOCX (Max 10MB)</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                                <Shield className="w-2.5 h-2.5 text-blue-600" />
                                <span className="font-medium">Secure</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Modern Upload Progress - Show when uploading or processing */}
            {(isUploading || (cvData && cvData.status === 'processing')) && currentFile && (
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-sm transition-all duration-300">
                    <CardContent className="p-2">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                {isUploading ? (
                                    <Upload className="w-3 h-3 text-blue-600 animate-pulse" />
                                ) : (
                                    <Loader className="w-3 h-3 text-blue-600 animate-spin" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <p className="text-xs font-medium text-gray-900 truncate">
                                        {currentFile.name}
                                    </p>
                                    <span className="text-xs font-bold text-blue-600 ml-1">
                                        {Math.round(uploadProgress)}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                    <span className="font-medium">{formatFileSize(currentFile.size)} • {getFileExtension(currentFile.name)}</span>
                                    <span className="font-medium text-blue-600">{isUploading ? "Uploading..." : "Processing..."}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                        role="progressbar"
                                        aria-valuenow={uploadProgress}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label={`Upload progress: ${Math.round(uploadProgress)}%`}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Modern CV Data Display - Show when upload and processing are complete */}
            {cvData && cvData.status === 'completed' && !isUploading && (
                <Card className="border-0 shadow-sm hover:shadow-sm transition-all duration-300">
                    <CardContent className="p-2">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <p className="text-xs font-medium text-gray-900 truncate">
                                        {cvData.filename}
                                    </p>
                                    <div className="flex items-center gap-0.5 ml-1">
                                        <MetaButton
                                            variant="primary-ghost"
                                            size="sm"
                                            width="fit"
                                            icon={Eye}
                                            className="h-5 w-5 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            tooltip="View file details"
                                        />
                                        <MetaButton
                                            onClick={handleRemove}
                                            variant="danger-ghost"
                                            size="sm"
                                            width="fit"
                                            icon={Trash2}
                                            className="h-5 w-5 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                            tooltip="Remove file"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-600">
                                    <span className="font-medium">{formatFileSize(cvData.size)} • {getFileExtension(cvData.filename)}</span>
                                    <span className="text-green-600 font-bold flex items-center gap-0.5">
                                        <CheckCircle className="w-2.5 h-2.5" />
                                        Processed
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Modern Error Display */}
            {error && (
                <Card className="overflow-hidden border-red-300 bg-red-50 hover:shadow-sm transition-all duration-300">
                    <CardContent className="p-2">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-3 h-3 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-red-900 mb-0.5">Upload Failed</h4>
                                <p className="text-xs text-red-700 mb-1 break-words">{error}</p>
                                <div className="flex items-center gap-0.5 text-xs text-red-600">
                                    <Shield className="w-2.5 h-2.5" />
                                    <span className="font-medium">Try a different file or contact support</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
