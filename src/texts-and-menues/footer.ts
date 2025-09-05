import { isPricingEnabled } from "@/lib/feature-flags"

const templates = {
  Company: {
    items: [
      { name: "Support", href: "/company/contact" },
    ]
  },

  ...(isPricingEnabled() && {
    Resources: {
      items: [
        { name: "Pricing", href: "/resources/pricing" }
      ]
    }
  }),

  Legal: {
    items: [
      { name: "Privacy Policy", href: "/legal/privacy-policy" },
      { name: "Terms of Service", href: "/legal/terms-of-service" }
    ]
  }
}

export default templates
