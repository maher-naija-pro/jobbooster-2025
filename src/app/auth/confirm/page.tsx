import { Suspense } from 'react'

interface ConfirmPageProps {
    searchParams: Promise<{
        email?: string
    }>
}

export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
    const resolvedSearchParams = await searchParams
    const email = resolvedSearchParams.email

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Check your email
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {email
                            ? `We've sent a confirmation link to ${email}`
                            : "We've sent you a confirmation link"
                        }
                    </p>
                </div>

                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                            Email sent successfully
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Please check your email and click the confirmation link to complete your registration.
                        </p>
                        <div className="mt-6">
                            <a
                                href="/"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm"
                            >
                                Return to home
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
