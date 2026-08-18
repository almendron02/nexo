"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getCourseLesson } from "@/content/course-catalog";
import { lessonAccessFor } from "@/lib/course-access";
import { usePrototypeState } from "@/lib/prototype-store";

export function LibrarySourceLessons({
  authenticated,
  lessonIds,
}: {
  authenticated: boolean;
  lessonIds: string[];
}) {
  const state = usePrototypeState();
  const sources = lessonIds
    .map((id) => getCourseLesson(id))
    .filter((source) => source !== undefined);

  return (
    <section className="library-sources" aria-labelledby="library-sources-title">
      <div>
        <BookOpen aria-hidden="true" />
        <p className="eyebrow">Learn it in context</p>
        <h2 id="library-sources-title">Source lessons</h2>
      </div>
      <ol>
        {sources.map(({ lesson, module }) => {
          const access = lessonAccessFor({
            authenticated,
            completedLessons: state.completedLessons,
            lessonId: lesson.id,
          });
          const label = access.status === "available"
            ? module.number === 0
              ? "Free · Start Here"
              : `Available · Module ${module.number}`
            : access.status === "account-required"
              ? "Free account required"
              : access.status === "checkpoint-required"
                ? access.checkpointTitle
                : `Complete ${access.prerequisiteId} first`;

          return (
            <li key={lesson.id}>
              <Link href={`/lesson/${lesson.id}`}>
                <span>Lesson {lesson.id}</span>
                <strong>{lesson.title}</strong>
                <small>{label}</small>
                <ArrowRight aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
