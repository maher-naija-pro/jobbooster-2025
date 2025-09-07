'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LanguageCardSelector } from '@/components/ui/language-card-selector'
import { TimezoneCardSelector } from '@/components/ui/timezone-card-selector'
import { PrivacyCardSelector } from '@/components/ui/privacy-card-selector'
import { Switch } from '@/components/ui/switch'
import { updatePreferences } from '@/app/user/profile/actions'
import { toast } from 'sonner'
import { Icons } from '@/components/icons'
import { SUPPORTED_LANGUAGES } from '@/lib/types'

interface PreferencesFormProps {
  profile: {
    preferences?: {
      language?: string
      timezone?: string
      notifications?: {
        email?: boolean
        marketing?: boolean
      }
      privacy?: {
        profileVisibility?: string
        dataRetention?: number
      }
    }
  }
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Icons.Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Upgrading...
        </>
      ) : (
        'Update Preferences'
      )}
    </Button>
  )
}

function FormInputs({ language, timezone, notifications, privacy }: any) {
  const { pending } = useFormStatus()

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">General</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language">Preferred Language</Label>
            <LanguageCardSelector
              value={language || 'en'}
              onChange={(value) => {
                const input = document.querySelector('input[name="language"]') as HTMLInputElement
                if (input) input.value = value
              }}
              disabled={pending}
            />
            <input type="hidden" name="language" value={language || 'en'} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <TimezoneCardSelector
              value={timezone || 'UTC'}
              onChange={(value) => {
                const input = document.querySelector('input[name="timezone"]') as HTMLInputElement
                if (input) input.value = value
              }}
              disabled={pending}
            />
            <input type="hidden" name="timezone" value={timezone || 'UTC'} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notifications</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="emailNotifications"
              name="emailNotifications"
              defaultChecked={notifications.email || false}
              disabled={pending}
            />
          </div>


          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketingNotifications">Marketing Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive marketing emails and updates
              </p>
            </div>
            <Switch
              id="marketingNotifications"
              name="marketingNotifications"
              defaultChecked={notifications.marketing || false}
              disabled={pending}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Privacy</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profileVisibility">Profile Visibility</Label>
            <PrivacyCardSelector
              value={privacy.profileVisibility || 'private'}
              onChange={(value) => {
                const input = document.querySelector('input[name="profileVisibility"]') as HTMLInputElement
                if (input) input.value = value
              }}
              disabled={pending}
            />
            <input type="hidden" name="profileVisibility" value={privacy.profileVisibility || 'private'} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataRetention">Data Retention (days)</Label>
            <Input
              id="dataRetention"
              name="dataRetention"
              type="number"
              min="30"
              max="3650"
              defaultValue={privacy.dataRetention || 365}
              disabled={pending}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export function PreferencesForm({ profile }: PreferencesFormProps) {
  const [error, setError] = useState('')

  const preferences = profile?.preferences || {}
  const language = preferences.language || 'en'
  const timezone = preferences.timezone || 'UTC'
  const notifications = preferences.notifications || {}
  const privacy = preferences.privacy || {}

  const handleSubmit = async (formData: FormData) => {
    const result = await updatePreferences(formData)
    if (!result.success) {
      setError(result.error || 'Failed to update preferences')
    } else {
      setError('')
      toast.success(result.message || 'Preferences updated successfully')
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <FormInputs
        language={language}
        timezone={timezone}
        notifications={notifications}
        privacy={privacy}
      />

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  )
}
