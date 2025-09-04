import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/app/user/profile/actions'
import { ProfileForm } from '@/components/user/profile-form'
import { AvatarUpload } from '@/components/user/avatar-upload'
import { PreferencesForm } from '@/components/user/preferences-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ProfilePageProps {
    searchParams: Promise<{
        message?: string
    }>
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const profile = await getProfile(user.id)
    const resolvedSearchParams = await searchParams
    const message = resolvedSearchParams.message


    if (!profile) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Profile Settings</h1>
                        <p className="text-muted-foreground">
                            Manage your account settings and preferences
                        </p>
                    </div>
                    <div className="p-6 text-center">
                        <p className="text-red-600">Failed to load profile data. Please try refreshing the page.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Profile Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences
                    </p>
                </div>

                {message && (
                    <div className="mb-6 p-4 text-sm text-green-600 bg-green-50 rounded-md">
                        {decodeURIComponent(message)}
                    </div>
                )}

                <div className="space-y-8">
                    {/* Profile Information Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your personal information and account details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileForm profile={profile} />
                        </CardContent>
                    </Card>

                    {/* Avatar Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                            <CardDescription>
                                Upload and manage your profile picture
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AvatarUpload profile={profile} />
                        </CardContent>
                    </Card>

                    {/* Preferences Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferences</CardTitle>
                            <CardDescription>
                                Configure your application preferences and settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PreferencesForm profile={profile} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
