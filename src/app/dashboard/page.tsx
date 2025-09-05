import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getProfile } from '@/app/user/profile/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { isPricingEnabled } from '@/lib/feature-flags'
import {
    FileText,
    Mail,
    User,
    Calendar,
    TrendingUp,
    Activity,
    Clock,
    Search,
    Trash2
} from 'lucide-react'

export default async function Dashboard() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const profile = await getProfile(user.id)

    const initials = profile?.fullName
        ? profile.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
        : user.email?.charAt(0).toUpperCase() || 'U'

    const subscription = profile?.subscription || { plan: 'free' }
    const preferences = profile?.preferences || {}

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={profile?.avatarUrl} alt={profile?.fullName || user.email} />
                            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold">
                                Welcome back, {profile?.fullName || user.email?.split('@')[0]}!
                            </h1>
                            <p className="text-muted-foreground">
                                Here's what's happening with your account today.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Badge variant={subscription.plan === 'free' ? 'secondary' : 'default'}>
                            {subscription.plan.toUpperCase()} Plan
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            Member since {new Date(profile?.createdAt || user.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">CVs Uploaded</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{profile?.cvData?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                +2 from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{profile?.generatedContent?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                +12 from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{profile?.userSessions?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Currently active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {profile?.userActivities?.[0]?.createdAt
                                    ? new Date(profile.userActivities[0].createdAt).toLocaleDateString()
                                    : 'Today'
                                }
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {profile?.userActivities?.[0]?.action || 'No recent activity'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    Your recent actions and system events
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {profile?.userActivities?.length > 0 ? (
                                    <div className="space-y-4">
                                        {profile.userActivities.slice(0, 5).map((activity: any) => (
                                            <div key={activity.id} className="flex items-center space-x-4">
                                                <div className="h-2 w-2 bg-primary rounded-full" />
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium">{activity.action.replace('_', ' ')}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(activity.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No recent activity</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>
                                    Common tasks and shortcuts
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button className="w-full justify-start" variant="outline">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Upload New CV
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Generate Cover Letter
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Generate Email
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <Search className="mr-2 h-4 w-4" />
                                    Analyze CV
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <User className="mr-2 h-4 w-4" />
                                    Update Profile
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Account Status */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Account Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Email Verified</span>
                                    <Badge variant={user.email_confirmed_at ? 'default' : 'destructive'}>
                                        {user.email_confirmed_at ? 'Verified' : 'Pending'}
                                    </Badge>
                                </div>
                                {isPricingEnabled() && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Plan</span>
                                        <Badge variant={subscription.plan === 'free' ? 'secondary' : 'default'}>
                                            {subscription.plan}
                                        </Badge>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Language</span>
                                    <span className="text-sm text-muted-foreground">
                                        {preferences.language || 'English'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}