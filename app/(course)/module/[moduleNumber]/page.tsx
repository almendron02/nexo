import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseModuleOverview } from "@/components/CourseModuleOverview";
import { courseModules, getCourseModule } from "@/content/course-catalog";
import { getLearnerSnapshot } from "@/lib/learner-data";
import { publicPageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return courseModules.filter((module) => module.number !== 4).map((module) => ({ moduleNumber: String(module.number) }));
}

export async function generateMetadata({ params }: { params: Promise<{ moduleNumber: string }> }): Promise<Metadata> {
  const { moduleNumber } = await params;
  const courseModule = getCourseModule(Number(moduleNumber));
  if (!courseModule) return {};
  const isPublic = courseModule.number === 0;
  const title = `Module ${courseModule.number}: ${courseModule.title}`;
  if (isPublic) {
    return publicPageMetadata(title, courseModule.description, `/module/${courseModule.number}`);
  }
  return {
    title,
    description: courseModule.description,
    robots: { index: false, follow: false },
  };
}

export default async function CourseModulePage({ params }: { params: Promise<{ moduleNumber: string }> }) {
  const { moduleNumber } = await params;
  const number = Number(moduleNumber);
  const courseModule = Number.isInteger(number) ? getCourseModule(number) : undefined;
  if (!courseModule || number === 4) notFound();
  const learner = await getLearnerSnapshot();
  return <CourseModuleOverview authenticated={Boolean(learner.user)} module={courseModule} />;
}
