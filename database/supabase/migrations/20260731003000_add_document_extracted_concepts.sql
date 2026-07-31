alter table public.learning_documents
add column if not exists extracted_concepts jsonb not null default '[]'::jsonb;

comment on column public.learning_documents.extracted_concepts is
  'Baseline structured concepts extracted from readable learning material and used for PLKG enrichment.';
