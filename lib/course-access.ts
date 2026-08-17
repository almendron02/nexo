import { builtCourseModules, getCourseLesson } from "@/content/course-catalog";

export type LessonAccess =
  | { status: "available" }
  | { status: "account-required" }
  | { status: "prerequisite-required"; prerequisiteId: string; prerequisiteTitle: string }
  | { status: "checkpoint-required"; checkpointHref: string; checkpointTitle: string };

const lessonsInOrder = builtCourseModules.flatMap((module) => module.lessons);
const stageCheckpointBeforeModule: Partial<Record<number, { id: string; href: string; title: string }>> = {
  5: { id: "stage-01-checkpoint", href: "/checkpoint/stage-1", title: "Stage I Checkpoint" },
  10: { id: "stage-02-checkpoint", href: "/checkpoint/stage-2", title: "Stage II Checkpoint" },
  15: { id: "stage-03-checkpoint", href: "/checkpoint/stage-3", title: "Stage III Checkpoint" },
};

export function previousLesson(lessonId: string) {
  const index = lessonsInOrder.findIndex((lesson) => lesson.id === lessonId);
  return index > 0 ? lessonsInOrder[index - 1] : undefined;
}

export function lessonAccessFor({
  authenticated,
  completedLessons,
  lessonId,
}: {
  authenticated: boolean;
  completedLessons: string[];
  lessonId: string;
}): LessonAccess {
  const courseLesson = getCourseLesson(lessonId);
  if (!courseLesson || courseLesson.module.number === 0) return { status: "available" };
  if (!authenticated) return { status: "account-required" };
  if (completedLessons.includes(lessonId)) return { status: "available" };

  const checkpoint = stageCheckpointBeforeModule[courseLesson.module.number];
  if (checkpoint && !completedLessons.includes(checkpoint.id)) {
    return { status: "checkpoint-required", checkpointHref: checkpoint.href, checkpointTitle: checkpoint.title };
  }

  const prerequisite = previousLesson(lessonId);
  if (prerequisite && !completedLessons.includes(prerequisite.id)) {
    return { status: "prerequisite-required", prerequisiteId: prerequisite.id, prerequisiteTitle: prerequisite.title };
  }

  return { status: "available" };
}

export function checkpointAccessFor({
  authenticated,
  completedLessons,
  stage,
}: {
  authenticated: boolean;
  completedLessons: string[];
  stage: number;
}): LessonAccess {
  if (!authenticated) return { status: "account-required" };

  const moduleCeiling: Record<number, number> = { 1: 4, 2: 9, 3: 14, 4: 16 };
  const required = builtCourseModules
    .filter((module) => module.number <= moduleCeiling[stage])
    .flatMap((module) => module.lessons);
  const missing = required.find((lesson) => !completedLessons.includes(lesson.id));
  return missing
    ? { status: "prerequisite-required", prerequisiteId: missing.id, prerequisiteTitle: missing.title }
    : { status: "available" };
}
