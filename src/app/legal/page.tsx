import Link from "next/link"
import { Site_name } from "@/texts-and-menues/site-name"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: Site_name.siteName + " | " + "Legal Information",
    keywords: Site_name.keywords,
    description: "Legal information, terms of service, and privacy policy for " + Site_name.siteName,
    twitter: {
        title: Site_name.Title,
        site: " @" + Site_name.siteName,
        images: [Site_name.cover_twitter]
    },
    openGraph: {
        images: [Site_name.cover_facebook],
        title: Site_name.Title,
        url: Site_name.domain,
        siteName: Site_name.siteName,
        type: "website",
        description: Site_name.description,
    }
}

const LegalPage = () => {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <section className="container mx-auto px-4 py-16 sm:py-24">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <header className="text-center mb-16">
                        <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                            Legal
                            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                                {" "}Information
                            </span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Important legal documents and policies that govern your use of {Site_name.siteName}.
                            Please review these documents carefully.
                        </p>
                    </header>

                    {/* Navigation Cards */}
                    <nav className="grid md:grid-cols-2 gap-8 mb-16" role="navigation" aria-label="Legal documents">
                        <Link
                            href="/legal/terms-of-service"
                            className="group block p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/20"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                        Terms of Service
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                                        The terms and conditions that govern your use of our platform and services.
                                    </p>
                                    <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                                        Read Terms
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/legal/privacy-policy"
                            className="group block p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/20"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                        Privacy Policy
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                                        How we collect, use, and protect your personal information and data.
                                    </p>
                                    <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                                        Read Policy
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </nav>

                    {/* Additional Information */}
                    <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                            Questions About Our Legal Documents?
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-6">
                            If you have any questions about our Terms of Service or Privacy Policy,
                            please don't hesitate to contact us. We're here to help clarify any concerns.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href={`mailto:${Site_name.ContactMail}`}
                                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/20"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Contact Us
                            </a>
                            <a
                                href={`mailto:${Site_name.supporMail}`}
                                className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-600"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                                </svg>
                                Support
                            </a>
                        </div>
                    </section>

                    {/* Last Updated */}
                    <footer className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400">
                        <p>Last updated: {new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </footer>
                </div>
            </section>
        </main>
    )
}

export default LegalPage
