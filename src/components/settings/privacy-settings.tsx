'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/icons'
import { MetaButton } from '@/components/buttons/meta-button'
import { ConsentManagement } from '@/components/gdpr/ConsentManagement'

interface ConsentPreferences {
    essential: boolean
    analytics: boolean
    marketing: boolean
    preferences: boolean
    emailNotifications: boolean
    pushNotifications: boolean
    dataProcessing: boolean
    dataSharing: boolean
}

interface PrivacySettingsProps {
    onExportClick: () => void
    onDeletionClick: () => void
    isExporting: boolean
    onConsentSave: (preferences: ConsentPreferences) => Promise<void>
    onConsentReset: () => Promise<void>
    onContactSupport: () => void
}

/**
 * Privacy Settings Component
 * 
 * Handles user privacy preferences including:
 * - Consent management for data processing
 * - Data export (Right to Portability)
 * - Data deletion (Right to be Forgotten)
 */
export function PrivacySettings({
    onExportClick,
    onDeletionClick,
    isExporting,
    onConsentSave,
    onConsentReset,
    onContactSupport
}: PrivacySettingsProps) {
    return (
        <div className="space-y-6">
            {/* Consent Management */}
            <Card>
                <CardContent>
                    <ConsentManagement
                        onSave={onConsentSave}
                        onReset={onConsentReset}
                    />
                </CardContent>
            </Card>

            {/* Data Rights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data Export */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icons.download className="h-5 w-5 text-green-600" />
                            Data Export (Right to Portability)
                        </CardTitle>
                        <CardDescription>
                            Download a copy of your personal data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-slate-600 dark:text-slate-300">
                                You can request a copy of all your personal data in a structured,
                                commonly used format.
                            </p>
                            <div className="flex gap-3">
                                <MetaButton
                                    onClick={onContactSupport}
                                    variant="secondary-outline"
                                >
                                    <Icons.mail className="h-4 w-4 mr-2" />
                                    Contact Support
                                </MetaButton>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Deletion */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icons.trash className="h-5 w-5 text-red-600" />
                            Data Deletion (Right to be Forgotten)
                        </CardTitle>
                        <CardDescription>
                            Permanently delete your personal data from our system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-2">
                                <Icons.alertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                                <p className="text-slate-600 dark:text-slate-300">
                                    <strong>Warning:</strong> This action will permanently delete all your data
                                    and cannot be undone. You will lose access to your account and all
                                    associated information.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <MetaButton
                                    onClick={onContactSupport}
                                    variant="secondary-outline"
                                >
                                    <Icons.mail className="h-4 w-4 mr-2" />
                                    Contact Support
                                </MetaButton>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
