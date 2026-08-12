import type {
  ConceptId,
  LessonDefinition,
  ReadingQuestion,
} from "@/content/schemas";

export type Example = [spanish: string, translation: string];

interface DecisionSpec {
  heading: string;
  context: string;
  prompt: string;
  options: string[];
  answer: number;
  correct: string;
  incorrect: string;
}

interface BoundarySide {
  label: string;
  question: string;
  description: string;
  example: Example;
}

interface FillSpec {
  before: string;
  after: string;
  answer: string;
  accepted?: string[];
  feedback: string;
  concepts?: ConceptId[];
}

interface ReadingSpec {
  heading: string;
  sentences: Example[];
  question: {
    prompt: string;
    options: string[];
    answer: number;
    feedback: string;
    concepts?: ConceptId[];
  };
}

export interface CourseLessonSpec {
  id: string;
  title: string;
  displayTitle: string;
  dek: string;
  goal: string;
  durationMinutes: number;
  concepts: ConceptId[];
  explain: [string, string, ...string[]];
  examples: [Example, Example, ...Example[]];
  boundary: {
    heading: string;
    note: string;
    left: BoundarySide;
    right: BoundarySide;
  };
  prediction: DecisionSpec;
  guided: DecisionSpec;
  builder: {
    prompt: string;
    tokens: string[];
    correctOrder: string[];
    answer: string;
    feedback: string;
  };
  reading: ReadingSpec;
  recall: [FillSpec, FillSpec, ...FillSpec[]];
  production: {
    prompt: string;
    requirements: string[];
    example: string;
    minimumCharacters?: number;
    requiredGroups?: Array<{ accepted: string[]; missingFeedback: string }>;
  };
  takeaway: string;
}

function choiceBlock(spec: CourseLessonSpec, role: "prediction" | "guided") {
  const decision = spec[role];
  const optionIds = decision.options.map((_, index) => `${role}-${index}`);
  return {
    id: `l${spec.id.replace(".", "")}-${role}`,
    type: "choice" as const,
    conceptIds: spec.concepts,
    eyebrow: role === "prediction" ? "Predict from the model" : "Guided decision",
    heading: decision.heading,
    context: decision.context,
    prompt: decision.prompt,
    options: decision.options.map((label, index) => ({ id: optionIds[index], label })),
    correctOptionId: optionIds[decision.answer],
    correctFeedback: decision.correct,
    incorrectFeedback: decision.incorrect,
  };
}

export function createCourseLesson(spec: CourseLessonSpec): LessonDefinition {
  const prefix = `l${spec.id.replace(".", "")}`;
  const [moduleNumber, lessonNumber] = spec.id.split(".");
  const readingQuestion: ReadingQuestion = {
    id: `${prefix}-reading-question`,
    prompt: spec.reading.question.prompt,
    options: spec.reading.question.options.map((label, index) => ({ id: `reading-${index}`, label })),
    correctOptionId: `reading-${spec.reading.question.answer}`,
    feedback: spec.reading.question.feedback,
    conceptIds: spec.reading.question.concepts ?? spec.concepts,
  };

  return {
    id: spec.id,
    moduleId: `module-${moduleNumber.padStart(2, "0")}`,
    title: spec.title,
    displayTitle: spec.displayTitle,
    dek: spec.dek,
    goal: spec.goal,
    durationMinutes: spec.durationMinutes,
    concepts: spec.concepts,
    experience: {
      kind: "lesson",
      contextLabel: `Module ${moduleNumber} · Lesson ${lessonNumber}`,
      openingMarker: `${moduleNumber.padStart(2, "0")} / ${lessonNumber.padStart(2, "0")}`,
      returnHref: `/module/${moduleNumber}`,
      returnLabel: `Module ${moduleNumber}`,
    },
    blocks: [
      {
        id: `${prefix}-opening`,
        type: "prose",
        conceptIds: spec.concepts,
        eyebrow: "Understand the system",
        heading: spec.displayTitle,
        paragraphs: spec.explain,
        spanish: spec.examples.slice(0, 3).map(([text, translation]) => ({ text, translation })),
      },
      choiceBlock(spec, "prediction"),
      {
        id: `${prefix}-model`,
        type: "prose",
        conceptIds: spec.concepts,
        eyebrow: "Make the reasoning visible",
        heading: "Meaning first; form second.",
        paragraphs: [
          `The examples are not isolated phrases to memorize. Each one applies the same idea: ${spec.takeaway}`,
          "Read the complete message, identify the job of the target form, and only then choose the words or ending. That order makes the pattern reusable in sentences you have never seen.",
        ],
        points: [
          { label: "01", title: "Read the whole idea", description: "Use the subject, the context, and the words around the target form." },
          { label: "02", title: "Name the job", description: "Explain in plain language what the sentence is trying to communicate." },
          { label: "03", title: "Build the form", description: "Apply the pattern and make every connected word agree." },
          { label: "04", title: "Check the message", description: "Read the finished Spanish again and verify that it says what you intended." },
        ],
        spanish: spec.examples.slice(1).map(([text, translation]) => ({ text, translation })),
      },
      {
        id: `${prefix}-boundary`,
        type: "comparison",
        conceptIds: spec.concepts,
        eyebrow: "Keep the boundary clear",
        heading: spec.boundary.heading,
        note: spec.boundary.note,
        sides: [spec.boundary.left, spec.boundary.right].map((side) => ({
          label: side.label,
          question: side.question,
          description: side.description,
          examples: [{ text: side.example[0], translation: side.example[1] }],
        })),
      },
      choiceBlock(spec, "guided"),
      {
        id: `${prefix}-builder`,
        type: "builder",
        conceptIds: spec.concepts,
        eyebrow: "Construct the message",
        heading: "Put the complete sentence together.",
        ...spec.builder,
      },
      {
        id: `${prefix}-reading`,
        type: "reading",
        conceptIds: spec.concepts,
        eyebrow: "Observe it in context",
        heading: spec.reading.heading,
        instructions: "Read the connected Spanish once for the situation. Then listen line by line and answer from the meaning before revealing the translations.",
        sentences: spec.reading.sentences.map(([text, translation], index) => ({ id: `${prefix}-r${index + 1}`, text, translation })),
        questions: [readingQuestion],
      },
      {
        id: `${prefix}-recall`,
        type: "fill",
        conceptIds: spec.concepts,
        eyebrow: "Support disappears",
        heading: "Retrieve the pattern without choices.",
        prompt: "Type the missing Spanish word or form. Use the complete sentence to decide what belongs in the blank.",
        items: spec.recall.map((item, index) => ({
          id: `${prefix}-f${index + 1}`,
          before: item.before,
          after: item.after,
          answer: item.answer,
          accepted: item.accepted ?? [item.answer],
          conceptIds: item.concepts ?? spec.concepts,
          feedback: item.feedback,
        })),
      },
      {
        id: `${prefix}-production`,
        type: "free-write",
        conceptIds: spec.concepts,
        eyebrow: "Original Spanish",
        heading: "Use the idea for a message of your own.",
        prompt: spec.production.prompt,
        requirements: spec.production.requirements,
        example: spec.production.example,
        minimumCharacters: spec.production.minimumCharacters ?? 24,
        evaluation: spec.production.requiredGroups ? {
          minimumIdeas: Math.max(1, spec.production.requirements.length),
          requiredGroups: spec.production.requiredGroups,
          successFeedback: "Your response includes the target structure and communicates a complete original idea.",
        } : undefined,
      },
      {
        id: `${prefix}-summary`,
        type: "summary",
        conceptIds: spec.concepts,
        eyebrow: "Keep this idea",
        heading: spec.takeaway,
        message: "Carry the reasoning into the next lesson: meaning chooses the structure, and the structure organizes the forms.",
        ideas: [
          { label: "NOTICE", question: "What is this sentence trying to do?", uses: ["read the whole context", "name the information job"] },
          { label: "BUILD", question: "How does Spanish carry that meaning?", uses: ["apply the pattern", "check the complete message"] },
        ],
      },
    ],
    completion: {
      title: "The pattern is ready to travel.",
      message: `You explained, recognized, built, retrieved, and produced the central idea from ${spec.title}.`,
    },
  };
}
