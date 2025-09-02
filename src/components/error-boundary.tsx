'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
                <div className="bg-white rounded-xl border border-red-200 p-6">
                    <div className="text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Something went wrong
                        </h3>
                        <p className="text-gray-600 mb-4">
                            An error occurred while rendering the CV analysis component.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left">
                                <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
                                <pre className="text-xs text-red-700 whitespace-pre-wrap">
                                    {this.state.error.toString()}
                                </pre>
                                {this.state.errorInfo && (
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-red-700 font-medium">
                                            Stack Trace
                                        </summary>
                                        <pre className="text-xs text-red-600 mt-2 whitespace-pre-wrap">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        <button
                            onClick={this.handleReset}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
