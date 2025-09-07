'use client'

import { useState, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { uploadAvatar, deleteAvatar } from '@/app/user/avatar/actions'
import { toast } from 'sonner'
import { Icons } from '@/components/icons'

interface AvatarUploadProps {
  profile: any
}

function SingleUploadButton({ onError }: { onError: (error: string) => void }) {
  const { pending } = useFormStatus()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Client-side validation
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        onError('File size must be less than 5MB')
        return
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        onError('Only JPEG, PNG, and WebP images are allowed')
        return
      }

      // Auto-submit the form when file is selected
      const form = e.target.closest('form')
      if (form) {
        form.requestSubmit()
      }
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        name="avatar"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="w-full"
      >
        {pending ? (
          <>
            <Icons.Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Icons.FileUp className="h-4 w-4 mr-2" />
            Choose & Upload Avatar
          </>
        )}
      </Button>
    </>
  )
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <>
          <Icons.Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Upgrading...
        </>
      ) : (
        'Remove Avatar'
      )}
    </Button>
  )
}

export function AvatarUpload({ profile }: AvatarUploadProps) {
  const [error, setError] = useState('')
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)

  const handleDelete = async () => {
    setError('')

    try {
      const result = await deleteAvatar()

      if (result.success) {
        toast.success(result.message)
        setError('')
      } else {
        const errorMsg = result.error || 'An unknown error occurred'
        setError(errorMsg)
        setIsErrorModalOpen(true)
        toast.error(errorMsg)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      setIsErrorModalOpen(true)
      toast.error(errorMessage)
    }
  }

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage || 'An unknown error occurred')
    setIsErrorModalOpen(true)
  }

  const handleFormSubmit = async (formData: FormData) => {
    try {
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        toast.success(result.message)
        setError('')
        // Refresh the page to show the new avatar
        window.location.reload()
      } else {
        const errorMsg = result.error || 'An unknown error occurred'
        setError(errorMsg)
        setIsErrorModalOpen(true)
        toast.error(errorMsg)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      setIsErrorModalOpen(true)
      toast.error(errorMessage)
    }
  }

  const initials = profile?.fullName
    ? profile.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : profile?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <>
      <div className="space-y-6">
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

        <form action={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <SingleUploadButton onError={handleUploadError} />
          </div>

          {profile?.avatarUrl && (
            <div className="flex justify-center">
              <DeleteButton onDelete={handleDelete} />
            </div>
          )}
        </form>
      </div>

      {/* Error Modal */}
      <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icons.shield className="h-5 w-5 text-red-500" />
              Upload Error
            </DialogTitle>
            <DialogDescription>
              There was an error processing your avatar upload.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsErrorModalOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setIsErrorModalOpen(false)
                setError('')
              }}
            >
              Try Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
