import { Site_name } from "@/texts-and-menues/site-name"
const Policy = () => {
  return (
    <section id="polc" className="p-20 container sm:py-20 py-32">
      <div className=" container items-center justify-center">
        <div className="container  first-line:flex flex-col mb-16 flex-wrap gap-y-7 gap-4 sm:gap-8">
          <h1 className="text-4xl lg:text-6xl  font-bold text-center">
            Privacy
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              -Policy
            </span>
          </h1>
        </div>
      </div>

      <div className="sm:container justify-center  text-lg sm:text-xl first-line:flex flex-col mt-10 flex-wrap  gap-20 ">
        <p className="mb-10">
          At {Site_name.siteName}, accessible from {Site_name.siteUrl}, through our web application we prioritize the privacy of our users. This Privacy Policy outlines the types of information collected by {Site_name.siteUrl} and how we use it.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-5">Data Collection and AI Processing</h2>
          <p>
            {Site_name.siteName}'s web application collect email addresses and resume data from users. This data is processed using advanced AI algorithms to offer personalized services such as job recommendations and skill assessments.
          </p>
        </section>



        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">OpenAI API Usage</h2>
          <p>
            The {Site_name.siteName} web application send requests to the API to generate cover letters and other job-seeking-related content. The data sent to the API is used solely for generating the requested content and is not stored or used for any other purpose.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Log Files</h2>
          <p>
            {Site_name.siteName} follows a standard procedure of using log files. The information collected includes IP addresses, browser type, ISP, date and time stamps, and other non-identifiable data.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Cookies and Web Beacons</h2>
          <p>
            {Site_name.siteName} uses cookies to store information such as visitors' preferences and optimize user experience by customizing content based on browser type and other data.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Your Data Protection Rights Under GDPR</h2>
          <p>
            If you are a resident of the EEA, you have certain rights regarding your personal data. For details or to request data removal, please contact us at {Site_name.siteUrl}.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            For questions about this Privacy Policy, contact us at:
          </p>
          <address>
            {Site_name.siteName}<br />
            {Site_name.Addresse}<br />
            {Site_name.siteUrl}
          </address>
        </section>
      </div >
    </section >





  )
}

export default Policy
