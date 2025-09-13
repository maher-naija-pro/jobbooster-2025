'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { MetaButton } from '@/components/buttons/meta-button'
import { Icons } from '@/components/icons'
import { toast } from 'sonner'

interface SecuritySettingsProps {
    profile: any
}

export function SecuritySettings({ profile }: SecuritySettingsProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: profile?.preferences?.security?.twoFactorAuth || false,
        loginAlerts: profile?.preferences?.security?.loginAlerts || true,
        sessionTimeout: profile?.preferences?.security?.sessionTimeout || 30,
        requirePasswordChange: profile?.preferences?.security?.requirePasswordChange || false,
        passwordChangeDays: profile?.preferences?.security?.passwordChangeDays || 90
    })

    // Mock data for active sessions
    const activeSessions = [
        {
            id: '1',
            device: 'Chrome on Windows',
            location: 'New York, NY',
            ipAddress: '192.168.1.100',
            lastActive: '2024-01-20 14:30',
            current: true
        },
        {
            id: '2',
            device: 'Safari on iPhone',
            location: 'San Francisco, CA',
            ipAddress: '192.168.1.101',
            lastActive: '2024-01-19 09:15',
            current: false
        }
    ]

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordForm(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSecuritySettingChange = (key: string, value: boolean | number) => {
        setSecuritySettings(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handlePasswordUpdate = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('New passwords do not match')
            return
        }

        if (passwordForm.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters long')
            return
        }

        setIsLoading(true)
        try {
            // Add actual password update logic here
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('Password updated successfully')
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } catch (error) {
            toast.error('Failed to update password')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSecuritySettingsSave = async () => {
        setIsLoading(true)
        try {
            // Add actual security settings save logic here
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('Security settings updated successfully')
        } catch (error) {
            toast.error('Failed to update security settings')
        } finally {
            setIsLoading(false)
        }
    }

    const handleTerminateSession = async (sessionId: string) => {
        try {
            // Add actual session termination logic here
            await new Promise(resolve => setTimeout(resolve, 500))
            toast.success('Session terminated successfully')
        } catch (error) {
            toast.error('Failed to terminate session')
        }
    }

    const handleTerminateAllSessions = async () => {
        try {
            // Add actual terminate all sessions logic here
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('All other sessions terminated successfully')
        } catch (error) {
            toast.error('Failed to terminate sessions')
        }
    }

    return (
        <div className="space-y-6">
            {/* Password Change */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icons.key className="h-5 w-5 text-blue-600" />
                        Change Password
                    </CardTitle>
                    <CardDescription>
                        Update your password to keep your account secure
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                    placeholder="Enter your current password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? <Icons.eyeOff className="h-4 w-4" /> : <Icons.eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={passwordForm.newPassword}
                                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                    placeholder="Enter your new password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <Icons.eyeOff className="h-4 w-4" /> : <Icons.eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                    placeholder="Confirm your new password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <Icons.eyeOff className="h-4 w-4" /> : <Icons.eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <MetaButton onClick={handlePasswordUpdate} disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </MetaButton>
                </CardContent>
            </Card>

 
        </div>
    )
}
