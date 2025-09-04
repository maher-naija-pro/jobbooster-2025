'use client';

import React, { useState, useEffect } from 'react';
import { useTabProgressEnhanced } from '../hooks/use-tab-progress-enhanced';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

export function TabProgressDemo() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationType, setGenerationType] = useState<'cover-letter' | 'email' | 'cv-analysis' | null>(null);
    const [progress, setProgress] = useState(0);

    // Use the tab progress hook
    useTabProgressEnhanced({
        isGenerating,
        generationType,
        progress,
        baseTitle: 'Tab Progress Demo - JobBooster',
        showFaviconProgress: true
    });

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isGenerating && progress < 100) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        setIsGenerating(false);
                        setGenerationType(null);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 100);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isGenerating, progress]);

    const startGeneration = (type: 'cover-letter' | 'email' | 'cv-analysis') => {
        setProgress(0);
        setGenerationType(type);
        setIsGenerating(true);
    };

    const stopGeneration = () => {
        setIsGenerating(false);
        setGenerationType(null);
        setProgress(0);
    };

    const setProgressValue = (value: number) => {
        setProgress(value);
        setIsGenerating(value > 0 && value < 100);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Tab Progress Demo</CardTitle>
                    <p className="text-sm text-gray-600">
                        Watch the browser tab title and favicon change as generation progresses.
                        The progress bar will automatically hide when generation completes.
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Current Status */}
                    <div className="space-y-2">
                        <h3 className="font-medium">Current Status</h3>
                        <div className="text-sm text-gray-600">
                            <p>Generating: {isGenerating ? 'Yes' : 'No'}</p>
                            <p>Type: {generationType || 'None'}</p>
                            <p>Progress: {progress}%</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <h3 className="font-medium">Progress</h3>
                        <Progress value={progress} className="w-full" />
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>0%</span>
                            <span>{progress}%</span>
                            <span>100%</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-4">
                        <h3 className="font-medium">Start Generation</h3>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => startGeneration('cover-letter')}
                                disabled={isGenerating}
                                variant="outline"
                            >
                                📝 Cover Letter
                            </Button>
                            <Button
                                onClick={() => startGeneration('email')}
                                disabled={isGenerating}
                                variant="outline"
                            >
                                📧 Email
                            </Button>
                            <Button
                                onClick={() => startGeneration('cv-analysis')}
                                disabled={isGenerating}
                                variant="outline"
                            >
                                📊 CV Analysis
                            </Button>
                        </div>
                    </div>

                    {/* Manual Progress Control */}
                    <div className="space-y-4">
                        <h3 className="font-medium">Manual Progress Control</h3>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={(e) => setProgressValue(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => setProgressValue(0)}>0%</Button>
                                <Button size="sm" onClick={() => setProgressValue(25)}>25%</Button>
                                <Button size="sm" onClick={() => setProgressValue(50)}>50%</Button>
                                <Button size="sm" onClick={() => setProgressValue(75)}>75%</Button>
                                <Button size="sm" onClick={() => setProgressValue(100)}>100%</Button>
                            </div>
                        </div>
                    </div>

                    {/* Stop Button */}
                    {isGenerating && (
                        <div className="pt-4 border-t">
                            <Button onClick={stopGeneration} variant="destructive">
                                Stop Generation
                            </Button>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">How to Test</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Click any generation button to start</li>
                            <li>• Watch the browser tab title change with progress</li>
                            <li>• Notice the favicon updates with a circular progress indicator</li>
                            <li>• The progress automatically stops at 100% and resets the tab</li>
                            <li>• Use manual controls to test different progress states</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
