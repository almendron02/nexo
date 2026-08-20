import { lesson45 } from "@/content/spanish-foundations/module-04";
import { ProtectedLesson } from "@/components/ProtectedLesson";
import { privateLessonMetadata } from "@/lib/seo";

export const metadata = privateLessonMetadata("4.5", "HAY vs. ESTAR");

export default function LessonFortyFivePage() {
  return <ProtectedLesson lesson={lesson45} />;
}
