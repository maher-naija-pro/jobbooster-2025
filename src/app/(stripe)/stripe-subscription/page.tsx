"use client"

import PaymentForm from "@/app/(stripe)/componant_stripe/PaymentForm"
import { CardWrapper } from "@/components/card-wrapper"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

import { FormError } from "@/components/form_message/form-error"
import { LoginButton } from "@/components/buttons/login-button"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
export default function Home() {
  const [clientSecret, setClientSecret] = React.useState("")
  const [loading, setLoading] = React.useState(true);
  const [error, seterror] = React.useState("");
  const [errorCode, setErrorCode] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (clientSecret) return;
    // Create PaymentIntent as soon as the page loads
    setLoading(true);
    seterror("");
    setErrorCode(null);

    fetch("/api/stripe/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { amount: 89 } })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          seterror(data.error)
          setErrorCode(data.errorCode);
          console.log("API Error:", data.error);
        } else {
          console.log("🚀 ~ React.useEffect ~ data.clientSecret:", data)
          return setClientSecret(data.clientSecret);
        }
      })
      .catch((err) => {
        seterror("An error occurred while processing your request.");
        console.error("Fetch error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [clientSecret]);



  const options = {
    clientSecret
  }

  return (
    <div className="App">

      {
        loading ? (
          <CardWrapper>
            <div className="w-full mx-auto p-10  space-y-4">
              {/* Header Section Skeleton */}
              <div className="w-full flex items-center space-x-2">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-4 w-48" />
              </div>

              {/* Card Information Section Skeleton */}
              <div className="space-y-4">
                {/* Card Number */}
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>

                {/* Expiry Date and CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>

                {/* Country Selector */}
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Footer Section Skeleton */}
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </CardWrapper>


        ) : errorCode === "AUTHENTICATION_ERROR" ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-red-500">{error}</p>
            < LoginButton />
          </div>
        ) : clientSecret ? (
          <CardWrapper>
            <div className="mt-5" >
              <FormError message={error} />
            </div>

            <Elements options={options} stripe={stripePromise}>
              <PaymentForm />
            </Elements>
            <div className=" -mt-7 text-center  font-light text-sm ">Powered by @Stripe for Secure Payments</div>
          </CardWrapper>
        ) : (<div className=" mx-auto p-6 border rounded-lg shadow space-y-4">
          {/* Header Section Skeleton */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Card Information Section Skeleton */}
          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Expiry Date and CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Country Selector */}
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Footer Section Skeleton */}
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
        )

      }
    </div >
  );


}
