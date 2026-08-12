import type { ConceptId } from "@/content/schemas";

export type MasteryLevel = "Learning" | "Developing" | "Solid";

export interface AttemptRecord {
  id: string;
  interactionId: string;
  answer: string;
  correct: boolean;
  kind: "choice" | "sort" | "builder" | "reading" | "fill" | "writing" | "review";
  conceptIds: ConceptId[];
  attemptNumber: number;
  createdAt: string;
}

export interface ConceptEvidence {
  id: string;
  conceptId: ConceptId;
  interactionId: string;
  correct: boolean;
  independent: boolean;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  before: string;
  after: string;
  answer: string;
  accepted: string[];
  conceptId: ConceptId;
  explanation: string;
}

export interface PrototypeState {
  version: 1;
  learnerName: string;
  completedLessons: string[];
  attempts: AttemptRecord[];
  evidence: ConceptEvidence[];
  reviewQueue: ReviewItem[];
  lastVisitedLesson: string;
}

export const STORAGE_KEY = "nexo:prototype:v1";

export const defaultReviewQueue: ReviewItem[] = [
  {
    id: "review-estar-location",
    before: "El libro ",
    after: " en la mesa.",
    answer: "está",
    accepted: ["está", "esta"],
    conceptId: "estar_location",
    explanation: "The sentence locates an identified book, so it uses estar.",
  },
  {
    id: "review-ser-origin",
    before: "Lucía ",
    after: " de Colombia.",
    answer: "es",
    accepted: ["es"],
    conceptId: "ser_origin",
    explanation: "Origin uses ser in this course: Lucía es de Colombia.",
  },
  {
    id: "review-agreement",
    before: "Ana está ",
    after: ". (tired)",
    answer: "cansada",
    accepted: ["cansada"],
    conceptId: "adjective_agreement",
    explanation: "The adjective agrees with Ana: cansada.",
  },
];

export const defaultPrototypeState: PrototypeState = {
  version: 1,
  learnerName: "learner",
  completedLessons: [],
  attempts: [],
  evidence: [],
  reviewQueue: [],
  lastVisitedLesson: "0.1",
};

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("es");
}

export function isAcceptedAnswer(value: string, accepted: string[]) {
  return accepted.some((answer) => normalize(answer) === normalize(value));
}

export function masteryFor(state: PrototypeState, conceptId: ConceptId): MasteryLevel {
  const evidence = state.evidence.filter((item) => item.conceptId === conceptId);
  if (evidence.length < 2) return "Learning";

  const correct = evidence.filter((item) => item.correct).length;
  const independent = evidence.filter((item) => item.correct && item.independent).length;
  const accuracy = correct / evidence.length;

  if (correct >= 4 && independent >= 2 && accuracy >= 0.75) return "Solid";
  if (correct >= 2 && accuracy >= 0.5) return "Developing";
  return "Learning";
}

export function lessonProgress(state: PrototypeState, lessonId: string) {
  return state.completedLessons.includes(lessonId) ? 100 : 0;
}

export function createRecordId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${random}`;
}
