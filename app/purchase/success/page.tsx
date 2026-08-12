import Link from "next/link";
import { Check, Clock3 } from "lucide-react";
import { safeNextPath } from "@/lib/auth-navigation";
import { FOUNDATIONS_COURSE_ID } from "@/lib/course-access";
import { stripeClient } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export default async function PurchaseSuccess({ searchParams }: { searchParams: Promise<{ next?: string | string[]; session_id?: string | string[] }> }) {
  const params = await searchParams;
  const next = safeNextPath(Array.isArray(params.next) ? params.next[0] : params.next, "/dashboard");
  const sessionId = Array.isArray(params.session_id) ? params.session_id[0] : params.session_id;
  const stripe = stripeClient();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let paid = false;
  if (stripe && sessionId && user) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid" && session.metadata?.user_id === user.id && session.metadata?.course_id === FOUNDATIONS_COURSE_ID;
    } catch { paid = false; }
  }

  return (
    <main className="purchase-success">
      <div>{paid ? <Check aria-hidden="true" /> : <Clock3 aria-hidden="true" />}</div>
      <p className="eyebrow">{paid ? "Welcome to Nexo" : "Payment processing"}</p>
      <h1>{paid ? "Spanish Foundations is yours." : "We are confirming your access."}</h1>
      <p>{paid ? "Your one-time payment is complete. Your entitlement is being recorded, and the complete course will remain available to this account." : "Payment can take a moment to reach your account. Refresh this page shortly; no second purchase is needed."}</p>
      <Link className="button button--dark" href={paid ? next : "/plans"}>{paid ? "Start the course" : "Return to plans"}</Link>
    </main>
  );
}
