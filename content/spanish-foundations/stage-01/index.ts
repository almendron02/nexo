import type { LessonDefinition } from "@/content/schemas";
import { module01Lessons } from "./module-01";
import { module02Lessons } from "./module-02";
import { module03Lessons } from "./module-03";
import { startHereLessons } from "./start-here";

export * from "./start-here";
export * from "./module-01";
export * from "./module-02";
export * from "./module-03";

export const preModule04LessonDefinitions = [
  ...startHereLessons,
  ...module01Lessons,
  ...module02Lessons,
  ...module03Lessons,
];

export const preModule04LessonsById = Object.fromEntries(
  preModule04LessonDefinitions.map((lesson) => [lesson.id, lesson]),
) as Record<string, LessonDefinition>;

export const preModule04LessonsByModule = {
  0: startHereLessons,
  1: module01Lessons,
  2: module02Lessons,
  3: module03Lessons,
} as const;
