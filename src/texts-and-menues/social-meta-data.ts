import type { Metadata } from "next"
import { Site_name } from "@/texts-and-menues/site-name"
interface platformnameProps {
  title: string
}

//add this after <GoogleTagManager gtmId="GTM-XYZ" />
export const socialmetadata: Metadata = {
  title: Site_name.siteName + " | " + Site_name.Title,
  keywords: Site_name.keywords,
  description: Site_name.description,
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
