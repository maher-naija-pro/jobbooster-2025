import { currentUser } from "@/lib/auth/session_user"
import { NextResponse, NextRequest } from "next/server"
import { stripeapi } from "@/lib/stripe"
import { logger } from "@/lib/logger"


export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  logger.info('Stripe subscription creation request started', {
    requestId,
    endpoint: '/api/stripe/subscription',
    method: 'POST'
  });

  const { data } = await req.json()
  logger.debug('Stripe subscription request data received', {
    requestId,
    hasData: !!data
  });

  const user = await currentUser()

  logger.debug('User authentication check', {
    requestId,
    hasUser: !!user,
    userEmail: user?.email
  });

  try {
    // Ensure that the currentUser() provided a valid user object
    if (!user || !user.email) {
      logger.warn('Stripe subscription authentication failed', {
        requestId,
        hasUser: !!user,
        hasEmail: !!user?.email
      });
      return NextResponse.json({ error: "No user found. Please log in.", errorCode: "AUTHENTICATION_ERROR" }, { status: 400 });
    }
    logger.debug('User authenticated for Stripe subscription', {
      requestId,
      userId: user.id,
      userEmail: user.email
    });


    logger.debug('Searching for Stripe customer', {
      requestId,
      userEmail: user.email
    });

    const customers = await stripeapi.customers.list({
      limit: 1, // @ts-ignore
      email: user.email
    })
    if (!customers.data.length) {
      logger.warn('No matching Stripe customer found', {
        requestId,
        userEmail: user.email
      });
      return NextResponse.json({ error: "No matching customer found for email:", errorCode: "CLIENT_MATCH" }, { status: 404 });
    }

    const customer = customers.data[0];
    logger.info('Stripe customer found', {
      requestId,
      customerId: customer.id,
      userEmail: user.email
    });


    logger.debug('Creating Stripe subscription', {
      requestId,
      customerId: customer.id,
      userEmail: user.email
    });

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

    logger.info('Stripe subscription created successfully', {
      requestId,
      subscriptionId: subscription.id,
      customerId: customer.id
    });

    // Retrieve the latest invoice to get the payment intent
    if (!subscription.latest_invoice) {
      logger.error('Subscription creation failed - no invoice found', {
        requestId,
        subscriptionId: subscription.id
      });
      return NextResponse.json({
        error: "Subscription creation failed: no invoice found.", errorCode: "SUBSCRIPTION_MATCH"
      }, { status: 404 });
    }

    // @ts-ignore
    const invoice = await stripeapi.invoices.retrieve(subscription.latest_invoice.id)
    logger.info('Stripe invoice retrieved successfully', {
      requestId,
      invoiceId: invoice.id,
      subscriptionId: subscription.id
    });

    if (!invoice.payment_intent) {
      logger.error('Invoice processing failed - no payment intent found', {
        requestId,
        invoiceId: invoice.id,
        subscriptionId: subscription.id
      });
      return NextResponse.json({
        error: "Invoice has no payment intent.", errorCode: "INVOICE_INTENT"
      }, { status: 404 });
    }

    // @ts-ignore
    const paymentIntent = await stripeapi.paymentIntents.retrieve(invoice.payment_intent)

    logger.info('Stripe subscription creation completed successfully', {
      requestId,
      subscriptionId: subscription.id,
      invoiceId: invoice.id,
      paymentIntentId: paymentIntent.id,
      processingTime: Date.now() - startTime
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    logger.error('Stripe subscription creation failed', {
      requestId,
      error: error.message || 'Unknown error',
      stack: error.stack,
      processingTime
    });
    return new NextResponse(
      JSON.stringify({
        error: error.message || "An unexpected error occurred.",
      }),
      { status: 400 }
    );
  }
}

