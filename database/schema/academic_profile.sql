-- Reference schema snapshot for academic profile Sprint 4 tables.
-- Source of truth for execution is database/supabase/migrations.

create table public.academic_profiles (
  student_id uuid primary key references public.student_profiles (id) on delete cascade,
  university text,
  programme_name text not null check (char_length(programme_name) between 1 and 160),
  field_of_study text,
  academic_year integer check (academic_year is null or academic_year > 0),
  academic_goals text[] not null default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.academic_semesters (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles (id) on delete cascade,
  label text not null check (char_length(label) between 1 and 80),
  sequence integer not null check (sequence > 0),
  academic_period text,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, sequence)
);

create table public.academic_subjects (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles (id) on delete cascade,
  semester_id uuid not null references public.academic_semesters (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 160),
  code text not null check (char_length(code) between 1 and 40),
  credit_hours integer check (credit_hours is null or credit_hours >= 0),
  lecturer_name text,
  status text not null default 'active',
  current_topic text,
  learning_status text not null default 'New subject workspace ready',
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint academic_subjects_status_check
    check (status in ('active', 'completed', 'dropped')),
  unique (student_id, semester_id, code)
);
