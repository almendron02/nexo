import { CourseIndex } from "@/components/CourseIndex";
import { createClient } from "@/lib/supabase/server";

export default async function CoursePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <CourseIndex authenticated={Boolean(user)} />;
}
