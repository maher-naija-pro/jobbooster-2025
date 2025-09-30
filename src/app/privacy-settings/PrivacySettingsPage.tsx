'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Shield,
    Download,
    Trash2,
    Settings,
    Eye,
    Lock,
    Database,
    FileText,
    Mail,
    Calendar,
    AlertTriangle,
    CheckCircle
} from 'lucide-react'
import { MetaButton } from '@/components/buttons/meta-button'
import { ConsentManagement } from '@/components/gdpr/ConsentManagement'
import { DataExportModal } from '@/components/gdpr/DataExportModal'
import { DataDeletionModal } from '@/components/gdpr/DataDeletionModal'

export function PrivacySettingsPage() {
    const [showExportModal, setShowExportModal] = useState(false)
    const [showDeletionModal, setShowDeletionModal] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Mock data - replace with actual data from your API
    const userData = {
        profile: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            createdAt: '2024-01-15',
            lastLogin: '2024-01-20'
        },
        dataSummary: {
            cvCount: 3,
            analysisCount: 12,
            totalStorage: '2.3 MB',
            lastExport: '2024-01-10'
        },
        consentStatus: {
            gdprConsent: true,
            marketingConsent: false,
            analyticsConsent: true,
            lastUpdated: '2024-01-15'
        }
    }

    const handleExport = async (format: 'json' | 'csv' | 'pdf') => {
        setIsExporting(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))

            // In a real implementation, you would:
            // 1. Call your API to generate the export
            // 2. Download the file
            // 3. Log the export activity

            console.log(`Exporting data in ${format} format`)

            // Simulate file download
            const blob = new Blob([`Your data export in ${format} format`], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `data-export-${new Date().toISOString().split('T')[0]}.${format}`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

        } catch (error) {
            console.error('Export failed:', error)
        } finally {
            setIsExporting(false)
        }
    }

    const handleDelete = async (options: {
        deleteProfile: boolean
        deleteCvData: boolean
        deleteActivityLogs: boolean
        deleteCommunications: boolean
        deleteSessions: boolean
        reason: string
        confirmDeletion: boolean
    }) => {
        setIsDeleting(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 3000))

            // In a real implementation, you would:
            // 1. Call your API to delete the data
            // 2. Log the deletion activity
            // 3. Sign out the user

            console.log('Deleting data with options:', options)

        } catch (error) {
            console.error('Deletion failed:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleConsentSave = async (preferences: {
        essential: boolean
        analytics: boolean
        marketing: boolean
        preferences: boolean
        emailNotifications: boolean
        pushNotifications: boolean
        dataProcessing: boolean
    }) => {
        try {
            // Save consent preferences to your API
            console.log('Saving consent preferences:', preferences)

            // Update localStorage
            localStorage.setItem('consent-preferences', JSON.stringify(preferences))
            localStorage.setItem('consent-last-updated', new Date().toISOString())

        } catch (error) {
            console.error('Failed to save consent preferences:', error)
            throw error
        }
    }

    const handleConsentReset = async () => {
        try {
            // Reset consent preferences
            console.log('Resetting consent preferences')

            // Clear localStorage
            localStorage.removeItem('consent-preferences')
            localStorage.removeItem('consent-last-updated')

        } catch (error) {
            console.error('Failed to reset consent preferences:', error)
            throw error
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Privacy Settings
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300">
                            Manage your privacy preferences and data protection rights
                        </p>
                    </div>

                    {/* Data Overview */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-primary" />
                                Your Data Overview
                            </CardTitle>
                            <CardDescription>
                                Summary of your personal data stored in our system
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {userData.dataSummary.cvCount}
                                    </div>
                                    <div className="text-sm text-slate-600 dark:text-slate-300">CVs Uploaded</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {userData.dataSummary.analysisCount}
                                    </div>
                                    <div className="text-sm text-slate-600 dark:text-slate-300">Analyses Performed</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <Database className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {userData.dataSummary.totalStorage}
                                    </div>
                                    <div className="text-sm text-slate-600 dark:text-slate-300">Data Storage</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <Download className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {userData.dataSummary.lastExport}
                                    </div>
                                    <div className="text-sm text-slate-600 dark:text-slate-300">Last Export</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content */}
                    <Tabs defaultValue="consent" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="consent">Consent Management</TabsTrigger>
                            <TabsTrigger value="data-rights">Data Rights</TabsTrigger>
                            <TabsTrigger value="security">Security & Access</TabsTrigger>
                        </TabsList>

                        {/* Consent Management Tab */}
                        <TabsContent value="consent">
                            <ConsentManagement
                                onSave={handleConsentSave}
                                onReset={handleConsentReset}
                            />
                        </TabsContent>

                        {/* Data Rights Tab */}
                        <TabsContent value="data-rights" className="space-y-6">
                            {/* Data Export */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Download className="h-5 w-5 text-primary" />
                                        Data Export (Right to Data Portability)
                                    </CardTitle>
                                    <CardDescription>
                                        Download a copy of all your personal data in a machine-readable format
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <p className="text-slate-600 dark:text-slate-300">
                                            You have the right to receive a copy of your personal data in a structured,
                                            commonly used, and machine-readable format. This includes all your profile
                                            information, CV data, analysis results, and activity logs.
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span className="text-sm text-slate-600 dark:text-slate-300">
                                                Last export: {userData.dataSummary.lastExport}
                                            </span>
                                        </div>
                                        <MetaButton onClick={() => setShowExportModal(true)}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Export My Data
                                        </MetaButton>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Data Deletion */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trash2 className="h-5 w-5 text-red-600" />
                                        Data Deletion (Right to be Forgotten)
                                    </CardTitle>
                                    <CardDescription>
                                        Permanently delete your personal data from our system
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                                            <p className="text-slate-600 dark:text-slate-300">
                                                <strong>Warning:</strong> This action will permanently delete all your data
                                                and cannot be undone. You will lose access to your account and all
                                                associated information.
                                            </p>
                                        </div>
                                        <MetaButton
                                            onClick={() => setShowDeletionModal(true)}
                                            variant="danger"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete My Data
                                        </MetaButton>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Data Rectification */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Settings className="h-5 w-5 text-primary" />
                                        Data Rectification
                                    </CardTitle>
                                    <CardDescription>
                                        Update or correct your personal information
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <p className="text-slate-600 dark:text-slate-300">
                                            You have the right to have inaccurate personal data corrected and incomplete
                                            personal data completed. You can update your information through your profile settings.
                                        </p>
                                        <MetaButton variant="primary-outline">
                                            <Settings className="h-4 w-4 mr-2" />
                                            Update Profile
                                        </MetaButton>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Security & Access Tab */}
                        <TabsContent value="security" className="space-y-6">
                            {/* Account Security */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lock className="h-5 w-5 text-primary" />
                                        Account Security
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your account security and access controls
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                            <div>
                                                <div className="font-medium">Password</div>
                                                <div className="text-sm text-slate-600 dark:text-slate-300">
                                                    Last changed: 30 days ago
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Change
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                            <div>
                                                <div className="font-medium">Two-Factor Authentication</div>
                                                <div className="text-sm text-slate-600 dark:text-slate-300">
                                                    Not enabled
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Enable
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Data Access Logs */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-5 w-5 text-primary" />
                                        Data Access Logs
                                    </CardTitle>
                                    <CardDescription>
                                        View who has accessed your data and when
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <div>
                                                    <div className="font-medium">Profile Update</div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-300">
                                                        You - {new Date().toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="secondary">Self</Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <div>
                                                    <div className="font-medium">CV Analysis</div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-300">
                                                        System - 2 days ago
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="outline">System</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Modals */}
            <DataExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                onExport={handleExport}
            />

            <DataDeletionModal
                isOpen={showDeletionModal}
                onClose={() => setShowDeletionModal(false)}
                onDelete={handleDelete}
            />
        </main>
    )
}
