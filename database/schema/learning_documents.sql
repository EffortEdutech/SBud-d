create table public.learning_documents (
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
