import { currentUser } from "@/lib/auth/session_user"
import { NextResponse, NextRequest } from "next/server"

import { stripeapi } from "@/lib/stripe"


export async function GET(req: NextRequest) {



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

    if (customers.data.length === 0) {
      return NextResponse.json({
        error: "Subscription not found", errorCode: "SUBSCRIPTION_MATCH"
      }, { status: 404 });
    }
    const customerId = customers.data[0].id;

    // Search for the subscription by customer ID
    const subscriptions = await stripeapi.subscriptions.list({
      customer: customerId,
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({
        error: "Subscription not found", errorCode: "SUBSCRIPTION_MATCH"
      }, { status: 404 });

    }

    const subscription = subscriptions.data[0];

    console.info("Subscription get successfully:", subscription.id);

    return NextResponse.json({ subscription: subscription.status })
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

