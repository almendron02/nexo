import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { safeNextPath } from "@/lib/auth-navigation";

export const metadata: Metadata = { title: "Create account — Nexo" };

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const params = await searchParams;
  const next = safeNextPath(Array.isArray(params.next) ? params.next[0] : params.next, "/module/1");
  return <AuthForm mode="sign-up" next={next} />;
}
