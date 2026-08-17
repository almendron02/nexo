import Link from "next/link";
import { ArrowRight, Check, CodeXml, GitFork, Route } from "lucide-react";

const commitments = [
  "Complete 4-stage course",
  "88 structured lessons",
  "Listening and sentence audio",
  "Interactive grammar practice",
  "Concept-level progress evidence",
  "Stage checkpoints and review",
] as const;

export function OpenSourcePage() {
  const sourceRepositoryUrl = process.env.NEXT_PUBLIC_SOURCE_REPOSITORY_URL;

  return (
    <div className="page plans-page">
      <header className="plans-hero">
        <p className="eyebrow">Free forever · Open source</p>
        <h1>Spanish belongs to everyone.</h1>
        <p>Nexo is building one complete, structured grammar course that anyone can learn from, inspect, improve, translate, or adapt.</p>
      </header>

      <section className="plans-choice" aria-labelledby="open-source-choice-title">
        <div className="plans-choice__free">
          <p className="eyebrow">For learners</p>
          <h2 id="open-source-choice-title">The whole course. $0.</h2>
          <p>Start Here needs no account. A free account after that keeps your place, preserves first attempts, and carries mastery evidence and review history across the complete path.</p>
          <Link className="button button--dark" href="/start">Start learning <ArrowRight aria-hidden="true" /></Link>
        </div>
        <div className="plans-choice__course">
          <p className="eyebrow">For contributors</p>
          <h2>{sourceRepositoryUrl ? "Built in public." : "Ready to be public."}</h2>
          <p>The application code is licensed under MIT. Nexo&apos;s authored curriculum and grammar content are licensed under CC BY-SA 4.0, so improvements to the learning commons stay open.</p>
          {sourceRepositoryUrl ? (
            <a className="button button--ghost" href={sourceRepositoryUrl} rel="noreferrer" target="_blank">View the source <CodeXml aria-hidden="true" /></a>
          ) : (
            <span aria-disabled="true" className="button button--ghost">Source publication pending <CodeXml aria-hidden="true" /></span>
          )}
        </div>
      </section>

      <section className="plans-comparison" aria-labelledby="open-source-included-title">
        <div className="plans-comparison__heading">
          <p className="eyebrow">The learning contract</p>
          <h2 id="open-source-included-title">Free does not mean unfinished.</h2>
        </div>
        <div className="plans-table" role="table" aria-label="What Nexo includes">
          <div className="plans-table__head" role="row"><span role="columnheader">Spanish Foundations</span><strong role="columnheader">Included</strong><strong role="columnheader">Cost</strong></div>
          {commitments.map((label) => <div role="row" key={label}><span role="cell">{label}</span><span role="cell"><Check aria-label="Included" /></span><span role="cell">$0</span></div>)}
        </div>
      </section>

      <section className="plans-path" aria-labelledby="open-source-path-title">
        <p className="eyebrow">One source of truth</p>
        <h2 id="open-source-path-title">A course with a beginning, a path, and a finish.</h2>
        <div>
          {[
            ["01", "Authored in Git", "Typed lesson files keep grammar explanations reviewable and versioned."],
            ["02", "Free accounts", "Accounts exist to preserve learning state, never to decide who can afford access."],
            ["03", "Evidence by concept", "Attempts build a durable picture of what the learner can understand and produce."],
            ["04", "Open improvements", "Corrections and additions can strengthen the same shared grammar source."],
          ].map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
        <blockquote>The business model will never be a tollbooth in front of Spanish grammar.</blockquote>
      </section>

      <section className="plans-experience">
        <p className="eyebrow">What the account is for</p>
        <div>
          <article><span><Route aria-hidden="true" /></span><h3>Keep the course in motion</h3><p>Resume the exact lesson or checkpoint that logically comes next.</p></article>
          <article><span><Check aria-hidden="true" /></span><h3>Preserve evidence</h3><p>Keep first attempts, corrections, concept evidence, and completed lessons together.</p></article>
          <article><span><GitFork aria-hidden="true" /></span><h3>Learn across devices</h3><p>Use the same account wherever you continue the course.</p></article>
        </div>
      </section>

      <section className="plans-faq">
        <p className="eyebrow">The clear answers</p>
        <h2>Free, with structure.</h2>
        <details><summary>Is every lesson free?</summary><p>Yes. All four stages, sixteen modules, checkpoints, review, and future course improvements are free.</p></details>
        <details><summary>Why is an account required after Start Here?</summary><p>The later course depends on ordered progress, preserved attempts, concept evidence, and review history. The account keeps that learning record coherent and available across devices.</p></details>
        <details><summary>Can I use the grammar content elsewhere?</summary><p>Yes. The authored course content uses CC BY-SA 4.0, which permits sharing and adaptation with attribution under the same license.</p></details>
        <details><summary>Can I build with the code?</summary><p>Yes. The application code uses the permissive MIT License.</p></details>
      </section>

      <footer className="plans-final">
        <p className="eyebrow">Spanish Foundations</p>
        <h2>Start the complete path.</h2>
        <p>Free account · No subscription · No paywall</p>
        <Link className="button button--dark" href="/auth/sign-up?next=/dashboard">Create your account <ArrowRight aria-hidden="true" /></Link>
      </footer>
    </div>
  );
}
