'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { MetaButton } from '@/components/buttons/meta-button'
import { Icons } from '@/components/icons'
import { toast } from 'sonner'

interface UserProfileSettingsProps {
    profile: any
}

export function UserProfileSettings({ profile }: UserProfileSettingsProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showEmail, setShowEmail] = useState(false)

    const [formData, setFormData] = useState({
        fullName: profile?.fullName || '',
        username: profile?.username || '',
        email: profile?.email || '',
        bio: profile?.bio || '',
        location: profile?.location || '',
        website: profile?.website || '',
        profileVisibility: profile?.preferences?.privacy?.profileVisibility || 'public',
        showEmail: profile?.preferences?.privacy?.showEmail || false,
        showLocation: profile?.preferences?.privacy?.showLocation || true,
        showWebsite: profile?.preferences?.privacy?.showWebsite || true
    })

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            // Add actual save logic here
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('Profile updated successfully')
            setIsEditing(false)
        } catch (error) {
            toast.error('Failed to update profile')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        setFormData({
            fullName: profile?.fullName || '',
            username: profile?.username || '',
            email: profile?.email || '',
            bio: profile?.bio || '',
            location: profile?.location || '',
            website: profile?.website || '',
            profileVisibility: profile?.preferences?.privacy?.profileVisibility || 'public',
            showEmail: profile?.preferences?.privacy?.showEmail || false,
            showLocation: profile?.preferences?.privacy?.showLocation || true,
            showWebsite: profile?.preferences?.privacy?.showWebsite || true
        })
        setIsEditing(false)
    }

    return (
        <div className="space-y-6">
            {/* Profile Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icons.user className="h-5 w-5 text-blue-600" />
                        Profile Information
                    </CardTitle>
                    <CardDescription>
                        Update your personal information and profile details
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                disabled={!isEditing}
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                disabled={!isEditing}
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Input
                                id="email"
                                type={showEmail ? 'text' : 'password'}
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                disabled={!isEditing}
                                placeholder="Enter your email"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowEmail(!showEmail)}
                            >
                                {showEmail ? <Icons.eyeOff className="h-4 w-4" /> : <Icons.eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>



                    <div className="flex justify-end gap-2">
                        {isEditing ? (
                            <>
                                <Button variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <MetaButton onClick={handleSave} disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </MetaButton>
                            </>
                        ) : (
                            <MetaButton onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </MetaButton>
                        )}
                    </div>
                </CardContent>
            </Card>


        </div>
    )
}
