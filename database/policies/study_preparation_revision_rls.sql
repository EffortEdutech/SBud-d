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
