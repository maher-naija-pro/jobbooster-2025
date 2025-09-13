'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, Loader, Eye, Target, Shield, FileCheck, X } from 'lucide-react';
import { cn, validateFile, formatFileSize } from '@/lib/utils';
import { CVData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface CVUploadModalProps {
    onFileUpload: (file: File) => Promise<void>;
    onFileRemove: () => void;
    cvData: CVData | null;
    isProcessing: boolean;
    error: string | null;
    uploadProgress: number;
    isUploading: boolean;
    cvDataList?: CVData[];
    children?: React.ReactNode;
}

export function CVUploadModal({
    onFileUpload,
    onFileRemove,
    cvData,
    isProcessing,
    error,
    uploadProgress,
    isUploading,
    cvDataList = [],
    children
}: CVUploadModalProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [uploadCompleted, setUploadCompleted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = useCallback(async (file: File) => {
        const validation = validateFile(file);
        if (!validation.isValid) {
            console.error('File validation failed:', validation.error);
            return;
        }

        setCurrentFile(file);
        setUploadCompleted(false);
        try {
            await onFileUpload(file);
            // Mark upload as completed when the promise resolves
            setUploadCompleted(true);
        } catch (err) {
            console.error('File upload failed:', err);
            setCurrentFile(null);
            setUploadCompleted(false);
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

    const handleClose = () => {
        setIsOpen(false);
        setCurrentFile(null);
        setShowSuccessMessage(false);
        setUploadCompleted(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Show success message when upload is successful
    useEffect(() => {
        if (uploadCompleted && !isUploading && !isProcessing) {
            // Show success message
            setShowSuccessMessage(true);
        }
    }, [uploadCompleted, isUploading, isProcessing]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        onClick={() => setIsOpen(true)}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload CV
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                            <Upload className="h-6 w-6 text-white" />
                        </div>
                        Upload CV
                    </DialogTitle>
                    <DialogDescription className="text-slate-600 text-base">
                        Upload a new CV or resume to get started with content generation
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Modern Upload Area - Show when not uploading or processing */}
                    {!isProcessing && !isUploading && (
                        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <div
                                    className={cn(
                                        "relative border-2 border-dashed rounded-xl text-center transition-all duration-300 cursor-pointer min-h-[120px] flex flex-col items-center justify-center group hover:scale-[1.02] hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
                                        isDragOver
                                            ? "border-blue-500 bg-blue-50 scale-[1.02] shadow-lg"
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

                                    <div className="flex flex-col items-center gap-3">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                                            isDragOver
                                                ? "bg-blue-100 scale-110 shadow-lg"
                                                : "bg-gray-100 group-hover:bg-blue-100"
                                        )}>
                                            <Target className={cn(
                                                "w-6 h-6 transition-all duration-300",
                                                isDragOver ? "text-blue-600 scale-110" : "text-gray-600 group-hover:text-blue-600"
                                            )} />
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className={cn(
                                                "text-lg font-semibold transition-colors duration-300",
                                                isDragOver ? "text-blue-700" : "text-gray-900 group-hover:text-blue-700"
                                            )}>
                                                {isDragOver ? "Drop to Upload" : cvDataList.length > 0 ? "Upload Another CV" : "Drop to Upload CV/Resume"}
                                            </h3>
                                            <p className="text-sm text-gray-600 group-hover:text-gray-700">
                                                or <span className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors underline decoration-2 underline-offset-2">click to browse</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <FileCheck className="w-4 h-4 text-green-600" />
                                        <span className="font-medium">PDF, DOC, DOCX (Max 10MB)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-blue-600" />
                                        <span className="font-medium">Secure</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Modern Upload Progress - Show when uploading or processing */}
                    {(isUploading || (cvData && cvData.status === 'processing')) && currentFile && (
                        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        {isUploading ? (
                                            <Upload className="w-6 h-6 text-blue-600 animate-pulse" />
                                        ) : (
                                            <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-base font-semibold text-gray-900 truncate">
                                                {currentFile.name}
                                            </p>
                                            <span className="text-lg font-bold text-blue-600 ml-2">
                                                {Math.round(uploadProgress)}%
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                            <span className="font-medium">{formatFileSize(currentFile.size)} • {getFileExtension(currentFile.name)}</span>
                                            <span className="font-medium text-blue-600">{isUploading ? "Uploading..." : "Processing..."}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
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
                        <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-base font-semibold text-gray-900 truncate">
                                                {cvData.filename}
                                            </p>
                                            <div className="flex items-center gap-2 ml-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    aria-label="View file details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    onClick={handleRemove}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                    aria-label="Remove file"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <span className="font-medium">{formatFileSize(cvData.size)} • {getFileExtension(cvData.filename)}</span>
                                            <span className="text-green-600 font-bold flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4" />
                                                Processed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Success Message */}
                    {showSuccessMessage && uploadCompleted && currentFile && (
                        <Card className="overflow-hidden border-green-300 bg-green-50 hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-bold text-green-900 mb-2">Upload Successful!</h4>
                                        <p className="text-sm text-green-700 mb-3">
                                            Your CV "{currentFile.name}" has been uploaded and processed successfully.
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-green-600">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="font-medium">Upload completed successfully!</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Modern Error Display */}
                    {error && (
                        <Card className="overflow-hidden border-red-300 bg-red-50 hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-bold text-red-900 mb-2">Upload Failed</h4>
                                        <p className="text-sm text-red-700 mb-3 break-words">{error}</p>
                                        <div className="flex items-center gap-2 text-sm text-red-600">
                                            <Shield className="w-4 h-4" />
                                            <span className="font-medium">Try a different file or contact support</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={isUploading || isProcessing}
                        >
                            {uploadCompleted ? 'Close' : 'Cancel'}
                        </Button>
                        {uploadCompleted && (
                            <Button
                                variant="default"
                                onClick={handleClose}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Done
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
