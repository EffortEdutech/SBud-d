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

comment on table public.academic_profiles is
  'Student-owned academic context for programme and academic goals.';

comment on table public.academic_semesters is
  'Student-owned semester containers for academic progression.';

comment on table public.academic_subjects is
  'Student-owned subject enrollments and early learning progress placeholders.';

alter table public.academic_profiles enable row level security;
alter table public.academic_semesters enable row level security;
alter table public.academic_subjects enable row level security;

grant select, insert, update on table public.academic_profiles to authenticated;
grant select, insert, update on table public.academic_semesters to authenticated;
grant select, insert, update on table public.academic_subjects to authenticated;

create policy "Students can read their own academic profile"
  on public.academic_profiles
  for select
  to authenticated
  using ((select auth.uid()) = student_id);

create policy "Students can create their own academic profile"
  on public.academic_profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = student_id);

create policy "Students can update their own academic profile"
  on public.academic_profiles
  for update
  to authenticated
  using ((select auth.uid()) = student_id)
  with check ((select auth.uid()) = student_id);

create policy "Students can read their own semesters"
  on public.academic_semesters
  for select
  to authenticated
  using ((select auth.uid()) = student_id);

create policy "Students can create their own semesters"
  on public.academic_semesters
  for insert
  to authenticated
  with check ((select auth.uid()) = student_id);

create policy "Students can update their own semesters"
  on public.academic_semesters
  for update
  to authenticated
  using ((select auth.uid()) = student_id)
  with check ((select auth.uid()) = student_id);

create policy "Students can read their own subjects"
  on public.academic_subjects
  for select
  to authenticated
  using ((select auth.uid()) = student_id);

create policy "Students can create their own subjects"
  on public.academic_subjects
  for insert
  to authenticated
  with check ((select auth.uid()) = student_id);

create policy "Students can update their own subjects"
  on public.academic_subjects
  for update
  to authenticated
  using ((select auth.uid()) = student_id)
  with check ((select auth.uid()) = student_id);
