import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export const metadata: Metadata = { title: "Check your email" };

export default function CheckEmailPage() {
  return (
    <div className="auth-message-page">
      <Mail aria-hidden="true" />
      <p className="eyebrow">One quick step</p>
      <h1>Check your email.</h1>
      <p>Open the confirmation message from Nexo, then follow its link to finish creating your account.</p>
      <Link href="/auth/sign-in">Back to sign in <ArrowRight aria-hidden="true" /></Link>
    </div>
  );
}
