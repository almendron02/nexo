"use client";

import { useSyncExternalStore } from "react";
import type { ConceptId } from "@/content/schemas";
import {
  createRecordId,
  defaultPrototypeState,
  type PrototypeState,
  STORAGE_KEY,
} from "@/lib/prototype-state";

type RecordAttemptInput = {
  interactionId: string;
  answer: string;
  correct: boolean;
  kind: "choice" | "sort" | "builder" | "reading" | "fill" | "writing" | "review";
  conceptIds: ConceptId[];
  independent?: boolean;
};

let cache: PrototypeState | null = null;
const listeners = new Set<() => void>();

function readStoredState(): PrototypeState {
  if (typeof window === "undefined") return defaultPrototypeState;
  if (cache) return cache;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cache = defaultPrototypeState;
      return cache;
    }

    const parsed = JSON.parse(raw) as PrototypeState;
    cache = parsed.version === 1 ? parsed : defaultPrototypeState;
  } catch {
    cache = defaultPrototypeState;
  }

  return cache;
}

function writeState(next: PrototypeState) {
  cache = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePrototypeState() {
  return useSyncExternalStore(subscribe, readStoredState, () => defaultPrototypeState);
}

export function recordAttempt(input: RecordAttemptInput) {
  const state = readStoredState();
  const attemptNumber = state.attempts.filter(
    (attempt) => attempt.interactionId === input.interactionId,
  ).length + 1;
  const createdAt = new Date().toISOString();

  writeState({
    ...state,
    attempts: [
      ...state.attempts,
      {
        id: createRecordId("attempt"),
        interactionId: input.interactionId,
        answer: input.answer,
        correct: input.correct,
        kind: input.kind,
        conceptIds: input.conceptIds,
        attemptNumber,
        createdAt,
      },
    ],
    evidence: [
      ...state.evidence,
      ...input.conceptIds.map((conceptId) => ({
        id: createRecordId("evidence"),
        conceptId,
        interactionId: input.interactionId,
        correct: input.correct,
        independent: input.independent ?? false,
        createdAt,
      })),
    ],
  });
}

export function completeLesson(lessonId: string) {
  const state = readStoredState();
  if (state.completedLessons.includes(lessonId)) return;
  writeState({
    ...state,
    completedLessons: [...state.completedLessons, lessonId],
    lastVisitedLesson: lessonId,
  });
}

export function resolveReviewItem(itemId: string) {
  const state = readStoredState();
  writeState({
    ...state,
    reviewQueue: state.reviewQueue.filter((item) => item.id !== itemId),
  });
}

export function resetPrototype() {
  writeState(defaultPrototypeState);
}
