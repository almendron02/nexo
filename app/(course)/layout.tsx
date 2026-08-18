import { AppShell } from "@/components/AppShell";
import { InterfaceSoundController } from "@/components/InterfaceSoundController";
import { LearnerStateHydrator } from "@/components/LearnerStateHydrator";
import { createClient } from "@/lib/supabase/server";

export default async function CourseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [progressResult, attemptResult, evidenceResult, profileResult] = user ? await Promise.all([
    supabase.from("lesson_progress").select("lesson_id").order("completed_at", { ascending: true }),
    supabase.from("learner_attempts").select("id, interaction_id, answer, correct, kind, concept_ids, attempt_number, created_at").order("created_at", { ascending: true }),
    supabase.from("concept_evidence").select("id, concept_id, interaction_id, correct, independent, created_at").order("created_at", { ascending: true }),
    supabase.from("learner_profiles").select("last_visited_lesson").maybeSingle(),
  ]) : [null, null, null, null];
  const learnerState = user ? {
    userId: user.id,
    completedLessons: (progressResult?.data ?? []).map((row) => row.lesson_id),
    attempts: (attemptResult?.data ?? []).map((row) => ({ id: row.id, interactionId: row.interaction_id, answer: row.answer, correct: row.correct, kind: row.kind, conceptIds: row.concept_ids, attemptNumber: row.attempt_number, createdAt: row.created_at })),
    evidence: (evidenceResult?.data ?? []).map((row) => ({ id: row.id, conceptId: row.concept_id, interactionId: row.interaction_id, correct: row.correct, independent: row.independent, createdAt: row.created_at })),
    lastVisitedLesson: profileResult?.data?.last_visited_lesson ?? "0.1",
  } : null;

  return (
    <>
      <InterfaceSoundController />
      <LearnerStateHydrator initial={learnerState} />
      <AppShell userEmail={user?.email ?? null}>{children}</AppShell>
    </>
  );
}
