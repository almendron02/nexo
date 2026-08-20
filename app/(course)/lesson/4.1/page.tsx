import { lesson41 } from "@/content/spanish-foundations/module-04";
import { ProtectedLesson } from "@/components/ProtectedLesson";
import { privateLessonMetadata } from "@/lib/seo";

export const metadata = privateLessonMetadata("4.1", "ESTAR: How and Where");

export default function LessonFortyOnePage() {
  return <ProtectedLesson lesson={lesson41} />;
}
