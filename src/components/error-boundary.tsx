'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Card className="border-red-200">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Something went wrong
                            </h3>
                            <p className="text-gray-600 mb-4">
                                An error occurred while rendering the CV analysis component.
                            </p>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <Alert variant="destructive" className="mb-4 text-left">
                                    <AlertTriangle className="w-4 h-4" />
                                    <AlertDescription>
                                        <div className="space-y-2">
                                            <h4 className="font-medium mb-2">Error Details:</h4>
                                            <pre className="text-xs whitespace-pre-wrap">
                                                {this.state.error.toString()}
                                            </pre>
                                            {this.state.errorInfo && (
                                                <details className="mt-2">
                                                    <summary className="cursor-pointer font-medium">
                                                        Stack Trace
                                                    </summary>
                                                    <pre className="text-xs mt-2 whitespace-pre-wrap">
                                                        {this.state.errorInfo.componentStack}
                                                    </pre>
                                                </details>
                                            )}
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Button
                                onClick={this.handleReset}
                                className="flex items-center gap-2 mx-auto"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return this.props.children;
    }
}
