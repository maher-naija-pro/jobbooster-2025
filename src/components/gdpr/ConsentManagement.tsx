'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    Shield,
    BarChart3,
    Target,
    Settings,
    Mail,
    Bell,
    Database,
    CheckCircle,
    AlertCircle,
    Info
} from 'lucide-react'
import { MetaButton } from '@/components/buttons/meta-button'

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

interface ConsentManagementProps {
    onSave: (preferences: ConsentPreferences) => Promise<void>
    onReset: () => Promise<void>
}

export function ConsentManagement({ onSave, onReset }: ConsentManagementProps) {
    const [preferences, setPreferences] = useState<ConsentPreferences>({
        essential: true,
        analytics: false,
        marketing: false,
        preferences: false,
        emailNotifications: false,
        pushNotifications: false,
        dataProcessing: false,
        dataSharing: false
    })
    const [isLoading, setIsLoading] = useState(false)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
    const [hasChanges, setHasChanges] = useState(false)

    useEffect(() => {
        // Load saved preferences from database
        loadPreferencesFromDatabase()
    }, [])

    const loadPreferencesFromDatabase = async () => {
        try {
            const response = await fetch('/api/gdpr/consent')
            if (response.ok) {
                const data = await response.json()
                if (data.consent && data.gdprConsent) {
                    const loadedPreferences = {
                        essential: data.consent.essential ?? true,
                        analytics: data.consent.analytics ?? false,
                        marketing: data.consent.marketing ?? false,
                        preferences: data.consent.preferences ?? false,
                        emailNotifications: data.consent.emailNotifications ?? false,
                        pushNotifications: data.consent.pushNotifications ?? false,
                        dataProcessing: data.consent.dataProcessing ?? false,
                        dataSharing: data.consent.dataSharing ?? false
                    }
                    setPreferences(loadedPreferences)
                    if (data.consentDate) {
                        setLastUpdated(new Date(data.consentDate))
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load preferences from database:', error)
        }
    }

    const handlePreferenceChange = (key: keyof ConsentPreferences, value: boolean) => {
        if (key === 'essential') return // Essential cannot be disabled

        setPreferences(prev => ({ ...prev, [key]: value }))
        setHasChanges(true)
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            await onSave(preferences)

            setLastUpdated(new Date())
            setHasChanges(false)
        } catch (error) {
            console.error('Failed to save preferences:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = async () => {
        setIsLoading(true)
        try {
            await onReset()

            // Reset to defaults
            const defaults: ConsentPreferences = {
                essential: true,
                analytics: false,
                marketing: false,
                preferences: false,
                emailNotifications: false,
                pushNotifications: false,
                dataProcessing: false,
                dataSharing: false
            }

            setPreferences(defaults)
            setHasChanges(false)
        } catch (error) {
            console.error('Failed to reset preferences:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const consentCategories = [
        {
            id: 'essential',
            title: 'Essential Cookies',
            description: 'Required for basic site functionality and security',
            icon: Shield,
            required: true,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            id: 'analytics',
            title: 'Analytics & Performance',
            description: 'Help us understand how you use our site to improve performance',
            icon: BarChart3,
            required: false,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            id: 'marketing',
            title: 'Marketing & Advertising',
            description: 'Used to deliver relevant ads and measure campaign effectiveness',
            icon: Target,
            required: false,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            id: 'preferences',
            title: 'Preferences & Settings',
            description: 'Remember your choices and personalize your experience',
            icon: Settings,
            required: false,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20'
        }
    ]

    const notificationCategories = [
        {
            id: 'emailNotifications',
            title: 'Email Notifications',
            description: 'Receive updates about your account and our services',
            icon: Mail,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
        },
        {
            id: 'pushNotifications',
            title: 'Push Notifications',
            description: 'Get real-time updates in your browser',
            icon: Bell,
            color: 'text-pink-600',
            bgColor: 'bg-pink-50 dark:bg-pink-900/20'
        }
    ]

    const dataProcessingCategories = [
        {
            id: 'dataProcessing',
            title: 'Data Processing',
            description: 'Allow us to process your data for service improvement',
            icon: Database,
            color: 'text-cyan-600',
            bgColor: 'bg-cyan-50 dark:bg-cyan-900/20'
        },
        {
            id: 'dataSharing',
            title: 'Data Sharing',
            description: 'Share anonymized data with trusted partners for research',
            icon: Database,
            color: 'text-teal-600',
            bgColor: 'bg-teal-50 dark:bg-teal-900/20'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Consent Management
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                    Manage your privacy preferences and data processing consent
                </p>
                {lastUpdated && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Last updated: {lastUpdated.toLocaleString()}
                    </p>
                )}
            </div>

            {/* Cookie Consent */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Cookie Consent
                    </CardTitle>
                    <CardDescription>
                        Control which cookies and tracking technologies we can use
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {consentCategories.map((category) => (
                        <div
                            key={category.id}
                            className={`p-4 rounded-lg border ${category.bgColor} ${preferences[category.id as keyof ConsentPreferences]
                                ? 'border-primary/20'
                                : 'border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <category.icon className={`h-5 w-5 ${category.color}`} />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Label className="font-medium">{category.title}</Label>
                                            {category.required && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Required
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                            {category.description}
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    checked={preferences[category.id as keyof ConsentPreferences]}
                                    onCheckedChange={(checked) =>
                                        handlePreferenceChange(category.id as keyof ConsentPreferences, checked)
                                    }
                                    disabled={category.required}
                                />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>



            {/* Data Processing */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        Data Processing Consent
                    </CardTitle>
                    <CardDescription>
                        Control how we process and use your personal data
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {dataProcessingCategories.map((category) => (
                        <div
                            key={category.id}
                            className={`p-4 rounded-lg border ${category.bgColor} ${preferences[category.id as keyof ConsentPreferences]
                                ? 'border-primary/20'
                                : 'border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <category.icon className={`h-5 w-5 ${category.color}`} />
                                    <div>
                                        <Label className="font-medium">{category.title}</Label>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                            {category.description}
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    checked={preferences[category.id as keyof ConsentPreferences]}
                                    onCheckedChange={(checked) =>
                                        handlePreferenceChange(category.id as keyof ConsentPreferences, checked)
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Information Notice */}
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="space-y-2">
                            <h4 className="font-medium text-blue-900 dark:text-blue-100">
                                Important Information
                            </h4>
                            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                <p>
                                    • Essential cookies are required for the site to function and cannot be disabled
                                </p>
                                <p>
                                    • You can change these preferences at any time
                                </p>
                                <p>
                                    • Some features may not work properly if you disable certain cookies
                                </p>
                                <p>
                                    • We will never sell your personal data to third parties
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <MetaButton
                    onClick={handleSave}
                    disabled={!hasChanges || isLoading}
                    className="flex-1"
                >
                    {isLoading ? 'Saving...' : 'Save Preferences'}
                </MetaButton>
                <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={isLoading}
                    className="flex-1"
                >
                    Reset to Defaults
                </Button>
            </div>

            {hasChanges && (
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-4 w-4" />
                    You have unsaved changes
                </div>
            )}
        </div>
    )
}
