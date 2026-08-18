import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LibraryEntryPage } from "@/components/LibraryEntryPage";
import { getLibraryEntry, libraryEntries } from "@/content/library";
import { getLearnerSnapshot } from "@/lib/learner-data";

export function generateStaticParams() {
  return libraryEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getLibraryEntry(slug);
  if (!entry) return {};
  return {
    title: `${entry.title} — Nexo Library`,
    description: entry.summary,
  };
}

export default async function LibraryGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getLibraryEntry(slug);
  if (!entry) notFound();
  const learner = await getLearnerSnapshot();
  return <LibraryEntryPage authenticated={Boolean(learner.user)} entry={entry} />;
}
