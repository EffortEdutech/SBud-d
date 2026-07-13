create table if not exists public.study_preparation_plans (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  subject_id uuid not null references public.academic_subjects(id) on delete cascade,
  topic_label text not null,
  readiness_status text not null default 'not_started'
    check (readiness_status in ('not_started', 'preparing', 'ready', 'needs_support')),
  state text not null default 'upcoming'
    check (state in ('upcoming', 'preparing', 'learning', 'revising', 'mastered')),
  prerequisite_labels text[] not null default '{}',
  learning_outcomes text[] not null default '{}',
  tasks jsonb not null default '[]'::jsonb,
  trace jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.study_revision_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  subject_id uuid not null references public.academic_subjects(id) on delete cascade,
  topic_label text not null,
  status text not null default 'queued'
    check (status in ('queued', 'in_progress', 'completed', 'needs_support')),
  priority_label text not null default 'medium'
    check (priority_label in ('low', 'medium', 'high')),
  mastery_score integer not null default 0 check (mastery_score between 0 and 100),
  due_label text not null default 'This week',
  recommended_action text not null,
  flashcards jsonb not null default '[]'::jsonb,
  quiz_questions jsonb not null default '[]'::jsonb,
  trace jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists study_preparation_plans_student_subject_idx
  on public.study_preparation_plans(student_id, subject_id);

create index if not exists study_revision_items_student_subject_idx
  on public.study_revision_items(student_id, subject_id);

alter table public.study_preparation_plans enable row level security;
alter table public.study_revision_items enable row level security;

create policy "Students can read their study preparation plans"
  on public.study_preparation_plans
  for select
  to authenticated
  using ((select auth.uid()) = student_id);

create policy "Students can insert their study preparation plans"
  on public.study_preparation_plans
  for insert
  to authenticated
  with check ((select auth.uid()) = student_id);

create policy "Students can update their study preparation plans"
  on public.study_preparation_plans
  for update
  to authenticated
  using ((select auth.uid()) = student_id)
  with check ((select auth.uid()) = student_id);

create policy "Students can read their study revision items"
  on public.study_revision_items
  for select
  to authenticated
  using ((select auth.uid()) = student_id);

create policy "Students can insert their study revision items"
  on public.study_revision_items
  for insert
  to authenticated
  with check ((select auth.uid()) = student_id);

create policy "Students can update their study revision items"
  on public.study_revision_items
  for update
  to authenticated
  using ((select auth.uid()) = student_id)
  with check ((select auth.uid()) = student_id);
