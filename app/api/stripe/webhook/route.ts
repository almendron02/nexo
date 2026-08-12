import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { FOUNDATIONS_COURSE_ID } from "@/lib/course-access";
import { stripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = stripeClient();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseSecret = process.env.SUPABASE_SECRET_KEY;
  if (!stripe || !signature || !webhookSecret || !supabaseSecret) return NextResponse.json({ error: "Payment fulfillment is not configured." }, { status: 503 });

  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret); }
  catch { return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 }); }
  if (event.type !== "checkout.session.completed") return NextResponse.json({ received: true });

  const session = event.data.object;
  const userId = session.metadata?.user_id ?? session.client_reference_id;
  const courseId = session.metadata?.course_id;
  if (!userId || courseId !== FOUNDATIONS_COURSE_ID || session.payment_status !== "paid") return NextResponse.json({ error: "Incomplete course purchase metadata." }, { status: 400 });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabaseSecret, { auth: { persistSession: false, autoRefreshToken: false } });
  const now = new Date().toISOString();
  const purchase = await supabase.from("purchases").upsert({
    user_id: userId, provider: "stripe", provider_checkout_id: session.id,
    provider_payment_id: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
    course_id: courseId, amount_total: session.amount_total, currency: session.currency, status: "paid", updated_at: now,
  }, { onConflict: "provider_checkout_id" });
  if (purchase.error) return NextResponse.json({ error: "Purchase could not be recorded." }, { status: 500 });

  const entitlement = await supabase.from("course_entitlements").upsert({
    user_id: userId, course_id: courseId, access_type: "lifetime", status: "active", source: "stripe",
    source_reference: session.id, starts_at: now, expires_at: null, updated_at: now,
  }, { onConflict: "user_id,course_id" });
  if (entitlement.error) return NextResponse.json({ error: "Course access could not be granted." }, { status: 500 });
  return NextResponse.json({ received: true });
}
