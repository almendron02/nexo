"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { safeNextPath } from "@/lib/auth-navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = { error: string | null };

const initialError: AuthActionState = { error: null };

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLocaleLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function signInAction(_state: AuthActionState = initialError, formData: FormData): Promise<AuthActionState> {
  void _state;
  const { email, password } = readCredentials(formData);
  const next = safeNextPath(formData.get("next"));

  if (!validEmail(email) || !password) return { error: "Enter a valid email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: "That email and password do not match an account." };
  redirect(next);
}

export async function signUpAction(_state: AuthActionState = initialError, formData: FormData): Promise<AuthActionState> {
  void _state;
  const { email, password } = readCredentials(formData);
  const next = safeNextPath(formData.get("next"), "/module/1");

  if (!validEmail(email)) return { error: "Enter a valid email address." };
  if (password.length < 8) return { error: "Use at least 8 characters for your password." };

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", next);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: callbackUrl.toString() },
  });

  if (error) return { error: error.message };
  if (data.session) redirect(next);

  const cookieStore = await cookies();
  cookieStore.set("nexo-auth-next", next, {
    httpOnly: true,
    maxAge: 60 * 60,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  redirect("/auth/check-email");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
