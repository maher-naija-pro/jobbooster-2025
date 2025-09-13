import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/app/user/profile/actions'
import { PreferencesForm } from '@/components/user/preferences-form'
import { SettingsPageClient } from '@/components/settings/settings-page-client'

interface SettingsPageProps {
    searchParams: Promise<{
        message?: string
    }>
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const profile = await getProfile(user.id)
    const resolvedSearchParams = await searchParams
    const message = resolvedSearchParams.message

    return (
        <SettingsPageClient
            profile={profile}
            message={message}
        />
    )
}
