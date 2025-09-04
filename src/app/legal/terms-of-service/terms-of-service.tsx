import { Site_name } from "@/texts-and-menues/site-name"
import Link from "next/link"

const TermsOfService = () => {
  // Table of contents for better navigation
  const tableOfContents = [
    { id: "acceptance", title: "Acceptance of Terms" },
    { id: "privacy", title: "Privacy Policy" },
    { id: "changes", title: "Changes to Terms" },
    { id: "account", title: "Account Registration and Use" },
    { id: "newsletter", title: "Newsletter and Marketing Emails" },
    { id: "conduct", title: "User Conduct" },
    { id: "intellectual", title: "Intellectual Property" },
    { id: "third-party", title: "Third-Party Links" },
    { id: "dispute", title: "Dispute Resolution" },
    { id: "contact", title: "Contact Information" }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4">
              Terms of
              <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                {" "}Service
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-4">
              Last updated: {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
              <a
                href="#toc"
                className="inline-flex items-center px-4 py-2 text-primary hover:text-primary/80 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Table of Contents
              </a>
            </div>
          </header>

          {/* Table of Contents */}
          <nav id="toc" className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8" aria-label="Table of contents">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Table of Contents</h2>
            <ol className="space-y-3">
              {tableOfContents.map((item, index) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="flex items-center text-slate-600 dark:text-slate-300 hover:text-primary transition-colors group"
                  >
                    <span className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-sm font-medium mr-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {index + 1}
                    </span>
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Terms Content */}
          <article className="prose prose-lg max-w-none">
            <section id="acceptance" className="mb-6 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                By accessing and using the website <strong>{Site_name.siteUrl}</strong> ("Website"), you agree to be bound by these Terms of Service ("Terms") and our <Link href="/legal/privacy-policy" className="text-primary hover:text-primary/80 underline">Privacy Policy</Link>. If you do not agree to these Terms, please do not use our Website.
              </p>
            </section>

            <section id="privacy" className="mb-6 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">2. Privacy Policy</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Our <Link href="/legal/privacy-policy" className="text-primary hover:text-primary/80 underline">Privacy Policy</Link>, which outlines how we collect, use, and protect your personal information, is incorporated here by reference. Please read it carefully.
              </p>
            </section>

            <section id="changes" className="mb-6 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">3. Changes to Terms</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We may modify these Terms at any time. We will notify you of significant changes by posting a notice on our Website or by sending you an email. Your continued use of the Website after such changes have been notified will constitute your consent to such changes. It is your responsibility to review these Terms periodically for changes.
              </p>
            </section>

            <section id="account" className="mb-6 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">4. Account Registration and Use</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                You may need to register for an account to use certain features of our Website. By registering, you agree to provide accurate, current, and complete information about yourself as requested.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
              </p>
            </section>

            <section id="newsletter" className="mb-6 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">5. Newsletter and Marketing Emails</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                By creating an account, you consent to be subscribed to our newsletter, and to receive marketing emails from us and our partners. You can unsubscribe at any time by following the unsubscribe link in any of these emails.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We are not responsible for any issues that arise from you missing important communications because you unsubscribed from our emails.
              </p>
            </section>

            <section id="conduct" className="mb-6 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">6. User Conduct</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                You agree to use the Website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Website.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Prohibited behaviors include, but are not limited to, harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within the Website.
              </p>
            </section>

            <section id="intellectual" className="mb-6 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">7. Intellectual Property</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                The content on the Website is owned by us or our licensors and is protected by copyright and other intellectual property laws. You may not use the content except as permitted under these Terms.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Unauthorized use of the content may violate copyright, trademark, and other laws. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Website without express written permission from us.
              </p>
            </section>

            <section id="third-party" className="mb-6 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">8. Third-Party Links</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Our Website may contain links to third-party websites that are not operated by us. We are not responsible for the content, privacy, or practices of any third-party websites.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Accessing these links is at your own risk. We recommend that you review the terms and conditions and privacy policies of any third-party websites you visit.
              </p>
            </section>

            <section id="dispute" className="mb-6 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">9. Dispute Resolution</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Any disputes arising out of or related to these Terms will be governed by the laws of France, without regard to its conflict of law provisions. You agree to submit to the exclusive jurisdiction of the courts located in France to resolve any legal matter arising from these Terms.
              </p>
            </section>

            <section id="contact" className="mb-6 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">10. Contact Information</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-slate-600 dark:text-slate-300">
                  <strong>Email:</strong> <a href={`mailto:${Site_name.ContactMail}`} className="text-primary hover:text-primary/80 underline">{Site_name.ContactMail}</a>
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
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#toc"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/20"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default TermsOfService
