import { Dashboard } from "@/components/Dashboard";
import { getLearnerSnapshot } from "@/lib/learner-data";

export default async function DashboardPage() {
  const learner = await getLearnerSnapshot();
  return <Dashboard entitled={learner.entitled} />;
}
