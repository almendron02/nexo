import type { Metadata } from "next";
import { LibraryIndex } from "@/components/LibraryIndex";

export const metadata: Metadata = {
  title: "Library — Nexo",
  description: "Your Nexo learning library.",
};

export default function LibraryPage() {
  return <LibraryIndex />;
}
