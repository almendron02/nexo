import type { ConceptId, LessonDefinition } from "@/content/schemas";
import {
  checkpointFourStory,
  checkpointThreeBlocks,
  checkpointTwoBlocks,
} from "@/content/spanish-foundations/checkpoint-exams";

type ObjectiveCheckpointSpec = {
  id: string;
  moduleId: string;
  stageRoman: string;
  moduleNumber: number;
  title: string;
  displayTitle: string;
  dek: string;
  goal: string;
  concepts: ConceptId[];
  moduleRange: string;
  blocks: typeof checkpointTwoBlocks;
};

function objectiveCheckpoint(spec: ObjectiveCheckpointSpec): LessonDefinition {
  const prefix = spec.id.replaceAll("-", "");
  return {
    id: spec.id,
    moduleId: spec.moduleId,
    title: spec.title,
    displayTitle: spec.displayTitle,
    dek: spec.dek,
    goal: spec.goal,
    durationMinutes: 45,
    concepts: spec.concepts,
    experience: {
      kind: "checkpoint",
      contextLabel: `Stage ${spec.stageRoman} · Checkpoint`,
      openingMarker: `${spec.stageRoman} / ${String(spec.moduleNumber).padStart(2, "0")}`,
      returnHref: `/module/${spec.moduleNumber}`,
      returnLabel: `Module ${spec.moduleNumber}`,
      grading: { pointsPerQuestion: 2, passingPercentage: 75 },
    },
    blocks: [
      {
        id: `${prefix}-orientation`,
        type: "prose",
        conceptIds: spec.concepts,
        eyebrow: "Graded checkpoint",
        heading: "Five modules. Fifty questions. One transparent grade.",
        paragraphs: [
          `This checkpoint covers Modules ${spec.moduleRange}. Each module contributes exactly ten questions, and every question is worth two points. The maximum is 100 points, so your score is also your percentage grade.`,
          "Correct every missed answer to finish the checkpoint. Your first answer remains the graded evidence; later corrections show what you learned without replacing that first attempt.",
        ],
        points: [
          { label: "50", title: "Questions", description: `Ten questions from each module in ${spec.moduleRange}.` },
          { label: "2", title: "Points each", description: "Every question contributes equally." },
          { label: "75%", title: "Review line", description: "Below 75% recommends Review without blocking progress." },
        ],
      },
      ...spec.blocks,
      {
        id: `${prefix}-summary`,
        type: "summary",
        conceptIds: spec.concepts,
        eyebrow: "Before submitting",
        heading: "Use the whole message, not an isolated ending.",
        message: "The result screen reports raw points, first-attempt questions, and a percentage out of 100. Corrections remain visible as additional evidence.",
        ideas: [
          { label: "CONTROL", question: "Does the form match its subject and structure?", uses: ["agreement", "position", "conjugation"] },
          { label: "MEANING", question: "Does the sentence express the intended relationship?", uses: ["reference", "time", "speaker stance"] },
        ],
      },
    ],
    completion: {
      title: `${spec.title} passed.`,
      message: "Your percentage shows enough first-attempt control to continue.",
      reviewTitle: "Review this stage—recommended.",
      reviewMessage: "Your checkpoint and corrections are saved. Review the marked concepts, then continue when the relationships feel more independent.",
    },
  };
}

export const stage02Checkpoint = objectiveCheckpoint({
  id: "stage-02-checkpoint",
  moduleId: "stage-02",
  stageRoman: "II",
  moduleNumber: 9,
  title: "Use Spanish Exam",
  displayTitle: "Ask, act, and make plans in real time.",
  dek: "Fifty questions revisit Modules 5–9: ten questions per module, two points each, and one percentage grade out of 100.",
  goal: "Demonstrate control of questions, quantities, present actions, essential irregulars, plans, obligations, purpose, and time expressions.",
  moduleRange: "5–9",
  concepts: [
    "question_structure", "question_words_identity", "question_words_context", "question_reason_quantity",
    "numbers_basic", "numbers_large", "dates_calendar", "clock_time", "time_expressions",
    "infinitive_structure", "present_ar", "present_er", "present_ir", "present_negation", "present_sentence",
    "stem_change", "querer_poder", "tener_expressions", "hacer_poner", "venir_salir_oir", "saber_conocer", "ir_forms",
    "near_future", "tener_que", "verb_patterns", "para_infinitive", "hace_time",
  ],
  blocks: checkpointTwoBlocks,
});

export const stage03Checkpoint = objectiveCheckpoint({
  id: "stage-03-checkpoint",
  moduleId: "stage-03",
  stageRoman: "III",
  moduleNumber: 14,
  title: "Connect Spanish Exam",
  displayTitle: "Keep people, objects, and clauses connected.",
  dek: "Fifty questions revisit Modules 10–14: ten questions per module, two points each, and one percentage grade out of 100.",
  goal: "Demonstrate control of objects and pronouns, gustar structures, reflexive meaning, negatives, connectors, and the present subjunctive.",
  moduleRange: "10–14",
  concepts: [
    "direct_objects", "personal_a", "direct_object_pronouns", "object_pronoun_position",
    "indirect_objects", "indirect_object_pronouns", "gustar_structure", "gusta_gustan", "gustar_verbs", "combined_pronouns",
    "reflexive_pronouns", "daily_routine", "reflexive_position", "reflexive_change", "reciprocal_reflexive",
    "negative_words", "double_negation", "core_prepositions", "sequence_prepositions", "clause_connectors",
    "subjunctive_purpose", "subjunctive_forms", "subjunctive_influence", "subjunctive_reactions", "subjunctive_connectors",
  ],
  blocks: checkpointThreeBlocks,
});

export const stage04Checkpoint: LessonDefinition = {
  id: "stage-04-checkpoint",
  moduleId: "stage-04",
  title: "Past-Tense Story Exam",
  displayTitle: "Rebuild a complete story in the past.",
  dek: "Fill every past-tense verb in an original instructional adaptation of Genesis 1:1–27. Each blank is worth two points; the final grade is normalized to 100%.",
  goal: "Choose preterite or imperfect from narrative viewpoint and conjugate every missing past-tense verb from its infinitive cue.",
  durationMinutes: 55,
  concepts: ["preterite_function", "preterite_ar", "preterite_er_ir", "preterite_irregular", "preterite_spelling", "preterite_narration", "imperfect_function", "imperfect_forms", "imperfect_description", "imperfect_habit", "preterite_imperfect", "past_narration"],
  experience: {
    kind: "checkpoint",
    contextLabel: "Stage IV · Final Checkpoint",
    openingMarker: "IV / 16",
    returnHref: "/module/16",
    returnLabel: "Module 16",
    grading: { pointsPerQuestion: 2, passingPercentage: 75 },
  },
  blocks: [
    {
      id: "cp4-orientation",
      type: "prose",
      conceptIds: ["preterite_imperfect", "past_narration"],
      eyebrow: "Graded final checkpoint",
      heading: "The infinitive is given; the narrative viewpoint is yours.",
      paragraphs: [
        "Every finite past-tense verb in the adaptation is a blank. A parenthetical infinitive appears immediately beside it, for example: _____ (crear) or _____ (tener).",
        "Each blank is worth two raw points. Because this story contains more than fifty verbs, Nexo converts the raw total into a percentage out of 100. The first response sets the grade, and corrections let you complete the text without erasing that evidence.",
        "The passage is an original modern instructional adaptation based on a public-domain Spanish source. It is not the copyrighted Nueva Versión Internacional wording.",
      ],
      points: [
        { label: "PRETERITE", title: "Advance completed events", description: "Use bounded actions to move the creation sequence forward." },
        { label: "IMPERFECT", title: "Establish the world", description: "Use descriptions and ongoing states as the background." },
        { label: "2 PTS", title: "Every blank", description: "All missing past-tense forms carry equal weight." },
      ],
    },
    checkpointFourStory,
    {
      id: "cp4-summary",
      type: "summary",
      conceptIds: ["preterite_imperfect", "past_narration"],
      eyebrow: "Narrative control",
      heading: "Background holds the world; completed events move it.",
      message: "Your grade measures the first form supplied for every past-tense blank and reports the result as a percentage out of 100.",
      ideas: [
        { label: "IMPERFECT", question: "What was already true or in progress?", uses: ["description", "state", "background"] },
        { label: "PRETERITE", question: "What happened and moved the sequence?", uses: ["completed event", "change", "next step"] },
      ],
    },
  ],
  completion: {
    title: "The final checkpoint is complete.",
    message: "Your percentage shows control of the two past viewpoints across a sustained story.",
    reviewTitle: "Review the past viewpoints—recommended.",
    reviewMessage: "Your grade and corrections are saved. Review the marked past-tense concepts, then return to the story when the viewpoint choices feel more independent.",
  },
};

export const remainingStageCheckpoints = {
  "stage-2": stage02Checkpoint,
  "stage-3": stage03Checkpoint,
  "stage-4": stage04Checkpoint,
} as const;
