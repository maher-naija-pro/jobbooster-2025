import LegalNotice from "@/app/legal/legal-notice/LegalNotice"
import type { Metadata } from "next"

import { Site_name } from "@/texts-and-menues/site-name";

// Metadata for SEO
export const metadata: Metadata = {
    title: Site_name.siteName + " | " + "Legal Notice",
    keywords: Site_name.keywords,
    description: "Legal notice and terms for " + Site_name.siteName + " - Company information, liability, intellectual property, and contact details.",
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
        description: "Legal notice and terms for " + Site_name.siteName + " - Company information, liability, intellectual property, and contact details.",
    }
}

export default function LegalNoticePage() {
    return (
        <>
            <LegalNotice />
        </>
    )
}
