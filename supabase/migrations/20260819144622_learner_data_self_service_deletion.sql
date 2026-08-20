-- Let an authenticated learner erase course records without granting access to
-- anyone else's rows. Account deletion remains an Auth-admin operation.
grant delete on public.learner_profiles to authenticated;
grant delete on public.lesson_progress to authenticated;
grant delete on public.learner_attempts to authenticated;
grant delete on public.concept_evidence to authenticated;

create policy "Learners delete their own profile"
on public.learner_profiles for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "Learners delete their own lesson progress"
on public.lesson_progress for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "Learners delete their own attempts"
on public.learner_attempts for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "Learners delete their own concept evidence"
on public.concept_evidence for delete
to authenticated
using ((select auth.uid()) = user_id);
