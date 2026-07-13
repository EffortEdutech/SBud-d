create table public.study_preparation_plans (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  subject_id uuid not null references public.academic_subjects(id) on delete cascade,
  topic_label text not null,
  readiness_status text not null,
  state text not null,
  prerequisite_labels text[] not null default '{}',
  learning_outcomes text[] not null default '{}',
  tasks jsonb not null default '[]'::jsonb,
  trace jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.study_revision_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  subject_id uuid not null references public.academic_subjects(id) on delete cascade,
  topic_label text not null,
  status text not null,
  priority_label text not null,
  mastery_score integer not null default 0,
  due_label text not null,
  recommended_action text not null,
  flashcards jsonb not null default '[]'::jsonb,
  quiz_questions jsonb not null default '[]'::jsonb,
  trace jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
