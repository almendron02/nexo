import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { safeNextPath } from "@/lib/auth-navigation";

export const metadata: Metadata = { title: "Sign in — Nexo" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string | string[]; next?: string | string[] }> }) {
  const params = await searchParams;
  const next = safeNextPath(Array.isArray(params.next) ? params.next[0] : params.next);
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const initialError = error === "confirmation" ? "That confirmation link could not be completed. Please try signing in or request a new email." : null;
  return <AuthForm initialError={initialError} mode="sign-in" next={next} />;
}
