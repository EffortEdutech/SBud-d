create table if not exists public.plkg_nodes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  subject_id uuid references public.academic_subjects(id) on delete set null,
  type text not null check (type in ('subject', 'topic', 'concept', 'resource', 'learning_activity')),
  label text not null,
  description text,
  learning_status text not null default 'introduced' check (
    learning_status in ('introduced', 'learning', 'understanding', 'mastered', 'needs_review')
  ),
  confidence_level integer not null default 0 check (
    confidence_level >= 0 and confidence_level <= 100
  ),
  mastery_score integer not null default 0 check (
    mastery_score >= 0 and mastery_score <= 100
  ),
  source_type text not null default 'manual' check (
    source_type in ('academic_profile', 'document', 'blie_interaction', 'manual')
  ),
  source_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plkg_edges (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  source_node_id uuid not null references public.plkg_nodes(id) on delete cascade,
  target_node_id uuid not null references public.plkg_nodes(id) on delete cascade,
  type text not null check (
    type in ('contains', 'requires', 'related_to', 'explains', 'generated_from', 'reinforces')
  ),
  label text not null,
  strength numeric(3,2) not null default 0.50 check (strength >= 0 and strength <= 1),
  created_at timestamptz not null default now(),
  constraint plkg_edges_no_self_loop check (source_node_id <> target_node_id)
);

comment on table public.plkg_nodes is
  'Student-owned Personal Learning Knowledge Graph nodes.';

comment on table public.plkg_edges is
  'Student-owned Personal Learning Knowledge Graph relationships.';

alter table public.plkg_nodes enable row level security;
alter table public.plkg_edges enable row level security;

grant select, insert, update on public.plkg_nodes to authenticated;
grant select, insert, update on public.plkg_edges to authenticated;

create policy "Students can read own PLKG nodes"
on public.plkg_nodes
for select
to authenticated
using ((select auth.uid()) = student_id);

create policy "Students can create own PLKG nodes"
on public.plkg_nodes
for insert
to authenticated
with check ((select auth.uid()) = student_id);

create policy "Students can update own PLKG nodes"
on public.plkg_nodes
for update
to authenticated
using ((select auth.uid()) = student_id)
with check ((select auth.uid()) = student_id);

create policy "Students can read own PLKG edges"
on public.plkg_edges
for select
to authenticated
using ((select auth.uid()) = student_id);

create policy "Students can create own PLKG edges"
on public.plkg_edges
for insert
to authenticated
with check (
  (select auth.uid()) = student_id
  and exists (
    select 1 from public.plkg_nodes source_node
    where source_node.id = source_node_id
      and source_node.student_id = (select auth.uid())
  )
  and exists (
    select 1 from public.plkg_nodes target_node
    where target_node.id = target_node_id
      and target_node.student_id = (select auth.uid())
  )
);

create policy "Students can update own PLKG edges"
on public.plkg_edges
for update
to authenticated
using ((select auth.uid()) = student_id)
with check ((select auth.uid()) = student_id);
