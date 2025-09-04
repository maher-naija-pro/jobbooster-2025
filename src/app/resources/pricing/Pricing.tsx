"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const handleLogin = () => {
    setIsLoading(true)
    router.push("/stripe-subscription");
  };
  return (
    <section id="term" className="container pt-7 sm:pt-20 sm:py-32">
      <div className="container text-lg sm:text-xl  first-line:flex flex-col  flex-wrap ">
        <h2 className="text-3xl lg:text-6xl  font-bold text-center">
          Get
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            {" "}
            Unlimited{" "}
          </span>
          Access
        </h2>
        <h3 className=" text-xl  sm:text-2xl text-center text-muted-foreground pr-8 pl-8 pt-4 sm:pb-4  ">
          Choose the perfect plan to elevate your business with our flexible and affordable pricing
          options
        </h3>
      </div>


      <div className="sm:container text-lg sm:text-xl  first-line:flex flex-col sm:mt-10 flex-wrap gap-y-7 gap-4 sm:gap-8">

        <div className="items-center justify-center flex p-9   gap-10 ">
          {pricingList.map((pricing: PricingProps) => (

            <Card
              key={pricing.title}
              className={
                pricing.popular === PopularPlanType.YES
                  ? "drop-shadow-lg shadow-black/10 sm:-mt-10 h-200 scale-105 dark:shadow-white"
                  : "drop-shadow-md  shadow-black/10  dark:shadow-white"
              }
            >
              <CardHeader>
                <CardTitle className="flex item-center justify-between">
                  <div className=" mb-4">{pricing.title}</div>
                  {pricing.popular === PopularPlanType.YES ? (
                    <Badge
                      variant="secondary"
                      className="text-sm text-primary bg-cyan-300 dark:bg-cyan-400"
                    >
                      Most popular
                    </Badge>
                  ) : null}
                </CardTitle>
                <div className=" ">
                  <span className="text-3xl font-bold ">${pricing.price}</span>
                  <span className="text-muted-foreground"> </span>
                </div>

                <CardDescription>{pricing.description}</CardDescription>
              </CardHeader>

              <CardContent>

                <Button type="button"
                  onClick={handleLogin}
                  className={
                    pricing.popular === PopularPlanType.YES
                      ? " w-full   bg-red-700 border hover:border-slate-400 hover:bg-slate-800  rounded-full  py-4 px-10 dark:text-white"
                      : "w-full border hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900  dark:hover:text-slate-50 border-slate-700  text-base"
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
                <div className="space-y-4">
                  {pricing.benefitList.map((benefit: string) => (
                    <span key={benefit} className="flex">
                      <Check className="text-green-500" /> <h3 className="ml-2">{benefit}</h3>
                    </span>
                  ))}
                </div>
              </CardFooter>
            </Card>

          ))}
        </div>

      </div>
    </section >

  )
}

export default Pricing
