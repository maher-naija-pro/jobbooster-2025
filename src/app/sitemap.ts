import { Site_name } from "@/texts-and-menues/site-name"

export default async function sitemap() {
  return [
    {
      url: Site_name.domain,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      images: [Site_name.domain + "cover.jpg"],
    },
    {
      url: Site_name.domain + "company/contact",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      images: [Site_name.domain + "cover.jpg"],
    },
    {
      url: Site_name.domain + "legal/privacy-policy",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      images: [Site_name.domain + "cover.jpg"],
    },
    {
      url: Site_name.domain + "legal/terms-of-service",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      images: [Site_name.domain + "cover.jpg"],
    }
  ]
}
