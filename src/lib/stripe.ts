import Stripe from "stripe"

// Ensure Stripe secret key exists
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe secret key is missing. Please set STRIPE_SECRET_KEY in your environment variables.");
}
export const stripeapi = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2024-12-18.acacia"
})