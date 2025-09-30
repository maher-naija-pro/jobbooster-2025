import { currentUser } from "@/lib/auth/session_user"
import { NextResponse, NextRequest } from "next/server"
import { stripeapi } from "@/lib/stripe"
import { logger } from "@/lib/logger"


export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  logger.info('Stripe subscription retrieval request started', {
    requestId,
    endpoint: '/api/stripe/get-subscription-by-email',
    method: 'GET'
  });

  const user = await currentUser()

  logger.debug('User authentication check for subscription retrieval', {
    requestId,
    hasUser: !!user,
    userEmail: user?.email
  });

  try {
    // Ensure that the currentUser() provided a valid user object
    if (!user || !user.email) {
      logger.warn('Stripe subscription retrieval authentication failed', {
        requestId,
        hasUser: !!user,
        hasEmail: !!user?.email
      });
      return NextResponse.json({ error: "No user found. Please log in.", errorCode: "AUTHENTICATION_ERROR" }, { status: 400 });
    }
    logger.debug('User authenticated for subscription retrieval', {
      requestId,
      userId: user.id,
      userEmail: user.email
    });


    logger.debug('Searching for Stripe customer by email', {
      requestId,
      userEmail: user.email
    });

    const customers = await stripeapi.customers.list({
      limit: 1,
      email: user.email
    })
    if (!customers.data.length) {
      logger.warn('No matching Stripe customer found for email', {
        requestId,
        userEmail: user.email
      });
      return NextResponse.json({ error: "No matching customer found for email:", errorCode: "CLIENT_MATCH" }, { status: 404 });
    }

    const customer = customers.data[0];
    logger.info('Stripe customer found for subscription retrieval', {
      requestId,
      customerId: customer.id,
      userEmail: user.email
    });

    const customerId = customer.id;

    logger.debug('Searching for customer subscriptions', {
      requestId,
      customerId
    });

    // Search for the subscription by customer ID
    const subscriptions = await stripeapi.subscriptions.list({
      customer: customerId,
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      logger.warn('No subscriptions found for customer', {
        requestId,
        customerId,
        userEmail: user.email
      });
      return NextResponse.json({
        error: "Subscription not found", errorCode: "SUBSCRIPTION_MATCH"
      }, { status: 404 });
    }

    const subscription = subscriptions.data[0];

    logger.info('Stripe subscription retrieved successfully', {
      requestId,
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      customerId,
      userEmail: user.email,
      processingTime: Date.now() - startTime
    });

    return NextResponse.json({ subscription: subscription.status })
  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    logger.error('Stripe subscription retrieval failed', {
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

