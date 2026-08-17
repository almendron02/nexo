import type { LessonDefinition } from "@/content/schemas";
import { CheckpointGate } from "@/components/CheckpointGate";
import { LessonExperience } from "@/components/LessonExperience";
import { checkpointAccessFor } from "@/lib/course-access";
import { getLearnerSnapshot } from "@/lib/learner-data";

export async function ProtectedCheckpoint({ lesson, stage }: { lesson: LessonDefinition; stage: number }) {
  const learner = await getLearnerSnapshot();
  const access = checkpointAccessFor({ authenticated: Boolean(learner.user), completedLessons: learner.completedLessons, stage });
  return access.status === "available" ? <LessonExperience lesson={lesson} /> : <CheckpointGate access={access} stage={stage} />;
}
