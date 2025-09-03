import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/app/user/profile/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PreferencesForm } from '@/components/user/preferences-form'
import { AvatarUpload } from '@/components/user/avatar-upload'

interface SettingsPageProps {
    searchParams: {
        message?: string
    }
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const profile = await getProfile(user.id)
    const message = searchParams.message

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your application settings and preferences
                    </p>
                </div>

                {message && (
                    <div className="mb-6 p-4 text-sm text-green-600 bg-green-50 rounded-md">
                        {decodeURIComponent(message)}
                    </div>
                )}

                <Tabs defaultValue="preferences" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="preferences">Preferences</TabsTrigger>
                        <TabsTrigger value="avatar">Avatar</TabsTrigger>
                    </TabsList>

                    <TabsContent value="preferences">
                        <Card>
                            <CardHeader>
                                <CardTitle>Application Preferences</CardTitle>
                                <CardDescription>
                                    Configure your application preferences and settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PreferencesForm profile={profile} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="avatar">
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
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
