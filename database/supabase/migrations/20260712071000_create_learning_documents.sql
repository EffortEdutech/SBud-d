create table if not exists public.learning_documents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  subject_id uuid not null references public.academic_subjects(id) on delete cascade,
  title text not null,
  file_name text not null,
  mime_type text not null,
  kind text not null check (kind in ('pdf', 'image', 'note', 'slide', 'reference')),
  file_size_bytes integer not null check (file_size_bytes > 0),
  storage_bucket text not null default 'student-documents',
  storage_path text not null,
  topic_label text,
  processing_status text not null default 'uploaded' check (
    processing_status in ('uploaded', 'processing', 'understanding', 'connected', 'failed')
  ),
  processing_label text not null default 'Document received.',
  processing_progress_percent integer not null default 10 check (
    processing_progress_percent >= 0 and processing_progress_percent <= 100
  ),
  processing_error_message text,
  summary text,
  concept_count integer not null default 0 check (concept_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint learning_documents_student_storage_path_unique unique (student_id, storage_path),
  constraint learning_documents_student_owned_storage_path check (
    storage_path like student_id::text || '/%'
  )
);

comment on table public.learning_documents is
  'Student-owned learning material metadata and document processing state.';

comment on column public.learning_documents.storage_path is
  'Private object storage path. Pattern: {student_id}/{subject_id}/{document_id}/{file_name}.';

alter table public.learning_documents enable row level security;

grant select, insert, update on public.learning_documents to authenticated;

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

insert into storage.buckets (id, name, public)
values ('student-documents', 'student-documents', false)
on conflict (id) do nothing;

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

create policy "Students can update own stored learning documents"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'student-documents'
  and name like (select auth.uid())::text || '/%'
)
with check (
  bucket_id = 'student-documents'
  and name like (select auth.uid())::text || '/%'
);
