create table if not exists public.sync_queue_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  entity_type text not null
    check (
      entity_type in (
        'dashboard_snapshot',
        'document_metadata',
        'plkg_learning_activity',
        'study_reflection',
        'study_snapshot'
      )
    ),
  entity_id text not null,
  operation text not null check (operation in ('create', 'update', 'delete')),
  status text not null default 'pending' check (status in ('pending', 'syncing', 'synced', 'failed')),
  payload jsonb not null default '{}'::jsonb,
  retry_count integer not null default 0 check (retry_count >= 0),
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sync_queue_events_student_status_idx
  on public.sync_queue_events(student_id, status, updated_at desc);

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
