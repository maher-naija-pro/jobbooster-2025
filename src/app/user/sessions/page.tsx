import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getSessionManagement } from '@/app/user/profile/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { endSession } from '@/app/user/profile/actions'
import { Monitor, Smartphone, Tablet, Globe, Clock, Trash2 } from 'lucide-react'

export default async function SessionsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const sessionData = await getSessionManagement(user.id)

    if (!sessionData.success) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Session Management</h1>
                    <p className="text-muted-foreground">Error loading session data.</p>
                </div>
            </div>
        )
    }

    const { analytics, activeSessions } = sessionData.data

    const getDeviceIcon = (device: string) => {
        switch (device.toLowerCase()) {
            case 'mobile':
                return <Smartphone className="h-4 w-4" />
            case 'tablet':
                return <Tablet className="h-4 w-4" />
            case 'desktop':
                return <Monitor className="h-4 w-4" />
            default:
                return <Monitor className="h-4 w-4" />
        }
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Session Management</h1>
                    <p className="text-muted-foreground">
                        Manage your active sessions and view session analytics
                    </p>
                </div>

                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                            <Globe className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.totalSessions}</div>
                            <p className="text-xs text-muted-foreground">
                                All time sessions
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.activeSessions}</div>
                            <p className="text-xs text-muted-foreground">
                                Currently active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Expired Sessions</CardTitle>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.expiredSessions}</div>
                            <p className="text-xs text-muted-foreground">
                                No longer active
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Device Breakdown */}
                {analytics.sessionsByDevice.length > 0 && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Sessions by Device</CardTitle>
                            <CardDescription>
                                Distribution of your sessions across different devices
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analytics.sessionsByDevice.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            {getDeviceIcon(item.device)}
                                            <span className="font-medium capitalize">{item.device}</span>
                                        </div>
                                        <Badge variant="secondary">{item.count}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Active Sessions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Active Sessions</CardTitle>
                        <CardDescription>
                            Manage your currently active sessions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {activeSessions.length > 0 ? (
                            <div className="space-y-4">
                                {activeSessions.map((session) => (
                                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                {getDeviceIcon((session.deviceInfo as any)?.device || 'Desktop')}
                                                <div>
                                                    <p className="font-medium">
                                                        {(session.deviceInfo as any)?.browser || 'Unknown Browser'} on {(session.deviceInfo as any)?.os || 'Unknown OS'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {session.ipAddress} • Last active: {new Date(session.lastActivity).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline">
                                                {new Date(session.expiresAt).toLocaleDateString()}
                                            </Badge>
                                            <form action={async () => {
                                                'use server'
                                                await endSession(session.id)
                                            }}>
                                                <Button variant="outline" size="sm">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    End Session
                                                </Button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No active sessions found.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
