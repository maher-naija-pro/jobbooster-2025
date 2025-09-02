'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface DebugApiResponseProps {
    data: any;
    title?: string;
    className?: string;
}

export function DebugApiResponse({
    data,
    title = "API Response Debug",
    className
}: DebugApiResponseProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (!data) {
        return (
            <div className={cn("bg-gray-50 border border-gray-200 rounded-lg p-4", className)}>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>No API response data available</span>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("bg-gray-50 border border-gray-200 rounded-lg", className)}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Debug
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                    >
                        {copied ? (
                            <>
                                <Check className="w-3 h-3" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="w-3 h-3" />
                                Copy
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => setIsVisible(!isVisible)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                    >
                        {isVisible ? (
                            <>
                                <EyeOff className="w-3 h-3" />
                                Hide
                            </>
                        ) : (
                            <>
                                <Eye className="w-3 h-3" />
                                Show
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            {isVisible && (
                <div className="p-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-96 overflow-auto">
                        <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>

                    {/* Data Summary */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div className="bg-white p-3 rounded border">
                            <div className="text-gray-600">Type</div>
                            <div className="font-medium text-gray-900">
                                {typeof data}
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <div className="text-gray-600">Keys</div>
                            <div className="font-medium text-gray-900">
                                {typeof data === 'object' && data !== null ? Object.keys(data).length : 'N/A'}
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <div className="text-gray-600">Size</div>
                            <div className="font-medium text-gray-900">
                                {JSON.stringify(data).length} chars
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <div className="text-gray-600">Status</div>
                            <div className="font-medium text-gray-900">
                                {data?.success ? 'Success' : data?.error ? 'Error' : 'Unknown'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
