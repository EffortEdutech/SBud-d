alter table public.learning_documents enable row level security;

create policy "Students can read own learning documents"
on public.learning_documents
for select
to authenticated
using ((select auth.uid()) = student_id);

create policy "Students can create own learning documents"
on public.learning_documents
for insert
to authenticated
with check ((select auth.uid()) = student_id);

create policy "Students can update own learning documents"
on public.learning_documents
for update
to authenticated
using ((select auth.uid()) = student_id)
with check ((select auth.uid()) = student_id);

create policy "Students can read own stored learning documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'student-documents'
  and name like (select auth.uid())::text || '/%'
);

create policy "Students can upload own stored learning documents"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'student-documents'
  and name like (select auth.uid())::text || '/%'
);
