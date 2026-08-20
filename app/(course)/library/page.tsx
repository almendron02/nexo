import type { Metadata } from "next";
import { LibraryIndex } from "@/components/LibraryIndex";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata(
  "Spanish Grammar Library",
  "Read clear, focused guides to Spanish questions, verbs, pronouns, ser and estar, pronunciation, time, and story narration.",
  "/library",
);

export default function LibraryPage() {
  return <LibraryIndex />;
}
