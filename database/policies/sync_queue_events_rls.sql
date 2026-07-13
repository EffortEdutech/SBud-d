alter table public.sync_queue_events enable row level security;

create policy "Students can read their sync queue events"
  on public.sync_queue_events
  for select
  to authenticated
  using ((select auth.uid()) = student_id);

create policy "Students can insert their sync queue events"
  on public.sync_queue_events
  for insert
  to authenticated
  with check ((select auth.uid()) = student_id);

create policy "Students can update their sync queue events"
  on public.sync_queue_events
  for update
  to authenticated
  using ((select auth.uid()) = student_id)
  with check ((select auth.uid()) = student_id);
