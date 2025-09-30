'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Trash2,
    AlertTriangle,
    Shield,
    Database,
    FileText,
    Mail,
    Calendar,
    CheckCircle,
    XCircle
} from 'lucide-react'
import { MetaButton } from '@/components/buttons/meta-button'

interface DataDeletionModalProps {
    isOpen: boolean
    onClose: () => void
    onDelete: (options: DeletionOptions) => Promise<void>
}

interface DeletionOptions {
    deleteProfile: boolean
    deleteCvData: boolean
    deleteActivityLogs: boolean
    deleteCommunications: boolean
    deleteSessions: boolean
    reason: string
    confirmDeletion: boolean
}

export function DataDeletionModal({ isOpen, onClose, onDelete }: DataDeletionModalProps) {
    const [deletionOptions, setDeletionOptions] = useState<DeletionOptions>({
        deleteProfile: true,
        deleteCvData: true,
        deleteActivityLogs: true,
        deleteCommunications: true,
        deleteSessions: true,
        reason: '',
        confirmDeletion: false
    })
    const [isDeleting, setIsDeleting] = useState(false)
    const [deletionStep, setDeletionStep] = useState('')
    const [error, setError] = useState<string | null>(null)

    const dataTypes = [
        {
            id: 'deleteProfile',
            name: 'Profile Information',
            description: 'Personal details, preferences, and account settings',
            icon: Shield,
            estimatedSize: '2-5 KB',
            required: true
        },
        {
            id: 'deleteCvData',
            name: 'CV Data & Analysis',
            description: 'Uploaded CVs, analysis results, and generated content',
            icon: FileText,
            estimatedSize: '10-50 KB',
            required: false
        },
        {
            id: 'deleteActivityLogs',
            name: 'Activity Logs',
            description: 'Login history, feature usage, and user interactions',
            icon: Database,
            estimatedSize: '5-20 KB',
            required: false
        },
        {
            id: 'deleteCommunications',
            name: 'Communications',
            description: 'Email notifications and support messages',
            icon: Mail,
            estimatedSize: '1-10 KB',
            required: false
        },
        {
            id: 'deleteSessions',
            name: 'Session Data',
            description: 'Login sessions and device information',
            icon: Calendar,
            estimatedSize: '1-5 KB',
            required: false
        }
    ]

    const handleOptionChange = (option: keyof DeletionOptions, value: boolean) => {
        if (option === 'deleteProfile') return // Profile deletion is always required

        setDeletionOptions(prev => ({ ...prev, [option]: value }))
    }

    const handleDelete = async () => {
        if (!deletionOptions.confirmDeletion) {
            setError('Please confirm that you understand the consequences of data deletion')
            return
        }

        if (!deletionOptions.reason.trim()) {
            setError('Please provide a reason for data deletion')
            return
        }

        setIsDeleting(true)
        setError(null)

        try {
            const steps = [
                'Preparing data deletion...',
                'Removing profile information...',
                'Clearing CV data and analysis...',
                'Deleting activity logs...',
                'Removing communications...',
                'Clearing session data...',
                'Finalizing deletion...'
            ]

            for (let i = 0; i < steps.length; i++) {
                setDeletionStep(steps[i])
                await new Promise(resolve => setTimeout(resolve, 1000))
            }

            await onDelete(deletionOptions)

            setDeletionStep('Data deletion completed successfully!')

            // Auto-close after success
            setTimeout(() => {
                onClose()
                setDeletionOptions({
                    deleteProfile: true,
                    deleteCvData: true,
                    deleteActivityLogs: true,
                    deleteCommunications: true,
                    deleteSessions: true,
                    reason: '',
                    confirmDeletion: false
                })
                setDeletionStep('')
                setError(null)
            }, 2000)

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Data deletion failed')
        } finally {
            setIsDeleting(false)
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
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-6 w-6" />
                        Delete Your Data
                    </CardTitle>
                    <CardDescription>
                        Permanently delete your personal data from our system. This action cannot be undone.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {isDeleting ? (
                        // Deletion in progress
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                    <Trash2 className="h-8 w-8 text-red-600 animate-pulse" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Deleting Your Data</h3>
                                <p className="text-slate-600 dark:text-slate-300">{deletionStep}</p>
                            </div>
                        </div>
                    ) : (
                        // Deletion options
                        <div className="space-y-6">
                            {/* Warning */}
                            <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800 dark:text-red-200">
                                    <strong>Warning:</strong> This action will permanently delete your data and cannot be undone.
                                    You will lose access to all your CVs, analysis results, and account information.
                                </AlertDescription>
                            </Alert>

                            {/* Data types to delete */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Data to be Deleted</h3>
                                <div className="space-y-3">
                                    {dataTypes.map((dataType) => (
                                        <div
                                            key={dataType.id}
                                            className={`p-4 rounded-lg border ${deletionOptions[dataType.id as keyof DeletionOptions]
                                                ? 'border-red-200 bg-red-50 dark:bg-red-900/20'
                                                : 'border-slate-200 dark:border-slate-700'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    id={dataType.id}
                                                    checked={!!deletionOptions[dataType.id as keyof DeletionOptions]}
                                                    onCheckedChange={(checked) =>
                                                        handleOptionChange(dataType.id as keyof DeletionOptions, checked as boolean)
                                                    }
                                                    disabled={dataType.required}
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <dataType.icon className="h-5 w-5 text-slate-600" />
                                                        <Label htmlFor={dataType.id} className="font-medium">
                                                            {dataType.name}
                                                        </Label>
                                                        {dataType.required && (
                                                            <span className="text-xs text-red-600 font-medium">(Required)</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                                        {dataType.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reason for deletion */}
                            <div>
                                <Label htmlFor="reason" className="text-base font-medium">
                                    Reason for Data Deletion *
                                </Label>
                                <Textarea
                                    id="reason"
                                    placeholder="Please tell us why you want to delete your data..."
                                    value={deletionOptions.reason}
                                    onChange={(e) => setDeletionOptions(prev => ({ ...prev, reason: e.target.value }))}
                                    className="mt-2"
                                    rows={3}
                                />
                            </div>

                            {/* Confirmation */}
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        id="confirmDeletion"
                                        checked={deletionOptions.confirmDeletion}
                                        onCheckedChange={(checked) =>
                                            setDeletionOptions(prev => ({ ...prev, confirmDeletion: checked as boolean }))
                                        }
                                    />
                                    <div>
                                        <Label htmlFor="confirmDeletion" className="font-medium">
                                            I understand the consequences
                                        </Label>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                            I confirm that I understand this action will permanently delete all my data
                                            and that I will lose access to my account and all associated information.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Error message */}
                            {error && (
                                <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-800 dark:text-red-200">
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <MetaButton
                                    onClick={handleDelete}
                                    disabled={!deletionOptions.confirmDeletion || !deletionOptions.reason.trim()}
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete My Data
                                </MetaButton>
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isDeleting}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>

                            <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                <p>
                                    Data deletion is processed immediately and cannot be reversed.
                                    If you have any questions, please contact our support team before proceeding.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
