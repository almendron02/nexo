import { ModuleOverview } from "@/components/ModuleOverview";
import { getLearnerSnapshot } from "@/lib/learner-data";

export default async function ModuleFourPage() {
  const learner = await getLearnerSnapshot();
  return <ModuleOverview authenticated={Boolean(learner.user)} />;
}
