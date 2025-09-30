'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { CookieConsentBanner } from './CookieConsentBanner'

interface CookiePreferences {
    essential: boolean
    analytics: boolean
    marketing: boolean
    preferences: boolean
}

interface GDPRContextType {
    consent: CookiePreferences | null
    updateConsent: (preferences: CookiePreferences) => void
    hasConsent: boolean
    showConsentBanner: boolean
    setShowConsentBanner: (show: boolean) => void
}

const GDPRContext = createContext<GDPRContextType | undefined>(undefined)

interface GDPRProviderProps {
    children: ReactNode
    testMode?: boolean // Add test mode prop
}

export function GDPRProvider({ children, testMode }: GDPRProviderProps) {
    const [consent, setConsent] = useState<CookiePreferences | null>(null)
    const [hasConsent, setHasConsent] = useState(false)
    const [showConsentBanner, setShowConsentBanner] = useState(false)
    const [isTestMode, setIsTestMode] = useState(false)

    const loadConsentFromDatabase = useCallback(async () => {
        try {
            const response = await fetch('/api/gdpr/consent')
            if (response.ok) {
                const data = await response.json()
                if (data.consent && data.gdprConsent) {
                    // Use database preferences
                    setConsent(data.consent)
                    setHasConsent(true)

                    // Don't show banner if user has existing preferences (unless in test mode)
                    if (!isTestMode) {
                        setShowConsentBanner(false)
                    }
                    return
                }
            }
        } catch (error) {
            console.error('Failed to load consent from database:', error)
        }

        // No fallback to localStorage - show banner for new users
        setShowConsentBanner(true)
    }, [isTestMode])

    useEffect(() => {
        // Determine test mode on client side to avoid hydration mismatch
        const clientTestMode = testMode ?? (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_COOKIE_TEST_MODE === 'true')
        setIsTestMode(clientTestMode)

        // In test mode, always show the banner
        if (clientTestMode) {
            setShowConsentBanner(true)
            return
        }

        // Load consent from database first, then localStorage as fallback
        loadConsentFromDatabase()
    }, [loadConsentFromDatabase, testMode])

    const updateConsent = (preferences: CookiePreferences) => {
        setConsent(preferences)
        setHasConsent(true)
        setShowConsentBanner(false)

        // Update consent in database via API
        updateConsentInDatabase(preferences)
    }

    const updateConsentInDatabase = async (preferences: CookiePreferences) => {
        try {
            // Call your API to update consent in database
            const response = await fetch('/api/gdpr/consent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    consent: preferences,
                    consentDate: new Date().toISOString(),
                    consentVersion: '1.0'
                })
            })

            if (!response.ok) {
                throw new Error('Failed to update consent in database')
            }
        } catch (error) {
            console.error('Failed to update consent in database:', error)
            // Don't throw error to avoid breaking the UI
        }
    }

    const handleAccept = (preferences: CookiePreferences) => {
        updateConsent(preferences)

        // Initialize analytics and marketing tools based on consent
        if (preferences.analytics) {
            initializeAnalytics()
        }

        if (preferences.marketing) {
            initializeMarketing()
        }
    }

    const handleReject = () => {
        const onlyEssential = {
            essential: true,
            analytics: false,
            marketing: false,
            preferences: false
        }
        updateConsent(onlyEssential)
    }

    const initializeAnalytics = () => {
        // Initialize Google Analytics, Mixpanel, etc.
        console.log('Initializing analytics tools...')

        // Example: Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('consent', 'update', {
                analytics_storage: 'granted'
            })
        }
    }

    const initializeMarketing = () => {
        // Initialize marketing tools like Facebook Pixel, etc.
        console.log('Initializing marketing tools...')

        // Example: Facebook Pixel
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('consent', 'grant')
        }
    }

    const contextValue: GDPRContextType = {
        consent,
        updateConsent,
        hasConsent,
        showConsentBanner,
        setShowConsentBanner
    }

    return (
        <GDPRContext.Provider value={contextValue}>
            {children}

            {/* Cookie Consent Banner */}
            {showConsentBanner && (
                <CookieConsentBanner
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onCustomize={() => setShowConsentBanner(false)}
                    testMode={isTestMode}
                />
            )}
        </GDPRContext.Provider>
    )
}

export function useGDPR() {
    const context = useContext(GDPRContext)
    if (context === undefined) {
        throw new Error('useGDPR must be used within a GDPRProvider')
    }
    return context
}

// Type declarations for global objects
declare global {
    interface Window {
        gtag?: (...args: any[]) => void
        fbq?: (...args: any[]) => void
    }
}
