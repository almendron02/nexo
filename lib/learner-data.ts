import type { User } from "@supabase/supabase-js";
import { FOUNDATIONS_COURSE_ID, hasActiveCourseEntitlement, type CourseEntitlement } from "@/lib/course-access";
import { createClient } from "@/lib/supabase/server";

export type LearnerSnapshot = {
  completedLessons: string[];
  entitled: boolean;
  user: User | null;
};

export async function getLearnerSnapshot(): Promise<LearnerSnapshot> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { completedLessons: [], entitled: false, user: null };

  const [progressResult, entitlementResult] = await Promise.all([
    supabase.from("lesson_progress").select("lesson_id").order("completed_at", { ascending: true }),
    supabase
      .from("course_entitlements")
      .select("course_id, access_type, status, expires_at")
      .eq("course_id", FOUNDATIONS_COURSE_ID)
      .maybeSingle(),
  ]);

  return {
    completedLessons: (progressResult.data ?? []).map((row) => row.lesson_id),
    entitled: hasActiveCourseEntitlement(entitlementResult.data as CourseEntitlement | null),
    user,
  };
}
