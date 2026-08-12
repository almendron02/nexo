import type { Metadata } from "next";
import { PlansPage } from "@/components/PlansPage";
import { safeNextPath } from "@/lib/auth-navigation";
import { getLearnerSnapshot } from "@/lib/learner-data";

export const metadata: Metadata = { title: "Spanish Foundations — Nexo", description: "One complete Spanish course. One payment. Lifetime access." };

export default async function Plans({ searchParams }: { searchParams: Promise<{ checkout?: string | string[]; next?: string | string[] }> }) {
  const params = await searchParams;
  const next = safeNextPath(Array.isArray(params.next) ? params.next[0] : params.next, "/dashboard");
  const checkout = Array.isArray(params.checkout) ? params.checkout[0] : params.checkout;
  const message = checkout === "unavailable" ? "Secure checkout is not configured yet. Your course access has not changed." : checkout === "cancelled" ? "Checkout was cancelled. Nothing was charged." : undefined;
  const learner = await getLearnerSnapshot();
  return <PlansPage authenticated={Boolean(learner.user)} entitled={learner.entitled} message={message} next={next} />;
}
