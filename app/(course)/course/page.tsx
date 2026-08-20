import type { Metadata } from "next";
import { CourseIndex } from "@/components/CourseIndex";
import { getLearnerSnapshot } from "@/lib/learner-data";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata(
  "Complete Beginner Spanish Course",
  "Explore Nexo’s complete free Spanish Foundations path: Start Here, 16 ordered modules, four checkpoints, concept-level review, and a visible finish.",
  "/course",
);

export default async function CoursePage() {
  const learner = await getLearnerSnapshot();
  return <CourseIndex authenticated={Boolean(learner.user)} />;
}
