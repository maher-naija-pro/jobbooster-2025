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
import { Shield, BarChart3, Target, Settings } from 'lucide-react'

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
      cookies?: {
        essential?: boolean
        analytics?: boolean
        marketing?: boolean
        preferences?: boolean
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

function FormInputs({ language, timezone, notifications, privacy, cookies }: any) {
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

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Cookie Preferences</h3>

        <div className="space-y-4">
          {/* Essential Cookies */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Essential Cookies</Label>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Required for basic site functionality
                </p>
              </div>
            </div>
            <Switch checked={true} disabled />
          </div>

          {/* Analytics Cookies */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Analytics Cookies</Label>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Help us understand how visitors use our site
                </p>
              </div>
            </div>
            <Switch
              id="analyticsCookies"
              name="analyticsCookies"
              defaultChecked={cookies?.analytics || false}
              disabled={pending}
            />
          </div>

          {/* Marketing Cookies */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Marketing Cookies</Label>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Used to deliver relevant advertisements
                </p>
              </div>
            </div>
            <Switch
              id="marketingCookies"
              name="marketingCookies"
              defaultChecked={cookies?.marketing || false}
              disabled={pending}
            />
          </div>

          {/* Preference Cookies */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <Settings className="h-4 w-4 text-white" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Preference Cookies</Label>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Remember your settings and preferences
                </p>
              </div>
            </div>
            <Switch
              id="preferenceCookies"
              name="preferenceCookies"
              defaultChecked={cookies?.preferences || false}
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
  const cookies = preferences.cookies || {}

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
        cookies={cookies}
      />

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  )
}
