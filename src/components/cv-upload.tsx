'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, Loader, Eye, Target, Shield, FileCheck } from 'lucide-react';
import { cn, validateFile, formatFileSize } from '../lib/utils';
import { CVData } from '../lib/types';

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
        <div className={cn("space-y-2", className)}>
            {/* Ultra Compact Upload Area - Show when not uploading or processing */}
            {!isProcessing && !isUploading && (
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                    <CardContent className="p-4 ">
                        <div
                            className={cn(
                                "relative border-2 border-dashed rounded-lg  text-center transition-all duration-300 cursor-pointer min-h-[120px] flex flex-col items-center justify-center group hover:scale-[1.05] hover:shadow-lg",
                                isDragOver
                                    ? "border-blue-400 bg-blue-50 scale-[1.08] shadow-xl"
                                    : "border-gray-300 hover:border-blue-300 hover:bg-blue-50/50",
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

                            <div className="flex flex-col items-center gap-2">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                                    isDragOver ? "bg-primary/10 scale-125" : "bg-muted group-hover:bg-primary/10"
                                )}>
                                    <Target className={cn(
                                        "w-5 h-5 transition-all duration-300",
                                        isDragOver ? "text-primary scale-110" : "text-muted-foreground group-hover:text-primary"
                                    )} />
                                </div>

                                <div className="space-y-1">
                                    <h4 className={cn(
                                        "text-sm font-medium transition-colors duration-300",
                                        isDragOver ? "text-blue-600" : "text-gray-900 group-hover:text-blue-600"
                                    )}>
                                        {isDragOver ? "Drop to Upload" : cvDataList.length > 0 ? "Upload Another CV" : "Drop to Upload CV/Resume"}
                                    </h4>
                                    <p className="text-xs text-gray-600 group-hover:text-gray-700">
                                        or <span className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors">click to browse</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <FileCheck className="w-3 h-3" />
                                <span>PDF, DOC, DOCX (Max 10MB)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                <span>Secure</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Ultra Compact Upload Progress - Show when uploading or processing */}
            {(isUploading || (cvData && cvData.status === 'processing')) && currentFile && (
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                    <CardContent className="">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                {isUploading ? (
                                    <Upload className="w-4 h-4 text-blue-600 animate-pulse" />
                                ) : (
                                    <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {currentFile.name}
                                    </p>
                                    <span className="text-xs font-medium text-blue-600 ml-2">
                                        {Math.round(uploadProgress)}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                    <span>{formatFileSize(currentFile.size)} • {getFileExtension(currentFile.name)}</span>
                                    <span>{isUploading ? "Uploading..." : "Processing..."}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Ultra Compact CV Data Display - Show when upload and processing are complete */}
            {cvData && cvData.status === 'completed' && !isUploading && (
                <Card className=" border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                    <CardContent className="">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {cvData.filename}
                                    </p>
                                    <div className="flex items-center gap-1 ml-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                        >
                                            <Eye className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            onClick={handleRemove}
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                    <span>{formatFileSize(cvData.size)} • {getFileExtension(cvData.filename)}</span>
                                    <span className="text-green-600 font-medium">✓ Processed</span>
                                </div>

                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Ultra Compact Error Display */}
            {error && (
                <Card className="overflow-hidden border-red-200 bg-red-50 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-red-900 mb-1">Upload Failed</h4>
                                <p className="text-xs text-red-700 mb-2 truncate">{error}</p>
                                <div className="flex items-center gap-1 text-xs text-red-600">
                                    <Shield className="w-3 h-3" />
                                    <span>Try a different file or contact support</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
