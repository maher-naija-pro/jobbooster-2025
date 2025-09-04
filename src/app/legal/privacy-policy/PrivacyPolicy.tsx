import { Site_name } from "@/texts-and-menues/site-name"
import Link from "next/link"

const PrivacyPolicy = () => {
  // Table of contents for better navigation
  const tableOfContents = [
    { id: "introduction", title: "Introduction" },
    { id: "data-collection", title: "Data Collection and AI Processing" },
    { id: "ai-processing", title: "AI Processing and Content Generation" },
    { id: "log-files", title: "Log Files" },
    { id: "cookies", title: "Cookies and Web Beacons" },
    { id: "data-protection", title: "Data Protection Rights (GDPR)" },
    { id: "data-security", title: "Data Security" },
    { id: "data-retention", title: "Data Retention" },
    { id: "children-privacy", title: "Children's Privacy" },
    { id: "changes", title: "Changes to Privacy Policy" },
    { id: "contact", title: "Contact Us" }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Privacy
              <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                {" "}Policy
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
              <Link 
                href="/legal"
                className="inline-flex items-center px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Legal
              </Link>
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

          {/* Privacy Policy Content */}
          <article className="prose prose-lg max-w-none">
            <section id="introduction" className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Introduction</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 text-sm">
                At <strong>{Site_name.siteName}</strong>, accessible from <strong>{Site_name.siteUrl}</strong>, we prioritize the privacy of our users. This Privacy Policy outlines the types of information collected by our web application and how we use, store, and protect it.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                By using our service, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
              </p>
            </section>

            <section id="data-collection" className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Data Collection and AI Processing</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 text-sm">
                Our web application collects the following types of personal information:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 mb-3 text-sm">
                <li><strong>Email addresses</strong> - For account creation and communication</li>
                <li><strong>Resume data</strong> - Including work experience, skills, education, and contact information</li>
                <li><strong>Job preferences</strong> - Industry preferences, location preferences, and salary expectations</li>
                <li><strong>Usage data</strong> - Information about how you interact with our platform</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                This data is processed using advanced AI algorithms to offer personalized services such as job recommendations, skill assessments, and career guidance. We use this information to improve our services and provide you with relevant opportunities.
              </p>
            </section>

            <section id="ai-processing" className="mb-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">AI Processing and Content Generation</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Our web application uses self-hosted AI technology to generate cover letters, resume improvements, and other job-seeking-related content. This approach ensures complete data privacy and security:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                <li><strong>Self-hosted AI infrastructure</strong> - All AI processing happens on our own servers</li>
                <li><strong>No external data sharing</strong> - Your personal information never leaves our secure environment</li>
                <li><strong>Complete data control</strong> - We maintain full control over your data throughout the entire process</li>
                <li><strong>Enhanced privacy protection</strong> - No third-party AI services have access to your information</li>
                <li><strong>Secure processing</strong> - All AI operations are performed within our encrypted, private infrastructure</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                By using our self-hosted AI solution, we guarantee that your personal data, resume information, and job requirements remain completely private and are never shared with external AI providers or third-party services.
              </p>
            </section>

            <section id="log-files" className="mb-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Log Files</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                We follow standard procedures for collecting log files, which may include:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                <li>IP addresses</li>
                <li>Browser type and version</li>
                <li>Internet Service Provider (ISP)</li>
                <li>Date and time stamps</li>
                <li>Referring/exit pages</li>
                <li>Number of clicks</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                This information is used to analyze trends, administer the site, track user movement, and gather demographic information. It is not linked to any personally identifiable information.
              </p>
            </section>

            <section id="cookies" className="mb-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Cookies and Web Beacons</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our platform:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                <li><strong>Essential cookies</strong> - Required for basic site functionality</li>
                <li><strong>Analytics cookies</strong> - Help us understand how visitors use our site</li>
                <li><strong>Preference cookies</strong> - Remember your settings and preferences</li>
                <li><strong>Marketing cookies</strong> - Used to deliver relevant advertisements</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                You can control cookie settings through your browser preferences. However, disabling certain cookies may affect the functionality of our service.
              </p>
            </section>

            <section id="data-protection" className="mb-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Data Protection Rights (GDPR)</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                If you are a resident of the European Economic Area (EEA), you have certain data protection rights:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                <li><strong>Right to access</strong> - Request copies of your personal data</li>
                <li><strong>Right to rectification</strong> - Request correction of inaccurate data</li>
                <li><strong>Right to erasure</strong> - Request deletion of your personal data</li>
                <li><strong>Right to restrict processing</strong> - Request limitation of data processing</li>
                <li><strong>Right to data portability</strong> - Request transfer of your data</li>
                <li><strong>Right to object</strong> - Object to processing of your personal data</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                To exercise any of these rights, please contact us at <a href={`mailto:${Site_name.ContactMail}`} className="text-primary hover:text-primary/80 underline">{Site_name.ContactMail}</a>.
              </p>
            </section>

            <section id="data-security" className="mb-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Data Security</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and assessments</li>
                <li>Access controls and authentication measures</li>
                <li>Secure data storage and backup procedures</li>
                <li>Staff training on data protection practices</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                While we strive to protect your personal information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section id="data-retention" className="mb-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Data Retention</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                We retain your personal information for as long as necessary to:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                <li>Provide our services to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Improve our services and user experience</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                When you delete your account, we will delete or anonymize your personal information within 30 days, unless we are required to retain it for legal or regulatory purposes.
              </p>
            </section>

            <section id="children-privacy" className="mb-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Children's Privacy</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Our service is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we discover that we have collected personal information from a child under 16, we will delete such information from our servers.
              </p>
            </section>

            <section id="changes" className="mb-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Changes to Privacy Policy</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We will also notify you via email if the changes are significant. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section id="contact" className="mb-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Contact Us</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
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
          <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#toc"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/20"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Back to Top
            </a>
            <Link
              href="/legal"
              className="inline-flex items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-600"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Legal
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PrivacyPolicy