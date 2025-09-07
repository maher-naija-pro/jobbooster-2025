import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/app/user/profile/actions'
import { ProfileForm } from '@/components/user/profile-form'
import { AvatarUpload } from '@/components/user/avatar-upload'
import { PreferencesForm } from '@/components/user/preferences-form'
import { ResetPasswordModal } from '@/components/auth/reset-password-modal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { prisma } from '@/lib/prisma'

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


    let finalProfile = profile

    if (!finalProfile) {
        // Profile should exist - if not, create it as a fallback
        // This can happen if profile creation failed during registration
        const { ensureUserProfile } = await import('@/lib/auth/profile-utils')
        const result = await ensureUserProfile(user.id, user.email!)

        if (result.success && result.profile) {
            // Fetch the full profile with relations
            const fullProfile = await prisma.profile.findUnique({
                where: { userId: user.id },
                include: {
                    userSessions: {
                        orderBy: { lastActivity: 'desc' },
                        take: 5
                    },
                    userActivities: {
                        orderBy: { createdAt: 'desc' },
                        take: 10
                    },
                    cvData: {
                        orderBy: { createdAt: 'desc' },
                        take: 5
                    },
                    generatedContent: {
                        orderBy: { createdAt: 'desc' },
                        take: 10
                    }
                }
            })

            if (fullProfile) {
                // Use the newly created profile
                finalProfile = fullProfile
            } else {
                // If still no profile, show error
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
        } else {
            // If profile creation failed, show error
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
                            <ProfileForm profile={finalProfile} />
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
                            <AvatarUpload profile={finalProfile} />
                        </CardContent>
                    </Card>

                    {/* Security Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icons.shield className="h-5 w-5" />
                                Security Settings
                            </CardTitle>
                            <CardDescription>
                                Manage your account security and password settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-1">
                                    <h4 className="font-medium">Password</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Update your password to keep your account secure
                                    </p>
                                </div>
                                <ResetPasswordModal>
                                    <Button variant="outline" size="sm">
                                        <Icons.lock className="mr-2 h-4 w-4" />
                                        Reset Password
                                    </Button>
                                </ResetPasswordModal>
                            </div>

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
                            <PreferencesForm profile={finalProfile} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
