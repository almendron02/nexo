import { lesson42 } from "@/content/spanish-foundations/module-04";
import { ProtectedLesson } from "@/components/ProtectedLesson";
import { privateLessonMetadata } from "@/lib/seo";

export const metadata = privateLessonMetadata("4.2", "Where Things Are");

export default function LessonFortyTwoPage() {
  return <ProtectedLesson lesson={lesson42} />;
}
