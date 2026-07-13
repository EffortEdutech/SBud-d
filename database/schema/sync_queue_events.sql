create table public.sync_queue_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  entity_type text not null,
  entity_id text not null,
  operation text not null,
  status text not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  retry_count integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
