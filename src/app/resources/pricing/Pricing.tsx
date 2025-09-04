"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { PopularPlanType } from "@/texts-and-menues/pricing"
import { PricingProps } from "@/texts-and-menues/pricing"
import { pricingList } from "@/texts-and-menues/pricing"
import { Check } from "lucide-react"


import type { Metadata } from "next"

import { Site_name } from "@/texts-and-menues/site-name";

//add this after <GoogleTagManager gtmId="GTM-XYZ" />
export const metadata: Metadata = {
  title: Site_name.siteName + " | " + "Pricing",
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

const Pricing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { session } = useAuth();
  const handleLogin = () => {
    setIsLoading(true)
    router.push("/stripe-subscription");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLogin();
    }
  };
  return (
    <main id="pricing" className="container pt-7 sm:pt-20 sm:py-32">
      <header className="container text-center mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
          Get
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            {" "}
            Unlimited{" "}
          </span>
          Access
        </h1>
        <h2 className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Choose the perfect plan to elevate your business with our flexible and affordable pricing
          options
        </h2>
      </header>

      <section aria-label="Pricing plans" className="container">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {pricingList.map((pricing: PricingProps) => (

            <Card
              key={pricing.title}
              role="article"
              aria-labelledby={`plan-${pricing.title.toLowerCase()}`}
              className={
                pricing.popular === PopularPlanType.YES
                  ? "drop-shadow-lg shadow-black/10 lg:-mt-10 w-full max-w-sm scale-105 dark:shadow-white border-2 border-primary/20"
                  : "drop-shadow-md shadow-black/10 w-full max-w-sm dark:shadow-white"
              }
            >
              <CardHeader>
                <CardTitle
                  id={`plan-${pricing.title.toLowerCase()}`}
                  className="flex items-center justify-between mb-4"
                >
                  <h3 className="text-2xl font-bold">{pricing.title}</h3>
                  {pricing.popular === PopularPlanType.YES ? (
                    <Badge
                      variant="secondary"
                      className="text-sm text-white bg-blue-600 dark:bg-blue-500"
                      aria-label="Most popular plan"
                    >
                      Most popular
                    </Badge>
                  ) : null}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${pricing.price}</span>
                  <span className="text-muted-foreground ml-2">{pricing.description}</span>
                </div>
              </CardHeader>

              <CardContent>

                <Button
                  type="button"
                  onClick={handleLogin}
                  onKeyDown={handleKeyDown}
                  aria-label={`${pricing.buttonText} - ${pricing.title} plan for $${pricing.price} per month`}
                  className={
                    pricing.popular === PopularPlanType.YES
                      ? "w-full bg-red-600 hover:bg-red-700 text-white border-0 rounded-lg py-4 px-10 font-semibold transition-colors duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      : "w-full border-2 border-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-50 text-slate-900 dark:text-slate-100 rounded-lg py-4 px-10 font-semibold transition-colors duration-200 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  }
                >

                  {isLoading ? (
                    <span className="hover:bg-blue-100 flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </span>
                  ) : (
                    <span>                  <a target={pricing.target} href={pricing.href}>
                      {" "}
                      {pricing.buttonText}{" "}
                    </a>
                    </span>
                  )}
                </Button>
              </CardContent>

              <hr className="w-4/5 m-auto mb-4" />

              <CardFooter className="flex">
                <ul className="space-y-4" role="list" aria-label={`${pricing.title} plan features`}>
                  {pricing.benefitList.map((benefit: string) => (
                    <li key={benefit} className="flex items-start">
                      <Check className="text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="ml-2 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardFooter>
            </Card>

          ))}
        </div>

      </section>
    </main>

  )
}

export default Pricing
