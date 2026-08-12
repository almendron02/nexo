"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { safeNextPath } from "@/lib/auth-navigation";
import { FOUNDATIONS_COURSE_ID } from "@/lib/course-access";
import { FOUNDING_PRICE_CENTS, stripeClient } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function startCheckoutAction(formData: FormData) {
  const next = safeNextPath(formData.get("next"), "/dashboard");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/auth/sign-up?next=${encodeURIComponent(`/plans?next=${next}`)}`);

  const stripe = stripeClient();
  if (!stripe) redirect(`/plans?next=${encodeURIComponent(next)}&checkout=unavailable`);
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    client_reference_id: user.id,
    metadata: { course_id: FOUNDATIONS_COURSE_ID, user_id: user.id },
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: FOUNDING_PRICE_CENTS,
        product_data: { name: "Nexo Spanish Foundations", description: "Lifetime access to the complete four-stage course." },
      },
    }],
    success_url: `${origin}/purchase/success?session_id={CHECKOUT_SESSION_ID}&next=${encodeURIComponent(next)}`,
    cancel_url: `${origin}/plans?next=${encodeURIComponent(next)}&checkout=cancelled`,
  });
  if (!session.url) redirect(`/plans?next=${encodeURIComponent(next)}&checkout=unavailable`);
  redirect(session.url);
}
