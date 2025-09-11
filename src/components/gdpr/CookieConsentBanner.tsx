'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { X, Settings, Shield, BarChart3, Target } from 'lucide-react'
import { MetaButton } from '@/components/buttons/meta-button'

interface CookiePreferences {
    essential: boolean
    analytics: boolean
    marketing: boolean
    preferences: boolean
}

interface CookieConsentBannerProps {
    onAccept: (preferences: CookiePreferences) => void
    onReject: () => void
    onCustomize: () => void
    testMode?: boolean // Add test mode prop
}

export function CookieConsentBanner({ onAccept, onReject, onCustomize, testMode = false }: CookieConsentBannerProps) {
    const [showBanner, setShowBanner] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [preferences, setPreferences] = useState<CookiePreferences>({
        essential: true, // Always true, cannot be disabled
        analytics: false,
        marketing: false,
        preferences: false
    })

    useEffect(() => {
        // In test mode, always show the banner
        if (testMode) {
            setShowBanner(true)
            setIsLoading(false)
            return
        }

        // Load existing preferences from database first
        loadExistingPreferences()
    }, [testMode])

    const loadExistingPreferences = async () => {
        try {
            const response = await fetch('/api/gdpr/consent')
            if (response.ok) {
                const data = await response.json()
                if (data.consent && data.gdprConsent) {
                    // User has existing preferences in database
                    setPreferences(data.consent)
                    setShowBanner(false) // Don't show banner if preferences exist
                    setIsLoading(false)
                    return
                }
            }
        } catch (error) {
            console.error('Failed to load existing preferences:', error)
        }

        // Fallback to localStorage check
        const consent = localStorage.getItem('cookie-consent')
        if (consent) {
            try {
                const parsedConsent = JSON.parse(consent)
                setPreferences(parsedConsent)
                setShowBanner(false)
            } catch (error) {
                console.error('Failed to parse localStorage consent:', error)
            }
        } else {
            setShowBanner(true)
        }

        setIsLoading(false)
    }

    const handleAcceptAll = () => {
        const allAccepted = {
            essential: true,
            analytics: true,
            marketing: true,
            preferences: true
        }
        localStorage.setItem('cookie-consent', JSON.stringify(allAccepted))
        localStorage.setItem('cookie-consent-date', new Date().toISOString())
        onAccept(allAccepted)
        setShowBanner(false)
    }

    const handleRejectAll = () => {
        const onlyEssential = {
            essential: true,
            analytics: false,
            marketing: false,
            preferences: false
        }
        localStorage.setItem('cookie-consent', JSON.stringify(onlyEssential))
        localStorage.setItem('cookie-consent-date', new Date().toISOString())
        onReject()
        setShowBanner(false)
    }

    const handleSavePreferences = () => {
        localStorage.setItem('cookie-consent', JSON.stringify(preferences))
        localStorage.setItem('cookie-consent-date', new Date().toISOString())
        onAccept(preferences)
        setShowBanner(false)
    }

    const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
        if (key === 'essential') return // Essential cookies cannot be disabled
        setPreferences(prev => ({ ...prev, [key]: value }))
    }

    // Show loading state while checking database
    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-end justify-center p-0">
                <div className="relative w-full bg-white dark:bg-slate-800 shadow-2xl border-t border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className="ml-3 text-slate-600 dark:text-slate-400">Loading preferences...</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!showBanner) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Banner */}
            <div className="relative w-full bg-white dark:bg-slate-800 shadow-2xl border-t border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Modern gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20" />

                {/* Content container with proper z-index */}
                <div className="relative z-10">
                    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-100 dark:via-blue-100 dark:to-slate-100 bg-clip-text text-transparent">
                                        Cookie Consent
                                    </h2>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowBanner(false)}
                                className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                            We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts.
                            You can customize your preferences below.
                        </p>

                        {!showDetails ? (
                            // Simple view
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <MetaButton
                                        onClick={handleAcceptAll}
                                        className="flex-1 sm:flex-none sm:min-w-[160px]"
                                        variant="primary"
                                        size="md"
                                    >
                                        Accept All Cookies
                                    </MetaButton>
                                    <MetaButton
                                        onClick={handleRejectAll}
                                        className="flex-1 sm:flex-none sm:min-w-[120px]"
                                        variant="secondary-outline"
                                        size="md"
                                    >
                                        Reject All
                                    </MetaButton>
                                    <MetaButton
                                        onClick={() => setShowDetails(true)}
                                        className="flex-1 sm:flex-none sm:min-w-[140px]"
                                        variant="secondary"
                                        size="md"
                                        icon={Settings}
                                    >
                                        Customize
                                    </MetaButton>
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                    By clicking "Accept All", you consent to our use of cookies.
                                    <a href="/legal/privacy-policy" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline ml-1 transition-colors">
                                        Learn more
                                    </a>
                                </p>
                            </div>
                        ) : (
                            // Detailed view
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    {/* Essential Cookies */}
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                                <Shield className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Essential Cookies</Label>
                                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                                    Required for basic site functionality
                                                </p>
                                            </div>
                                        </div>
                                        <Switch checked={true} disabled />
                                    </div>

                                    {/* Analytics Cookies */}
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                                <BarChart3 className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Analytics Cookies</Label>
                                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                                    Help us understand how visitors use our site
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={preferences.analytics}
                                            onCheckedChange={(checked) => handlePreferenceChange('analytics', checked)}
                                        />
                                    </div>

                                    {/* Marketing Cookies */}
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                                <Target className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Marketing Cookies</Label>
                                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                                    Used to deliver relevant advertisements
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={preferences.marketing}
                                            onCheckedChange={(checked) => handlePreferenceChange('marketing', checked)}
                                        />
                                    </div>

                                    {/* Preference Cookies */}
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                                                <Settings className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Preference Cookies</Label>
                                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                                    Remember your settings and preferences
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={preferences.preferences}
                                            onCheckedChange={(checked) => handlePreferenceChange('preferences', checked)}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <MetaButton
                                        onClick={handleSavePreferences}
                                        className="flex-1 sm:flex-none sm:min-w-[160px]"
                                        variant="primary"
                                        size="md"
                                    >
                                        Save Preferences
                                    </MetaButton>
                                    <MetaButton
                                        onClick={() => setShowDetails(false)}
                                        className="flex-1 sm:flex-none sm:min-w-[120px]"
                                        variant="secondary-outline"
                                        size="md"
                                    >
                                        Back
                                    </MetaButton>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
