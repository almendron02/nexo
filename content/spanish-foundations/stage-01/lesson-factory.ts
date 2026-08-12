import type {
  BuilderBlock,
  ChoiceBlock,
  ComparisonBlock,
  ConceptId,
  FillBlock,
  FreeWriteBlock,
  LessonDefinition,
  ProseBlock,
  ReadingBlock,
  SortBlock,
  SummaryBlock,
} from "@/content/schemas";

type WithoutBase<T extends { id: string; type: string; conceptIds: ConceptId[] }> = Omit<T, "id" | "type" | "conceptIds"> & {
  conceptIds?: ConceptId[];
};

export interface FoundationLessonSpec {
  id: string;
  moduleId: string;
  title: string;
  displayTitle: string;
  dek: string;
  goal: string;
  durationMinutes: number;
  concepts: ConceptId[];
  opening: WithoutBase<ProseBlock>;
  prediction: WithoutBase<ChoiceBlock>;
  model: WithoutBase<ProseBlock>;
  contrast?: WithoutBase<ComparisonBlock>;
  guided: WithoutBase<ChoiceBlock>;
  sort?: WithoutBase<SortBlock>;
  builder: WithoutBase<BuilderBlock>;
  reading: WithoutBase<ReadingBlock>;
  recall: WithoutBase<FillBlock>;
  production: WithoutBase<FreeWriteBlock>;
  summary: WithoutBase<SummaryBlock>;
  completion: LessonDefinition["completion"];
}

function lessonPrefix(id: string) {
  return `l${id.replace(".", "")}`;
}

export function createFoundationLesson(spec: FoundationLessonSpec): LessonDefinition {
  const prefix = lessonPrefix(spec.id);
  const withBase = <T extends { conceptIds?: ConceptId[] }>(
    id: string,
    type: string,
    block: T,
  ) => ({ ...block, id: `${prefix}-${id}`, type, conceptIds: block.conceptIds ?? spec.concepts });

  const blocks = [
    withBase("opening", "prose", spec.opening),
    withBase("prediction", "choice", spec.prediction),
    withBase("model", "prose", spec.model),
    spec.contrast ? withBase("contrast", "comparison", spec.contrast) : null,
    withBase("guided", "choice", spec.guided),
    spec.sort ? withBase("sort", "sort", spec.sort) : null,
    withBase("builder", "builder", spec.builder),
    withBase("reading", "reading", spec.reading),
    withBase("recall", "fill", spec.recall),
    withBase("production", "free-write", spec.production),
    withBase("summary", "summary", spec.summary),
  ].filter(Boolean) as LessonDefinition["blocks"];

  return {
    id: spec.id,
    moduleId: spec.moduleId,
    title: spec.title,
    displayTitle: spec.displayTitle,
    dek: spec.dek,
    goal: spec.goal,
    durationMinutes: spec.durationMinutes,
    concepts: spec.concepts,
    blocks,
    completion: spec.completion,
    experience: spec.id.startsWith("0.") ? {
      kind: "lesson",
      contextLabel: `Start Here · Lesson ${spec.id.split(".")[1]}`,
      openingMarker: `00 / ${spec.id.split(".")[1].padStart(2, "0")}`,
      returnHref: "/module/0",
      returnLabel: "Start Here",
    } : undefined,
  };
}
