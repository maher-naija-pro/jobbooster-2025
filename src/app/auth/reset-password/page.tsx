import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { requestPasswordReset } from './actions'

interface ResetPasswordPageProps {
    searchParams: {
        message?: string
    }
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
    const message = searchParams.message

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Reset your password</CardTitle>
                    <CardDescription>
                        Enter your email address and we'll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {message && (
                        <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 rounded-md">
                            {decodeURIComponent(message)}
                        </div>
                    )}

                    <form action={requestPasswordReset} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Send reset link
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        <a href="/auth/login" className="text-primary hover:underline">
                            Back to sign in
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
