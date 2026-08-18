export type ConceptId =
  | "learning_cycle"
  | "spanish_vowels"
  | "spanish_consonants"
  | "stress_rules"
  | "accent_marks"
  | "greeting_chunks"
  | "noun_gender"
  | "gender_patterns"
  | "articles_indefinite"
  | "articles_definite"
  | "noun_number"
  | "noun_phrase"
  | "adjective_function"
  | "adjective_gender"
  | "adjective_number"
  | "adjective_position"
  | "subject_pronouns"
  | "ser_forms"
  | "profession_article"
  | "nationality_agreement"
  | "relationships"
  | "gender_agreement"
  | "adjective_agreement"
  | "ser_identity"
  | "ser_classification"
  | "ser_origin"
  | "estar_forms"
  | "estar_state"
  | "estar_location"
  | "ser_vs_estar_selection"
  | "ser_estar_meaning_change"
  | "hay_existence"
  | "hay_vs_estar"
  | "question_structure"
  | "question_words_identity"
  | "question_words_context"
  | "question_reason_quantity"
  | "numbers_basic"
  | "numbers_large"
  | "dates_calendar"
  | "clock_time"
  | "time_expressions"
  | "infinitive_structure"
  | "present_ar"
  | "present_er"
  | "present_ir"
  | "present_negation"
  | "present_sentence"
  | "stem_change"
  | "querer_poder"
  | "tener_expressions"
  | "hacer_poner"
  | "venir_salir_oir"
  | "saber_conocer"
  | "ir_forms"
  | "near_future"
  | "tener_que"
  | "verb_patterns"
  | "para_infinitive"
  | "hace_time"
  | "direct_objects"
  | "personal_a"
  | "direct_object_pronouns"
  | "object_pronoun_position"
  | "indirect_objects"
  | "indirect_object_pronouns"
  | "gustar_structure"
  | "gusta_gustan"
  | "gustar_verbs"
  | "reflexive_pronouns"
  | "daily_routine"
  | "reflexive_position"
  | "reflexive_change"
  | "reciprocal_reflexive"
  | "negative_words"
  | "double_negation"
  | "core_prepositions"
  | "sequence_prepositions"
  | "clause_connectors"
  | "subjunctive_purpose"
  | "subjunctive_forms"
  | "subjunctive_influence"
  | "subjunctive_reactions"
  | "subjunctive_connectors"
  | "preterite_function"
  | "preterite_ar"
  | "preterite_er_ir"
  | "preterite_irregular"
  | "preterite_spelling"
  | "preterite_narration"
  | "imperfect_function"
  | "imperfect_forms"
  | "imperfect_description"
  | "imperfect_habit"
  | "preterite_imperfect"
  | "combined_pronouns"
  | "past_narration";

export type LessonStatus = "available" | "next" | "locked";

export interface LessonOutline {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  durationMinutes: number;
  archetype: "concept" | "pattern" | "application" | "contrast";
  status: LessonStatus;
  concepts: ConceptId[];
}

export interface LessonSourceSection {
  id: string;
  purpose: string;
  title: string;
  teachingCopy: string;
  examples?: string[];
  interaction?: string;
}

export interface LessonSource {
  id: string;
  title: string;
  goal: string;
  introduces: ConceptId[];
  reinforces: ConceptId[];
  vocabulary: string[];
  sections: LessonSourceSection[];
  audioPhrases: string[];
  reviewSeeds: Array<{
    prompt: string;
    answer: string;
    concept: ConceptId;
  }>;
}

export interface BlockBase {
  id: string;
  conceptIds: ConceptId[];
}

export interface ProseBlock extends BlockBase {
  type: "prose";
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
  spanish?: Array<{ text: string; translation?: string }>;
  points?: Array<{
    label: string;
    title: string;
    description: string;
  }>;
}

export interface ComparisonBlock extends BlockBase {
  type: "comparison";
  eyebrow?: string;
  heading: string;
  note?: string;
  sides: Array<{
    label: string;
    question: string;
    description: string;
    examples: Array<{ text: string; translation: string }>;
  }>;
}

export interface ChoiceBlock extends BlockBase {
  type: "choice";
  eyebrow?: string;
  heading: string;
  prompt: string;
  context?: string;
  sentence?: { before: string; after: string };
  options: Array<{ id: string; label: string }>;
  correctOptionId: string;
  correctFeedback: string;
  incorrectFeedback: string;
}

export interface SortBlock extends BlockBase {
  type: "sort";
  eyebrow?: string;
  heading: string;
  prompt: string;
  buckets: Array<{ id: string; label: string; hint: string }>;
  items: Array<{ id: string; label: string; answer: string }>;
}

export interface BuilderBlock extends BlockBase {
  type: "builder";
  eyebrow?: string;
  heading: string;
  prompt: string;
  tokens: string[];
  correctOrder: string[];
  answer: string;
  feedback: string;
}

export interface ReadingQuestion {
  id: string;
  prompt: string;
  options: Array<{ id: string; label: string }>;
  correctOptionId: string;
  feedback: string;
  conceptIds: ConceptId[];
}

export interface ReadingBlock extends BlockBase {
  type: "reading";
  eyebrow?: string;
  heading: string;
  instructions: string;
  sentences: Array<{ id: string; text: string; translation: string }>;
  questions: ReadingQuestion[];
}

export interface FillBlock extends BlockBase {
  type: "fill";
  eyebrow?: string;
  heading: string;
  prompt: string;
  items: Array<{
    id: string;
    before: string;
    after: string;
    accepted: string[];
    answer: string;
    conceptIds: ConceptId[];
    feedback: string;
  }>;
}

export interface StoryFillBlank {
  type: "blank";
  id: string;
  answer: string;
  accepted: string[];
  infinitive: string;
  conceptIds: ConceptId[];
  feedback: string;
}

export interface StoryFillText {
  type: "text";
  text: string;
}

export interface StoryFillBlock extends BlockBase {
  type: "story-fill";
  eyebrow?: string;
  heading: string;
  prompt: string;
  verses: Array<{
    number: number;
    parts: Array<StoryFillText | StoryFillBlank>;
  }>;
  sourceNote: string;
  sourceHref: string;
}

export interface FreeWriteBlock extends BlockBase {
  type: "free-write";
  eyebrow?: string;
  heading: string;
  prompt: string;
  requirements: string[];
  example: string;
  minimumCharacters: number;
  evaluation?: {
    minimumIdeas: number;
    requiredGroups: Array<{
      accepted: string[];
      missingFeedback: string;
    }>;
    successFeedback: string;
  };
}

export interface SummaryBlock extends BlockBase {
  type: "summary";
  eyebrow?: string;
  heading: string;
  message: string;
  ideas: Array<{ label: string; question: string; uses: string[] }>;
}

export type LessonBlock =
  | ProseBlock
  | ComparisonBlock
  | ChoiceBlock
  | SortBlock
  | BuilderBlock
  | ReadingBlock
  | FillBlock
  | StoryFillBlock
  | FreeWriteBlock
  | SummaryBlock;

export interface LessonDefinition {
  id: string;
  moduleId: string;
  title: string;
  displayTitle: string;
  dek: string;
  goal: string;
  durationMinutes: number;
  concepts: ConceptId[];
  blocks: LessonBlock[];
  completion: {
    title: string;
    message: string;
    reviewTitle?: string;
    reviewMessage?: string;
  };
  experience?: {
    kind: "lesson" | "checkpoint";
    contextLabel: string;
    openingMarker: string;
    returnHref: string;
    returnLabel: string;
    grading?: {
      pointsPerQuestion: number;
      passingPercentage: number;
    };
  };
}
