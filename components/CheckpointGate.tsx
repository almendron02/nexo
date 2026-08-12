import Link from "next/link";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import type { LessonAccess } from "@/lib/course-access";

export function CheckpointGate({ access, stage }: { access: Exclude<LessonAccess, { status: "available" }>; stage: number }) {
  const next = `/checkpoint/stage-${stage}`;
  const account = access.status === "account-required";
  const purchase = access.status === "purchase-required";
  return (
    <main className="access-page">
      <div className="access-page__mark"><LockKeyhole aria-hidden="true" /></div>
      <p className="eyebrow">Stage {stage} · Checkpoint</p>
      <h1>{account ? "Create an account to continue." : purchase ? "Get the complete course first." : "Finish the stage before its checkpoint."}</h1>
      <p>{account ? "Your account keeps checkpoint results and the course path together." : purchase ? "Stage checkpoints are included with lifetime access to Spanish Foundations." : `The checkpoint unlocks when every preceding lesson is complete. Your next required class is Lesson ${access.status === "prerequisite-required" ? access.prerequisiteId : ""}.`}</p>
      <div className="access-page__actions">
        {account ? <Link className="button button--dark" href={`/auth/sign-up?next=${encodeURIComponent(next)}`}>Create account <ArrowRight aria-hidden="true" /></Link> : purchase ? <Link className="button button--dark" href={`/plans?next=${encodeURIComponent(next)}`}>See course access <ArrowRight aria-hidden="true" /></Link> : access.status === "prerequisite-required" ? <Link className="button button--dark" href={`/lesson/${access.prerequisiteId}`}>Continue Lesson {access.prerequisiteId} <ArrowRight aria-hidden="true" /></Link> : null}
        <Link className="access-page__back" href="/course"><ArrowLeft aria-hidden="true" /> Return to the course</Link>
      </div>
    </main>
  );
}
