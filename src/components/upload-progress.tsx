'use client';

import React from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Progress } from './ui/progress';

interface UploadProgressProps {
    progress: number;
    filename: string;
    filesize: number;
    status: 'uploading' | 'processing' | 'completed' | 'error';
    error?: string;
    className?: string;
}

export function UploadProgress({
    progress,
    filename,
    filesize,
    status,
    error,
    className
}: UploadProgressProps) {
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'uploading':
                return <Upload className="w-5 h-5 text-indigo-600 animate-pulse" />;
            case 'processing':
                return <Upload className="w-5 h-5 text-indigo-600 animate-spin" />;
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-emerald-600" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-rose-600" />;
            default:
                return <Upload className="w-5 h-5 text-indigo-600" />;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'uploading':
                return 'Uploading file...';
            case 'processing':
                return 'Processing document...';
            case 'completed':
                return 'Upload completed';
            case 'error':
                return 'Upload failed';
            default:
                return 'Uploading...';
        }
    };

    const getProgressColor = () => {
        if (status === 'error') return 'bg-rose-600';
        if (status === 'completed') return 'bg-emerald-600';
        return 'bg-indigo-600';
    };

    return (
        <div className={cn("border border-gray-200 rounded-lg p-6 bg-gray-50", className)}>
            <div className="flex items-center gap-3 mb-4">
                {getStatusIcon()}
                <div className="flex-1">
                    <p className="font-medium text-gray-900">{getStatusText()}</p>
                    <p className="text-sm text-gray-600">
                        {filename} • {formatFileSize(filesize)}
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <Progress
                value={status === 'completed' ? 100 : progress}
                className="w-full h-3 mb-3"
            />

            {/* Progress Percentage */}
            <div className="flex justify-between items-center text-sm text-gray-600">
                <span>{status === 'completed' ? 100 : Math.round(progress)}%</span>
                {status === 'uploading' && (
                    <span className="text-indigo-600 font-medium">
                        {progress < 100 ? 'Uploading...' : 'Finalizing...'}
                    </span>
                )}
                {status === 'processing' && (
                    <span className="text-indigo-600 font-medium">Processing...</span>
                )}
                {status === 'completed' && (
                    <span className="text-emerald-600 font-medium">Complete</span>
                )}
                {status === 'error' && (
                    <span className="text-rose-600 font-medium">Failed</span>
                )}
            </div>

            {/* Error Message */}
            {error && status === 'error' && (
                <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-md">
                    <p className="text-sm text-rose-700">{error}</p>
                </div>
            )}


        </div>
    );
}
