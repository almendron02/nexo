import type { Metadata } from "next";
import { ModuleOverview } from "@/components/ModuleOverview";
import { getLearnerSnapshot } from "@/lib/learner-data";

export const metadata: Metadata = {
  title: "Module 4: States, Places and Existence",
  robots: { index: false, follow: false },
};

export default async function ModuleFourPage() {
  const learner = await getLearnerSnapshot();
  return <ModuleOverview authenticated={Boolean(learner.user)} />;
}
