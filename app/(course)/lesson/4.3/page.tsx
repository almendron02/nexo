import { lesson43 } from "@/content/spanish-foundations/module-04";
import { ProtectedLesson } from "@/components/ProtectedLesson";
import { privateLessonMetadata } from "@/lib/seo";

export const metadata = privateLessonMetadata("4.3", "SER vs. ESTAR");

export default function Lesson43Page() {
  return <ProtectedLesson lesson={lesson43} />;
}
