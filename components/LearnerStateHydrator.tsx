"use client";

import { useEffect } from "react";
import type { AttemptRecord, ConceptEvidence, PrototypeState } from "@/lib/prototype-state";
import { defaultPrototypeState, STORAGE_KEY } from "@/lib/prototype-state";
import { clearAuthenticatedPrototypeState, hydratePrototypeState } from "@/lib/prototype-store";
import { createClient } from "@/lib/supabase/client";

type ProgressPayload = {
  completedLessons: string[];
  attempts: AttemptRecord[];
  evidence: ConceptEvidence[];
  lastVisitedLesson: string;
  userId: string;
};

function localState(): PrototypeState {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as PrototypeState | null;
    return parsed?.version === 1 ? parsed : defaultPrototypeState;
  } catch {
    return defaultPrototypeState;
  }
}

export function LearnerStateHydrator({ initial }: { initial: ProgressPayload | null }) {
  useEffect(() => {
    if (!initial) {
      clearAuthenticatedPrototypeState();
      return;
    }

    const local = localState();
    const freeLessonIds = local.completedLessons.filter((id) => id.startsWith("0."));
    const mergedCompleted = [...new Set([...initial.completedLessons, ...freeLessonIds])];
    const mergedAttempts = initial.attempts.length ? initial.attempts : local.attempts.filter((attempt) => attempt.interactionId.startsWith("start"));
    const mergedEvidence = initial.evidence.length ? initial.evidence : local.evidence.filter((item) => item.interactionId.startsWith("start"));
    hydratePrototypeState({
      ...defaultPrototypeState,
      completedLessons: mergedCompleted,
      attempts: mergedAttempts,
      evidence: mergedEvidence,
      lastVisitedLesson: initial.lastVisitedLesson || local.lastVisitedLesson,
    }, initial.userId);

    if (freeLessonIds.some((id) => !initial.completedLessons.includes(id))) {
      const supabase = createClient();
      void supabase.from("lesson_progress").insert(freeLessonIds.filter((id) => !initial.completedLessons.includes(id)).map((lesson_id) => ({ user_id: initial.userId, lesson_id })));
    }
  }, [initial]);

  return null;
}
