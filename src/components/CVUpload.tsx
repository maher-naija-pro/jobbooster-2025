'use client';

import { useCallback, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../lib/context';
import type { CVData } from '../lib/types';

interface CVUploadProps {
    cvData?: CVData | null;
    uploadState?: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
    uploadProgress?: number;
    uploadError?: string | null;
    maxFileSize?: number;
    supportedFormats?: string[];
}

export function CVUpload({
    cvData = null,
    uploadState = 'idle',
    uploadProgress = 0,
    uploadError = null,
    maxFileSize = 10 * 1024 * 1024, // 10MB default
    supportedFormats = ['pdf', 'doc', 'docx']
}: CVUploadProps) {
    const { setCVUploadState, setCVData, clearCVData } = useApp();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = useCallback((file: File): string | null => {
        // Check file size
        if (file.size > maxFileSize) {
            return `File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`;
        }

        // Check file type
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !supportedFormats.includes(fileExtension)) {
            return `Unsupported file format. Please upload ${supportedFormats.join(', ')} files only`;
        }

        return null;
    }, [maxFileSize, supportedFormats]);

    const processFile = useCallback(async (file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            setCVUploadState('error', 0, validationError);
            return;
        }

        setCVUploadState('uploading', 0, null);

        try {
            // Create FormData for API call
            const formData = new FormData();
            formData.append('file', file);

            // Simulate upload progress while API call is processing
            const progressInterval = setInterval(() => {
                setCVUploadState('uploading', uploadProgress + 10);
            }, 200);

            // Call the upload API
            const response = await fetch('/api/upload-cv', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                clearInterval(progressInterval);
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const result = await response.json();

            clearInterval(progressInterval);
            setCVUploadState('processing', 100, null);

            // Simulate additional processing delay for UI feedback
            await new Promise(resolve => setTimeout(resolve, 500));

            // Use the actual API response data
            const cvData: CVData = {
                id: result.cvData.id,
                filename: result.cvData.filename,
                size: result.cvData.size,
                uploadDate: new Date(result.cvData.uploadDate),
                extractedSkills: result.cvData.extractedSkills,
                processedContent: result.cvData.processedContent
            };

            setCVData(cvData);

        } catch (err) {
            console.error('File upload failed:', err);
            setCVUploadState('error', 0, 'Upload failed. Please try again.');
        }
    }, [validateFile, uploadProgress, setCVUploadState, setCVData]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            processFile(files[0]);
        }
    }, [processFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    }, [processFile]);

    const handleRemoveFile = useCallback(() => {
        clearCVData();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [clearCVData]);

    const handleRetry = useCallback(() => {
        setCVUploadState('idle', 0, null);
    }, [setCVUploadState]);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
                <Upload className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">CV/Resume Upload</h3>
            </div>

            <div
                className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${uploadState === 'dragover'
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }
          ${uploadState === 'uploading' || uploadState === 'processing'
                        ? 'border-blue-400 bg-blue-50'
                        : ''
                    }
          ${uploadState === 'error'
                        ? 'border-red-400 bg-red-50'
                        : ''
                    }
          ${uploadState === 'success'
                        ? 'border-green-400 bg-green-50'
                        : ''
                    }
        `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={supportedFormats.map(format => `.${format}`).join(',')}
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadState === 'uploading' || uploadState === 'processing'}
                />

                {/* Idle State */}
                {uploadState === 'idle' && !cvData && (
                    <div>
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">
                            📄 + Upload Area
                        </p>
                        <p className="text-gray-600 mb-4">
                            Drop your CV/Resume PDF here or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                            Supports: {supportedFormats.join(', ').toUpperCase()} • Max size: {maxFileSize / (1024 * 1024)}MB
                        </p>
                    </div>
                )}

                {/* Drag Over State */}
                {uploadState === 'dragover' && (
                    <div>
                        <Upload className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                        <p className="text-lg font-medium text-blue-700">
                            Drop your file here
                        </p>
                    </div>
                )}

                {/* Uploading State */}
                {uploadState === 'uploading' && (
                    <div>
                        <div className="animate-spin mx-auto h-12 w-12 text-blue-500 mb-4">
                            <Upload className="h-12 w-12" />
                        </div>
                        <p className="text-lg font-medium text-blue-700 mb-2">
                            Uploading document...
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-600">
                            Progress: {uploadProgress}%
                        </p>
                    </div>
                )}

                {/* Processing State */}
                {uploadState === 'processing' && (
                    <div>
                        <div className="animate-pulse mx-auto h-12 w-12 text-blue-500 mb-4">
                            <FileText className="h-12 w-12" />
                        </div>
                        <p className="text-lg font-medium text-blue-700 mb-2">
                            ⏳ Processing document...
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div className="bg-blue-600 h-2 rounded-full w-full animate-pulse" />
                        </div>
                    </div>
                )}

                {/* Success State */}
                {uploadState === 'success' && cvData && (
                    <div>
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                        <p className="text-lg font-medium text-green-700 mb-2">
                            ✅ {cvData.filename}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                            {formatFileSize(cvData.size)} • Uploaded successfully
                        </p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile();
                            }}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                        </button>
                    </div>
                )}

                {/* Error State */}
                {uploadState === 'error' && (
                    <div>
                        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                        <p className="text-lg font-medium text-red-700 mb-2">
                            ❌ Upload Failed
                        </p>
                        <p className="text-sm text-red-600 mb-4">
                            {uploadError || 'An error occurred during upload'}
                        </p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRetry();
                            }}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
