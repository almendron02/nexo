import { module05LessonDefinitions } from "./module-05";
import { module06LessonDefinitions } from "./module-06";
import { module07LessonDefinitions } from "./module-07";
import { module08LessonDefinitions } from "./module-08";
import { module09LessonDefinitions } from "./module-09";
import { module10LessonDefinitions } from "./module-10";
import { module11LessonDefinitions } from "./module-11";
import { module12LessonDefinitions } from "./module-12";
import { module13LessonDefinitions } from "./module-13";
import { module14LessonDefinitions } from "./module-14";
import { module15LessonDefinitions } from "./module-15";
import { module16LessonDefinitions } from "./module-16";

export { stage02Checkpoint, stage03Checkpoint, stage04Checkpoint, remainingStageCheckpoints } from "./checkpoints";

export const remainingLessonsByModule = {
  5: module05LessonDefinitions,
  6: module06LessonDefinitions,
  7: module07LessonDefinitions,
  8: module08LessonDefinitions,
  9: module09LessonDefinitions,
  10: module10LessonDefinitions,
  11: module11LessonDefinitions,
  12: module12LessonDefinitions,
  13: module13LessonDefinitions,
  14: module14LessonDefinitions,
  15: module15LessonDefinitions,
  16: module16LessonDefinitions,
} as const;

export const remainingLessonDefinitions = Object.values(remainingLessonsByModule).flat();

export const remainingLessonsById = Object.fromEntries(
  remainingLessonDefinitions.map((lesson) => [lesson.id, lesson]),
);
