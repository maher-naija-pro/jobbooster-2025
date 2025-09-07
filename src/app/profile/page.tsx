import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/app/user/profile/actions'
import { ProfileForm } from '@/components/user/profile-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
                    <div className="container mx-auto py-12 px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold">Profile</h1>
                                <p className="text-muted-foreground">
                                    Manage your account
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
                <div className="container mx-auto  px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold">Profile</h1>
                            <p className="text-muted-foreground">
                                Manage your account
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
        <div className="container mx-auto py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Profile</h1>
                    <p className="text-muted-foreground">
                        Manage your account
                    </p>
                </div>

                {message && (
                    <div className="mb-6 p-4 text-sm text-green-600 bg-green-50 rounded-md">
                        {decodeURIComponent(message)}
                    </div>
                )}

                <div className="space-y-8">
                    {/* Profile Information and Picture Section */}
                    <Card>
                        <CardContent className="pt-12">
                            <ProfileForm profile={finalProfile} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
