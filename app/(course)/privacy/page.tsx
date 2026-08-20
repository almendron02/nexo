import type { Metadata } from "next";
import Link from "next/link";
import { contactEmail } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata(
  "Privacy Notice",
  "Nexo’s plain-language privacy notice: what learner data is collected, why it is needed, which providers process it, how AI is not used on it, and how to exercise your rights.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <article className="legal-page">
      <header className="legal-header">
        <p className="eyebrow">Privacy Notice</p>
        <h1>Your learning is not the product.</h1>
        <p>Effective August 19, 2026 · This notice describes the current Nexo website and Spanish Foundations course.</p>
      </header>

      <div className="legal-summary" aria-label="Privacy summary">
        <p><strong>No advertising.</strong> Nexo does not sell learner data or use it for targeted advertising.</p>
        <p><strong>No analytics tracker.</strong> Nexo does not currently install Google Analytics, ad pixels, or marketing cookies.</p>
        <p><strong>No learner-data AI.</strong> Account data and answers are not sent to an AI service or used to train a model.</p>
      </div>

      <div className="legal-body">
        <section><h2>1. Who is responsible</h2><p>Nexo is an independent open-source project created and operated by Angel Gonzalez in Auburn, Alabama, United States. For privacy questions or rights requests, email <a href={`mailto:${contactEmail}?subject=Nexo%20privacy%20request`}>{contactEmail}</a> or use the <Link href="/contact">Contact page</Link>.</p></section>
        <section><h2>2. What Nexo processes</h2>
          <h3>When you visit public pages</h3><p>Nexo itself does not run a visitor analytics script. The hosting provider, Netlify, necessarily receives limited request and device information to deliver and secure the site, which can include an IP address, browser or user-agent information, requested URL, referrer, and request time.</p>
          <h3>When you create or use an account</h3><p>Supabase processes your email address, account identifier, password credential, confirmation status, authentication events, and session data. Nexo never receives your plaintext password. Essential authentication cookies keep you signed in, and a short-lived cookie remembers the safe page to open after email confirmation.</p>
          <h3>When you learn</h3><p>Nexo saves completed lesson identifiers, the last visited lesson, original answer text, whether an answer was correct, interaction type, attempt number and time, related concept identifiers, and whether concept evidence was independent. A working copy is stored in your browser; signed-in progress is also stored in Supabase so it can follow your account across devices.</p>
          <h3>When you choose audio settings</h3><p>Your selected voice preference stays in the browser on that device. Reviewed Nexo recordings play when available; otherwise the browser may use an installed system voice. Nexo does not send lesson phrases to an external speech or AI API.</p>
          <h3>When you contact Nexo</h3><p>If you send email, the address, message, attachments, and delivery metadata are processed by the sender’s and recipient’s email providers. Nexo intentionally does not add a separate website contact-form database.</p>
        </section>
        <section><h2>3. Why the data is used</h2><ul><li>Provide and secure the free account and course.</li><li>Preserve the ordered path, original attempts, corrections, progress, and review evidence.</li><li>Respond to support, privacy, accessibility, and security messages.</li><li>Diagnose abuse, failures, and security incidents when necessary.</li><li>Meet applicable legal obligations and protect users or the service.</li></ul><p>Where a legal basis is required, account and learner-data processing is necessary to provide the service you request; security and limited operational logging rely on legitimate interests in delivering a safe service; and legal requests are handled to meet applicable obligations. Nexo does not rely on consent for essential authentication cookies.</p></section>
        <section><h2>4. Providers and disclosure</h2><p>Nexo uses Netlify for hosting and delivery and Supabase for authentication, session handling, and account-linked learner data. Those providers may use subprocessors and may process data in the United States or other countries under their applicable agreements and safeguards. Nexo may disclose information when reasonably required by law, to protect rights or safety, or during a service transfer subject to this notice. Nexo does not sell or rent personal data and does not share it for cross-context behavioral advertising.</p></section>
        <section><h2>5. AI transparency</h2><p>Nexo’s live course does not use an AI API to grade, personalize, profile, or respond to learners. Learner answers and account records are not used to train an AI model. Development and editorial work may use software tools, including AI-assisted tools, but published lessons and product behavior remain subject to human review and that workflow does not include learner account data or answers.</p></section>
        <section><h2>6. Retention and deletion</h2><p>Browser data remains until you erase it in Settings, clear browser storage, or remove site data. Signed-in course records and the account remain while the account is active. Settings lets a signed-in learner erase saved course records; account deletion can be requested by email. Providers may retain security logs, backups, or deletion records for limited periods under their own schedules or legal obligations. Support email is kept only as long as reasonably needed to resolve the request, maintain necessary records, or meet legal obligations.</p></section>
        <section><h2>7. Your choices and rights</h2><p>Depending on where you live, you may have rights to know, access, correct, export, delete, restrict, or object to processing of personal data and to complain to a regulator. Nexo does not discriminate against anyone for making a privacy request. Use Settings for course-data controls or email <a href={`mailto:${contactEmail}?subject=Nexo%20privacy%20request`}>{contactEmail}</a>. Nexo may need to verify that a requester controls the account before releasing or deleting data.</p></section>
        <section><h2>8. Children</h2><p>Nexo is a general-audience course and is not directed to children under 13. Do not create an account or submit personal information if you are under 13. A parent or guardian who believes a child submitted information should contact Nexo so it can be investigated and deleted. Local law may require a higher age for a child to consent to online data processing.</p></section>
        <section><h2>9. Security</h2><p>Nexo uses HTTPS, server-managed authentication, essential secure-cookie settings in production, and row-level database policies intended to keep each learner’s records separate. No online service can promise perfect security. Report a suspected vulnerability privately through the <Link href="/contact">Contact page</Link>.</p></section>
        <section><h2>10. Changes</h2><p>Material changes will be dated on this page. If a change would use existing learner data for a materially new purpose, Nexo will provide an appropriate notice and seek consent where required rather than silently broadening the promise.</p></section>
      </div>
      <p className="legal-disclaimer">This notice is a transparent description of the product, not a substitute for advice from a qualified privacy lawyer about every jurisdiction in which Nexo may be used.</p>
    </article>
  );
}
