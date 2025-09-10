'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
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
}

export function GDPRProvider({ children }: GDPRProviderProps) {
    const [consent, setConsent] = useState<CookiePreferences | null>(null)
    const [hasConsent, setHasConsent] = useState(false)
    const [showConsentBanner, setShowConsentBanner] = useState(false)

    useEffect(() => {
        // Load consent from localStorage on mount
        const savedConsent = localStorage.getItem('cookie-consent')
        if (savedConsent) {
            try {
                const parsedConsent = JSON.parse(savedConsent)
                setConsent(parsedConsent)
                setHasConsent(true)
            } catch (error) {
                console.error('Failed to parse saved consent:', error)
            }
        } else {
            setShowConsentBanner(true)
        }
    }, [])

    const updateConsent = (preferences: CookiePreferences) => {
        setConsent(preferences)
        setHasConsent(true)
        setShowConsentBanner(false)

        // Save to localStorage
        localStorage.setItem('cookie-consent', JSON.stringify(preferences))
        localStorage.setItem('cookie-consent-date', new Date().toISOString())

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
