import { Site_name } from "@/texts-and-menues/site-name"
import Link from "next/link"

const LegalNotice = () => {
    // Table of contents for better navigation
    const tableOfContents = [
        { id: "introduction", title: "Introduction" },
        { id: "company-info", title: "Company Information" },
        { id: "publishing-director", title: "Publishing Director" },
        { id: "hosting-provider", title: "Hosting Provider" },
        { id: "intellectual-property", title: "Intellectual Property" },
        { id: "liability", title: "Liability" },
        { id: "privacy", title: "Privacy and Data Protection" },
        { id: "cookies", title: "Cookies Policy" },
        { id: "applicable-law", title: "Applicable Law" },
        { id: "contact", title: "Contact Information" }
    ]

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <section className="container mx-auto px-4 py-8 sm:py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <header className="text-center mb-8">
                        <h1 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                            Legal
                            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                                {" "}Notice
                            </span>
                        </h1>
                        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
                            Last updated: {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a
                                href="#toc"
                                className="inline-flex items-center px-3 py-2 text-primary hover:text-primary/80 transition-colors text-sm"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                                Table of Contents
                            </a>
                        </div>
                    </header>

                    {/* Table of Contents */}
                    <nav id="toc" className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8" aria-label="Table of contents">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Table of Contents</h2>
                        <ol className="space-y-2">
                            {tableOfContents.map((item, index) => (
                                <li key={item.id}>
                                    <a
                                        href={`#${item.id}`}
                                        className="flex items-center text-slate-600 dark:text-slate-300 hover:text-primary transition-colors group text-sm"
                                    >
                                        <span className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-medium mr-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            {index + 1}
                                        </span>
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    {/* Legal Notice Content */}
                    <article className="prose prose-sm max-w-none">
                        <section id="introduction" className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Introduction</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 text-sm">
                                This legal notice governs the use of the website <strong>{Site_name.siteUrl}</strong> (the "Website") operated by <strong>{Site_name.company}</strong> (the "Company"). By accessing and using this Website, you accept and agree to be bound by the terms and provision of this legal notice.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                If you do not agree to abide by the above, please do not use this service.
                            </p>
                        </section>

                        <section id="company-info" className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Company Information</h2>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        <strong>Company Name:</strong> {Site_name.company}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        <strong>Website:</strong> <a href={Site_name.domain} className="text-primary hover:text-primary/80 underline">{Site_name.siteUrl}</a>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        <strong>Address:</strong> {Site_name.Addresse}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        <strong>Email:</strong> <a href={`mailto:${Site_name.ContactMail}`} className="text-primary hover:text-primary/80 underline">{Site_name.ContactMail}</a>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        <strong>Support:</strong> <a href={`mailto:${Site_name.supporMail}`} className="text-primary hover:text-primary/80 underline">{Site_name.supporMail}</a>
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section id="publishing-director" className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Publishing Director</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 text-sm">
                                The publishing director of this website is the legal representative of {Site_name.company}.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                For any questions regarding the content of this website, please contact us at <a href={`mailto:${Site_name.ContactMail}`} className="text-primary hover:text-primary/80 underline">{Site_name.ContactMail}</a>.
                            </p>
                        </section>

                        <section id="hosting-provider" className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Hosting Provider</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 text-sm">
                                This website is hosted by a professional hosting provider. The hosting provider ensures the technical operation and maintenance of the server infrastructure.
                            </p>
                            <div className="space-y-2 text-sm">
                                <p className="text-slate-600 dark:text-slate-300">
                                    <strong>Hosting Type:</strong> Cloud hosting with high availability
                                </p>
                                <p className="text-slate-600 dark:text-slate-300">
                                    <strong>Security:</strong> SSL encryption and regular security updates
                                </p>
                                <p className="text-slate-600 dark:text-slate-300">
                                    <strong>Backup:</strong> Regular automated backups
                                </p>
                                <p className="text-slate-600 dark:text-slate-300">
                                    <strong>Uptime:</strong> 99.9% service level agreement
                                </p>
                            </div>
                        </section>

                        <section id="intellectual-property" className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Intellectual Property</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 text-sm">
                                All content on this website, including but not limited to text, graphics, logos, images, audio clips, video, and software, is the property of {Site_name.company} or its content suppliers and is protected by international copyright laws.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 text-sm">
                                The compilation of all content on this website is the exclusive property of {Site_name.company} and is protected by international copyright laws.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                You may not reproduce, distribute, display, sell, lease, transmit, create derivative works from, translate, modify, reverse-engineer, disassemble, decompile or otherwise exploit this website or any portion of it unless expressly permitted by {Site_name.company} in writing.
                            </p>
                        </section>

                        <section id="liability" className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Liability</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 text-sm">
                                The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, {Site_name.company} excludes all representations, warranties, conditions and terms relating to our website and the use of this website.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 text-sm">
                                In no event shall {Site_name.company} be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the website.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                {Site_name.company} does not warrant that the website will be available at any particular time or location, uninterrupted or secure, or that any defects or errors will be corrected.
                            </p>
                        </section>

                        <section id="privacy" className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Privacy and Data Protection</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 text-sm">
                                We are committed to protecting your privacy and personal data. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into this legal notice by reference.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 text-sm">
                                We comply with applicable data protection laws, including the General Data Protection Regulation (GDPR) for users in the European Union.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                For more information about how we collect, use, and protect your personal data, please review our <Link href="/legal/privacy-policy" className="text-primary hover:text-primary/80 underline">Privacy Policy</Link>.
                            </p>
                        </section>

                        <section id="cookies" className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Cookies Policy</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 text-sm">
                                This website uses cookies to enhance your browsing experience and provide personalized content. Cookies are small text files that are stored on your device when you visit our website.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 text-sm">
                                By continuing to use this website, you consent to our use of cookies in accordance with our Cookie Policy. You can manage your cookie preferences through your browser settings.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                For detailed information about our use of cookies, please refer to our <Link href="/legal/privacy-policy" className="text-primary hover:text-primary/80 underline">Privacy Policy</Link>.
                            </p>
                        </section>

                        <section id="applicable-law" className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Applicable Law</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 text-sm">
                                This legal notice shall be governed by and construed in accordance with the laws of France, without regard to its conflict of law provisions.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 text-sm">
                                Any disputes arising from or relating to this legal notice or your use of this website shall be subject to the exclusive jurisdiction of the courts of France.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                If any provision of this legal notice is found to be unenforceable or invalid, such provision shall be limited or eliminated to the minimum extent necessary so that this legal notice shall otherwise remain in full force and effect.
                            </p>
                        </section>

                        <section id="contact" className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Contact Information</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 text-sm">
                                If you have any questions about this legal notice or our website, please contact us:
                            </p>
                            <div className="space-y-1 text-sm">
                                <p className="text-slate-600 dark:text-slate-300">
                                    <strong>Email:</strong> <a href={`mailto:${Site_name.ContactMail}`} className="text-primary hover:text-primary/80 underline">{Site_name.ContactMail}</a>
                                </p>
                                <p className="text-slate-600 dark:text-slate-300">
                                    <strong>Support:</strong> <a href={`mailto:${Site_name.supporMail}`} className="text-primary hover:text-primary/80 underline">{Site_name.supporMail}</a>
                                </p>
                                <p className="text-slate-600 dark:text-slate-300">
                                    <strong>Website:</strong> <a href={Site_name.domain} className="text-primary hover:text-primary/80 underline">{Site_name.siteUrl}</a>
                                </p>
                                <p className="text-slate-600 dark:text-slate-300">
                                    <strong>Address:</strong> {Site_name.Addresse}
                                </p>
                            </div>
                        </section>
                    </article>

                    {/* Back to top and navigation */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href="#toc"
                            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/20 text-sm"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            Back to Top
                        </a>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default LegalNotice
