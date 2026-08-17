import Link from "next/link";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import type { LessonAccess } from "@/lib/course-access";

export function AccessResolution({ access, lessonId, lessonTitle }: { access: Exclude<LessonAccess, { status: "available" }>; lessonId: string; lessonTitle: string }) {
  const next = `/lesson/${lessonId}`;
  const account = access.status === "account-required";
  const checkpoint = access.status === "checkpoint-required";
  const heading = account
    ? "Create an account to continue."
    : checkpoint
      ? `Complete the ${access.checkpointTitle} first.`
      : `Complete Lesson ${access.prerequisiteId} first.`;
  const body = account
    ? "The complete course is free. Your account keeps your place, preserves your attempts, and carries your learning evidence across the course."
    : checkpoint
      ? `This lesson begins a new stage. The checkpoint brings the previous stage together before the course adds a new system.`
      : `Lesson ${lessonId} builds directly on ${access.prerequisiteTitle}. Finish that class first so the next explanation has the foundation it expects.`;

  return (
    <main className="access-page">
      <div className="access-page__mark"><LockKeyhole aria-hidden="true" /></div>
      <p className="eyebrow">Lesson {lessonId} · Access</p>
      <h1>{heading}</h1>
      <p>{body}</p>
      <div className="access-page__lesson"><span>You were opening</span><strong>{lessonId} · {lessonTitle}</strong></div>
      <div className="access-page__actions">
        {account ? (
          <><Link className="button button--dark" href={`/auth/sign-up?next=${encodeURIComponent(next)}`}>Create account <ArrowRight aria-hidden="true" /></Link><Link className="button button--ghost" href={`/auth/sign-in?next=${encodeURIComponent(next)}`}>Sign in</Link></>
        ) : checkpoint ? (
          <Link className="button button--dark" href={access.checkpointHref}>Begin checkpoint <ArrowRight aria-hidden="true" /></Link>
        ) : (
          <Link className="button button--dark" href={`/lesson/${access.prerequisiteId}`}>Continue Lesson {access.prerequisiteId} <ArrowRight aria-hidden="true" /></Link>
        )}
        <Link className="access-page__back" href="/course"><ArrowLeft aria-hidden="true" /> Return to the course</Link>
      </div>
    </main>
  );
}
