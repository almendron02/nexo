import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/HomePage";
import { absoluteUrl } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata(
  "Nexo — Spanish that finally connects",
  "A complete, structured Spanish course for serious beginners. Learn Spanish grammar in the right order, understand how it works, and practice until you can use it yourself.",
  "/",
  { absoluteTitle: true },
);

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl()}#website`,
        name: "Nexo",
        url: absoluteUrl(),
        description: "A complete, written-first Spanish course for serious beginners.",
      },
      {
        "@type": "Organization",
        "@id": `${absoluteUrl()}#organization`,
        name: "Nexo",
        url: absoluteUrl(),
        founder: { "@type": "Person", name: "Angel Gonzalez" },
        sameAs: ["https://github.com/almendron02/nexo"],
      },
      {
        "@type": "Course",
        name: "Spanish Foundations",
        description: "A free, structured beginner course in general Latin American Spanish with 16 modules, checkpoints, and deliberate review.",
        provider: { "@id": `${absoluteUrl()}#organization` },
        url: absoluteUrl("/course"),
        isAccessibleForFree: true,
        inLanguage: ["en", "es-419"],
        educationalLevel: "Beginner",
      },
    ],
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />
      <HomePage />
    </>
  );
}
