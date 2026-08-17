import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type LearnerSnapshot = {
  completedLessons: string[];
  user: User | null;
};

export async function getLearnerSnapshot(): Promise<LearnerSnapshot> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { completedLessons: [], user: null };

  const progressResult = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .order("completed_at", { ascending: true });

  return {
    completedLessons: (progressResult.data ?? []).map((row) => row.lesson_id),
    user,
  };
}
