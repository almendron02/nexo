import Stripe from "stripe";

export const FOUNDING_PRICE_CENTS = 9900;
export const FOUNDING_PRICE_LABEL = "$99";
export const STANDARD_PRICE_LABEL = "$149";

export function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}
