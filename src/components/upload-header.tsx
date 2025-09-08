'use client';

import React from 'react';

export function UploadHeader() {
    return (
        <div className="text-center mb-2">
            <div className="flex justify-center gap-1 mb-1">
                <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div className="w-7 h-7 bg-success/10 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">
                Job Application Enhancer
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto text-xs leading-tight">
                All tools to create tailored job application kit aligned with your job description
                and your unique skills.
            </p>
        </div>
    );
}
