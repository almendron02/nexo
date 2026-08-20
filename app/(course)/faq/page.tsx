import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata(
  "Frequently Asked Questions",
  "Clear answers about Nexo’s free Spanish course, accounts, Latin American Spanish, learning data, audio, AI use, licensing, and support.",
  "/faq",
);

const faqs = [
  ["Is the complete course free?", "Yes. Start Here, all sixteen modules, checkpoints, Review, and future course improvements are free. Nexo has no subscription, purchase, or premium lesson tier."],
  ["Which Spanish does Nexo teach?", "Nexo teaches general Latin American Spanish for production. You learn tú, usted, and ustedes. Vosotros is introduced at recognition level so it will not be unfamiliar when you encounter it."],
  ["Is Nexo a video course?", "No. Nexo is written-first and interactive. Explanations, examples, sentence audio, guided practice, retrieval, writing, and review form one continuous lesson experience."],
  ["Why is an account required after Start Here?", "Start Here is open. A free account is required from Module 1 onward so Nexo can preserve lesson order, first attempts, concept evidence, and review history across devices."],
  ["What learner data is saved?", "For signed-in learners, Nexo saves an email address and account identifier, completed lessons, original answer text, correctness, attempt number, concept evidence, and the last visited lesson. A working copy is also stored in the browser. The Privacy Notice explains every category."],
  ["Does Nexo use Google Analytics or advertising trackers?", "No. Nexo does not currently install Google Analytics, ad pixels, or marketing cookies. Its hosting and account providers still process limited technical data needed to deliver, secure, and authenticate the service."],
  ["Does AI grade or train on my answers?", "No. Published feedback is authored and rule-based. Learner answers are not sent to an AI API, used to train a model, or used for a decision with legal or similarly significant effects."],
  ["Was any AI used to build Nexo?", "Software development and editorial work may use AI-assisted tools. Published lessons and product behavior remain subject to human review. That development process does not send learner account data or answers into an AI model."],
  ["How does Spanish audio work?", "Reviewed Nexo-owned recordings take priority. When a phrase has not been recorded, the browser can use a Spanish system voice installed on the learner’s device. Nexo does not send the phrase to an external speech API."],
  ["Can I reuse Nexo?", "The application code is licensed under MIT. Authored course content is licensed under CC BY-SA 4.0, which allows sharing and adaptation with attribution under the same license."],
  ["Is Nexo affiliated with Auburn University?", "No. Nexo was created independently by an Auburn student, but it is not an Auburn University program, is not endorsed by the university, and is not an accredited course."],
  ["How do I report an error or request help?", "Use the Contact page. Public curriculum and software issues can go to the source repository; account and privacy requests should be sent by email so personal information stays private."],
] as const;

export default function FaqPage() {
  return (
    <div className="info-page info-page--narrow">
      <header className="info-hero">
        <p className="eyebrow">Frequently asked questions</p>
        <h1>Clear answers before you begin.</h1>
        <p>How the course works, what an account saves, and the promises Nexo makes about access, AI, and learner data.</p>
      </header>
      <section className="info-faq" aria-label="Nexo questions and answers">
        {faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
      </section>
      <section className="info-callout info-callout--compact">
        <h2>Still have a question?</h2>
        <Link className="button button--dark" href="/contact">Contact Nexo <ArrowRight aria-hidden="true" /></Link>
      </section>
    </div>
  );
}
