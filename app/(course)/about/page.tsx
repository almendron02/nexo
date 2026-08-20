import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, GitBranch, Route } from "lucide-react";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata(
  "About Nexo",
  "Meet the creator of Nexo and learn why this free, written-first Latin American Spanish course is structured as one complete path.",
  "/about",
);

export default function AboutPage() {
  return (
    <div className="info-page">
      <header className="info-hero">
        <p className="eyebrow">About Nexo</p>
        <h1>A clear path into Spanish.</h1>
        <p>Nexo is an independent, written-first Spanish course created by Angel Gonzalez after helping fellow Auburn students connect disconnected rules into a usable system.</p>
      </header>

      <section className="info-split" aria-labelledby="about-origin-title">
        <div>
          <p className="eyebrow">The origin</p>
          <h2 id="about-origin-title">Built from the explanations that finally worked.</h2>
        </div>
        <div className="info-prose">
          <p>Angel kept meeting people who wanted Spanish for study abroad, work, service, and relationships in their own communities. Their problem was rarely a lack of isolated vocabulary. It was the absence of a dependable order: what to understand first, what to notice next, and when support should disappear.</p>
          <p>Nexo turns those lessons into one authored curriculum with a beginning, sixteen modules, four checkpoints, and an integrated finish. It teaches general Latin American Spanish for production and presents regional variation honestly without asking a beginner to produce every variety at once.</p>
          <p className="info-note">Nexo is an independent project. It is not an Auburn University program, is not endorsed by the university, and does not claim academic accreditation or professional certification.</p>
        </div>
      </section>

      <section className="info-cards" aria-label="Nexo principles">
        <article><BookOpen aria-hidden="true" /><p className="eyebrow">Written first</p><h2>Read, notice, retrieve, produce.</h2><p>Important Spanish stays interactive and audible, while the lesson remains a continuous line of thought rather than a stack of videos.</p></article>
        <article><Route aria-hidden="true" /><p className="eyebrow">Complete path</p><h2>A visible finish.</h2><p>Every module prepares the next. Review appears when it is due, and the course ends in integrated comprehension and production.</p></article>
        <article><GitBranch aria-hidden="true" /><p className="eyebrow">Open source</p><h2>Claims you can inspect.</h2><p>The code and authored course source are versioned in public so explanations, corrections, and product behavior can be reviewed.</p></article>
      </section>

      <section className="info-callout">
        <p className="eyebrow">Spanish, understood.</p>
        <h2>Begin with the part that changes everything after it.</h2>
        <div><Link className="button button--dark" href="/start">Start learning <ArrowRight aria-hidden="true" /></Link><Link className="button button--ghost" href="/course">See the full course</Link></div>
      </section>
    </div>
  );
}
