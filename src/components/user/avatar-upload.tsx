'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { uploadAvatar, deleteAvatar } from '@/app/user/avatar/actions'
import { toast } from 'sonner'

interface AvatarUploadProps {
  profile: any
}

export function AvatarUpload({ profile }: AvatarUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = async (formData: FormData) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await uploadAvatar(formData)

      if (result.success) {
        toast.success(result.message)
        setError('')
      } else {
        setError(result.error)
        toast.error(result.error)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await deleteAvatar()

      if (result.success) {
        toast.success(result.message)
        setError('')
      } else {
        setError(result.error)
        toast.error(result.error)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const initials = profile?.fullName
    ? profile.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : profile?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex items-center space-x-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile?.avatarUrl} alt={profile?.fullName || profile?.email} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Profile Picture</h3>
          <p className="text-sm text-muted-foreground">
            Upload a new profile picture. Maximum file size is 5MB.
            Supported formats: JPEG, PNG, WebP.
          </p>
        </div>
      </div>

      <form action={handleUpload} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="avatar" className="text-sm font-medium">
            Choose File
          </label>
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            disabled={isLoading}
          />
        </div>

        <div className="flex space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Upload Avatar'}
          </Button>

          {profile?.avatarUrl && (
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Remove Avatar'}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
