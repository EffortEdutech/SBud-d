alter table public.learning_documents
add column if not exists extracted_text text;

comment on column public.learning_documents.extracted_text is
  'Baseline extracted readable text from uploaded learning material. Used before concept extraction and PLKG enrichment.';
