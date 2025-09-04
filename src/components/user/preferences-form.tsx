'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { updatePreferences } from '@/app/user/profile/actions'
import { toast } from 'sonner'
import { Icons } from '@/components/icons'

interface PreferencesFormProps {
  profile: {
    preferences?: {
      notifications?: {
        email?: boolean
        push?: boolean
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

function FormInputs({ notifications, privacy }: any) {
  const { pending } = useFormStatus()

  return (
    <>
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
              <Label htmlFor="pushNotifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications in your browser
              </p>
            </div>
            <Switch
              id="pushNotifications"
              name="pushNotifications"
              defaultChecked={notifications.push || false}
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
            <Select name="profileVisibility" defaultValue={privacy.profileVisibility || 'private'}>
              <SelectTrigger disabled={pending}>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
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
  const notifications = preferences.notifications || {}
  const privacy = preferences.privacy || {}

  return (
    <form action={updatePreferences} className="space-y-6">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}


      <FormInputs notifications={notifications} privacy={privacy} />

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  )
}
