import { Suspense } from 'react'
import ConfirmHandler from './ConfirmHandler'

interface ConfirmPageProps {
    searchParams: Promise<{
        email?: string
        token?: string
    }>
}

export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
    const resolvedSearchParams = await searchParams
    const email = resolvedSearchParams.email
    const token = resolvedSearchParams.token

    // If token is present in search params, show verification success
    if (token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Email Verified!
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Your email has been successfully verified.
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
                                Verification Complete
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Your account is now active. You can start using all features of our platform.
                            </p>
                            <div className="mt-6">
                                <a
                                    href="/dashboard"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Go to Dashboard
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Use client component to handle URL fragment tokens
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                            <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Loading...
                        </h2>
                    </div>
                </div>
            </div>
        }>
            <ConfirmHandler />
        </Suspense>
    )
}
