-- Reference copy of the student_profiles RLS policies.
-- Source of truth for execution is database/supabase/migrations.

alter table public.student_profiles enable row level security;

grant select, insert, update on table public.student_profiles to authenticated;

create policy "Students can read their own profile"
  on public.student_profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Students can create their own profile"
  on public.student_profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Students can update their own profile"
  on public.student_profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
