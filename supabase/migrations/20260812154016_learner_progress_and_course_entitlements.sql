-- Account-backed learner progress and provider-independent course access.
create table public.learner_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_visited_lesson text not null default '0.1', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade, lesson_id text not null,
  completed_at timestamptz not null default now(), primary key (user_id, lesson_id)
);
create table public.learner_attempts (
  user_id uuid not null references auth.users(id) on delete cascade, id text not null, interaction_id text not null,
  answer text not null, correct boolean not null, kind text not null check (kind in ('choice','sort','builder','reading','fill','writing','review')),
  concept_ids text[] not null default '{}', attempt_number integer not null check (attempt_number > 0), created_at timestamptz not null,
  primary key (user_id, id)
);
create table public.concept_evidence (
  user_id uuid not null references auth.users(id) on delete cascade, id text not null, concept_id text not null,
  interaction_id text not null, correct boolean not null, independent boolean not null default false, created_at timestamptz not null,
  primary key (user_id, id)
);
create table public.course_entitlements (
  user_id uuid not null references auth.users(id) on delete cascade, course_id text not null,
  access_type text not null check (access_type in ('lifetime','temporary')),
  status text not null check (status in ('active','refunded','revoked','expired')), source text not null, source_reference text,
  starts_at timestamptz not null default now(), expires_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  primary key (user_id, course_id)
);
create table public.purchases (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null, provider_checkout_id text not null unique, provider_payment_id text, course_id text not null,
  amount_total integer, currency text, status text not null check (status in ('paid','pending','refunded','failed')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index learner_attempts_user_created_idx on public.learner_attempts (user_id, created_at);
create index concept_evidence_user_created_idx on public.concept_evidence (user_id, created_at);
create index purchases_user_created_idx on public.purchases (user_id, created_at);

alter table public.learner_profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.learner_attempts enable row level security;
alter table public.concept_evidence enable row level security;
alter table public.course_entitlements enable row level security;
alter table public.purchases enable row level security;

grant select, insert, update on public.learner_profiles to authenticated;
grant select, insert on public.lesson_progress to authenticated;
grant select, insert on public.learner_attempts to authenticated;
grant select, insert on public.concept_evidence to authenticated;
grant select on public.course_entitlements to authenticated;
grant select on public.purchases to authenticated;
grant all on public.learner_profiles, public.lesson_progress, public.learner_attempts, public.concept_evidence, public.course_entitlements, public.purchases to service_role;

create policy "Learners read their own profile" on public.learner_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners create their own profile" on public.learner_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Learners update their own profile" on public.learner_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Learners read their own lesson progress" on public.lesson_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners record their own lesson progress" on public.lesson_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Learners read their own attempts" on public.learner_attempts for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners preserve their own attempts" on public.learner_attempts for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Learners read their own concept evidence" on public.concept_evidence for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners preserve their own concept evidence" on public.concept_evidence for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Learners read their own course access" on public.course_entitlements for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners read their own purchases" on public.purchases for select to authenticated using ((select auth.uid()) = user_id);
