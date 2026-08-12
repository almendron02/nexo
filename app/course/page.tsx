import { CourseIndex } from "@/components/CourseIndex";
import { getLearnerSnapshot } from "@/lib/learner-data";

export default async function CoursePage() {
  const learner = await getLearnerSnapshot();
  return <CourseIndex authenticated={Boolean(learner.user)} entitled={learner.entitled} />;
}
