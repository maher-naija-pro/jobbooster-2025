export interface SiteProps {
  siteName: string
  siteUrl: string
  ContactMail: string
  Addresse: string
  mailfrom: string
  domain: string
  supporMail: string
  platform_path: string
  stripe_suceess: string
  Title: string
  description: string
  cover_twitter: string
  cover_facebook: string
  company: string
  keywords: string
}

export const Site_name: SiteProps = {
  siteName: "TheJobBooster.com", // Variable for site name
  siteUrl: "thejobbooster.com", // Variable for site URL
  ContactMail: "contact@thejobbooster.com",
  Title: "Accelerate Job application process",
  description: "Accelerate Job application process",
  supporMail: "support@thejobbooster.com",
  Addresse: "13 avenue saint exupery chatillon 92320",
  mailfrom: "thejobbooster@thejobbooster.com",
  domain: "https://www.thejobbooster.com/",
  stripe_suceess: "https://www.thejobbooster.com/success",
  platform_path: "/",
  cover_twitter: "/cover.jpg",
  cover_facebook: "/cover.jpg",
  company: "inoxen",
  keywords: "Job, Application, Enhancer, Accelerator, Resume, Optimization, CoverLetter, Interviews, Career, Opportunities, Recruitment, Hiring, Networking, Skills, Jobs, Profiles, Candidates, Employers, Success, Employment"
}
