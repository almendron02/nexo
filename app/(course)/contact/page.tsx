import type { Metadata } from "next";
import { CodeXml, Mail, ShieldCheck } from "lucide-react";
import { contactEmail, sourceRepositoryUrl } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata(
  "Contact Nexo",
  "Contact Nexo for course questions, account and privacy requests, accessibility help, bug reports, and responsible security disclosure.",
  "/contact",
);

const emailHref = `mailto:${contactEmail}`;

export default function ContactPage() {
  return (
    <div className="info-page">
      <header className="info-hero">
        <p className="eyebrow">Contact Nexo</p>
        <h1>Tell us what needs attention.</h1>
        <p>Choose the route that keeps your message useful and your personal information appropriately private.</p>
      </header>

      <section className="contact-grid" aria-label="Contact options">
        <article>
          <Mail aria-hidden="true" />
          <p className="eyebrow">Private support</p>
          <h2>Account, privacy, or accessibility</h2>
          <p>Email Nexo for account deletion, data access or correction, an accessibility barrier, or anything that includes personal information.</p>
          <a className="contact-link" href={`${emailHref}?subject=Nexo%20support%20request`}>{contactEmail}</a>
          <small>Typical response: within 3 business days. Verified privacy requests may take up to 30 days.</small>
        </article>
        <article>
          <CodeXml aria-hidden="true" />
          <p className="eyebrow">Public issue</p>
          <h2>Curriculum or software correction</h2>
          <p>Use GitHub for a reproducible bug, a grammar correction, or an open-source contribution. Do not include account details or other personal data.</p>
          <a className="contact-link" href={`${sourceRepositoryUrl}/issues/new`} rel="noreferrer" target="_blank">Open a GitHub issue</a>
          <small>Public by design · Best for reviewable project work</small>
        </article>
        <article>
          <ShieldCheck aria-hidden="true" />
          <p className="eyebrow">Security</p>
          <h2>Report a vulnerability privately</h2>
          <p>Do not publish exploitable details or learner data in an issue. Send a concise report by email, including the affected URL and safe reproduction steps.</p>
          <a className="contact-link" href={`${emailHref}?subject=Nexo%20security%20report`}>Send a security report</a>
          <small>Initial acknowledgment target: within 3 business days</small>
        </article>
      </section>

      <p className="contact-privacy-note">Nexo does not use an embedded contact form, so your message is not copied into a separate form database. Your email provider and the recipient’s email provider will process the message under their own terms.</p>
    </div>
  );
}
