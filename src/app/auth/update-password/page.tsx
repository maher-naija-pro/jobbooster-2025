import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updatePassword } from '../reset-password/actions'

interface UpdatePasswordPageProps {
  searchParams: Promise<{
    message?: string
  }>
}

export default async function UpdatePasswordPage({ searchParams }: UpdatePasswordPageProps) {
  const resolvedSearchParams = await searchParams
  const message = resolvedSearchParams.message

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Update your password</CardTitle>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 rounded-md">
              {decodeURIComponent(message)}
            </div>
          )}

          <form action={updatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your new password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Update password
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <a href="/profile" className="text-primary hover:underline">
              Back to profile
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
