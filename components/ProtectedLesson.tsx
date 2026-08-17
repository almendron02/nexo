import type { LessonDefinition } from "@/content/schemas";
import { AccessResolution } from "@/components/AccessResolution";
import { LessonExperience } from "@/components/LessonExperience";
import { lessonAccessFor } from "@/lib/course-access";
import { getLearnerSnapshot } from "@/lib/learner-data";

export async function ProtectedLesson({ lesson }: { lesson: LessonDefinition }) {
  const learner = await getLearnerSnapshot();
  const access = lessonAccessFor({ authenticated: Boolean(learner.user), completedLessons: learner.completedLessons, lessonId: lesson.id });
  return access.status === "available"
    ? <LessonExperience lesson={lesson} />
    : <AccessResolution access={access} lessonId={lesson.id} lessonTitle={lesson.title} />;
}
