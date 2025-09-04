'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile } from '@/app/user/profile/actions'
import { toast } from 'sonner'

interface ProfileFormProps {
  profile: any
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [username, setUsername] = useState(profile?.username || '')
  const [fullName, setFullName] = useState(profile?.fullName || '')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')

  // Show loading state if profile is not loaded yet
  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }


  // Update state when profile changes
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '')
      setFullName(profile.fullName || '')
    }
  }, [profile])

  // Check username uniqueness
  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setUsernameStatus('idle')
        return
      }

      if (username === profile?.username) {
        setUsernameStatus('available')
        return
      }

      setUsernameStatus('checking')

      try {
        const response = await fetch('/api/check-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username })
        })

        const data = await response.json()
        setUsernameStatus(data.available ? 'available' : 'taken')
      } catch (error) {
        setUsernameStatus('idle')
      }
    }

    const timeoutId = setTimeout(checkUsername, 500)
    return () => clearTimeout(timeoutId)
  }, [username, profile?.username])

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await updateProfile(formData)

      if (result.success) {
        toast.success(result.message)
        setError('')
        // Update local state to reflect the changes
        setUsername(formData.get('username') as string)
        setFullName(formData.get('fullName') as string)
      } else {
        setError(result.error)
        toast.error(result.error)
        // Revert optimistic update on error
        setUsername(profile?.username || '')
        setFullName(profile?.fullName || '')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      // Revert optimistic update on error
      setUsername(profile?.username || '')
      setFullName(profile?.fullName || '')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className={usernameStatus === 'taken' ? 'border-red-500' : usernameStatus === 'available' ? 'border-green-500' : ''}
            />
            {usernameStatus === 'checking' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              </div>
            )}
            {usernameStatus === 'available' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                ✓
              </div>
            )}
            {usernameStatus === 'taken' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                ✗
              </div>
            )}
          </div>
          {usernameStatus === 'taken' && (
            <p className="text-sm text-red-600">Username is already taken</p>
          )}
          {usernameStatus === 'available' && (
            <p className="text-sm text-green-600">Username is available</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={profile?.email || ''}
          disabled
          className="bg-gray-50"
        />
        <p className="text-sm text-muted-foreground">
          Email address cannot be changed. Contact support if you need to update it.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading || usernameStatus === 'taken' || usernameStatus === 'checking'}
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </Button>
      </div>
    </form>
  )
}
