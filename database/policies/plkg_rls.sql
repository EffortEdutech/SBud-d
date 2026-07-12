alter table public.plkg_nodes enable row level security;
alter table public.plkg_edges enable row level security;

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
