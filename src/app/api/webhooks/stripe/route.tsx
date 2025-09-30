import { db } from "@/lib/db"
import { stripeapi } from "@/lib/stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { logger } from "@/lib/logger"

export async function POST(req: Request) {
  const startTime = Date.now();
  const requestId = `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  logger.info('Stripe webhook request started', {
    requestId,
    endpoint: '/api/webhooks/stripe',
    method: 'POST'
  });

  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripeapi.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    logger.info('Stripe webhook event constructed successfully', {
      requestId,
      eventType: event.type,
      eventId: event.id
    });
  } catch (error) {
    logger.error('Stripe webhook event construction failed', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return new NextResponse("Webhook error", { status: 400 })
  }
  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    logger.info('Processing checkout.session.completed event', {
      requestId,
      sessionId: session.id,
      subscriptionId: session.subscription
    });

    const subscription = await stripeapi.subscriptions.retrieve(session.subscription as string)

    if (!session?.metadata?.orgId) {
      logger.error('Missing orgId in session metadata', {
        requestId,
        sessionId: session.id,
        hasMetadata: !!session.metadata
      });
      return new NextResponse("Org ID is required", { status: 400 })
    }

    logger.debug('Creating organization subscription record', {
      requestId,
      orgId: session.metadata.orgId,
      subscriptionId: subscription.id,
      customerId: subscription.customer
    });

    // TODO: Implement orgSubscription model in Prisma schema
    // await db.orgSubscription.create({
    //   data: {
    //     orgId: session?.metadata?.orgId,
    //     stripeSubscriptionId: subscription.id,
    //     stripeCustomerId: subscription.customer as string,
    //     stripePriceId: subscription.items.data[0].price.id,
    //     stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
    //   }
    // });

    logger.info('Organization subscription created successfully', {
      requestId,
      orgId: session.metadata.orgId,
      subscriptionId: subscription.id
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    logger.info('Processing invoice.payment_succeeded event', {
      requestId,
      sessionId: session.id,
      subscriptionId: session.subscription
    });

    const subscription = await stripeapi.subscriptions.retrieve(session.subscription as string)

    // TODO: Implement orgSubscription model in Prisma schema
    // await db.orgSubscription.update({
    //   where: {
    //     stripeSubscriptionId: subscription.id
    //   },
    //   data: {
    //     stripePriceId: subscription.items.data[0].price.id,
    //     stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
    //   }
    // });

    logger.info('Organization subscription updated for payment success', {
      requestId,
      subscriptionId: subscription.id
    });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    logger.info('Payment intent succeeded', {
      requestId,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status
    });
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    logger.warn('Payment intent failed', {
      requestId,
      paymentIntentId: paymentIntent.id,
      errorMessage: paymentIntent.last_payment_error?.message
    });
  }

  if (event.type === "charge.succeeded") {
    const charge = event.data.object;
    logger.info('Charge succeeded', {
      requestId,
      chargeId: charge.id
    });
  }

  logger.info('Stripe webhook processing completed successfully', {
    requestId,
    eventType: event.type,
    processingTime: Date.now() - startTime
  });

  return new NextResponse(null, { status: 200 })
}
