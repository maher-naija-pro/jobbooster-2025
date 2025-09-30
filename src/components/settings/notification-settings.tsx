'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MetaButton } from '@/components/buttons/meta-button'
import { Icons } from '@/components/icons'
import { toast } from 'sonner'

interface NotificationPreferencesShape {
    notifications?: {
        email?: boolean
        marketing?: boolean
        security?: boolean
        updates?: boolean
        push?: boolean
        pushMarketing?: boolean
        pushSecurity?: boolean
        pushUpdates?: boolean
        emailFrequency?: 'immediate' | 'daily' | 'weekly'
        digestFrequency?: 'daily' | 'weekly' | 'monthly'
        quietHours?: boolean
        quietStart?: string
        quietEnd?: string
        quietDays?: string[]
    }
}

interface NotificationSettingsProps {
    profile: { preferences?: NotificationPreferencesShape } | null
}

export function NotificationSettings({ profile }: NotificationSettingsProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({
        // Email Notifications
        emailNotifications: profile?.preferences?.notifications?.email || true,
        emailMarketing: profile?.preferences?.notifications?.marketing || false,
        emailSecurity: profile?.preferences?.notifications?.security || true,
        emailUpdates: profile?.preferences?.notifications?.updates || true,

        // Push Notifications
        pushNotifications: profile?.preferences?.notifications?.push || true,
        pushMarketing: profile?.preferences?.notifications?.pushMarketing || false,
        pushSecurity: profile?.preferences?.notifications?.pushSecurity || true,
        pushUpdates: profile?.preferences?.notifications?.pushUpdates || false,

        // Frequency Settings
        emailFrequency: profile?.preferences?.notifications?.emailFrequency || 'immediate',
        digestFrequency: profile?.preferences?.notifications?.digestFrequency || 'weekly',

        // Quiet Hours
        quietHours: profile?.preferences?.notifications?.quietHours || false,
        quietStart: profile?.preferences?.notifications?.quietStart || '22:00',
        quietEnd: profile?.preferences?.notifications?.quietEnd || '08:00',
        quietDays: profile?.preferences?.notifications?.quietDays || ['saturday', 'sunday']
    })

    const handleSettingChange = (key: string, value: boolean | string) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            // Add actual save logic here
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('Notification settings updated successfully')
        } catch (error) {
            toast.error('Failed to update notification settings')
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setSettings({
            emailNotifications: true,
            emailMarketing: false,
            emailSecurity: true,
            emailUpdates: true,
            pushNotifications: true,
            pushMarketing: false,
            pushSecurity: true,
            pushUpdates: false,
            emailFrequency: 'immediate',
            digestFrequency: 'weekly',
            quietHours: false,
            quietStart: '22:00',
            quietEnd: '08:00',
            quietDays: ['saturday', 'sunday']
        })
    }

    return (
        <div className="space-y-6">
            {/* Email Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icons.mail className="h-5 w-5 text-blue-600" />
                        Email Notifications
                    </CardTitle>
                    <CardDescription>
                        Control which email notifications you receive
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>All Email Notifications</Label>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    Master switch for all email notifications
                                </p>
                            </div>
                            <Switch
                                checked={settings.emailNotifications}
                                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                            />
                        </div>

                        <div className="ml-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Security Alerts</Label>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        Login attempts, password changes, and security events
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.emailSecurity}
                                    onCheckedChange={(checked) => handleSettingChange('emailSecurity', checked)}
                                    disabled={!settings.emailNotifications}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Product Updates</Label>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        New features, improvements, and important announcements
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.emailUpdates}
                                    onCheckedChange={(checked) => handleSettingChange('emailUpdates', checked)}
                                    disabled={!settings.emailNotifications}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Marketing & Promotions</Label>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        Special offers, tips, and promotional content
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.emailMarketing}
                                    onCheckedChange={(checked) => handleSettingChange('emailMarketing', checked)}
                                    disabled={!settings.emailNotifications}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Push Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icons.smartphone className="h-5 w-5 text-green-600" />
                        Push Notifications
                    </CardTitle>
                    <CardDescription>
                        Control push notifications on your devices
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>All Push Notifications</Label>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    Master switch for all push notifications
                                </p>
                            </div>
                            <Switch
                                checked={settings.pushNotifications}
                                onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                            />
                        </div>

                        <div className="ml-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Security Alerts</Label>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        Immediate security notifications
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.pushSecurity}
                                    onCheckedChange={(checked) => handleSettingChange('pushSecurity', checked)}
                                    disabled={!settings.pushNotifications}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Product Updates</Label>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        New features and important updates
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.pushUpdates}
                                    onCheckedChange={(checked) => handleSettingChange('pushUpdates', checked)}
                                    disabled={!settings.pushNotifications}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Marketing & Promotions</Label>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        Special offers and promotional content
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.pushMarketing}
                                    onCheckedChange={(checked) => handleSettingChange('pushMarketing', checked)}
                                    disabled={!settings.pushNotifications}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>





            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
                <MetaButton variant="primary-outline" onClick={handleReset}>
                    Reset to Defaults
                </MetaButton>
                <MetaButton onClick={handleSave} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Settings'}
                </MetaButton>
            </div>
        </div>
    )
}
