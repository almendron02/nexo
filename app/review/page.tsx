import { ReviewSession } from "@/components/ReviewSession";
import { getLearnerSnapshot } from "@/lib/learner-data";
import { FeatureAccessResolution } from "@/components/FeatureAccessResolution";

export default async function ReviewPage() {
  const learner = await getLearnerSnapshot();
  if (!learner.entitled) return <FeatureAccessResolution feature="Personalized Review" description="Review reuses exercises from lessons you have completed and preserves the evidence you build across the course." />;
  return <ReviewSession entitled={learner.entitled} />;
}
