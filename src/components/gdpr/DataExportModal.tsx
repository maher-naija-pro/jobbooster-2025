'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, Database, User, Mail, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import { MetaButton } from '@/components/buttons/meta-button'

interface DataExportModalProps {
    isOpen: boolean
    onClose: () => void
    onExport: (format: 'json' | 'csv' | 'pdf') => Promise<void>
}

interface ExportProgress {
    isExporting: boolean
    progress: number
    currentStep: string
    error: string | null
}

export function DataExportModal({ isOpen, onClose, onExport }: DataExportModalProps) {
    const [selectedFormat, setSelectedFormat] = useState<'json' | 'csv' | 'pdf'>('json')
    const [exportProgress, setExportProgress] = useState<ExportProgress>({
        isExporting: false,
        progress: 0,
        currentStep: '',
        error: null
    })

    const dataTypes = [
        {
            id: 'profile',
            name: 'Profile Information',
            description: 'Personal details, preferences, and account settings',
            icon: User,
            estimatedSize: '2-5 KB'
        },
        {
            id: 'cv-data',
            name: 'CV Data',
            description: 'Uploaded CVs, analysis results, and generated content',
            icon: FileText,
            estimatedSize: '10-50 KB'
        },
        {
            id: 'activity',
            name: 'Activity Logs',
            description: 'Login history, feature usage, and user interactions',
            icon: Database,
            estimatedSize: '5-20 KB'
        },
        {
            id: 'communications',
            name: 'Communications',
            description: 'Email notifications and support messages',
            icon: Mail,
            estimatedSize: '1-10 KB'
        },
        {
            id: 'sessions',
            name: 'Session Data',
            description: 'Login sessions and device information',
            icon: Calendar,
            estimatedSize: '1-5 KB'
        }
    ]

    const formatOptions = [
        {
            value: 'json' as const,
            label: 'JSON',
            description: 'Machine-readable format, best for developers',
            extension: '.json'
        },
        {
            value: 'csv' as const,
            label: 'CSV',
            description: 'Spreadsheet format, good for data analysis',
            extension: '.csv'
        },
        {
            value: 'pdf' as const,
            label: 'PDF',
            description: 'Human-readable format, best for review',
            extension: '.pdf'
        }
    ]

    const handleExport = async () => {
        setExportProgress({
            isExporting: true,
            progress: 0,
            currentStep: 'Preparing export...',
            error: null
        })

        try {
            // Simulate progress updates
            const steps = [
                'Collecting profile data...',
                'Processing CV information...',
                'Gathering activity logs...',
                'Compiling communications...',
                'Finalizing export...'
            ]

            for (let i = 0; i < steps.length; i++) {
                setExportProgress(prev => ({
                    ...prev,
                    currentStep: steps[i],
                    progress: ((i + 1) / steps.length) * 100
                }))

                // Simulate processing time
                await new Promise(resolve => setTimeout(resolve, 1000))
            }

            await onExport(selectedFormat)

            setExportProgress(prev => ({
                ...prev,
                isExporting: false,
                progress: 100,
                currentStep: 'Export completed successfully!'
            }))

            // Auto-close after success
            setTimeout(() => {
                onClose()
                setExportProgress({
                    isExporting: false,
                    progress: 0,
                    currentStep: '',
                    error: null
                })
            }, 2000)

        } catch (error) {
            setExportProgress(prev => ({
                ...prev,
                isExporting: false,
                error: error instanceof Error ? error.message : 'Export failed'
            }))
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Download className="h-6 w-6 text-primary" />
                        Export Your Data
                    </CardTitle>
                    <CardDescription>
                        Download a copy of all your personal data stored in our system.
                        This includes your profile, CV data, activity logs, and communications.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {exportProgress.isExporting ? (
                        // Export in progress
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Download className="h-8 w-8 text-primary animate-pulse" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Exporting Your Data</h3>
                                <p className="text-slate-600 dark:text-slate-300">{exportProgress.currentStep}</p>
                            </div>

                            <Progress value={exportProgress.progress} className="w-full" />

                            <div className="text-center text-sm text-slate-500">
                                {Math.round(exportProgress.progress)}% complete
                            </div>
                        </div>
                    ) : exportProgress.error ? (
                        // Export error
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-red-600 mb-2">Export Failed</h3>
                                <p className="text-slate-600 dark:text-slate-300">{exportProgress.error}</p>
                            </div>
                            <MetaButton onClick={() => setExportProgress(prev => ({ ...prev, error: null }))}>
                                Try Again
                            </MetaButton>
                        </div>
                    ) : exportProgress.progress === 100 ? (
                        // Export success
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-green-600 mb-2">Export Complete!</h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Your data has been prepared and will be downloaded shortly.
                                </p>
                            </div>
                        </div>
                    ) : (
                        // Export options
                        <div className="space-y-6">
                            {/* Data types included */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Data Included in Export</h3>
                                <div className="grid gap-3">
                                    {dataTypes.map((dataType) => (
                                        <div key={dataType.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                            <dataType.icon className="h-5 w-5 text-primary" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{dataType.name}</span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {dataType.estimatedSize}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                                    {dataType.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Format selection */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Export Format</h3>
                                <div className="grid gap-3">
                                    {formatOptions.map((format) => (
                                        <div
                                            key={format.value}
                                            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${selectedFormat === format.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                }`}
                                            onClick={() => setSelectedFormat(format.value)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">{format.label}</div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-300">
                                                        {format.description}
                                                    </div>
                                                </div>
                                                <Badge variant="outline">{format.extension}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3 pt-4">
                                <MetaButton
                                    onClick={handleExport}
                                    className="flex-1"
                                    disabled={exportProgress.isExporting}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Data
                                </MetaButton>
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={exportProgress.isExporting}
                                >
                                    Cancel
                                </Button>
                            </div>

                            <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                <p>
                                    Your data will be exported in the selected format and downloaded to your device.
                                    Large exports may take several minutes to prepare.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
