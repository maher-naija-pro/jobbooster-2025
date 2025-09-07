import Link from 'next/link'

interface ErrorPageProps {
    searchParams: Promise<{
        message?: string
    }>
}

export default async function ErrorPage({ searchParams }: ErrorPageProps) {
    const params = await searchParams
    const message = params.message || 'An unexpected error occurred'

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Something went wrong
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {message}
                    </p>
                </div>

                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                            Error
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            We encountered an error while processing your request. Please try again.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm"
                            >
                                Return to home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
