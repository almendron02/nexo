"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";
import { signInAction, signUpAction, type AuthActionState } from "@/app/(course)/auth/actions";

const initialState: AuthActionState = { error: null };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="auth-submit" disabled={pending} type="submit">
      {pending ? "One moment…" : label}
      {!pending ? <ArrowRight aria-hidden="true" /> : null}
    </button>
  );
}

export function AuthForm({ mode, next, initialError = null }: { mode: "sign-in" | "sign-up"; next: string; initialError?: string | null }) {
  const isSignIn = mode === "sign-in";
  const [state, formAction] = useActionState(isSignIn ? signInAction : signUpAction, initialError ? { error: initialError } : initialState);
  const alternatePath = `${isSignIn ? "/auth/sign-up" : "/auth/sign-in"}?next=${encodeURIComponent(next)}`;

  return (
    <div className="auth-page">
      <section className="auth-intro" aria-labelledby="auth-title">
        <p className="eyebrow">{isSignIn ? "Welcome back" : "Continue after Module 0"}</p>
        <h1 id="auth-title">{isSignIn ? "Pick up where you left off." : "Keep your place in Nexo."}</h1>
        <p>
          {isSignIn
            ? "Sign in to open your dashboard, lessons, checkpoints, and review practice."
            : "Module 0 is open without an account. Create yours to keep your place and continue through the complete course for free."}
        </p>
        <div className="auth-boundary" aria-label="What an account unlocks">
          <span>Included with your account</span>
          <p>All 16 modules · Your progress · Review history · Your learning dashboard</p>
        </div>
      </section>

      <section className="auth-form-section" aria-label={isSignIn ? "Sign in" : "Create account"}>
        <div className="auth-form-heading">
          <p>{isSignIn ? "Sign in" : "Create an account"}</p>
          <span>{isSignIn ? "New to Nexo?" : "Already have an account?"} <Link href={alternatePath}>{isSignIn ? "Create one" : "Sign in"}</Link></span>
        </div>
        <form action={formAction} className="auth-form">
          <input name="next" type="hidden" value={next} />
          <label>
            <span>Email</span>
            <input autoComplete="email" inputMode="email" name="email" placeholder="you@example.com" required type="email" />
          </label>
          <label>
            <span>Password</span>
            <input autoComplete={isSignIn ? "current-password" : "new-password"} minLength={isSignIn ? undefined : 12} name="password" placeholder={isSignIn ? "Your password" : "At least 12 characters"} required type="password" />
          </label>
          {!isSignIn ? (
            <label className="auth-consent">
              <input name="terms" required type="checkbox" value="accepted" />
              <span>I agree to the <Link href="/terms" target="_blank">Terms of Use</Link> and acknowledge the <Link href="/privacy" target="_blank">Privacy Notice</Link>.</span>
            </label>
          ) : null}
          {state.error ? <p className="auth-error" role="alert">{state.error}</p> : null}
          <SubmitButton label={isSignIn ? "Sign in" : "Create account"} />
        </form>
        <p className="auth-form-note">Creating an account is free. There is no subscription, purchase, paid course tier, advertising tracker, or AI grading of your answers.</p>
      </section>
    </div>
  );
}
