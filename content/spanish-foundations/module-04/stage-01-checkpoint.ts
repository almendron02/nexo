import type { LessonDefinition } from "@/content/schemas";
import { checkpointOneBlocks } from "@/content/spanish-foundations/checkpoint-exams";

export const stage01Checkpoint: LessonDefinition = {
  id: "stage-01-checkpoint",
  moduleId: "stage-01",
  title: "Foundations Exam",
  displayTitle: "Show what the foundations can do together.",
  dek: "Fifty questions revisit Modules 0–4: ten questions per module, two points each, and one percentage grade out of 100.",
  goal: "Demonstrate first-attempt control of sound and stress, noun phrases, adjective agreement, ser, estar, and hay.",
  durationMinutes: 45,
  concepts: [
    "learning_cycle", "spanish_vowels", "spanish_consonants", "stress_rules", "accent_marks", "greeting_chunks",
    "noun_gender", "articles_indefinite", "articles_definite", "noun_number", "noun_phrase",
    "adjective_gender", "adjective_number", "adjective_position", "adjective_agreement",
    "subject_pronouns", "ser_forms", "profession_article", "nationality_agreement", "relationships", "ser_identity", "ser_classification", "ser_origin",
    "estar_forms", "estar_state", "estar_location", "ser_vs_estar_selection", "ser_estar_meaning_change", "hay_existence", "hay_vs_estar",
  ],
  experience: {
    kind: "checkpoint",
    contextLabel: "Stage I · Checkpoint",
    openingMarker: "I / 04",
    returnHref: "/module/4",
    returnLabel: "Module 4",
    grading: { pointsPerQuestion: 2, passingPercentage: 75 },
  },
  blocks: [
    {
      id: "cp1-orientation",
      type: "prose",
      conceptIds: ["learning_cycle", "noun_phrase", "adjective_agreement", "ser_vs_estar_selection", "hay_vs_estar"],
      eyebrow: "Graded checkpoint",
      heading: "Five modules. Fifty questions. One transparent grade.",
      paragraphs: [
        "Each module contributes exactly ten questions. Every question is worth two points, so 50 correct first attempts equal 100 points and a grade of 100%.",
        "You can correct every missed answer and still finish. The correction adds learning evidence, while the grade preserves what happened on the first attempt.",
      ],
      points: [
        { label: "50", title: "Questions", description: "Ten questions for each module from 0 through 4." },
        { label: "2", title: "Points each", description: "Every question has the same weight." },
        { label: "75%", title: "Review line", description: "A lower grade recommends Review but never locks the course." },
      ],
    },
    ...checkpointOneBlocks,
    {
      id: "cp1-summary",
      type: "summary",
      conceptIds: ["learning_cycle", "noun_phrase", "adjective_agreement", "ser_vs_estar_selection", "hay_vs_estar"],
      eyebrow: "Before submitting",
      heading: "Check agreement and meaning, then keep your first attempt honest.",
      message: "The result screen reports points, first-attempt questions, and a percentage out of 100. Corrections remain part of the learning record.",
      ideas: [
        { label: "FORM", question: "Do the word endings agree?", uses: ["gender", "number", "subject"] },
        { label: "MEANING", question: "What job does the sentence perform?", uses: ["identity", "state", "location", "existence"] },
      ],
    },
  ],
  completion: {
    title: "Checkpoint I passed.",
    message: "Your percentage shows enough first-attempt control to continue into Stage II.",
    reviewTitle: "Review first—recommended.",
    reviewMessage: "Your checkpoint is complete and your corrections are saved. Review the marked concepts before Stage II, then continue when they feel more independent.",
  },
};
