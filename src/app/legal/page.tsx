import { Site_name } from "@/texts-and-menues/site-name"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: Site_name.siteName + " | " + "Legal Documents",
    keywords: Site_name.keywords,
    description: "Legal documents and policies for " + Site_name.siteName + " - Privacy Policy, Terms of Service, and Legal Notice.",
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
        description: "Legal documents and policies for " + Site_name.siteName + " - Privacy Policy, Terms of Service, and Legal Notice.",
    }
}

const LegalPage = () => {
    const legalDocuments = [
        {
            title: "Privacy Policy",
            description: "Learn how we collect, use, and protect your personal information in compliance with GDPR and other privacy regulations.",
            href: "/legal/privacy-policy",
            icon: "🔒"
        },
        {
            title: "Terms of Service",
            description: "Understand the terms and conditions governing your use of our platform and services.",
            href: "/legal/terms-of-service",
            icon: "📋"
        },
        {
            title: "Legal Notice",
            description: "Company information, liability, intellectual property rights, and other legal information about our platform.",
            href: "/legal/legal-notice",
            icon: "⚖️"
        }
    ]

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <section className="container mx-auto px-4 py-8 sm:py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <header className="text-center mb-12">
                        <h1 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                            Legal
                            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                                {" "}Documents
                            </span>
                        </h1>
                        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Important legal information about our platform, services, and your rights as a user.
                        </p>
                    </header>

                    {/* Legal Documents Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {legalDocuments.map((document, index) => (
                            <Link
                                key={index}
                                href={document.href}
                                className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:border-primary/20 hover:-translate-y-1"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="text-3xl">{document.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                            {document.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {document.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-primary text-sm font-medium group-hover:text-primary/80 transition-colors">
                                    Read more
                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Additional Information */}
                    <div className="mt-12 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Questions or Concerns?</h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">
                            If you have any questions about our legal documents or need clarification on any terms, please don't hesitate to contact us.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href={`mailto:${Site_name.ContactMail}`}
                                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/20 text-sm"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Contact Us
                            </a>
                            <a
                                href={`mailto:${Site_name.supporMail}`}
                                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-600 text-sm"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                                </svg>
                                Support
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default LegalPage