import type { ConceptId } from "@/content/schemas";

export type LibraryCategory =
  | "Pronunciation"
  | "Building Spanish"
  | "Choosing meaning"
  | "Questions & time"
  | "Using verbs"
  | "Connecting Spanish"
  | "Telling stories";

export interface LibraryExample {
  text: string;
  translation: string;
  note?: string;
}

export interface LibraryStep {
  label: string;
  title: string;
  description: string;
  examples?: LibraryExample[];
}

export type LibrarySection =
  | {
      type: "text";
      eyebrow?: string;
      heading: string;
      paragraphs: string[];
      examples?: LibraryExample[];
    }
  | {
      type: "steps";
      eyebrow?: string;
      heading: string;
      introduction?: string;
      steps: LibraryStep[];
    }
  | {
      type: "comparison";
      eyebrow?: string;
      heading: string;
      introduction?: string;
      sides: Array<{
        label: string;
        question: string;
        description: string;
        examples: LibraryExample[];
      }>;
      note?: string;
    }
  | {
      type: "check";
      eyebrow?: string;
      heading: string;
      prompt: string;
      answer: string;
      explanation: string;
      example?: LibraryExample;
    };

export interface LibraryEntry {
  slug: string;
  category: LibraryCategory;
  title: string;
  summary: string;
  shortAnswer: string;
  readMinutes: number;
  moduleNumbers: number[];
  lessonIds: string[];
  conceptIds: ConceptId[];
  searchTerms: string[];
  sections: LibrarySection[];
  relatedSlugs: string[];
}

interface CourseGuideSeed extends Omit<LibraryEntry, "sections"> {
  explanation: [string, string];
  steps: Array<{ title: string; description: string }>;
  examples: LibraryExample[];
  check: { prompt: string; answer: string; explanation: string };
}

function createCourseGuide(seed: CourseGuideSeed): LibraryEntry {
  return {
    ...seed,
    sections: [
      {
        type: "text",
        eyebrow: "The useful model",
        heading: "Start with meaning, then choose the form.",
        paragraphs: seed.explanation,
        examples: seed.examples,
      },
      {
        type: "steps",
        eyebrow: "Decision routine",
        heading: "Work through the message in a dependable order.",
        steps: seed.steps.map((step, index) => ({ label: String(index + 1).padStart(2, "0"), ...step })),
      },
      {
        type: "check",
        eyebrow: "Check the idea",
        heading: "Can you explain the decision?",
        ...seed.check,
        example: seed.examples[0],
      },
    ],
  };
}

const courseReferenceEntries: LibraryEntry[] = [
  createCourseGuide({
    slug: "spanish-questions", category: "Questions & time", title: "Building useful Spanish questions",
    summary: "Choose a question structure from the information you actually need.",
    shortAnswer: "Spanish does not need an equivalent of English do or does. Begin with a complete Spanish idea, frame it as a question, and add qué, quién, cuál, dónde, cuándo, cómo, por qué, or cuánto only when that missing information calls for it.",
    readMinutes: 7, moduleNumbers: [5], lessonIds: ["5.1", "5.2", "5.3", "5.4", "5.5"],
    conceptIds: ["question_structure", "question_words_identity", "question_words_context", "question_reason_quantity"],
    searchTerms: ["questions", "question words", "qué", "quién", "cuál", "dónde", "cuándo", "cómo", "por qué", "cuánto"],
    explanation: [
      "A question is an information job. Yes-or-no questions ask whether a complete idea is true; information questions replace one missing part of that idea with a precise question word.",
      "Build from Spanish instead of translating English word order. Trabajas aquí can become ¿Trabajas aquí? without adding a helper verb, while ¿Dónde trabajas? replaces the unknown place with dónde.",
    ],
    steps: [
      { title: "Name the missing information", description: "Decide whether you need confirmation, a person, a thing, a choice, a place, a time, a manner, a reason, or a quantity." },
      { title: "Choose the question frame", description: "Use question marks for confirmation or place the matching accented question word at the front." },
      { title: "Keep a real Spanish verb", description: "Conjugate the verb for its subject and do not invent a translation of English do or does." },
    ],
    examples: [{ text: "¿Trabajas aquí?", translation: "Do you work here?" }, { text: "¿Dónde estudias?", translation: "Where do you study?" }, { text: "¿Por qué aprendes español?", translation: "Why are you learning Spanish?" }],
    check: { prompt: "You want to ask which class a friend prefers from several options. Should you use qué or cuál?", answer: "Use cuál: ¿Cuál prefieres?", explanation: "Cuál asks the listener to identify or select one possibility from a known set." },
    relatedSlugs: ["numbers-dates-time", "present-tense"],
  }),
  createCourseGuide({
    slug: "numbers-dates-time", category: "Questions & time", title: "Numbers, dates & clock time",
    summary: "Build quantities and schedules in the order Spanish listeners expect.",
    shortAnswer: "Build large numbers in groups, state dates as el + day + de + month, and use es la una only for one o’clock but son las with every other hour. Add de la mañana, de la tarde, or de la noche when the part of day matters.",
    readMinutes: 8, moduleNumbers: [6], lessonIds: ["6.1", "6.2", "6.3", "6.4", "6.5"],
    conceptIds: ["numbers_basic", "numbers_large", "dates_calendar", "clock_time", "time_expressions"],
    searchTerms: ["numbers", "dates", "calendar", "time", "clock", "hour", "minutes", "morning", "night"],
    explanation: [
      "Quantities become easier when you hear their groups instead of treating every digit separately. Calendar dates and clock times also use reusable frames, so the structure can remain stable while the information changes.",
      "Time has one important agreement contrast: la una is singular, while las dos, las tres, and every later hour are plural. A time answer uses es or son because the hour itself controls that choice.",
    ],
    steps: [
      { title: "Identify the kind of information", description: "Separate a quantity from a calendar date, a clock reading, or a broader time expression." },
      { title: "Build the fixed frame", description: "Use el … de … for dates and es la / son las for clock time before adding details." },
      { title: "Add useful precision", description: "Attach minutes, a part of day, or a routine expression only after the central number is clear." },
    ],
    examples: [{ text: "Son las dos y cuarto.", translation: "It is 2:15." }, { text: "Hoy es el doce de agosto.", translation: "Today is August 12." }, { text: "La clase es por la mañana.", translation: "The class is in the morning." }],
    check: { prompt: "The clock shows 1:30. Do you begin with es la or son las?", answer: "Begin with es la: Es la una y media.", explanation: "One o’clock is grammatically singular; the plural frame begins at two." },
    relatedSlugs: ["spanish-questions", "present-tense"],
  }),
  createCourseGuide({
    slug: "present-tense", category: "Using verbs", title: "The regular present tense",
    summary: "Turn an infinitive into a present action without losing the verb family.",
    shortAnswer: "Remove -ar, -er, or -ir to find the stem, then add the ending for the subject. AR, ER, and IR verbs share several person markers, but their family vowel matters. Put no immediately before the conjugated verb to negate the action.",
    readMinutes: 8, moduleNumbers: [7], lessonIds: ["7.1", "7.2", "7.3", "7.4", "7.5", "7.6"],
    conceptIds: ["infinitive_structure", "present_ar", "present_er", "present_ir", "present_negation", "present_sentence"],
    searchTerms: ["present tense", "ar verbs", "er verbs", "ir verbs", "conjugation", "infinitive", "negation", "no"],
    explanation: [
      "An infinitive names an action; a conjugated verb anchors that action to a person in the present. The ending carries enough subject information that Spanish can often omit the subject pronoun.",
      "Do not memorize each form as an unrelated word. Keep the stem visible, identify the verb family, and select the ending from both the family and the subject. Then attach objects and context around that finished verb.",
    ],
    steps: [
      { title: "Find the infinitive family", description: "Identify -ar, -er, or -ir before removing the ending to expose the stem." },
      { title: "Match the subject", description: "Choose the present ending that belongs to both the person and the verb family." },
      { title: "Build the complete message", description: "Place no before the conjugated verb when needed, then add what, where, when, or with whom." },
    ],
    examples: [{ text: "Trabajo en la biblioteca.", translation: "I work in the library." }, { text: "Comemos a la una.", translation: "We eat at one." }, { text: "No viven aquí.", translation: "They do not live here." }],
    check: { prompt: "Build we live from vivir. Which form keeps the IR family and matches nosotros?", answer: "Vivimos.", explanation: "Remove -ir to find viv- and add the nosotros IR ending -imos." },
    relatedSlugs: ["essential-irregular-verbs", "plans-and-verb-patterns"],
  }),
  createCourseGuide({
    slug: "essential-irregular-verbs", category: "Using verbs", title: "Essential present-tense irregulars",
    summary: "Control stem changes and the high-frequency verbs that do not fit one regular pattern.",
    shortAnswer: "Irregularity can live in one form, in a stressed stem, or across the whole verb. Learn the smallest true pattern: stem-changing verbs preserve regular endings, many verbs have a special yo form, and pairs such as saber/conocer divide meaning rather than grammar alone.",
    readMinutes: 9, moduleNumbers: [8], lessonIds: ["8.1", "8.2", "8.3", "8.4", "8.5", "8.6"],
    conceptIds: ["stem_change", "querer_poder", "tener_expressions", "hacer_poner", "venir_salir_oir", "saber_conocer"],
    searchTerms: ["irregular verbs", "stem change", "querer", "poder", "tener", "hacer", "poner", "venir", "salir", "oír", "saber", "conocer"],
    explanation: [
      "Irregular does not mean random. Querer and poder change their stressed stem vowel but keep regular present endings; tener, hacer, poner, venir, salir, and oír reveal smaller form-specific patterns worth naming directly.",
      "Meaning can create a second decision. Saber refers to facts, information, and knowing how; conocer refers to familiarity with a person, place, or thing. The most useful habit is to identify both the form pattern and the message job.",
    ],
    steps: [
      { title: "Locate the irregularity", description: "Ask whether the change belongs to the stressed stem, only the yo form, or the whole present paradigm." },
      { title: "Preserve what remains regular", description: "Keep the expected ending whenever the pattern changes only the stem or yo form." },
      { title: "Check the intended meaning", description: "For verbs with a contrast, choose from the relationship expressed rather than from a one-word translation." },
    ],
    examples: [{ text: "Quiero aprender.", translation: "I want to learn." }, { text: "Tengo veinte años.", translation: "I am twenty years old." }, { text: "Conozco a tu profesora.", translation: "I know your professor." }],
    check: { prompt: "You know where the library is. Should the sentence use saber or conocer?", answer: "Use saber: Sé dónde está la biblioteca.", explanation: "The sentence expresses known information, not familiarity with the library as a place." },
    relatedSlugs: ["present-tense", "plans-and-verb-patterns"],
  }),
  createCourseGuide({
    slug: "plans-and-verb-patterns", category: "Using verbs", title: "Plans, obligations & verb patterns",
    summary: "Combine one conjugated verb with an infinitive to express plans, needs, and purposes.",
    shortAnswer: "In a two-verb message with one subject, conjugate the first verb and keep the second action infinitive. Preserve the connector a in ir a, que in tener que, and para before an infinitive purpose; verbs such as querer, poder, necesitar, preferir, and deber connect directly.",
    readMinutes: 9, moduleNumbers: [9], lessonIds: ["9.1", "9.2", "9.3", "9.4", "9.5", "9.6"],
    conceptIds: ["ir_forms", "near_future", "tener_que", "verb_patterns", "para_infinitive", "hace_time"],
    searchTerms: ["plans", "future", "ir a", "tener que", "obligation", "infinitive", "purpose", "para", "hace", "duration"],
    explanation: [
      "Spanish creates efficient messages by letting one conjugated verb frame another action: Voy a estudiar, tengo que trabajar, and quiero descansar. The first form identifies the subject and adds planning, obligation, desire, ability, need, or preference.",
      "The connector belongs to the pattern, not to the English translation. Learn ir a and tener que as complete frames, while querer, poder, necesitar, preferir, and deber take an infinitive directly. Para + infinitive names the goal of another action.",
    ],
    steps: [
      { title: "Choose the relationship", description: "Name whether the second action is a plan, obligation, desire, ability, preference, need, or purpose." },
      { title: "Conjugate the framing verb", description: "Match ir, tener, querer, poder, or another first verb to the person responsible for the message." },
      { title: "Preserve the frame", description: "Keep a or que when the pattern requires it, and leave the second action in the infinitive." },
    ],
    examples: [{ text: "Voy a estudiar mañana.", translation: "I am going to study tomorrow." }, { text: "Tenemos que salir temprano.", translation: "We have to leave early." }, { text: "Practico para hablar mejor.", translation: "I practice to speak better." }],
    check: { prompt: "Ana plans to work tomorrow. Should trabajar be conjugated after va a?", answer: "No: Ana va a trabajar mañana.", explanation: "Va already carries the subject and present form; the planned action remains the infinitive trabajar." },
    relatedSlugs: ["essential-irregular-verbs", "direct-object-pronouns"],
  }),
  createCourseGuide({
    slug: "direct-object-pronouns", category: "Connecting Spanish", title: "Direct objects & pronoun position",
    summary: "Replace a known receiver of an action without losing its identity or position.",
    shortAnswer: "A direct object answers whom or what the verb affects. Replace a known object with lo, la, los, or las; use the personal a before a specific human direct object. Put the pronoun before a conjugated verb or attach it to an infinitive.",
    readMinutes: 8, moduleNumbers: [10], lessonIds: ["10.1", "10.2", "10.3", "10.4"],
    conceptIds: ["direct_objects", "personal_a", "direct_object_pronouns", "object_pronoun_position"],
    searchTerms: ["direct object", "object pronouns", "lo", "la", "los", "las", "personal a", "pronoun position"],
    explanation: [
      "The direct object receives the action directly: Leo el libro. Once el libro is identifiable, Lo leo prevents unnecessary repetition. The pronoun matches the object it replaces, not the subject performing the action.",
      "A specific human object normally receives the personal a: Veo a Ana. That a marks the person’s role but does not turn the direct object into an indirect one. Position then depends on the verb unit in front of you.",
    ],
    steps: [
      { title: "Find the affected person or thing", description: "Ask what or whom the action reaches directly; do not choose a pronoun from the subject." },
      { title: "Match the replacement", description: "Use lo, la, los, or las according to the known object’s gender and number." },
      { title: "Choose an outer edge", description: "Place the pronoun before a conjugated verb or attach it to an infinitive in a two-verb unit." },
    ],
    examples: [{ text: "Lo leo cada día.", translation: "I read it every day." }, { text: "Veo a Ana.", translation: "I see Ana." }, { text: "La voy a llamar.", translation: "I am going to call her." }],
    check: { prompt: "You already identified la película and want to say I watch it. Which pronoun replaces it?", answer: "Use la: La veo.", explanation: "La matches the feminine singular object la película and stands before the conjugated verb veo." },
    relatedSlugs: ["plans-and-verb-patterns", "gustar-and-indirect-objects"],
  }),
  createCourseGuide({
    slug: "gustar-and-indirect-objects", category: "Connecting Spanish", title: "Indirect objects & GUSTAR",
    summary: "Track recipients and experiencers with me, te, le, nos, and les.",
    shortAnswer: "An indirect object identifies who receives, benefits, or experiences. With gustar, that person appears through an indirect object pronoun, while the pleasing thing controls gusta or gustan: Me gusta el libro; me gustan los libros.",
    readMinutes: 9, moduleNumbers: [11], lessonIds: ["11.1", "11.2", "11.3", "11.4", "11.5"],
    conceptIds: ["indirect_objects", "indirect_object_pronouns", "gustar_structure", "gusta_gustan", "gustar_verbs"],
    searchTerms: ["indirect object", "gustar", "gusta", "gustan", "me", "te", "le", "nos", "les", "likes"],
    explanation: [
      "Indirect object pronouns keep the recipient or experiencer inside the verb phrase: Le doy el libro a Ana. The phrase a Ana can clarify le, but the pronoun remains part of the normal structure.",
      "Gustar reverses the English perspective. The Spanish sentence presents a thing as pleasing to someone, so the pleasing thing is the subject and determines singular gusta or plural gustan. The person who experiences the reaction is me, te, le, nos, or les.",
    ],
    steps: [
      { title: "Identify the experiencer or recipient", description: "Choose me, te, le, nos, or les from the person receiving something or having the reaction." },
      { title: "Find what controls the verb", description: "With gustar, look after the verb to see whether one thing, many things, or an infinitive is pleasing." },
      { title: "Clarify when useful", description: "Add a + person to remove ambiguity or create emphasis without dropping the indirect object pronoun." },
    ],
    examples: [{ text: "Le doy el libro a Ana.", translation: "I give the book to Ana." }, { text: "Me gusta bailar.", translation: "I like dancing." }, { text: "Nos gustan estas clases.", translation: "We like these classes." }],
    check: { prompt: "Several books are pleasing to Ana. Does the verb use gusta or gustan?", answer: "Use gustan: A Ana le gustan los libros.", explanation: "Los libros is the plural grammatical subject, while le identifies Ana as the experiencer." },
    relatedSlugs: ["direct-object-pronouns", "reflexive-spanish"],
  }),
  createCourseGuide({
    slug: "reflexive-spanish", category: "Connecting Spanish", title: "Reflexive routines, changes & reciprocity",
    summary: "Use reflexive pronouns when an action returns to its subject or moves within a group.",
    shortAnswer: "Match me, te, se, nos, or se to the subject when the action returns to that same person. Place it before a conjugated verb or attach it to an infinitive. With plural subjects, the same structure can express each other when the context makes reciprocity clear.",
    readMinutes: 8, moduleNumbers: [12], lessonIds: ["12.1", "12.2", "12.3", "12.4", "12.5"],
    conceptIds: ["reflexive_pronouns", "daily_routine", "reflexive_position", "reflexive_change", "reciprocal_reflexive"],
    searchTerms: ["reflexive", "me", "te", "se", "nos", "routine", "each other", "reciprocal", "pronoun position"],
    explanation: [
      "A reflexive pronoun links the receiver of the action back to its subject: Me preparo means I prepare myself, while Preparo la comida sends the action toward a different object. The pronoun is evidence about the relationship, not decoration attached to the verb.",
      "Reflexive Spanish also describes entry into a state—se enoja, se alegra—and reciprocal action with plural subjects—nos ayudamos. Context tells whether the people act on themselves individually or on one another.",
    ],
    steps: [
      { title: "Compare the subject and receiver", description: "Use a reflexive form only when the action returns to the subject or circulates among members of a plural subject." },
      { title: "Match the pronoun", description: "Coordinate me, te, se, nos, or se with the subject before conjugating the action." },
      { title: "Place the unit", description: "Put the pronoun before a conjugated verb or attach it to an infinitive at the outer edge of the verb unit." },
    ],
    examples: [{ text: "Me preparo por la mañana.", translation: "I get ready in the morning." }, { text: "Vamos a levantarnos temprano.", translation: "We are going to get up early." }, { text: "Nos ayudamos.", translation: "We help each other." }],
    check: { prompt: "We are going to get ready. Can nos stand before vamos or attach to preparar?", answer: "Both work: Nos vamos a preparar or Vamos a prepararnos.", explanation: "A two-verb unit gives the reflexive pronoun two valid outer-edge positions." },
    relatedSlugs: ["gustar-and-indirect-objects", "negatives-prepositions-connectors"],
  }),
  createCourseGuide({
    slug: "negatives-prepositions-connectors", category: "Connecting Spanish", title: "Negatives, prepositions & connectors",
    summary: "Make the relationship between actions, people, places, and ideas explicit.",
    shortAnswer: "Spanish can place one negative word before the verb or reinforce no with a negative word after it. Prepositions such as a, de, en, con, por, and para encode relationships rather than fixed English translations, while connectors show sequence, contrast, cause, and result between clauses.",
    readMinutes: 9, moduleNumbers: [13], lessonIds: ["13.1", "13.2", "13.3", "13.4", "13.5"],
    conceptIds: ["negative_words", "double_negation", "core_prepositions", "sequence_prepositions", "clause_connectors"],
    searchTerms: ["negatives", "double negative", "nadie", "nada", "nunca", "prepositions", "por", "para", "connectors", "porque", "pero"],
    explanation: [
      "Spanish negative agreement is systematic: Nadie viene places the negative word before the verb, while No viene nadie places no before the verb and reinforces it afterward. Both express one negative meaning.",
      "Prepositions and connectors name relationships. Choose them from source, destination, location, company, cause, purpose, sequence, contrast, or consequence—not from an isolated English word that may cover several Spanish relationships.",
    ],
    steps: [
      { title: "Name the relationship", description: "Decide whether the message needs negation, movement, origin, location, company, cause, purpose, sequence, contrast, or result." },
      { title: "Choose the Spanish frame", description: "Use the position and connector that normally express that relationship, including negative agreement when a negative follows the verb." },
      { title: "Read the complete clause", description: "Confirm that the connector joins two ideas logically instead of merely translating the nearest English word." },
    ],
    examples: [{ text: "No conozco a nadie aquí.", translation: "I do not know anyone here." }, { text: "Estudio para aprender.", translation: "I study in order to learn." }, { text: "Quiero ir, pero tengo que trabajar.", translation: "I want to go, but I have to work." }],
    check: { prompt: "You place nadie after the verb. Does the sentence also need no before the verb?", answer: "Yes: No veo a nadie.", explanation: "A negative word after the verb normally participates in Spanish negative agreement with no before the verb." },
    relatedSlugs: ["reflexive-spanish", "present-subjunctive"],
  }),
  createCourseGuide({
    slug: "present-subjunctive", category: "Connecting Spanish", title: "The present subjunctive",
    summary: "Present one action through another person’s desire, reaction, doubt, or evaluation.",
    shortAnswer: "The subjunctive usually appears when one clause frames another through influence, emotion, doubt, evaluation, or a pending condition. Form it from the present yo stem: remove -o, then use the opposite family vowel—AR verbs take e endings; ER and IR verbs take a endings.",
    readMinutes: 10, moduleNumbers: [14], lessonIds: ["14.1", "14.2", "14.3", "14.4", "14.5"],
    conceptIds: ["subjunctive_purpose", "subjunctive_forms", "subjunctive_influence", "subjunctive_reactions", "subjunctive_connectors"],
    searchTerms: ["subjunctive", "present subjunctive", "wants", "emotion", "doubt", "evaluation", "cuando", "para que", "que"],
    explanation: [
      "The present subjunctive is not a synonym for uncertainty. It presents a second idea inside someone’s stance toward it: Quiero que vengas frames your coming as my desire, while Sé que vienes asserts your coming as information.",
      "A common trigger has two clauses, que, and a change of subject. High-value connectors can also frame an event as pending or intended. First recognize the relationship; only then form the verb from the present yo stem.",
    ],
    steps: [
      { title: "Find the two ideas", description: "Identify the main stance and the second action, checking whether the subject changes across que." },
      { title: "Name the stance", description: "Look for influence, desire, emotion, doubt, evaluation, purpose, or a pending connector rather than a plain assertion." },
      { title: "Build the form", description: "Start from the present yo form, remove -o, and add the opposite family endings with any spelling changes needed." },
    ],
    examples: [{ text: "Quiero que vengas.", translation: "I want you to come." }, { text: "Me alegra que estés aquí.", translation: "I am glad you are here." }, { text: "Te llamo cuando llegue.", translation: "I will call you when I arrive." }],
    check: { prompt: "I know that Ana works here. Is the second clause asserted or framed through doubt or reaction?", answer: "It is asserted, so use the indicative: Sé que Ana trabaja aquí.", explanation: "Saber in the affirmative presents the information as known rather than placing it inside a non-assertive stance." },
    relatedSlugs: ["negatives-prepositions-connectors", "preterite-tense"],
  }),
  createCourseGuide({
    slug: "preterite-tense", category: "Telling stories", title: "The preterite: finished events",
    summary: "Advance a story through bounded actions that occurred and ended.",
    shortAnswer: "Use the preterite when you present a past action as a complete whole or a step in an event sequence. Regular AR verbs use é, aste, ó, amos, aron; regular ER and IR verbs share í, iste, ió, imos, ieron. Essential irregular stems use their own compact ending set.",
    readMinutes: 10, moduleNumbers: [15], lessonIds: ["15.1", "15.2", "15.3", "15.4", "15.5", "15.6"],
    conceptIds: ["preterite_function", "preterite_ar", "preterite_er_ir", "preterite_irregular", "preterite_spelling", "preterite_narration"],
    searchTerms: ["preterite", "past tense", "finished events", "irregular preterite", "story", "narration", "completed action"],
    explanation: [
      "The preterite is a viewpoint: it packages an event as bounded and complete. A specific time can support that viewpoint, but the speaker’s decision to move the event line forward matters more than a list of signal words.",
      "Regular endings carry stress and person. Spelling changes preserve sound, while essential irregulars such as tuve, hice, fui, and dije use compact stems and a shared unaccented ending family. In narration, each preterite answers what happened next.",
    ],
    steps: [
      { title: "Choose the event viewpoint", description: "Ask whether the action is presented as a complete occurrence that advances the story." },
      { title: "Identify the verb pattern", description: "Use the regular AR or ER/IR ending set, or retrieve the essential irregular stem and its ending." },
      { title: "Connect the event line", description: "Order completed changes with time phrases and connectors so the listener can follow what happened next." },
    ],
    examples: [{ text: "Ayer trabajé hasta las cinco.", translation: "Yesterday I worked until five." }, { text: "Después comimos juntos.", translation: "Afterward we ate together." }, { text: "Luego Ana se fue a casa.", translation: "Then Ana went home." }],
    check: { prompt: "Ayer is complete and the speaker presents studying as one finished event. Which form of estudiar fits yo?", answer: "Estudié: Ayer estudié español.", explanation: "The regular AR preterite yo ending is accented -é, marking the event as completed." },
    relatedSlugs: ["present-subjunctive", "preterite-vs-imperfect"],
  }),
  createCourseGuide({
    slug: "preterite-vs-imperfect", category: "Telling stories", title: "Preterite vs. imperfect",
    summary: "Build the past world with the imperfect and move through its events with the preterite.",
    shortAnswer: "Use the imperfect to present open background, description, habits, and actions viewed in progress. Use the preterite to present bounded events as complete. The same real-world action can use either tense when the storyteller changes viewpoint.",
    readMinutes: 11, moduleNumbers: [16], lessonIds: ["16.1", "16.2", "16.3", "16.4", "16.5", "16.6", "16.7"],
    conceptIds: ["imperfect_function", "imperfect_forms", "imperfect_description", "imperfect_habit", "preterite_imperfect", "combined_pronouns", "past_narration"],
    searchTerms: ["imperfect", "preterite vs imperfect", "past tense", "used to", "was doing", "background", "story", "narration", "combined pronouns"],
    explanation: [
      "The imperfect opens a window inside a past situation: the weather, the setting, a repeated habit, or an action already in progress. The preterite views an event from outside as a complete boundary and often changes that scene.",
      "A strong story coordinates both layers. Describe what the world was like and what people were doing, then use the preterite for the arrival, discovery, decision, or other event that advances the narrative. Tense choice is a storytelling decision, not simply a property of the verb.",
    ],
    steps: [
      { title: "Decide what role the verb plays", description: "Separate scene, description, habit, and ongoing background from completed events on the main timeline." },
      { title: "Choose the viewpoint", description: "Use the imperfect to stay inside an open past situation and the preterite to bound an event as a whole." },
      { title: "Coordinate the story", description: "Let background create context, events create change, and pronouns keep known people and things connected across sentences." },
    ],
    examples: [{ text: "Hacía frío y llovía.", translation: "It was cold and it was raining." }, { text: "Caminábamos cuando llegó Ana.", translation: "We were walking when Ana arrived." }, { text: "Entonces le di el libro.", translation: "Then I gave the book to her." }],
    check: { prompt: "You are describing rain already in progress when Ana arrived. Which tense frames the rain, and which advances the arrival?", answer: "Use imperfect for llovía and preterite for llegó.", explanation: "The rain is open background; Ana’s arrival is the bounded event that changes the scene." },
    relatedSlugs: ["preterite-tense", "direct-object-pronouns"],
  }),
];

export const libraryEntries: LibraryEntry[] = [
  {
    slug: "spanish-vowels",
    category: "Pronunciation",
    title: "The five Spanish vowels",
    summary: "Hear and produce the stable vowel sounds that make Spanish spelling unusually dependable.",
    shortAnswer: "Spanish has five vowel letters—a, e, i, o, and u—and each stays close to one clear core sound. Keep the sound short and steady instead of adding the movement an English vowel may invite.",
    readMinutes: 5,
    moduleNumbers: [0],
    lessonIds: ["0.2"],
    conceptIds: ["spanish_vowels"],
    searchTerms: ["a e i o u", "vowels", "pronunciation", "sounds", "accent", "read Spanish", "casa", "mesa", "vino", "solo", "luna"],
    sections: [
      {
        type: "steps",
        eyebrow: "Five anchors",
        heading: "Attach each sound to a whole Spanish word.",
        introduction: "English spelling can make a vowel change dramatically from one word to another. These Spanish anchors give each letter a dependable center.",
        steps: [
          { label: "A", title: "casa", description: "Open and direct. Let the jaw relax and avoid turning the ending into an English uh.", examples: [{ text: "casa", translation: "house" }] },
          { label: "E", title: "mesa", description: "A clear e sound. Keep it steady instead of sliding toward an English long a.", examples: [{ text: "mesa", translation: "table" }] },
          { label: "I", title: "vino", description: "A focused high vowel. It does not sound like the English pronoun I.", examples: [{ text: "vino", translation: "wine" }] },
          { label: "O", title: "solo", description: "Rounded and compact. Do not add the second sound heard at the end of many English pronunciations of go.", examples: [{ text: "solo", translation: "alone / only" }] },
          { label: "U", title: "luna", description: "A steady rounded vowel. Keep the tongue and lips in one position through the sound.", examples: [{ text: "luna", translation: "moon" }] },
        ],
      },
      {
        type: "comparison",
        eyebrow: "The useful contrast",
        heading: "Stable does not mean robotic.",
        introduction: "A vowel can be more prominent in a stressed syllable, but its core identity remains recognizable.",
        sides: [
          {
            label: "KEEP",
            question: "What should remain steady?",
            description: "The vowel stays clean while the word carries natural rhythm and stress.",
            examples: [
              { text: "Ana toma café.", translation: "Ana drinks coffee." },
              { text: "Luis vive en Lima.", translation: "Luis lives in Lima." },
            ],
          },
          {
            label: "AVOID",
            question: "What tends to interfere?",
            description: "English habits may turn one written vowel into a glide or replace an unstressed vowel with an indistinct uh. Spanish usually keeps the written vowel audible.",
            examples: [{ text: "Rosa usa una computadora.", translation: "Rosa uses a computer." }],
          },
        ],
        note: "Listen to the complete word and imitate the syllable. English spelling descriptions are only rough clues, never the target sound.",
      },
      {
        type: "text",
        eyebrow: "Why it matters",
        heading: "Stable vowels turn writing into a pronunciation guide.",
        paragraphs: [
          "Once the five anchors are reliable, a new written word gives you useful information before you know its meaning. You can identify its vowel sequence and produce a reasonable first reading.",
          "Stress tells you which syllable stands out. It does not give the vowel a completely different English-style identity. Read every vowel, then let the stressed syllable become more prominent.",
        ],
        examples: [
          { text: "café", translation: "coffee", note: "The accent marks final stress; é stays a clear e." },
          { text: "música", translation: "music", note: "The first syllable is stressed; all three vowels remain distinct." },
        ],
      },
      {
        type: "check",
        eyebrow: "Check the idea",
        heading: "Can you read from the letter instead of from English habit?",
        prompt: "The word is luna. Which vowel anchors the first syllable, and should that sound move while you hold it?",
        answer: "The anchor is u, and the vowel should remain steady.",
        explanation: "Lu- begins with the same compact u sound you will reuse in uno and música. A longer syllable does not need an added glide.",
        example: { text: "luna", translation: "moon" },
      },
    ],
    relatedSlugs: ["noun-gender", "adjective-agreement"],
  },
  {
    slug: "noun-gender",
    category: "Building Spanish",
    title: "Noun gender without guessing",
    summary: "Treat gender as grammatical information carried by the noun phrase—not as a quality of the object.",
    shortAnswer: "Every Spanish noun belongs to a grammatical category, usually called masculine or feminine. Learn the noun with an article—el libro, la mesa—because the complete phrase gives stronger evidence than the final letter alone.",
    readMinutes: 7,
    moduleNumbers: [1],
    lessonIds: ["1.1", "1.2"],
    conceptIds: ["noun_gender", "gender_patterns", "articles_definite"],
    searchTerms: ["gender", "masculine", "feminine", "el la", "articles", "noun", "ending", "o a", "cion", "dad", "ma", "problem", "mano"],
    sections: [
      {
        type: "text",
        eyebrow: "Start here",
        heading: "Gender describes how a noun behaves in grammar.",
        paragraphs: [
          "El libro is masculine and la mesa is feminine. Spanish is not saying that a book is male or a table is female. It is placing each noun in a grammatical class that nearby words can respond to.",
          "The article reveals the category in a usable phrase. Other determiners may replace el or la later, but the noun keeps its gender. That is why storing el libro is more useful than memorizing isolated libro plus an abstract label.",
        ],
        examples: [
          { text: "el libro", translation: "the book" },
          { text: "la mesa", translation: "the table" },
          { text: "el problema", translation: "the problem" },
          { text: "la mano", translation: "the hand" },
        ],
      },
      {
        type: "steps",
        eyebrow: "Evidence hierarchy",
        heading: "Use the strongest information available.",
        steps: [
          { label: "01", title: "Trust the complete phrase", description: "If an article is present, it directly identifies the category in that phrase. El problema outranks a guess based on final -a." },
          { label: "02", title: "Use strong ending families", description: "Nouns in -ción, -sión, and -dad are usually feminine. Many Greek-origin nouns in -ma are masculine.", examples: [{ text: "la conversación", translation: "the conversation" }, { text: "la ciudad", translation: "the city" }, { text: "el sistema", translation: "the system" }] },
          { label: "03", title: "Use -o and -a as clues", description: "Many -o nouns are masculine and many -a nouns are feminine, but this broad pattern must be confirmed." },
          { label: "04", title: "Store frequent exceptions", description: "Learn high-frequency exceptions as complete phrases so they feel ordinary rather than irregular.", examples: [{ text: "la mano", translation: "the hand" }, { text: "el día", translation: "the day" }] },
        ],
      },
      {
        type: "comparison",
        eyebrow: "Do not confuse the systems",
        heading: "Natural gender and grammatical gender are not the same thing.",
        sides: [
          {
            label: "PEOPLE",
            question: "Can meaning align with the form?",
            description: "Some words for people change in ways that reflect the person being described.",
            examples: [{ text: "el hermano", translation: "the brother" }, { text: "la hermana", translation: "the sister" }],
          },
          {
            label: "OBJECTS & IDEAS",
            question: "Is the category still real?",
            description: "Objects, places, and abstract ideas also belong to a grammatical class, even though biological sex is irrelevant.",
            examples: [{ text: "la ciudad", translation: "the city" }, { text: "el tiempo", translation: "time / weather" }],
          },
        ],
        note: "Do not search for a masculine or feminine personality in an object. Learn the behavior of its noun phrase.",
      },
      {
        type: "check",
        eyebrow: "Check the idea",
        heading: "Which evidence should win?",
        prompt: "You encounter el problema. The noun ends in -a. Should you change the article to la?",
        answer: "No. Keep el problema.",
        explanation: "The visible article gives direct evidence, and problema belongs to a common masculine -ma family. The broad -a pattern is a clue, not a rule that can erase the phrase in front of you.",
        example: { text: "El problema es importante.", translation: "The problem is important." },
      },
    ],
    relatedSlugs: ["adjective-agreement", "spanish-vowels"],
  },
  {
    slug: "adjective-agreement",
    category: "Building Spanish",
    title: "Adjective agreement",
    summary: "Make a description respond to the gender and number of the noun it describes.",
    shortAnswer: "First identify the noun. Then identify the adjective family. Adjectives such as nuevo change to nueva for feminine singular, while adjectives such as grande keep one singular gender form. Plural meaning must appear across every responsive word.",
    readMinutes: 7,
    moduleNumbers: [2],
    lessonIds: ["2.2", "2.3", "2.4"],
    conceptIds: ["adjective_gender", "adjective_number", "adjective_position", "adjective_agreement"],
    searchTerms: ["adjective", "agreement", "gender", "plural", "word order", "rojo roja", "nuevo nueva", "grande", "after noun", "description"],
    sections: [
      {
        type: "steps",
        eyebrow: "A dependable sequence",
        heading: "Let the noun control the description.",
        introduction: "Agreement is a relationship. It does not mean that every word must end with the same letter.",
        steps: [
          { label: "01", title: "Find the noun", description: "Identify exactly what person, place, thing, or group the adjective describes." },
          { label: "02", title: "Identify the adjective family", description: "An -o adjective normally marks gender with -o/-a. Many -e adjectives keep the same singular form." },
          { label: "03", title: "Match the number", description: "When the meaning becomes plural, form the plural of the article, noun, and adjective according to each word's own ending." },
          { label: "04", title: "Use neutral order", description: "For a dependable first description, build article + noun and place a classifying adjective after it.", examples: [{ text: "una casa roja", translation: "a red house" }, { text: "los libros nuevos", translation: "the new books" }] },
        ],
      },
      {
        type: "comparison",
        eyebrow: "Two adjective families",
        heading: "Some forms change for gender; others stay stable.",
        sides: [
          {
            label: "-O / -A",
            question: "Does the singular form mark gender?",
            description: "Use -o with a masculine singular noun and -a with a feminine singular noun.",
            examples: [{ text: "el carro rojo", translation: "the red car" }, { text: "la casa roja", translation: "the red house" }],
          },
          {
            label: "STABLE SINGULAR",
            question: "Does the adjective keep one form?",
            description: "Many adjectives ending in -e use the same singular form with masculine and feminine nouns.",
            examples: [{ text: "el libro grande", translation: "the big book" }, { text: "la mesa grande", translation: "the big table" }],
          },
        ],
        note: "Do not invent forms such as interesanta. First learn what the adjective family is able to mark.",
      },
      {
        type: "text",
        eyebrow: "Plural agreement",
        heading: "Plural meaning travels across the complete phrase.",
        paragraphs: [
          "El libro nuevo becomes los libros nuevos. The article changes, the noun forms its plural, and the adjective forms its plural. One plural marker is not enough when other words also have plural forms.",
          "Each word follows its own spelling pattern. Ciudad becomes ciudades with -es, while grande becomes grandes with -s. The endings differ, but every part expresses the same plural meaning.",
        ],
        examples: [
          { text: "el libro nuevo", translation: "the new book" },
          { text: "los libros nuevos", translation: "the new books" },
          { text: "la ciudad grande", translation: "the big city" },
          { text: "las ciudades grandes", translation: "the big cities" },
        ],
      },
      {
        type: "check",
        eyebrow: "Check the idea",
        heading: "Can you coordinate family and number?",
        prompt: "Complete the description: las ciudades ___ (interesting). Should the adjective become interesantas or interesantes?",
        answer: "Use interesantes.",
        explanation: "Interesante keeps one form across singular gender, but it still changes for plural number. Add -s: las ciudades interesantes.",
        example: { text: "Las ciudades son interesantes.", translation: "The cities are interesting." },
      },
    ],
    relatedSlugs: ["noun-gender", "ser-vs-estar"],
  },
  {
    slug: "ser-vs-estar",
    category: "Choosing meaning",
    title: "SER vs. ESTAR",
    summary: "Choose the verb from the claim the sentence makes—not from a permanent-versus-temporary shortcut.",
    shortAnswer: "Use ser to establish identity, classification, origin, relationships, and event details. Use estar to present a state or locate an identified person, place, or thing. Read the complete sentence, name its job, and only then choose the form that matches the subject.",
    readMinutes: 9,
    moduleNumbers: [3, 4],
    lessonIds: ["3.2", "4.1", "4.3"],
    conceptIds: ["ser_forms", "ser_identity", "ser_classification", "ser_origin", "estar_forms", "estar_state", "estar_location", "ser_vs_estar_selection"],
    searchTerms: ["ser", "estar", "to be", "soy", "estoy", "es", "esta", "identity", "origin", "state", "location", "permanent temporary", "event"],
    sections: [
      {
        type: "comparison",
        eyebrow: "The mental model",
        heading: "Ask what the sentence is trying to establish.",
        sides: [
          {
            label: "SER",
            question: "What or who is it? Where is it from?",
            description: "Use ser to establish identity, place someone or something in a category, describe a relationship, or state origin.",
            examples: [{ text: "Ana es mi hermana.", translation: "Ana is my sister." }, { text: "Elena es doctora.", translation: "Elena is a doctor." }, { text: "Somos de México.", translation: "We are from Mexico." }],
          },
          {
            label: "ESTAR",
            question: "How is it? Where is it?",
            description: "Use estar to present a state or locate an identified person, place, or thing.",
            examples: [{ text: "Ana está cansada.", translation: "Ana is tired." }, { text: "Estamos bien.", translation: "We are well." }, { text: "El libro está en la mesa.", translation: "The book is on the table." }],
          },
        ],
        note: "The subject does not choose the verb. The claim does. The same person can be a student, at home, and tired in three different sentences.",
      },
      {
        type: "steps",
        eyebrow: "Decision routine",
        heading: "Do not stare at the blank. Read beyond it.",
        steps: [
          { label: "READ", title: "Take in the complete sentence", description: "Include the subject, the words after the verb, and any context around it." },
          { label: "NAME", title: "State the job in plain English", description: "Is this identity, classification, origin, a state, the location of a person or thing, or an event detail?" },
          { label: "CHOOSE", title: "Select the verb family", description: "Ser carries identity, classification, origin, relationships, and event details. Estar carries states and ordinary location." },
          { label: "MATCH", title: "Conjugate for the subject", description: "Only after meaning is settled should you choose soy, eres, es, somos, son—or estoy, estás, está, estamos, están." },
        ],
      },
      {
        type: "comparison",
        eyebrow: "A precise boundary",
        heading: "People and things are located with estar. Events take place with ser.",
        introduction: "This is a narrow distinction about what is being located—not a return to the permanent-versus-temporary shortcut.",
        sides: [
          {
            label: "PLACE",
            question: "Where is this identified place?",
            description: "An office is a place that has a location, so locate it with estar.",
            examples: [{ text: "La oficina está en el centro.", translation: "The office is downtown." }],
          },
          {
            label: "EVENT",
            question: "Where or when does it take place?",
            description: "A meeting or class is an event, so use ser for where or when it occurs.",
            examples: [{ text: "La reunión es en la oficina.", translation: "The meeting is at the office." }, { text: "La clase es a las nueve.", translation: "The class is at nine." }],
          },
        ],
      },
      {
        type: "check",
        eyebrow: "Check the idea",
        heading: "Name the claim before the verb.",
        prompt: "Elena worked for twelve hours. Complete: Elena ___ cansada. Does the sentence classify Elena or describe her state?",
        answer: "Use está: Elena está cansada.",
        explanation: "Cansada tells how Elena is after a long day. That state uses estar, and está matches the singular subject Elena.",
        example: { text: "Elena está cansada.", translation: "Elena is tired." },
      },
    ],
    relatedSlugs: ["hay-vs-estar", "adjective-agreement"],
  },
  {
    slug: "hay-vs-estar",
    category: "Choosing meaning",
    title: "HAY vs. ESTAR",
    summary: "Introduce what exists with hay; locate an identified subject with estar.",
    shortAnswer: "Use hay to announce that something exists or is present. Use estar when the subject is already identifiable and the sentence tells where it is. A place phrase can appear with either verb; the information job makes the decision.",
    readMinutes: 7,
    moduleNumbers: [4],
    lessonIds: ["4.5"],
    conceptIds: ["hay_existence", "hay_vs_estar", "estar_location", "estar_forms"],
    searchTerms: ["hay", "estar", "there is", "there are", "location", "existence", "present", "identified", "book", "restaurant", "school"],
    sections: [
      {
        type: "comparison",
        eyebrow: "The central contrast",
        heading: "Introduce it with hay. Locate it with estar.",
        sides: [
          {
            label: "HAY",
            question: "What exists or is present?",
            description: "Present something as new information, often with an indefinite noun phrase, a number, or no article.",
            examples: [{ text: "Hay un libro en la mesa.", translation: "There is a book on the table." }, { text: "Hay estudiantes en la biblioteca.", translation: "There are students in the library." }],
          },
          {
            label: "ESTAR",
            question: "Where is the identified subject?",
            description: "Refer to a known person or thing as the subject, then give its location.",
            examples: [{ text: "El libro está aquí.", translation: "The book is here." }, { text: "Los estudiantes están en la biblioteca.", translation: "The students are in the library." }],
          },
        ],
        note: "The shift from un to el is a useful clue, not the definition. The real difference is new existence versus identified location.",
      },
      {
        type: "text",
        eyebrow: "The form",
        heading: "Hay stays hay with one thing or many things.",
        paragraphs: [
          "Hay comes from haber, but its useful pattern here is hay + what exists or is present. It often corresponds to both there is and there are.",
          "The following noun phrase carries the number. Do not create a plural form of hay to agree with dos libros or tres restaurantes.",
        ],
        examples: [{ text: "Hay una escuela.", translation: "There is a school." }, { text: "Hay tres restaurantes.", translation: "There are three restaurants." }, { text: "No hay libros aquí.", translation: "There are no books here." }],
      },
      {
        type: "steps",
        eyebrow: "Decision routine",
        heading: "Ask what the listener is learning.",
        steps: [
          { label: "01", title: "Is the thing entering the conversation?", description: "If the message announces that something is present, begin with hay." },
          { label: "02", title: "Can the listener identify the subject?", description: "A name, possessive, or definite noun phrase often signals that you are locating something already known." },
          { label: "03", title: "Choose the location form", description: "Use está for an identified singular subject and están for an identified plural subject." },
          { label: "04", title: "Do not let the place phrase decide alone", description: "En la mesa can appear after hay or estar. Decide whether the sentence announces presence or locates a subject." },
        ],
      },
      {
        type: "comparison",
        eyebrow: "One scene, two perspectives",
        heading: "A conversation can move from existence to location.",
        sides: [
          {
            label: "FIRST MENTION",
            question: "What is there?",
            description: "The restaurant enters the conversation as new information.",
            examples: [{ text: "Hay un restaurante en la ciudad.", translation: "There is a restaurant in the city." }],
          },
          {
            label: "NOW IDENTIFIED",
            question: "Where is that restaurant?",
            description: "Both speakers can now identify it, so it becomes the subject being located.",
            examples: [{ text: "El restaurante está en el centro.", translation: "The restaurant is downtown." }],
          },
        ],
      },
      {
        type: "check",
        eyebrow: "Check the idea",
        heading: "A location phrase is not enough to choose the verb.",
        prompt: "You want to announce that a school exists in the city. Complete: ___ una escuela en la ciudad.",
        answer: "Use hay: Hay una escuela en la ciudad.",
        explanation: "Una escuela is new information. The sentence announces its existence in a place instead of locating a school the listener already knows.",
        example: { text: "Hay una escuela en la ciudad.", translation: "There is a school in the city." },
      },
    ],
    relatedSlugs: ["ser-vs-estar", "noun-gender"],
  },
  ...courseReferenceEntries,
];

export const libraryCategories: LibraryCategory[] = [
  "Pronunciation",
  "Building Spanish",
  "Choosing meaning",
  "Questions & time",
  "Using verbs",
  "Connecting Spanish",
  "Telling stories",
];

export function getLibraryEntry(slug: string) {
  return libraryEntries.find((entry) => entry.slug === slug);
}
