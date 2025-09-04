import { currentUser } from "@/lib/auth/session_user"
import { NextResponse, NextRequest } from "next/server"

import { stripeapi } from "@/lib/stripe"


export async function POST(req: NextRequest) {
  const { data } = await req.json()
  console.debug("Request data:", data);

  const user = await currentUser()

  console.log("🚀 ~ POST ~ user:", user)

  try {
    // Ensure that the currentUser() provided a valid user object
    if (!user || !user.email) {
      console.warn("Authentication failed: No user found or email missing.");
      return NextResponse.json({ error: "No user found. Please log in.", errorCode: "AUTHENTICATION_ERROR" }, { status: 400 });
    }
    console.log("🚀 ~ POST ~ user ok")


    const customers = await stripeapi.customers.list({
      limit: 1, // @ts-ignore
      email: user.email
    })
    if (!customers.data.length) {

      console.warn("No matching customer found for email:", user.email);
      return NextResponse.json({ error: "No matching customer found for email:", errorCode: "CLIENT_MATCH" }, { status: 404 });

    }
    console.log("🚀 ~ POST ~ custommer", customers.data)
    ///////////////////////////////////////
    const customer = customers.data[0];
    console.info("Stripe customer found:", customer.id);


    const subscription = await stripeapi.subscriptions.create({
      customer: customer.id,
      metadata: {
        email: user.email,
      },

      items: [
        {
          price: "price_1QfMsIJYWHwewsKIQkxExqW5"
        }
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"]
    })

    console.info("Subscription created successfully:", subscription.id);
    // Retrieve the latest invoice to get the payment intent
    if (!subscription.latest_invoice) {
      console.error("Subscription creation failed: No invoice found.");
      return NextResponse.json({
        error: "Subscription creation failed: no invoice found.", errorCode: "SUBSCRIPTION_MATCH"
      }, { status: 404 });
    }
    ///////////////////////////////////////////////////////:
    // @ts-ignore
    const invoice = await stripeapi.invoices.retrieve(subscription.latest_invoice.id)
    console.info("Invoice retrieved successfully:", invoice.id);

    if (!invoice.payment_intent) {
      console.error("Invoice processing failed: No payment intent found.");
      return NextResponse.json({
        error: "Invoice has no payment intent.", errorCode: "INVOICE_INTENT"
      }, { status: 404 });

    }
    /////////////////////////////////////////////////////////
    // @ts-ignore
    const paymentIntent = await stripeapi.paymentIntents.retrieve(invoice.payment_intent)
    console.log("🚀 ~ POST ~ paymentIntent:", paymentIntent.client_secret)

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    console.error("🚀 ~ POST ~ error:", error);
    return new NextResponse(
      JSON.stringify({
        error: error.message || "An unexpected error occurred.",
      }),
      { status: 400 }
    );
  }
}

