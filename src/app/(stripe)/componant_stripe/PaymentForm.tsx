"use client"

import { Button } from "@/components/ui/button"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import React from "react"
import { Site_name } from "@/texts-and-menues/site-name"
export default function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [message, setMessage] = React.useState("")

  const [isLoading, setIsLoading] = React.useState(false)
  React.useEffect(() => {

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    )

    if (!clientSecret) {
      return
    }
    // @ts-expect-error Stripe retrievePaymentIntent typing mismatch in SSR context
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      // @ts-expect-error paymentIntent union lacks narrowed status at this point
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!")
          break
        case "processing":
          setMessage("Your payment is processing.")
          break
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.")
          break
        default:
          setMessage("Something went wrong.")
          break
      }
    })
  }, [stripe])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsLoading(true)
    const stripe_suceess = Site_name.stripe_suceess
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: stripe_suceess
      }
    })

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message as string)
    } else {
      setMessage("An unexpected error occurred.")
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={onSubmit}>
      <PaymentElement id="payment-element" />
      <Button disabled={isLoading} className="w-full my-10" type="submit">
        <span id="button-text">
          {isLoading ? (
            <div className="spinner" id="spinner">
              loading...
            </div>
          ) : (
            "Pay Now"
          )}
        </span>
      </Button>
    </form>
  )
}
