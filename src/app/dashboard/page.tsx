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
    Bookmark,
    Search,
    Trash2,
    Eye,
    Briefcase
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
                            <CardTitle className="text-sm font-medium">Saved Offers</CardTitle>
                            <Bookmark className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                0
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Job offers saved
                            </p>
                        </CardContent>
                    </Card>

                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* CV Display Form */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="h-5 w-5" />
                                    CV Display
                                </CardTitle>
                                <CardDescription>
                                    View and manage your uploaded CVs
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {profile?.cvData?.length > 0 ? (
                                        <div className="space-y-3">
                                            {profile.cvData.slice(0, 3).map((cv: any) => (
                                                <div key={cv.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm font-medium">{cv.fileName}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {new Date(cv.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button size="sm" variant="outline">
                                                        View
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-muted-foreground mb-4">No CVs uploaded yet</p>
                                            <Button>
                                                Upload CV
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Offers Display Form */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5" />
                                    Job Offers
                                </CardTitle>
                                <CardDescription>
                                    Browse and manage job opportunities
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">Frontend Developer</p>
                                                    <p className="text-xs text-muted-foreground">Tech Corp • Remote</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline">
                                                View
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">Full Stack Engineer</p>
                                                    <p className="text-xs text-muted-foreground">StartupXYZ • Hybrid</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline">
                                                View
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">React Developer</p>
                                                    <p className="text-xs text-muted-foreground">BigTech Inc • On-site</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline">
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                    <Button className="w-full" variant="outline">
                                        Browse More Offers
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Common tasks and shortcuts
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <a href="/user/sessions">
                                        <Bookmark className="mr-2 h-4 w-4" />
                                        View Saved Offers
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Account Status */}
                <div className="mt-6">
                    <Card>
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
    )
}