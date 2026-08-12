import type { ConceptId } from "@/content/schemas";

export type CourseStageId = "start" | "stage-1" | "stage-2" | "stage-3" | "stage-4";

export interface CourseCatalogLesson {
  id: string;
  title: string;
  durationMinutes?: number;
}

export interface CourseCatalogModule {
  number: number;
  stageId: CourseStageId;
  stageLabel: string;
  title: string;
  description: string;
  objective: string;
  concepts: ConceptId[];
  lessons: CourseCatalogLesson[];
  checkpointAfter?: string;
  available: boolean;
}

export interface CourseStage {
  id: CourseStageId;
  label: string;
  title: string;
  description: string;
  moduleNumbers: number[];
}

const defineModule = (
  number: number,
  stageId: CourseStageId,
  stageLabel: string,
  title: string,
  description: string,
  objective: string,
  concepts: ConceptId[],
  lessons: Array<[string, string, number?]>,
  options: { checkpointAfter?: string; available?: boolean } = {},
): CourseCatalogModule => ({
  number,
  stageId,
  stageLabel,
  title,
  description,
  objective,
  concepts,
  lessons: lessons.map(([id, lessonTitle, durationMinutes]) => ({ id, title: lessonTitle, durationMinutes })),
  checkpointAfter: options.checkpointAfter,
  available: options.available ?? true,
});

export const courseModules: CourseCatalogModule[] = [
  defineModule(0, "start", "Start Here", "How Spanish works", "Train your ear, learn the sound system, and complete a first short conversation before grammar begins.", "Read and pronounce predictable Spanish, then enter a simple exchange with a reliable learning routine.", ["learning_cycle", "spanish_vowels", "spanish_consonants", "stress_rules", "accent_marks", "greeting_chunks"], [
    ["0.1", "How to Learn with Nexo", 18],
    ["0.2", "Hear the Five Vowels", 20],
    ["0.3", "Sounds English Speakers Miss", 22],
    ["0.4", "Stress, Accents & Spelling", 24],
    ["0.5", "Your First Conversation", 22],
  ]),
  defineModule(1, "stage-1", "Stage I · Build Spanish", "Nouns, gender & articles", "Understand how Spanish packages people and things into noun phrases.", "Choose gender, number, and articles from the noun phrase you mean to build.", ["noun_gender", "gender_patterns", "articles_indefinite", "articles_definite", "noun_number", "noun_phrase"], [
    ["1.1", "Why Spanish Nouns Have Gender", 24],
    ["1.2", "Gender Patterns Without Guessing", 25],
    ["1.3", "Un, Una, Los & Las", 26],
    ["1.4", "Build Your First Noun Phrases", 26],
  ]),
  defineModule(2, "stage-1", "Stage I · Build Spanish", "Description & agreement", "Make descriptions fit the nouns they describe.", "Build descriptions whose adjective form, number, and position express the intended meaning.", ["adjective_function", "adjective_gender", "adjective_number", "adjective_position", "adjective_agreement"], [
    ["2.1", "How Adjectives Work", 24],
    ["2.2", "Gender Agreement", 25],
    ["2.3", "Plural Agreement", 25],
    ["2.4", "Spanish Word Order", 26],
  ]),
  defineModule(3, "stage-1", "Stage I · Build Spanish", "People & identity", "Name the people in a sentence and use ser to say who they are.", "Identify subjects and express identity, origin, profession, nationality, and relationships with ser.", ["subject_pronouns", "ser_forms", "ser_identity", "ser_classification", "ser_origin", "profession_article", "nationality_agreement", "relationships"], [
    ["3.1", "Who Is Doing It?", 24],
    ["3.2", "SER: Identity", 27],
    ["3.3", "Who You Are", 25],
    ["3.4", "Where You Are From", 25],
    ["3.5", "Professions, Nationality & Relationships", 29],
  ]),
  defineModule(4, "stage-1", "Stage I · Build Spanish", "States, places & existence", "Choose the Spanish verb from the meaning you want to express—not from a shortcut.", "Choose between ser, estar, and hay from the job the sentence is doing.", ["estar_forms", "estar_state", "estar_location", "ser_vs_estar_selection", "ser_estar_meaning_change", "hay_existence", "hay_vs_estar"], [
    ["4.1", "ESTAR: How and Where", 26],
    ["4.2", "Where Things Are", 24],
    ["4.3", "SER vs. ESTAR", 28],
    ["4.4", "When SER and ESTAR Change Meaning", 25],
    ["4.5", "HAY vs. ESTAR", 27],
  ], { checkpointAfter: "Stage I Checkpoint" }),
  defineModule(5, "stage-2", "Stage II · Use Spanish", "Questions", "Turn statements into useful information-seeking questions.", "Ask clear questions with natural word order and the right question word.", ["question_structure", "question_words_identity", "question_words_context", "question_reason_quantity"], [
    ["5.1", "How Spanish Questions Work", 24], ["5.2", "What, Who & Which", 25], ["5.3", "Where, When & How", 24], ["5.4", "Why & How Much", 25], ["5.5", "Building Real Questions", 27],
  ]),
  defineModule(6, "stage-2", "Stage II · Use Spanish", "Numbers, dates & time", "Handle the quantities and schedules everyday plans depend on.", "Understand and state useful numbers, dates, clock times, and everyday time expressions.", ["numbers_basic", "numbers_large", "dates_calendar", "clock_time", "time_expressions"], [
    ["6.1", "Numbers You Actually Need", 24], ["6.2", "Bigger Numbers", 25], ["6.3", "Dates & Calendar", 25], ["6.4", "Telling Time", 26], ["6.5", "Everyday Time", 25],
  ]),
  defineModule(7, "stage-2", "Stage II · Use Spanish", "Present tense", "Turn infinitives into present actions with regular verb patterns.", "Describe present actions with regular AR, ER, and IR verbs, including negation.", ["infinitive_structure", "present_ar", "present_er", "present_ir", "present_negation", "present_sentence"], [
    ["7.1", "What an Infinitive Is", 24], ["7.2", "AR Verbs", 27], ["7.3", "ER Verbs", 26], ["7.4", "IR Verbs", 25], ["7.5", "Negating Actions", 24], ["7.6", "Building Present-Tense Sentences", 28],
  ]),
  defineModule(8, "stage-2", "Stage II · Use Spanish", "Essential irregular verbs", "Control the high-frequency verbs that organize real conversation.", "Use essential irregular and stem-changing verbs in present-time messages.", ["stem_change", "querer_poder", "tener_expressions", "hacer_poner", "venir_salir_oir", "saber_conocer"], [
    ["8.1", "Stem Changes", 27], ["8.2", "QUERER & PODER", 27], ["8.3", "TENER and Common Expressions", 27], ["8.4", "HACER & PONER", 26], ["8.5", "VENIR, SALIR & OÍR", 27], ["8.6", "SABER vs. CONOCER", 28],
  ]),
  defineModule(9, "stage-2", "Stage II · Use Spanish", "Plans & useful patterns", "Combine verbs into efficient patterns for plans, needs, and purposes.", "Express future plans, obligations, purposes, and elapsed time with reusable verb patterns.", ["ir_forms", "near_future", "tener_que", "verb_patterns", "para_infinitive", "hace_time"], [
    ["9.1", "IR", 25], ["9.2", "The Near Future", 26], ["9.3", "TENER QUE", 25], ["9.4", "High-Value Verb Patterns", 27], ["9.5", "PARA + Infinitive", 24], ["9.6", "Time Expressions with HACER", 27],
  ], { checkpointAfter: "Stage II Checkpoint" }),
  defineModule(10, "stage-3", "Stage III · Connect Spanish", "Direct objects", "Replace repeated objects without losing who receives the action.", "Recognize direct objects, use the personal a, and place direct object pronouns correctly.", ["direct_objects", "personal_a", "direct_object_pronouns", "object_pronoun_position"], [
    ["10.1", "What Is an Object?", 25], ["10.2", "The Personal A", 26], ["10.3", "Direct Object Pronouns", 27], ["10.4", "Where Pronouns Go", 27],
  ]),
  defineModule(11, "stage-3", "Stage III · Connect Spanish", "Indirect objects & GUSTAR", "Express who benefits, receives, or experiences a reaction.", "Use indirect object pronouns and understand the sentence structure behind gustar.", ["indirect_objects", "indirect_object_pronouns", "gustar_structure", "gusta_gustan", "gustar_verbs"], [
    ["11.1", "To Whom?", 25], ["11.2", "Indirect Object Pronouns", 27], ["11.3", "How GUSTAR Really Works", 28], ["11.4", "GUSTA vs. GUSTAN", 26], ["11.5", "Verbs Like GUSTAR", 28],
  ]),
  defineModule(12, "stage-3", "Stage III · Connect Spanish", "Reflexive Spanish", "Describe routines, changes, and reciprocal actions.", "Place reflexive pronouns and use them for routines, emotions, changes, and reciprocal meaning.", ["reflexive_pronouns", "daily_routine", "reflexive_position", "reflexive_change", "reciprocal_reflexive"], [
    ["12.1", "Doing Something to Yourself", 26], ["12.2", "Daily Routine", 28], ["12.3", "Reflexive Pronoun Position", 26], ["12.4", "Emotions & Changes", 27], ["12.5", "Each Other", 26],
  ]),
  defineModule(13, "stage-3", "Stage III · Connect Spanish", "Negatives, prepositions & connections", "Connect clauses while controlling common negative and relational patterns.", "Build natural negatives, use core prepositions, and connect related thoughts.", ["negative_words", "double_negation", "core_prepositions", "sequence_prepositions", "clause_connectors"], [
    ["13.1", "Spanish Negatives", 26], ["13.2", "Double Negatives", 26], ["13.3", "Core Prepositions", 28], ["13.4", "Before, After & Instead Of", 26], ["13.5", "Connecting Thoughts", 28],
  ]),
  defineModule(14, "stage-3", "Stage III · Connect Spanish", "The present subjunctive", "Express reactions, influence, doubt, and evaluation across connected clauses.", "Form the present subjunctive and use it after high-value triggers and connectors.", ["subjunctive_purpose", "subjunctive_forms", "subjunctive_influence", "subjunctive_reactions", "subjunctive_connectors"], [
    ["14.1", "Why the Subjunctive Exists", 28], ["14.2", "Forming the Present Subjunctive", 30], ["14.3", "Wants & Influence", 29], ["14.4", "Emotion, Doubt & Evaluation", 30], ["14.5", "High-Value Connectors", 30],
  ], { checkpointAfter: "Stage III Checkpoint" }),
  defineModule(15, "stage-4", "Stage IV · Tell Stories", "The preterite", "Tell a sequence of finished past events.", "Form regular and essential irregular preterites and use them to narrate what happened.", ["preterite_function", "preterite_ar", "preterite_er_ir", "preterite_irregular", "preterite_spelling", "preterite_narration"], [
    ["15.1", "Finished Events", 27], ["15.2", "Regular Preterite: AR", 28], ["15.3", "Regular Preterite: ER/IR", 28], ["15.4", "Essential Irregular Preterites", 31], ["15.5", "Spelling & Stem Changes", 29], ["15.6", "Telling What Happened", 32],
  ]),
  defineModule(16, "stage-4", "Stage IV · Tell Stories", "The imperfect & past narration", "Create a past world, then move events through it.", "Combine imperfect background with preterite events and coordinate pronouns in a complete story.", ["imperfect_function", "imperfect_forms", "imperfect_description", "imperfect_habit", "preterite_imperfect", "combined_pronouns", "past_narration"], [
    ["16.1", "The Other Past Tense", 28], ["16.2", "Forming the Imperfect", 29], ["16.3", "What Things Used to Be Like", 29], ["16.4", "Habits & Ongoing Background", 28], ["16.5", "Preterite vs. Imperfect", 32], ["16.6", "Pronouns Working Together", 30], ["16.7", "Tell a Story", 35],
  ], { checkpointAfter: "Stage IV Checkpoint" }),
];

export const courseStages: CourseStage[] = [
  { id: "start", label: "Orientation", title: "Start Here", description: "Learn how Spanish sounds and how Nexo turns noticing into independent production.", moduleNumbers: [0] },
  { id: "stage-1", label: "Stage I", title: "Build Spanish", description: "Build accurate noun phrases, descriptions, identity, states, places, and existence.", moduleNumbers: [1, 2, 3, 4] },
  { id: "stage-2", label: "Stage II", title: "Use Spanish", description: "Ask, count, act, plan, and use the present tense in practical messages.", moduleNumbers: [5, 6, 7, 8, 9] },
  { id: "stage-3", label: "Stage III", title: "Connect Spanish", description: "Coordinate objects, reactions, routines, relationships, and complex clauses.", moduleNumbers: [10, 11, 12, 13, 14] },
  { id: "stage-4", label: "Stage IV", title: "Tell Stories", description: "Narrate completed events and the background that gives them meaning.", moduleNumbers: [15, 16] },
];

export const builtCourseModules = courseModules.filter((item) => item.available);
export const builtLessonIds = builtCourseModules.flatMap((item) => item.lessons.map((lesson) => lesson.id));

export function getCourseModule(number: number) {
  return courseModules.find((item) => item.number === number);
}

export function getCourseLesson(id: string) {
  for (const item of courseModules) {
    const lesson = item.lessons.find((candidate) => candidate.id === id);
    if (lesson) return { module: item, lesson };
  }
  return undefined;
}
