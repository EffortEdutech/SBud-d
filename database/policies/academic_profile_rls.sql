-- Reference copy of the Sprint 4 academic profile RLS policies.
-- Source of truth for execution is database/supabase/migrations.

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
