import { notFound } from "next/navigation";
import { LessonExperience } from "@/components/LessonExperience";
import { AccessResolution } from "@/components/AccessResolution";
import { lessonAccessFor } from "@/lib/course-access";
import { getLearnerSnapshot } from "@/lib/learner-data";
import { preModule04LessonDefinitions, preModule04LessonsById } from "@/content/spanish-foundations/stage-01";
import { remainingLessonDefinitions, remainingLessonsById } from "@/content/spanish-foundations/stages-02-04";

export function generateStaticParams() {
  return [...preModule04LessonDefinitions, ...remainingLessonDefinitions].map((lesson) => ({ lessonId: lesson.id }));
}

export default async function FoundationLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = preModule04LessonsById[lessonId] ?? remainingLessonsById[lessonId];
  if (!lesson) notFound();
  const learner = await getLearnerSnapshot();
  const access = lessonAccessFor({ authenticated: Boolean(learner.user), completedLessons: learner.completedLessons, entitled: learner.entitled, lessonId });
  if (access.status !== "available") return <AccessResolution access={access} lessonId={lessonId} lessonTitle={lesson.title} />;
  return <LessonExperience lesson={lesson} />;
}
