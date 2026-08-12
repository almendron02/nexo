import type { ConceptId, LessonDefinition, ReadingQuestion } from "@/content/schemas";

interface CheckpointSpec {
  id: string;
  stageRoman: string;
  moduleNumber: number;
  title: string;
  displayTitle: string;
  dek: string;
  goal: string;
  concepts: ConceptId[];
  orientation: [string, string, ...string[]];
  reading: Array<[string, string]>;
  questions: Array<{ prompt: string; options: string[]; answer: number; feedback: string; concepts: ConceptId[] }>;
  choice: { heading: string; context: string; prompt: string; options: string[]; answer: number; correct: string; incorrect: string; concepts: ConceptId[] };
  builder: { prompt: string; tokens: string[]; correctOrder: string[]; answer: string; feedback: string; concepts: ConceptId[] };
  recall: Array<{ before: string; after: string; answer: string; accepted?: string[]; feedback: string; concepts: ConceptId[] }>;
  production: { prompt: string; requirements: string[]; example: string; minimumCharacters: number };
  summary: string;
}

function createCheckpoint(spec: CheckpointSpec): LessonDefinition {
  const prefix = spec.id.replaceAll("-", "");
  const questionBlocks: ReadingQuestion[] = spec.questions.map((question, index) => ({
    id: `${prefix}-q${index + 1}`,
    prompt: question.prompt,
    options: question.options.map((label, optionIndex) => ({ id: `q${index + 1}-${optionIndex}`, label })),
    correctOptionId: `q${index + 1}-${question.answer}`,
    feedback: question.feedback,
    conceptIds: question.concepts,
  }));
  const choiceIds = spec.choice.options.map((_, index) => `choice-${index}`);

  return {
    id: spec.id,
    moduleId: `stage-${spec.stageRoman.toLocaleLowerCase()}`,
    title: spec.title,
    displayTitle: spec.displayTitle,
    dek: spec.dek,
    goal: spec.goal,
    durationMinutes: 36,
    concepts: spec.concepts,
    experience: {
      kind: "checkpoint",
      contextLabel: `Stage ${spec.stageRoman} · Checkpoint`,
      openingMarker: `${spec.stageRoman} / ${String(spec.moduleNumber).padStart(2, "0")}`,
      returnHref: `/module/${spec.moduleNumber}`,
      returnLabel: `Module ${spec.moduleNumber}`,
    },
    blocks: [
      {
        id: `${prefix}-orientation`, type: "prose", conceptIds: spec.concepts,
        eyebrow: "Integrated checkpoint", heading: "Use the system without lesson labels.", paragraphs: spec.orientation,
        points: [
          { label: "READ", title: "Follow the whole situation", description: "Interpret connected Spanish before focusing on a blank or isolated form." },
          { label: "DECIDE", title: "Name each relationship", description: "Choose structures from subject, time, reference, and intended meaning." },
          { label: "RETRIEVE", title: "Work without visible choices", description: "Later items measure what you can independently bring back." },
          { label: "CREATE", title: "Produce connected Spanish", description: "Finish with one coherent response that integrates the stage." },
        ],
      },
      {
        id: `${prefix}-reading`, type: "reading", conceptIds: spec.concepts,
        eyebrow: "Connected comprehension", heading: "Read for the situation, then the forms.",
        instructions: "Read the full passage once. Listen line by line, answer from the Spanish, and reveal translations only after you commit.",
        sentences: spec.reading.map(([text, translation], index) => ({ id: `${prefix}-r${index + 1}`, text, translation })),
        questions: questionBlocks,
      },
      {
        id: `${prefix}-decision`, type: "choice", conceptIds: spec.choice.concepts,
        eyebrow: "Integrated decision", heading: spec.choice.heading, context: spec.choice.context, prompt: spec.choice.prompt,
        options: spec.choice.options.map((label, index) => ({ id: choiceIds[index], label })),
        correctOptionId: choiceIds[spec.choice.answer], correctFeedback: spec.choice.correct, incorrectFeedback: spec.choice.incorrect,
      },
      {
        id: `${prefix}-builder`, type: "builder", conceptIds: spec.builder.concepts,
        eyebrow: "Connected construction", heading: "Build the complete message.", ...spec.builder,
      },
      {
        id: `${prefix}-recall`, type: "fill", conceptIds: spec.concepts,
        eyebrow: "Unsupported recall", heading: "Retrieve across the entire stage.",
        prompt: "Type the missing Spanish word or form. Use the complete message—not the lesson it came from—to decide.",
        items: spec.recall.map((item, index) => ({ id: `${prefix}-f${index + 1}`, before: item.before, after: item.after, answer: item.answer, accepted: item.accepted ?? [item.answer], feedback: item.feedback, conceptIds: item.concepts })),
      },
      {
        id: `${prefix}-production`, type: "free-write", conceptIds: spec.concepts,
        eyebrow: "Independent production", heading: "Create one connected response.", ...spec.production,
      },
      {
        id: `${prefix}-summary`, type: "summary", conceptIds: spec.concepts,
        eyebrow: "Checkpoint principle", heading: spec.summary,
        message: "A stage is complete when its ideas cooperate inside meaning—not when isolated charts have been memorized.",
        ideas: [
          { label: "CONTROL", question: "Can the forms carry your intended meaning?", uses: ["accurate relationships", "clear reference", "connected time"] },
          { label: "TRANSFER", question: "Can you use the system in a new situation?", uses: ["independent recall", "original Spanish", "self-correction"] },
        ],
      },
    ],
    completion: {
      title: `${spec.title} is complete.`,
      message: "Your comprehension, recall, construction, and original Spanish are strong enough to continue.",
      reviewTitle: "Review the stage before moving on.",
      reviewMessage: "You completed the checkpoint. Revisit the marked ideas in Review, then return when the relationships feel independent.",
    },
  };
}

export const stage02Checkpoint = createCheckpoint({
  id: "stage-02-checkpoint", stageRoman: "II", moduleNumber: 9, title: "Use Spanish", displayTitle: "Ask, act, and make plans in real time.",
  dek: "Integrate questions, quantities, present actions, essential irregulars, and future or obligation patterns.",
  goal: "Carry a practical exchange from an information question through a present routine and into a specific plan.",
  concepts: ["question_structure", "question_words_context", "numbers_basic", "dates_calendar", "clock_time", "present_sentence", "stem_change", "tener_expressions", "saber_conocer", "near_future", "tener_que", "para_infinitive"],
  orientation: [
    "Stage II moved from asking for information to building the present actions, numbers, times, needs, and plans that answer those questions. This checkpoint removes the module boundaries so those systems have to cooperate.",
    "Listen for the information gap, choose a verb from its meaning, conjugate only the verb that carries the subject, and keep attached actions in the infinitive. Use dates and times to make every plan specific.",
  ],
  reading: [
    ["—¿Por qué estudias español?", "Why do you study Spanish?"],
    ["—Porque quiero trabajar con la comunidad hispana.", "Because I want to work with the Hispanic community."],
    ["—¿Cuándo practicas?", "When do you practice?"],
    ["—Estudio desde hace seis meses y practico los martes a las seis.", "I have studied for six months and practice Tuesdays at six."],
    ["—¿Vas a venir al grupo mañana?", "Are you going to come to the group tomorrow?"],
    ["—Sí, pero primero tengo que terminar un proyecto.", "Yes, but first I have to finish a project."],
  ],
  questions: [
    { prompt: "What motivates the learner?", options: ["working with the Hispanic community", "passing a math exam", "buying a book"], answer: 0, feedback: "Porque quiero trabajar… gives the reason.", concepts: ["question_reason_quantity", "querer_poder"] },
    { prompt: "When does the recurring practice happen?", options: ["Tuesdays at six", "tomorrow at noon", "every morning"], answer: 0, feedback: "Los martes a las seis combines habitual day and exact time.", concepts: ["clock_time", "time_expressions"] },
  ],
  choice: { heading: "Ask for the exact meeting time.", context: "You know the meeting is tomorrow but need its clock time.", prompt: "Which question requests the missing information precisely?", options: ["¿A qué hora empieza el grupo?", "¿Por qué grupo?", "¿Cuál hora está?"], answer: 0, correct: "A qué hora asks for the exact event time.", incorrect: "The missing answer is a clock time, so use a qué hora.", concepts: ["question_words_context", "clock_time"] },
  builder: { prompt: "Build: We are going to practice tomorrow because we want to improve.", tokens: ["Vamos a practicar", "mañana", "porque queremos", "mejorar."], correctOrder: ["Vamos a practicar", "mañana", "porque queremos", "mejorar."], answer: "Vamos a practicar mañana porque queremos mejorar.", feedback: "Vamos a carries the plan; queremos carries the reason; both second actions remain infinitives.", concepts: ["near_future", "querer_poder", "clause_connectors"] },
  recall: [
    { before: "¿", after: " estudias español? —Porque quiero viajar.", answer: "Por qué", accepted: ["por qué", "por que"], feedback: "The answer gives a reason, so ask por qué.", concepts: ["question_reason_quantity"] },
    { before: "La reunión es ", after: " las siete.", answer: "a", feedback: "A las places an event at an exact time.", concepts: ["clock_time"] },
    { before: "Nosotros ", after: " español cada día. (practice)", answer: "practicamos", feedback: "Regular -ar nosotros uses -amos.", concepts: ["present_ar"] },
    { before: "Yo ", after: " ayudar. (can)", answer: "puedo", feedback: "Poder changes o→ue in the yo form.", concepts: ["querer_poder"] },
    { before: "Ana ", after: " terminar hoy. (has to)", answer: "tiene que", feedback: "Ana carries the obligation with tiene que.", concepts: ["tener_que"] },
    { before: "Estudio ", after: " hablar mejor. (in order to)", answer: "para", feedback: "Para + infinitive expresses purpose.", concepts: ["para_infinitive"] },
  ],
  production: { prompt: "Write a 100–140 word exchange between two students who meet, ask about routines and motivation, arrange a study session, and explain one obligation before the plan.", requirements: ["At least four meaningful questions", "Present actions, a date or time, and two useful irregular verbs", "Near future, tener que, and para + infinitive"], example: "—¿Qué estudias y por qué? —Estudio español para trabajar… —¿Cuándo practicas? —Los martes… —¿Vas a venir mañana?", minimumCharacters: 100 },
  summary: "A useful exchange moves from the right question to a specific, conjugated, time-grounded answer.",
});

export const stage03Checkpoint = createCheckpoint({
  id: "stage-03-checkpoint", stageRoman: "III", moduleNumber: 14, title: "Connect Spanish", displayTitle: "Keep people, objects, reactions, and clauses connected.",
  dek: "Integrate object pronouns, gustar structures, reflexive meaning, negatives, connectors, and the present subjunctive.",
  goal: "Build a connected message that controls reference, relationships, reactions, reasons, and influence.",
  concepts: ["direct_object_pronouns", "object_pronoun_position", "indirect_object_pronouns", "gustar_structure", "reflexive_pronouns", "double_negation", "core_prepositions", "clause_connectors", "subjunctive_purpose", "subjunctive_influence", "subjunctive_reactions"],
  orientation: [
    "Stage III replaced repetition with reference and connected simple claims into relationships. The same sentence may now track who acts, what receives the action, who experiences it, and how another clause is framed.",
    "Begin with meaning: identify direct and indirect roles, keep pronouns at the edge of the verb unit, and choose indicative or subjunctive from the speaker’s stance. Connectors should reveal logic, not merely lengthen the response.",
  ],
  reading: [
    ["A Elena le interesa trabajar con la comunidad.", "Elena is interested in working with the community."],
    ["Sus amigos la invitan a un proyecto y ella les escribe enseguida.", "Her friends invite her to a project and she writes to them right away."],
    ["La coordinadora quiere que todos lleguen temprano.", "The coordinator wants everyone to arrive early."],
    ["Aunque Elena se pone nerviosa, no deja de participar.", "Although Elena gets nervous, she does not stop participating."],
    ["Le alegra que sus compañeros la apoyen.", "She is glad that her classmates support her."],
    ["Al final se ayudan mutuamente y nadie trabaja solo.", "In the end they help each other and nobody works alone."],
  ],
  questions: [
    { prompt: "What does la replace in sus amigos la invitan?", options: ["Elena", "the project", "the coordinator"], answer: 0, feedback: "La is the feminine singular direct object pronoun for Elena.", concepts: ["direct_object_pronouns"] },
    { prompt: "Why is apoyen subjunctive?", options: ["The support is framed through Elena’s emotion", "The classmates are plural", "The action is past"], answer: 0, feedback: "Le alegra que emotionally frames the second clause.", concepts: ["subjunctive_reactions"] },
  ],
  choice: { heading: "Replace both objects accurately.", context: "Damos los materiales a la coordinadora.", prompt: "Which sentence replaces a la coordinadora and los materiales?", options: ["Se los damos.", "Le los damos.", "Los le damos."], answer: 0, correct: "Indirect comes first; le becomes se before los.", incorrect: "Use se + los before the conjugated verb.", concepts: ["combined_pronouns"] },
  builder: { prompt: "Build: The coordinator asks us to support each other.", tokens: ["La coordinadora", "nos pide", "que nos apoyemos", "mutuamente."], correctOrder: ["La coordinadora", "nos pide", "que nos apoyemos", "mutuamente."], answer: "La coordinadora nos pide que nos apoyemos mutuamente.", feedback: "Nos marks the people asked; que + subjunctive carries the influence; the second nos is reciprocal.", concepts: ["indirect_object_pronouns", "subjunctive_influence", "reciprocal_reflexive"] },
  recall: [
    { before: "El libro: ", after: " quiero leer.", answer: "lo", feedback: "Lo replaces the masculine singular direct object before the verb unit.", concepts: ["object_pronoun_position"] },
    { before: "A Ana ", after: " gustan las clases.", answer: "le", feedback: "Le marks Ana as experiencer; gustan agrees with clases.", concepts: ["gusta_gustan"] },
    { before: "No conozco a ", after: ".", answer: "nadie", feedback: "Post-verb nadie joins pre-verb no.", concepts: ["double_negation"] },
    { before: "Quiero que tú ", after: " temprano. (arrive)", answer: "llegues", feedback: "A changed-subject desire uses subjunctive llegues.", concepts: ["subjunctive_influence"] },
    { before: "No creo que Ana ", after: ". (come)", answer: "venga", feedback: "Denied belief frames the clause with subjunctive.", concepts: ["subjunctive_reactions"] },
    { before: "Hablo despacio ", after: " todos entiendan.", answer: "para que", feedback: "A second subject’s purpose uses para que + subjunctive.", concepts: ["subjunctive_connectors"] },
  ],
  production: { prompt: "Write a 130–170 word message organizing a community project: state preferences, assign or request actions, track objects and recipients with pronouns, explain reasons, and react to the plan.", requirements: ["Direct and indirect object pronouns with clear referents", "One reflexive or reciprocal action and one negative agreement", "At least three meaningful subjunctive clauses"], example: "A nosotros nos interesa el proyecto. La coordinadora nos da las tareas y nos las explica. Quiere que lleguemos temprano…", minimumCharacters: 130 },
  summary: "Connected Spanish keeps reference clear while each connector, pronoun, and mood makes a distinct relationship visible.",
});

export const stage04Checkpoint = createCheckpoint({
  id: "stage-04-checkpoint", stageRoman: "IV", moduleNumber: 16, title: "Tell Stories", displayTitle: "Build a past world and move a meaningful event through it.",
  dek: "Integrate imperfect orientation, preterite events, cohesive pronouns, sequence, cause, and reflection.",
  goal: "Tell and interpret a coherent story whose tense choices guide the listener through background and change.",
  concepts: ["preterite_function", "preterite_ar", "preterite_er_ir", "preterite_irregular", "imperfect_function", "imperfect_forms", "preterite_imperfect", "combined_pronouns", "past_narration"],
  orientation: [
    "Stage IV is not a test of two past-tense charts. It is a test of viewpoint: what was already true, what kept happening, what changed, what happened next, and why the result matters.",
    "Orient the listener before accelerating the event line. Use pronouns only after reference is secure, and make every connector explain time, cause, contrast, or consequence.",
  ],
  reading: [
    ["Cuando tenía doce años, vivía cerca de una iglesia pequeña.", "When I was twelve, I lived near a small church."],
    ["Cada domingo muchas familias se reunían allí y todos preparaban comida.", "Every Sunday many families gathered there and everyone prepared food."],
    ["Un día llegó una familia nueva que no conocía a nadie.", "One day a new family arrived who did not know anyone."],
    ["Mi madre preparó un plato y me lo dio para llevarlo a su mesa.", "My mother prepared a dish and gave it to me to take to their table."],
    ["Hablamos durante horas y al final intercambiamos números.", "We talked for hours and in the end exchanged numbers."],
    ["Ese día entendí que una conversación podía convertirse en una amistad.", "That day I understood that a conversation could become a friendship."],
  ],
  questions: [
    { prompt: "Which sentences establish the recurring background?", options: ["the first two", "only the family’s arrival", "only the final reflection"], answer: 0, feedback: "Tenía, vivía, se reunían, and preparaban establish age, residence, habit, and background.", concepts: ["imperfect_description", "imperfect_habit"] },
    { prompt: "What does llevarlo refer to?", options: ["taking the dish to the new family", "taking the church to the mother", "taking the phone numbers home"], answer: 0, feedback: "Lo refers to the dish; para + infinitive explains the purpose of receiving it.", concepts: ["direct_object_pronouns", "para_infinitive"] },
  ],
  choice: { heading: "Choose viewpoint, not a keyword.", context: "The speaker was already walking home when it suddenly began to rain.", prompt: "Which pairing guides the listener correctly?", options: ["Caminaba a casa cuando empezó a llover.", "Caminé siempre cuando empezaba ayer.", "Caminaba a casa cuando empezaba de repente."], answer: 0, correct: "Caminaba is ongoing background; empezó is the bounded onset.", incorrect: "Use imperfect for what was in progress and preterite for the event that changed it.", concepts: ["preterite_imperfect"] },
  builder: { prompt: "Build: It was late, but we finished the project and sent it to the professor.", tokens: ["Era tarde,", "pero terminamos", "el proyecto", "y se lo enviamos", "al profesor."], correctOrder: ["Era tarde,", "pero terminamos", "el proyecto", "y se lo enviamos", "al profesor."], answer: "Era tarde, pero terminamos el proyecto y se lo enviamos al profesor.", feedback: "Era establishes background; terminamos/enviamos advance events; se lo keeps recipient and object connected.", concepts: ["preterite_imperfect", "combined_pronouns"] },
  recall: [
    { before: "Cuando era niño, ", after: " al parque cada día. (I used to go)", answer: "iba", feedback: "A recurring childhood habit uses imperfect iba.", concepts: ["imperfect_habit"] },
    { before: "Ayer ", after: " al museo. (I went)", answer: "fui", feedback: "The completed trip uses preterite fui.", concepts: ["preterite_irregular"] },
    { before: "", after: " cuando Ana llamó. (It was raining)", answer: "Llovía", accepted: ["llovía", "llovia"], feedback: "Weather in progress forms the background.", concepts: ["preterite_imperfect"] },
    { before: "Yo ", after: " el libro. (looked for, past)", answer: "busqué", accepted: ["busqué", "busque"], feedback: "The yo spelling change c→qu preserves the sound.", concepts: ["preterite_spelling"] },
    { before: "Le dimos las cartas → ", after: " dimos.", answer: "Se las", accepted: ["se las"], feedback: "Le becomes se before direct object las.", concepts: ["combined_pronouns"] },
    { before: "Al final ", after: " por qué importaba. (I understood)", answer: "entendí", accepted: ["entendí", "entendi"], feedback: "Entendí presents the bounded realization that closes the story.", concepts: ["past_narration"] },
  ],
  production: { prompt: "Write a 200–280 word story about a memorable day. Establish time, place, people, and background; narrate at least ten bounded events; maintain reference with pronouns; and close with what changed or why it matters.", requirements: ["Imperfect scene, habits, or ongoing actions", "At least ten connected preterite events", "Pronoun cohesion, cause/result, and reflective closure"], example: "Era sábado y hacía calor. Mi familia preparaba… De repente llegó… Primero… Al final comprendí que…", minimumCharacters: 200 },
  summary: "A memorable story lets the listener inhabit the background, follow each change, and understand why the ending matters.",
});

export const remainingStageCheckpoints = {
  "stage-2": stage02Checkpoint,
  "stage-3": stage03Checkpoint,
  "stage-4": stage04Checkpoint,
} as const;
