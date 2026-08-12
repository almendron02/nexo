# Payments and access

Nexo sells one product: lifetime access to `spanish-foundations`. Lesson code never asks Stripe for access; it reads an active row from `course_entitlements`.

## Launch configuration

Set these server-only variables in Netlify:

- `SUPABASE_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Keep the existing public Supabase URL and publishable key. Register the production webhook URL as `/api/stripe/webhook` and subscribe it to `checkout.session.completed`.

Checkout uses Stripe-hosted Checkout in one-time `payment` mode. The founding price is defined in `lib/stripe.ts`; when the founding offer ends, change the displayed and charged amount together.

## Access sequence

1. Module 0 and the Library are free.
2. Modules 1-16 require an account.
3. An account requires an active Spanish Foundations entitlement.
4. Lessons unlock in order.
5. New stages require the previous checkpoint.

The webhook writes both an immutable purchase record and the active lifetime entitlement. Never grant access only from the success-page redirect.
