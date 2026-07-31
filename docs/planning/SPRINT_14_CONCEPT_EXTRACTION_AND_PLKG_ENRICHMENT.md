# Sprint 14 - Concept Extraction And PLKG Enrichment

Status: Implemented
Last updated: 2026-07-31

---

# 1. Goal

Sprint 14 advances the True Learning MVP wow moment:

Lecture PDF upload -> text extraction -> concept extraction -> PLKG enrichment -> BLIE preparation
priorities -> quick quiz.

Sprint 13 made readable document text available. Sprint 14 turns that text into structured learning
concepts and maps them into the student's Personal Learning Knowledge Graph.

---

# 2. Scope

Included:

- Deterministic baseline concept extraction from `LearningDocument.extractedText`.
- API endpoint to map document concepts into the PLKG.
- Document-level `extractedConcepts` list for transparency in the Library UI.
- Supabase `learning_documents.extracted_concepts` JSONB persistence.
- PLKG resource node, concept nodes, and document/subject edges.
- Mobile Library action to trigger concept mapping.
- Tests for document concept mapping and document concept persistence.

Not included:

- External AI provider concept extraction.
- OCR or high-fidelity PDF parsing.
- Advanced duplicate concept merging across documents.
- BLIE real-provider retrieval responses from document-derived knowledge.
- Student concept edit/reject UI.

---

# 3. Product Outcome

A controlled tester can now:

1. Upload a sample lecture PDF.
2. Extract readable text.
3. Tap `Map concepts`.
4. See extracted concepts on the document card.
5. See PLKG status refresh after document-derived concepts are added.

This is the first sprint where an uploaded document becomes student-owned learning memory.

---

# 4. API Contract

Endpoint:

```text
POST /api/v1/documents/:id/concepts
```

Precondition:

- `POST /api/v1/documents/:id/extract` has already populated `extractedText`.

Response:

Returns the updated `LearningDocument`, including:

- `extractedConcepts`
- `conceptCount`
- processing status `connected`
- processing label `Concepts mapped to your PLKG.`
- processing progress `100`

Failure behavior:

- returns not found when the document does not belong to the authenticated student,
- returns bad request when document text has not been extracted,
- does not expose storage credentials, service-role keys, or private tokens.

---

# 5. Data Changes

New column:

```sql
public.learning_documents.extracted_concepts jsonb not null default '[]'::jsonb
```

Migration:

```text
database/supabase/migrations/20260731003000_add_document_extracted_concepts.sql
```

PLKG enrichment uses existing tables:

- `public.plkg_nodes`
- `public.plkg_edges`

Created graph structure:

- one `resource` node for the source document,
- one `concept` node per extracted concept,
- `explains` edges from resource -> concept,
- `contains` edges from subject -> concept when a subject node exists.

---

# 6. Implementation Notes

The baseline concept extractor is dependency-free. It uses topic labels, repeated academic terms,
and significant phrases from extracted text. Each concept includes a source snippet so the student
can see where the concept came from.

This is intentionally a baseline:

- it proves the document -> concept -> PLKG pipeline,
- it remains provider-independent,
- it avoids adding an unapproved production dependency,
- it prepares Sprint 15 and Sprint 16 retrieval-backed BLIE work.

---

# 7. Verification

Completed:

- `corepack pnpm format`
- `corepack pnpm check`
- `corepack pnpm mvp:readiness`
- local fixture-mode upload -> extract -> map concepts smoke test
- `.\scripts\graphify.ps1 update .`
- `git diff --check`

Pending before handoff completion:

- Live Supabase upload, extraction, and concept enrichment validation with local-only test-user
  tokens.

Live Supabase validation remains project-owner assisted because it requires local-only Supabase
environment values and authenticated test-user tokens.

---

# 8. Carry-Over To Sprint 15

Sprint 15 should implement:

- real BLIE provider integration behind the provider abstraction,
- provider-independent safety and configuration rules,
- retrieval-aware prompt/context preparation without exposing secrets.

Ad hoc carry-over:

- Apply migration `20260731003000_add_document_extracted_concepts.sql` in Supabase.
- Validate `POST /documents/:id/concepts` in Supabase mode with a test user.
- Decide whether concept edit/reject UI belongs in Sprint 16 or a later UX polish sprint.
