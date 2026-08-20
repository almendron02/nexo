import type { Metadata } from "next";
import Link from "next/link";
import { contactEmail } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata(
  "Terms of Use",
  "Terms for using Nexo’s free Spanish course, including account responsibilities, open-source licenses, educational limitations, AI transparency, and acceptable use.",
  "/terms",
);

export default function TermsPage() {
  return (
    <article className="legal-page">
      <header className="legal-header">
        <p className="eyebrow">Terms of Use</p>
        <h1>Free access, clear responsibilities.</h1>
        <p>Effective August 19, 2026 · These terms apply to the Nexo website, accounts, and Spanish Foundations course.</p>
      </header>
      <div className="legal-body">
        <section><h2>1. Agreement</h2><p>By using Nexo, you agree to these Terms and the <Link href="/privacy">Privacy Notice</Link>. If you do not agree, do not create an account or use account-only features. The public source licenses remain separate and continue to govern reuse of code and course content.</p></section>
        <section><h2>2. Who may use Nexo</h2><p>You must be at least 13 to create an account. If the law where you live requires a higher age or parental authorization for online services, you must meet that requirement. Nexo may suspend access reasonably necessary to protect users, investigate abuse, or meet a legal obligation.</p></section>
        <section><h2>3. The free course</h2><p>Nexo provides Start Here, all sixteen modules, checkpoints, Review, and the course finish without a paid tier. An account is required after Start Here to keep the ordered learning record coherent across devices. Nexo may improve, correct, reorganize, or discontinue parts of the service, but no purchase entitlement is involved.</p></section>
        <section><h2>4. Accounts</h2><p>Provide an email address you control, keep your password confidential, and do not share or misuse another person’s account. Notify Nexo if you believe an account is compromised. You may erase course records in Settings and request account deletion through the <Link href="/contact">Contact page</Link>.</p></section>
        <section><h2>5. Educational scope</h2><p>Nexo is a self-directed educational resource. It does not promise fluency, employment, admission, academic credit, professional qualification, or a particular examination result. It is not an accredited course and is not endorsed by Auburn University. Spanish varies by region and community; Nexo aims for accurate general Latin American production while acknowledging variation.</p></section>
        <section><h2>6. Your answers</h2><p>You keep any rights you have in original writing you enter. You give Nexo only the limited permission needed to store, process, display back to you, and delete those answers as part of the course. Do not submit confidential, regulated, or sensitive personal information in a lesson answer.</p></section>
        <section><h2>7. AI transparency</h2><p>Nexo does not send learner answers to an AI API, use them to train an AI model, or make legal or similarly significant decisions about learners. Software development and editorial work may use AI-assisted tools, but published material remains subject to human review. Nexo does not claim that any AI-assisted draft is automatically correct, original, or suitable for publication.</p></section>
        <section><h2>8. Open-source licenses</h2><p>Nexo application code is offered under the MIT License in the source repository. Authored course and grammar content is offered under CC BY-SA 4.0 as described in the repository. Those licenses grant reuse rights subject to their own conditions. The Nexo name, logo, and personal identity rights are not licensed merely because the code or course content is open.</p></section>
        <section><h2>9. Acceptable use</h2><p>Do not attempt to bypass access controls, probe or disrupt the service without authorization, upload malware, scrape in a way that materially harms availability, impersonate another person, use the service unlawfully, or publish another learner’s personal data. Responsible security research should be reported privately.</p></section>
        <section><h2>10. Third-party services and links</h2><p>Netlify and Supabase help operate Nexo. Links may also lead to GitHub or other independent sites. Their services and policies are their own responsibility, and Nexo does not control third-party content or availability.</p></section>
        <section><h2>11. Availability and warranties</h2><p>Nexo is provided “as is” and “as available” to the fullest extent permitted by law. The project aims for accurate course material, accessibility, security, and reliable progress, but does not guarantee uninterrupted service, error-free content, or compatibility with every device or browser. Some jurisdictions do not allow certain warranty exclusions, so those exclusions apply only where lawful.</p></section>
        <section><h2>12. Limitation of liability</h2><p>To the fullest extent permitted by law, Nexo and its maintainer will not be liable for indirect, incidental, special, consequential, or punitive damages arising from use of or inability to use the free service. Nothing in these Terms excludes liability that cannot legally be excluded or limits rights that applicable consumer law makes non-waivable.</p></section>
        <section><h2>13. Changes and contact</h2><p>Material changes will be dated here. Continued use after an effective change means the updated Terms apply from that point, except where law requires a different form of notice or consent. Questions may be sent to <a href={`mailto:${contactEmail}?subject=Nexo%20terms%20question`}>{contactEmail}</a>.</p></section>
      </div>
      <p className="legal-disclaimer">These Terms reduce ambiguity but cannot eliminate every legal risk. A qualified lawyer should review them before a broad public launch or material change in data use.</p>
    </article>
  );
}
