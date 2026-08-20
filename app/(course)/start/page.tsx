import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CircleUserRound, Route } from "lucide-react";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata(
  "Start Learning Spanish for Free",
  "Begin Nexo with five free lessons on Spanish sounds, stress, spelling, and your first conversation. No account is required for Start Here.",
  "/start",
);

export default function StartFreePage() {
  return (
    <main className="start-free-page">
      <p className="eyebrow">Start Here · Open introduction</p>
      <h1>Begin the complete path.</h1>
      <p className="start-free-page__lede">Start Here is a five-lesson introduction to Spanish sounds, stress, spelling, and your first conversation. No account is required until you are ready to preserve your progress and enter Module 1.</p>
      <div className="start-free-steps">
        <article><BookOpen aria-hidden="true" /><span>01</span><h2>Start openly</h2><p>Complete all five lessons in Start Here and experience how Nexo teaches.</p></article>
        <article><CircleUserRound aria-hidden="true" /><span>02</span><h2>Keep your place</h2><p>Create a free account after the introduction so your learning follows you.</p></article>
        <article><Route aria-hidden="true" /><span>03</span><h2>Follow the course</h2><p>Continue through all four stages, sixteen modules, and the final checkpoint for free.</p></article>
      </div>
      <div className="start-free-page__actions"><Link className="button button--dark button--large" href="/lesson/0.1">Begin Lesson 0.1 <ArrowRight aria-hidden="true" /></Link><Link className="button button--ghost" href="/module/0">See the free module</Link></div>
      <p className="start-free-page__note">There is no trial countdown, subscription, or paid tier. The account exists only to preserve the learning path.</p>
    </main>
  );
}
