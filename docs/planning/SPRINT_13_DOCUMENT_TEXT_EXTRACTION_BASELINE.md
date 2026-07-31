# Sprint 13 - Document Text Extraction Baseline

Status: Implemented
Last updated: 2026-07-31

---

# 1. Goal

Sprint 13 advances the True Learning MVP wow moment:

Lecture PDF upload -> text extraction -> concept extraction -> PLKG enrichment -> BLIE preparation
priorities -> quick quiz.

Sprint 12 made uploaded PDFs real by storing file bytes through the API boundary. Sprint 13 adds the
first processing step after upload: extract readable embedded text and persist it with the document.

---

# 2. Scope

Included:

- API endpoint to trigger extraction for an uploaded document.
- Fixture-mode extraction for local demos and tests.
- Supabase-mode extraction that downloads the private storage object through the API server.
- `learning_documents.extracted_text` schema and migration.
- Mobile Library action to trigger extraction and show the extracted text.
- Tests for service and repository behavior.

Not included:

- OCR for scanned PDFs or images.
- Full PDF parser dependency.
- Concept extraction.
- PLKG enrichment from extracted concepts.
- BLIE retrieval from extracted document text.
- Background worker orchestration.

---

# 3. Product Outcome

A controlled tester can now:

1. Upload a sample lecture PDF from the Library tab.
2. See the document enter `processing`.
3. Tap `Extract text`.
4. See readable extracted text in the document card.
5. Understand that concept extraction and PLKG enrichment are the next step.

This is intentionally small but important: it makes the uploaded document start turning into
learning context.

---

# 4. API Contract

Endpoint:

```text
POST /api/v1/documents/:id/extract
```

Response:

Returns the updated `LearningDocument`, including:

- `extractedText`
- updated `summary`
- processing status `understanding`
- processing label `Readable text extracted. Ready for concept extraction.`
- processing progress `45`

Failure behavior:

- returns not found when the document does not belong to the authenticated student,
- fails if no readable embedded text can be extracted,
- does not expose storage credentials or service-role keys.

---

# 5. Data Changes

New column:

```sql
public.learning_documents.extracted_text text
```

Migration:

```text
database/supabase/migrations/20260731000000_add_document_extracted_text.sql
```

The column stores baseline readable text from uploaded learning material. It is the input for Sprint
14 concept extraction.

---

# 6. Implementation Notes

The baseline extractor is dependency-free. It decodes PDF bytes as text, removes simple PDF syntax
noise, normalizes whitespace, and returns a short summary from the first readable characters.

This is acceptable for controlled MVP progress because:

- it avoids adding an unapproved production dependency,
- it works for simple text-bearing PDFs and the local sample upload,
- it establishes the API/data/UI pipeline needed for later extraction quality improvements.

It is not a replacement for a real PDF parsing/OCR pipeline.

---

# 7. Verification

Completed:

- `corepack pnpm format`
- `corepack pnpm check`
- `corepack pnpm mvp:readiness`
- local fixture-mode upload -> extract smoke test
- `.\scripts\graphify.ps1 update .`
- `git diff --check`

Pending before handoff completion:

- Live Supabase upload and extraction validation with local-only test-user tokens.

Live Supabase validation remains project-owner assisted because it requires local-only Supabase
environment values and authenticated test-user tokens.

---

# 8. Carry-Over To Sprint 14

Sprint 14 should implement:

- concept extraction from `extractedText`,
- student-visible concept list,
- PLKG node/edge enrichment from extracted concepts,
- BLIE context retrieval from document-derived PLKG knowledge.

Ad hoc carry-over:

- Apply migration `20260731000000_add_document_extracted_text.sql` in Supabase.
- Validate `POST /documents/:id/extract` in Supabase mode with a test user.
- Decide whether to approve a PDF parser/OCR dependency for better extraction quality.
