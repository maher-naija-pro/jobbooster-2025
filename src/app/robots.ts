import type { MetadataRoute } from 'next'
import { Site_name } from "@/texts-and-menues/site-name"
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/',
        },
        sitemap: Site_name.domain + "sitemap.xml",
    }
}