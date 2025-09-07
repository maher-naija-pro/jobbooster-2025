import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/app/user/profile/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Preferences</h1>
                    <p className="text-muted-foreground">
                        Manage your application preferences and settings
                    </p>
                </div>

                {message && (
                    <div className="mb-6 p-4 text-sm text-green-600 bg-green-50 rounded-md">
                        {decodeURIComponent(message)}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Application Preferences</CardTitle>
                        <CardDescription>
                            Configure your application preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PreferencesForm profile={profile} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
