import Stripe from "stripe"

// Create a mock Stripe instance for build time when secret key is not available
const createStripeInstance = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    // Return a mock Stripe instance for build time
    return {
      customers: {
        list: async () => ({ data: [] }),
      },
      subscriptions: {
        list: async () => ({ data: [] }),
      },
    } as any;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
    apiVersion: "2025-08-27.basil"
  });
};

export const stripeapi = createStripeInstance();