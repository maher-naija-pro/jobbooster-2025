'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './auth-provider'

interface Profile {
    id: string
    userId: string
    email: string
    fullName?: string | null
    username?: string | null
    avatarUrl?: string | null
    preferences: any
    subscription: any
    createdAt: Date
    updatedAt: Date
}

interface ProfileContextType {
    profile: Profile | null
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchProfile = async () => {
        if (!user) {
            setProfile(null)
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/user/profile')
            if (!response.ok) {
                throw new Error('Failed to fetch profile')
            }

            const data = await response.json()
            setProfile(data.profile)
        } catch (err) {
            console.error('Error fetching profile:', err)
            setError(err instanceof Error ? err.message : 'Failed to fetch profile')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [user])

    const refetch = async () => {
        await fetchProfile()
    }

    return (
        <ProfileContext.Provider value={{ profile, loading, error, refetch }}>
            {children}
        </ProfileContext.Provider>
    )
}

export function useProfile() {
    const context = useContext(ProfileContext)
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider')
    }
    return context
}
