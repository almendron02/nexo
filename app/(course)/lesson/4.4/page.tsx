import { lesson44 } from "@/content/spanish-foundations/module-04";
import { ProtectedLesson } from "@/components/ProtectedLesson";
import { privateLessonMetadata } from "@/lib/seo";

export const metadata = privateLessonMetadata("4.4", "When SER and ESTAR Change Meaning");

export default function LessonFortyFourPage() {
  return <ProtectedLesson lesson={lesson44} />;
}
