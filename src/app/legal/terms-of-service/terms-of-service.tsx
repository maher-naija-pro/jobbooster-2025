import { Site_name } from "@/texts-and-menues/site-name"
const Termm = () => {
  return (
    <section id="term" className="p-20 container sm:py-20 py-32">
      <div className=" container items-center justify-center">
        <div className="sm:container text-lg sm:text-xl  first-line:flex flex-col  flex-wrap gap-y-7 gap-4 sm:gap-8">
          <h1 className="text-4xl lg:text-6xl  font-bold text-center">
            Terms-of
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              -Service
            </span>
          </h1>
        </div>
      </div>
      <div className=" text-lg sm:text-xl  flex-col mt-14 flex-wrap  ">
        <section className="mb-10">
          <h2 className="text-xl mb-4 font-semibold">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the website {Site_name.siteUrl} ("Website"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, please do not use our Website.
          </p>
        </section >

        <section className="mb-10">
          <h2 className="text-xl mb-4 font-semibold">2. Privacy Policy</h2>
          <p>
            Our Privacy Policy, which outlines how we collect, use, and protect your personal information, is incorporated here by reference. Please read it carefully.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl mb-4 font-semibold">3. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. We will notify you of significant changes by posting a notice on our Website or by sending you an email. Your continued use of the Website after such changes have been notified will constitute your consent to such changes. It is your responsibility to review these Terms periodically for changes.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl mb-4 font-semibold">4. Account Registration and Use</h2>
          <p>
            You may need to register for an account to use certain features of our Website. By registering, you agree to provide accurate, current, and complete information about yourself as requested. You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl mb-4 font-semibold">5. Newsletter and Marketing Emails</h2>
          <p>
            By creating an account, you consent to be subscribed to our newsletter, and to receive marketing emails from us and our partners. You can unsubscribe at any time by following the unsubscribe link in any of these emails. We are not responsible for any issues that arise from you missing important communications because you unsubscribed from our emails.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl mb-4 font-semibold">6. User Conduct</h2>
          <p>
            You agree to use the Website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Website. Prohibited behaviors include, but are not limited to, harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within the Website.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl mb-4 font-semibold">7. Intellectual Property</h2>
          <p>
            The content on the Website is owned by us or our licensors and is protected by copyright and other intellectual property laws. You may not use the content except as permitted under these Terms. Unauthorized use of the content may violate copyright, trademark, and other laws. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Website without express written permission from us.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl mb-4 font-semibold">8. Third-Party Links</h2>
          <p>
            Our Website may contain links to third-party websites that are not operated by us. We are not responsible for the content, privacy, or practices of any third-party websites. Accessing these links is at your own risk. We recommend that you review the terms and conditions and privacy policies of any third-party websites you visit.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl mb-4 font-semibold">9. Dispute Resolution</h2>
          <p>
            Any disputes arising out of or related to these Terms will be governed by the laws of France, without regard to its conflict of law provisions. You agree to submit to the exclusive jurisdiction of the courts located in France to resolve any legal matter arising from these Terms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl mb-4 font-semibold">10. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at {Site_name.siteUrl}
          </p>
        </section>

      </div >
    </section >
  )
}

export default Termm
