import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { startCheckoutAction } from "@/app/plans/actions";
import { FOUNDING_PRICE_LABEL, STANDARD_PRICE_LABEL } from "@/lib/stripe";

const comparison = [
  ["Interactive lesson preview", true, true], ["Complete 4-stage course", false, true], ["88 structured lessons", false, true],
  ["Listening and audio", "Preview", true], ["Writing and speaking practice", "Preview", true], ["Personalized Review", false, true],
  ["Stage checkpoints", false, true], ["Progress tracking", false, true], ["Course improvements", false, true], ["Subscription", "None", "None"],
] as const;

export function PlansPage({ authenticated, entitled, message, next }: { authenticated: boolean; entitled: boolean; message?: string; next: string }) {
  return (
    <div className="page plans-page">
      <header className="plans-hero">
        <p className="eyebrow">One course · One payment</p>
        <h1>Learn Spanish without another subscription.</h1>
        <p>Get the complete Nexo Spanish Foundations course with lifetime access and one visible finish line.</p>
      </header>
      {message ? <p className="plans-message" role="status">{message}</p> : null}

      <section className="plans-choice" aria-labelledby="plans-choice-title">
        <div className="plans-choice__free">
          <p className="eyebrow">Explore Nexo</p><h2 id="plans-choice-title">Free</h2>
          <p>Take Start Here and use the open Library whenever you need a clear answer.</p>
          <Link className="button button--ghost" href="/module/0">Start the free introduction</Link>
        </div>
        <div className="plans-choice__course">
          <p className="eyebrow">Founding Student Access</p><h2>Spanish Foundations</h2>
          <div className="plans-price"><del>{STANDARD_PRICE_LABEL}</del><strong>{FOUNDING_PRICE_LABEL}</strong><span>one time</span></div>
          <p>Get the complete course and future improvements to Spanish Foundations at the founding price.</p>
          {entitled ? <Link className="button button--dark" href={next}>Continue your course <ArrowRight aria-hidden="true" /></Link> : (
            <form action={startCheckoutAction}><input name="next" type="hidden" value={next} /><button className="button button--dark" type="submit">{authenticated ? "Get the complete course" : "Create account to continue"} <ArrowRight aria-hidden="true" /></button></form>
          )}
          <strong className="plans-no-recurring">No monthly fee. No recurring charge.</strong>
        </div>
      </section>

      <section className="plans-comparison" aria-labelledby="plans-compare-title">
        <div className="plans-comparison__heading"><p className="eyebrow">A simple choice</p><h2 id="plans-compare-title">Everything you need to finish.</h2></div>
        <div className="plans-table" role="table" aria-label="Compare free exploration and Spanish Foundations">
          <div className="plans-table__head" role="row"><span role="columnheader">Learning experience</span><strong role="columnheader">Explore</strong><strong role="columnheader">Complete course</strong></div>
          {comparison.map(([label, free, complete]) => <div role="row" key={label}><span role="cell">{label}</span><span role="cell">{free === true ? <Check aria-label="Included" /> : free === false ? <Minus aria-label="Not included" /> : free}</span><span role="cell">{complete === true ? <Check aria-label="Included" /> : complete}</span></div>)}
        </div>
      </section>

      <section className="plans-path" aria-labelledby="plans-path-title"><p className="eyebrow">What you are buying</p><h2 id="plans-path-title">4 stages. 16 modules. One complete path.</h2><div>{[["I", "Build Spanish", "Understand how Spanish sentences work."], ["II", "Use Spanish", "Talk about everyday life, needs, abilities, and plans."], ["III", "Connect Spanish", "Handle pronouns, relationships, and more complex ideas."], ["IV", "Tell Stories", "Talk about what happened and describe the past."]].map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div><blockquote>You are not buying access to an endless lesson library. You are buying a course designed to be completed.</blockquote></section>

      <section className="plans-experience"><p className="eyebrow">Inside every stage</p><div>{[["Understand it", "Clear explanations of why Spanish works the way it does."], ["Hear it", "Natural Spanish audio throughout the course."], ["Use it", "Interactive exercises, writing, and speaking."], ["Remember it", "Review built around what you need to revisit."], ["Prove it", "Stage checkpoints and a final assessment."], ["Finish it", "A visible path from the first lesson to the end."]].map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

      <section className="plans-faq"><p className="eyebrow">The clear answers</p><h2>Before you begin.</h2>{[["Is this a subscription?", "No. Spanish Foundations is a one-time purchase."], ["How long do I have access?", "Lifetime access to the Spanish Foundations course you purchased."], ["Do I need to know Spanish already?", "No. The course begins from the foundations."], ["Can I try Nexo first?", "Yes. The complete Start Here introduction and Library are free."], ["Does the course have an end?", "Yes. Four stages, sixteen modules, stage checkpoints, and a final assessment."], ["Will I get future improvements?", "Yes. Existing owners receive improvements to Spanish Foundations."]].map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>

      <footer className="plans-final"><p className="eyebrow">Spanish Foundations</p><h2>Start the complete path.</h2><p>{FOUNDING_PRICE_LABEL} · One time · Lifetime access</p>{entitled ? <Link className="button button--dark" href={next}>Continue your course <ArrowRight aria-hidden="true" /></Link> : <form action={startCheckoutAction}><input name="next" type="hidden" value={next} /><button className="button button--dark" type="submit">Start Spanish Foundations <ArrowRight aria-hidden="true" /></button></form>}</footer>
    </div>
  );
}
