import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/app/user/profile/actions'
import { PreferencesForm } from '@/components/user/preferences-form'

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Cookie Preferences</h1>
                        <p className="text-slate-600 dark:text-slate-300 mt-2">
                            Manage your cookie preferences and privacy settings
                        </p>
                    </div>

                    {message && (
                        <div className="mb-6 p-4 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-md">
                            {decodeURIComponent(message)}
                        </div>
                    )}

                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <PreferencesForm profile={profile} />
                    </div>
                </div>
            </div>
        </div>
    )
}
