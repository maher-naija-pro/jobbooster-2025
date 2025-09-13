'use client'

import { useState } from 'react'
import { Icons } from '@/components/icons'
import { DataExportModal } from '@/components/gdpr/DataExportModal'
import { DataDeletionModal } from '@/components/gdpr/DataDeletionModal'
import { PreferencesForm } from '@/components/user/preferences-form'
import { UserProfileSettings } from '@/components/settings/user-profile-settings'
import { NotificationSettings } from '@/components/settings/notification-settings'
import { SecuritySettings } from '@/components/settings/security-settings'
import { PrivacySettings } from '@/components/settings/privacy-settings'

interface SettingsPageClientProps {
    profile: any
    message?: string
}

export function SettingsPageClient({ profile, message }: SettingsPageClientProps) {
    const [showExportModal, setShowExportModal] = useState(false)
    const [showDeletionModal, setShowDeletionModal] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Mock data - replace with actual data from your API
    const userData = {
        profile: {
            name: profile?.fullName || 'User',
            email: profile?.email || 'user@example.com',
            createdAt: profile?.createdAt || '2024-01-15',
            lastLogin: profile?.lastLoginAt || '2024-01-20'
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
            // Simulate export process
            await new Promise(resolve => setTimeout(resolve, 2000))
            console.log(`Exporting data in ${format} format...`)
            // Add actual export logic here
        } catch (error) {
            console.error('Export failed:', error)
        } finally {
            setIsExporting(false)
            setShowExportModal(false)
        }
    }

    const handleDeletion = async (options: any) => {
        setIsDeleting(true)
        try {
            // Simulate deletion process
            await new Promise(resolve => setTimeout(resolve, 3000))
            console.log('Deleting data with options:', options)
            // Add actual deletion logic here
        } catch (error) {
            console.error('Deletion failed:', error)
        } finally {
            setIsDeleting(false)
            setShowDeletionModal(false)
        }
    }

    const handleConsentSave = async (consentData: any) => {
        console.log('Saving consent data:', consentData)
        // Add actual consent saving logic here
    }

    const handleConsentReset = async () => {
        console.log('Resetting consent data')
        // Add actual consent reset logic here
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
                        <p className="text-slate-600 dark:text-slate-300 mt-2">
                            Manage your account preferences, privacy settings, and data rights
                        </p>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="mb-6 p-4 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-md">
                            {decodeURIComponent(message)}
                        </div>
                    )}


                    {/* Main Settings Sections */}
                    <div className="space-y-8">
                        {/* Profile Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Icons.user className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Profile</h2>
                            </div>
                            <UserProfileSettings profile={profile} />
                        </div>

                        {/* Notifications Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Icons.bell className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Notifications</h2>
                            </div>
                            <NotificationSettings profile={profile} />
                        </div>

                        {/* Privacy Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Icons.shield className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Privacy</h2>
                            </div>
                            <PrivacySettings
                                onExportClick={() => setShowExportModal(true)}
                                onDeletionClick={() => setShowDeletionModal(true)}
                                isExporting={isExporting}
                                onConsentSave={handleConsentSave}
                                onConsentReset={handleConsentReset}
                            />
                        </div>

                        {/* Security Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Icons.lock className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Security</h2>
                            </div>
                            <SecuritySettings profile={profile} />
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
                        onDelete={handleDeletion}
                    />
                </div>
            </div>
        </div>
    )
}
