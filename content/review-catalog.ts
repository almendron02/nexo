import type { ConceptId, FillBlock, LessonDefinition } from "@/content/schemas";
import { builtCourseModules } from "@/content/course-catalog";
import { module04LessonDefinitions } from "@/content/spanish-foundations/module-04";
import { preModule04LessonsByModule } from "@/content/spanish-foundations/stage-01";
import { remainingLessonsByModule } from "@/content/spanish-foundations/stages-02-04";

interface ReviewItemBase {
  id: string;
  lessonId: string;
  lessonTitle: string;
  conceptIds: ConceptId[];
  explanation: string;
  incorrectExplanation: string;
  instruction: string;
  question: string;
}

export interface TextReviewItem extends ReviewItemBase {
  kind: "fill" | "builder";
  before: string;
  after: string;
  answer: string;
  accepted: string[];
  audioText: string;
}

export interface ChoiceReviewItem extends ReviewItemBase {
  kind: "choice" | "reading" | "sort";
  options: Array<{ id: string; label: string }>;
  correctOptionId: string;
  answerLabel: string;
  audioText?: string;
}

export type ModuleReviewItem = TextReviewItem | ChoiceReviewItem;

export interface ModuleReviewSet {
  moduleNumber: number;
  title: string;
  stageLabel: string;
  description: string;
  items: ModuleReviewItem[];
}

const definitionsByModule: Record<number, LessonDefinition[]> = {
  0: [...preModule04LessonsByModule[0]],
  1: [...preModule04LessonsByModule[1]],
  2: [...preModule04LessonsByModule[2]],
  3: [...preModule04LessonsByModule[3]],
  4: Object.values(module04LessonDefinitions),
  5: [...remainingLessonsByModule[5]],
  6: [...remainingLessonsByModule[6]],
  7: [...remainingLessonsByModule[7]],
  8: [...remainingLessonsByModule[8]],
  9: [...remainingLessonsByModule[9]],
  10: [...remainingLessonsByModule[10]],
  11: [...remainingLessonsByModule[11]],
  12: [...remainingLessonsByModule[12]],
  13: [...remainingLessonsByModule[13]],
  14: [...remainingLessonsByModule[14]],
  15: [...remainingLessonsByModule[15]],
  16: [...remainingLessonsByModule[16]],
};

function reviewQuestion(block: FillBlock, item: FillBlock["items"][number]) {
  const clues = [...`${item.before} ${item.after}`.matchAll(/\(([^)]+)\)/g)];
  const meaning = clues[clues.length - 1]?.[1]?.trim().replace(/[.!?]+$/, "");
  if (meaning) return `Which Spanish word or form completes the sentence with the meaning “${meaning}”?`;

  if (item.conceptIds.some((concept) => concept === "hay_existence" || concept === "hay_vs_estar")) {
    return "Does the sentence introduce what exists with hay, or locate an identified subject with estar? Type the missing word or form.";
  }
  if (item.conceptIds.includes("ser_estar_meaning_change")) {
    return "Which form of ser or estar gives the adjective the intended meaning in this sentence?";
  }
  if (item.conceptIds.includes("ser_vs_estar_selection")) {
    return "Does the sentence identify or classify with ser, or describe a state or location with estar? Type the form that matches the subject.";
  }
  if (item.conceptIds.some((concept) => concept === "estar_forms" || concept === "estar_state" || concept === "estar_location")) {
    return "Which present form of estar matches the subject and completes this state or location?";
  }
  if (item.conceptIds.some((concept) => concept === "ser_forms" || concept === "ser_identity" || concept === "ser_classification" || concept === "ser_origin")) {
    return "Which form or connector completes this identity, classification, or origin statement?";
  }
  if (item.conceptIds.some((concept) => concept === "articles_definite" || concept === "articles_indefinite" || concept === "noun_gender" || concept === "noun_number" || concept === "noun_phrase")) {
    return "Which Spanish article or noun form completes the phrase with the required gender, number, and reference?";
  }
  if (item.conceptIds.some((concept) => concept === "adjective_gender" || concept === "adjective_number" || concept === "adjective_agreement" || concept === "adjective_position")) {
    return "Which adjective form completes the description and agrees with the noun?";
  }
  if (item.conceptIds.some((concept) => concept.startsWith("question_"))) {
    return "What information is the question requesting, and which Spanish question word or structure asks for it precisely?";
  }
  if (item.conceptIds.some((concept) => concept.startsWith("numbers_") || concept === "dates_calendar" || concept === "clock_time" || concept === "time_expressions")) {
    return "Which number or time expression completes the quantity, date, schedule, or routine described?";
  }
  if (item.conceptIds.some((concept) => concept.startsWith("present_") || concept === "infinitive_structure" || concept === "stem_change")) {
    return "Which present form matches the subject and verb family while preserving any required stem change or negation?";
  }
  if (item.conceptIds.some((concept) => ["querer_poder", "tener_expressions", "hacer_poner", "venir_salir_oir", "saber_conocer", "ir_forms", "near_future", "tener_que", "verb_patterns", "para_infinitive", "hace_time"].includes(concept))) {
    return "Which high-frequency verb or reusable verb pattern expresses the intended ability, need, plan, purpose, or time relationship?";
  }
  if (item.conceptIds.some((concept) => concept.includes("object") || concept === "personal_a" || concept === "combined_pronouns")) {
    return "Which object form or pronoun keeps the recipient, affected person, or known thing clear in this sentence?";
  }
  if (item.conceptIds.some((concept) => concept.includes("gustar") || concept === "indirect_objects" || concept === "indirect_object_pronouns")) {
    return "Who experiences or receives the action, what controls agreement, and which indirect form completes that relationship?";
  }
  if (item.conceptIds.some((concept) => concept.startsWith("reflexive_") || concept === "daily_routine" || concept === "reciprocal_reflexive")) {
    return "Does the action return to the subject or move between people, and which matching reflexive form completes it?";
  }
  if (item.conceptIds.some((concept) => concept.includes("negative") || concept.includes("preposition") || concept === "clause_connectors")) {
    return "Which negative, preposition, or connector makes the intended relationship between these ideas explicit?";
  }
  if (item.conceptIds.some((concept) => concept.startsWith("subjunctive_"))) {
    return "Is the second clause asserted, desired, doubted, evaluated, or connected to a different subject, and which mood form follows?";
  }
  if (item.conceptIds.some((concept) => concept.startsWith("preterite_") || concept.startsWith("imperfect_") || concept === "past_narration")) {
    return "Does this verb build open past background or advance a bounded event, and which past form carries that viewpoint?";
  }
  return "Which Spanish word or form completes this sentence?";
}

function sentenceAnswers(answer: string) {
  const withoutEndingPunctuation = answer.replace(/[.!?]+$/, "");
  return withoutEndingPunctuation === answer ? [answer] : [answer, withoutEndingPunctuation];
}

function cleanAudioText(text: string) {
  return text.replace(/\s*\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
}

function extractItems(lessons: LessonDefinition[]): ModuleReviewItem[] {
  return lessons.flatMap((lesson) => lesson.blocks.flatMap((block): ModuleReviewItem[] => {
    if (block.type === "fill") {
      return block.items.map((item): TextReviewItem => ({
        kind: "fill",
        id: `review-${lesson.id}-${block.id}-${item.id}`,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        before: item.before,
        after: item.after,
        answer: item.answer,
        accepted: item.accepted,
        audioText: cleanAudioText(`${item.before}${item.answer}${item.after}`),
        conceptIds: item.conceptIds,
        explanation: item.feedback,
        incorrectExplanation: "Not yet. Rebuild the phrase from its meaning and agreement, then try again.",
        instruction: block.prompt,
        question: reviewQuestion(block, item),
      }));
    }

    if (block.type === "builder") {
      return [{
        kind: "builder",
        id: `review-${lesson.id}-${block.id}`,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        before: "",
        after: "",
        answer: block.answer,
        accepted: sentenceAnswers(block.answer),
        audioText: cleanAudioText(block.answer),
        conceptIds: block.conceptIds,
        explanation: block.feedback,
        incorrectExplanation: "Not yet. Keep every idea, then check the verb form, pronoun position, and sentence order.",
        instruction: "Type the complete Spanish sentence. Final punctuation is optional.",
        question: block.prompt,
      } satisfies TextReviewItem];
    }

    if (block.type === "choice") {
      const answerLabel = block.options.find((option) => option.id === block.correctOptionId)?.label ?? "";
      return [{
        kind: "choice",
        id: `review-${lesson.id}-${block.id}`,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        options: block.options,
        correctOptionId: block.correctOptionId,
        answerLabel,
        audioText: block.sentence ? cleanAudioText(`${block.sentence.before}${answerLabel}${block.sentence.after}`) : undefined,
        conceptIds: block.conceptIds,
        explanation: block.correctFeedback,
        incorrectExplanation: block.incorrectFeedback,
        instruction: block.context ?? "Choose the option that makes the intended meaning precise.",
        question: block.prompt,
      } satisfies ChoiceReviewItem];
    }

    if (block.type === "reading") {
      return block.questions.map((question): ChoiceReviewItem => ({
        kind: "reading",
        id: `review-${lesson.id}-${block.id}-${question.id}`,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        options: question.options,
        correctOptionId: question.correctOptionId,
        answerLabel: question.options.find((option) => option.id === question.correctOptionId)?.label ?? "",
        conceptIds: question.conceptIds,
        explanation: question.feedback,
        incorrectExplanation: "Not yet. Return to the message, identify the evidence, and choose what that evidence supports.",
        instruction: `${block.instructions} ${block.sentences.map((sentence) => sentence.text).join(" ")}`,
        question: question.prompt,
      }));
    }

    if (block.type === "sort") {
      return block.items.map((sortItem): ChoiceReviewItem => ({
        kind: "sort",
        id: `review-${lesson.id}-${block.id}-${sortItem.id}`,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        options: block.buckets.map(({ id, label }) => ({ id, label })),
        correctOptionId: sortItem.answer,
        answerLabel: block.buckets.find((bucket) => bucket.id === sortItem.answer)?.label ?? "",
        conceptIds: block.conceptIds,
        explanation: `${sortItem.label} belongs with ${block.buckets.find((bucket) => bucket.id === sortItem.answer)?.label ?? "this category"}.`,
        incorrectExplanation: "Not yet. Compare the message with what each category means, then choose again.",
        instruction: block.prompt,
        question: `Which category fits “${sortItem.label}”?`,
      }));
    }

    return [];
  }));
}

export const moduleReviewSets: ModuleReviewSet[] = builtCourseModules.map((module) => ({
  moduleNumber: module.number,
  title: module.title,
  stageLabel: module.stageLabel,
  description: module.description,
  items: extractItems(definitionsByModule[module.number] ?? []),
}));

export function getModuleReviewSet(moduleNumber: number) {
  return moduleReviewSets.find((set) => set.moduleNumber === moduleNumber);
}
