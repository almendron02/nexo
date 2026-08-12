import type { LessonOutline } from "@/content/schemas";
import { lesson41 } from "./4.1-estar-how-and-where";
import { lesson42 } from "./4.2-where-things-are";
import { lesson43 } from "./4.3-ser-vs-estar";
import { lesson44 } from "./4.4-when-meaning-changes";
import { lesson45 } from "./4.5-hay-vs-estar";
import { stage01Checkpoint } from "./stage-01-checkpoint";

export const module04Lessons: LessonOutline[] = [
  {
    id: "4.1",
    slug: "4.1",
    title: "ESTAR: How and Where",
    shortTitle: "Meet estar",
    description: "Use estar to say how someone is and where someone or something is.",
    durationMinutes: 26,
    archetype: "pattern",
    status: "next",
    concepts: ["estar_forms", "estar_state", "estar_location"],
  },
  {
    id: "4.2",
    slug: "4.2",
    title: "Where Things Are",
    shortTitle: "Location",
    description: "Make location with estar increasingly automatic.",
    durationMinutes: 24,
    archetype: "application",
    status: "locked",
    concepts: ["estar_forms", "estar_location"],
  },
  {
    id: "4.3",
    slug: "4.3",
    title: "SER vs. ESTAR",
    shortTitle: "Meaning decides",
    description: "Choose the verb from the job the sentence is doing.",
    durationMinutes: 28,
    archetype: "concept",
    status: "locked",
    concepts: lesson43.concepts,
  },
  {
    id: "4.4",
    slug: "4.4",
    title: "When SER and ESTAR Change Meaning",
    shortTitle: "Meaning changes",
    description: "See how the verb can change the interpretation of an adjective.",
    durationMinutes: 25,
    archetype: "contrast",
    status: "locked",
    concepts: ["ser_estar_meaning_change"],
  },
  {
    id: "4.5",
    slug: "4.5",
    title: "HAY vs. ESTAR",
    shortTitle: "Existence or location",
    description: "Introduce what exists, then locate what is identified.",
    durationMinutes: 27,
    archetype: "concept",
    status: "locked",
    concepts: ["hay_existence", "hay_vs_estar"],
  },
];

export const module04LessonDefinitions = {
  "4.1": lesson41,
  "4.2": lesson42,
  "4.3": lesson43,
  "4.4": lesson44,
  "4.5": lesson45,
} as const;

export const module04 = {
  id: "module-04",
  number: 4,
  stage: "Stage I · Build Spanish",
  title: "States, places & existence",
  description: "Choose the Spanish verb from the meaning you want to express—not from a shortcut.",
  lessons: module04Lessons,
  lessonDefinitions: module04LessonDefinitions,
  checkpoint: stage01Checkpoint,
};
