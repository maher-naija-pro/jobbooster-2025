
import { isPricingEnabled } from "@/lib/feature-flags"

const routeList = {
  Home: {
    menu: "false",
    href: "/",
    items: []
  },

  Support: {
    menu: "false",
    href: "/company/contact",
    items: []
  },

  ...(isPricingEnabled() && {
    Pricing: {
      menu: "false",
      href: "/resources/pricing",
      items: []
    }
  }),

  Legal: {
    menu: "true",
    href: "#",
    items: [
      {
        label: "Privacy Policy",
        href: "/legal/privacy-policy"
      },
      {
        label: "Terms of Service",
        href: "/legal/terms-of-service"
      }
    ]
  },

  Contact: {
    menu: "false",
    href: "/company/contact",
    items: []
  }
}

export default routeList
