import { notFound } from "next/navigation";
import { CourseModuleOverview } from "@/components/CourseModuleOverview";
import { courseModules, getCourseModule } from "@/content/course-catalog";
import { getLearnerSnapshot } from "@/lib/learner-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return courseModules.filter((module) => module.number !== 4).map((module) => ({ moduleNumber: String(module.number) }));
}

export default async function CourseModulePage({ params }: { params: Promise<{ moduleNumber: string }> }) {
  const { moduleNumber } = await params;
  const number = Number(moduleNumber);
  const courseModule = Number.isInteger(number) ? getCourseModule(number) : undefined;
  if (!courseModule || number === 4) notFound();
  const learner = await getLearnerSnapshot();
  return <CourseModuleOverview authenticated={Boolean(learner.user)} module={courseModule} />;
}
