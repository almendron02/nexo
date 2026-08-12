import Link from "next/link";
import { ArrowRight, BookOpen, CircleUserRound, CreditCard } from "lucide-react";

export default function StartFreePage() {
  return (
    <main className="start-free-page">
      <p className="eyebrow">Start Here · Free introduction</p>
      <h1>Take your first module before deciding.</h1>
      <p className="start-free-page__lede">Start Here is a complete five-lesson introduction to Spanish sounds, stress, spelling, and your first conversation. No account and no payment are required.</p>
      <div className="start-free-steps">
        <article><BookOpen aria-hidden="true" /><span>01</span><h2>Learn free</h2><p>Complete all five lessons in Start Here and hear how Nexo teaches.</p></article>
        <article><CircleUserRound aria-hidden="true" /><span>02</span><h2>Keep your place</h2><p>Create a free account after the introduction so your learning follows you.</p></article>
        <article><CreditCard aria-hidden="true" /><span>03</span><h2>Choose the course</h2><p>If the method fits, one payment opens all four stages with lifetime access.</p></article>
      </div>
      <div className="start-free-page__actions"><Link className="button button--dark button--large" href="/lesson/0.1">Begin Lesson 0.1 <ArrowRight aria-hidden="true" /></Link><Link className="button button--ghost" href="/module/0">See the free module</Link></div>
      <p className="start-free-page__note">There is no trial countdown and no subscription. You choose whether to continue only after experiencing the course.</p>
    </main>
  );
}
