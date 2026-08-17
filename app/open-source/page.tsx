import type { Metadata } from "next";
import { OpenSourcePage } from "@/components/OpenSourcePage";

export const metadata: Metadata = {
  title: "Free and open source — Nexo",
  description: "Nexo is a free, open-source Spanish course with optional account-backed progress.",
};

export default function OpenSourceRoute() {
  return <OpenSourcePage />;
}
