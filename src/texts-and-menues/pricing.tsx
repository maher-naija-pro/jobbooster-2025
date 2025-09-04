import ListSocial from "./socials-link"

export enum PopularPlanType {
  NO = 0,
  YES = 1
}
export interface PricingProps {
  title: string
  href: string
  popular: PopularPlanType
  price: number
  target: string
  description: string
  buttonText: string
  benefitList: string[]
}

export const pricingList: PricingProps[] = [

  {
    title: "Pro",
    href: "/stripe-subscription",
    popular: 1,
    price: 9,
    target: "_self",
    description: "per/month",
    buttonText: "Start Pro",
    benefitList: ["Priority Support", "All Advanced Features", "Better text generation"]
  }
]
