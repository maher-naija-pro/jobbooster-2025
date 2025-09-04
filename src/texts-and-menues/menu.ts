
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

  Pricing: {
    menu: "false",
    href: "/resources/pricing",
    items: []
  },

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
      },
      {
        label: "Contact",
        href: "/company/contact"
      }
    ]
  }
}

export default routeList
