# Sprint 12 - Real Document Upload And Storage

Status: Planned
Last updated: 2026-07-30

---

# 1. Purpose

Sprint 12 starts the True Learning MVP wow moment:

> A student uploads a lecture PDF, SBud-d extracts concepts, updates the student's PLKG, then BLIE
> shows the three things to understand before the next class and generates a quick quiz.

This sprint covers only the first step of that loop: real document upload and private storage.

The sprint should not attempt text extraction, concept extraction, PLKG enrichment, or real AI
provider integration. Those remain planned for Sprint 13 through Sprint 16.

---

# 2. Sprint Goal

A student can upload a PDF into a subject-owned learning material flow. The API stores the file
bytes in private student-owned storage, persists metadata, and returns a document record with a
visible processing status that prepares the next extraction sprint.

---

# 3. Release Target

Release target:

True Learning MVP.

Controlled Demo MVP carry-over:

Sprint 11 is accepted with a known live-validation blocker. Supabase CLI migration-history
validation and full live RLS validation remain open, but they should not block Sprint 12 planning or
fixture-mode implementation.

---

# 4. Scope

## In Scope

- PDF-only upload for the first MVP file type.
- API-first upload flow.
- Server-side Supabase Storage write path.
- Student-owned private storage path:
  `{studentId}/{subjectId}/{documentId}/{fileName}`.
- Metadata persistence through the existing document repository boundary.
- Processing status update after upload.
- Mobile UI affordance for selecting/uploading a PDF when a supported picker approach is approved.
- Fixture-mode compatibility for local development.
- Tests for upload validation, storage path creation, metadata creation, and error handling.
- Documentation updates for upload commands, environment notes, and known limitations.

## Out Of Scope

- Image upload.
- OCR.
- PDF text extraction.
- Concept extraction.
- PLKG enrichment.
- Real BLIE provider integration.
- Retrieval-backed BLIE answers.
- Background processing worker infrastructure beyond a visible queued/pending status.
- Direct mobile writes to Supabase Storage.
- Service-role keys in mobile or tracked files.

---

# 5. Product Decisions For Sprint 12

## File Type

Decision:

PDF only.

Reason:

The first wow moment is lecture PDF driven. PDF upload is simpler to validate than handling both
PDFs and images at the same time.

## Upload Boundary

Decision:

Mobile uploads through the API. The API writes to private Supabase Storage.

Reason:

This preserves the architecture invariant that mobile clients do not bypass backend business rules.

## Storage Bucket

Decision:

Use the existing private bucket plan:

`student-documents`

## Storage Path

Decision:

Use:

`{studentId}/{subjectId}/{documentId}/{fileName}`

Reason:

This follows the existing Sprint 5 storage convention and keeps ownership visible in object paths.

## Processing Status

Initial Sprint 12 statuses:

- `uploaded`
- `queued_for_extraction`
- `extraction_pending`
- `failed`

Recommended behavior:

After a successful upload, the document should be stored with a status equivalent to
`queued_for_extraction` or `extraction_pending`, depending on the existing type model. Sprint 13
will consume this status for text extraction.

---

# 6. Architecture Guardrails

- Mobile must call API endpoints only.
- The API owns validation, storage path creation, and metadata persistence.
- Storage remains private and student-owned.
- The API must never log file bytes, bearer tokens, Supabase keys, or private URLs.
- Fixture mode remains available and must continue to pass readiness checks.
- Supabase mode must use local-only environment values and must not commit secrets.
- File upload size and MIME validation must fail clearly.
- Processing should be represented as asynchronous even if Sprint 12 only queues the work.

---

# 7. Expected Implementation Areas

Graphify and direct documentation review identify these likely implementation areas for Sprint 12:

- `packages/types/src/document-library.ts`
- `services/api/src/documents/document.controller.ts`
- `services/api/src/documents/document.service.ts`
- `services/api/src/documents/document.repository.ts`
- `services/api/src/supabase/supabase-api-client.ts`
- `apps/mobile/src/documents/document-service.ts`
- `apps/mobile/App.tsx`
- `database/supabase/migrations`
- `database/policies`
- `docs/development/LOCAL_DEVELOPMENT.md`
- `docs/development/SUPABASE_LIVE_VALIDATION.md`
- `docs/release/MVP_KNOWN_ISSUES.md`

Source files must still be inspected directly before editing.

---

# 8. Proposed API Shape

Sprint 12 should prefer a small, stable API surface:

- `POST /api/v1/documents/upload`

Expected request:

- authenticated student context from bearer token,
- subject id,
- file name,
- MIME type,
- PDF bytes as multipart form data.

Expected response:

- document id,
- subject id,
- file name,
- storage path,
- processing status,
- created timestamp,
- updated timestamp.

If multipart support introduces a new production dependency, stop and ask for approval before adding
it.

---

# 9. Test Plan

Minimum automated coverage:

- Reject unsupported MIME types.
- Reject missing subject id.
- Reject missing file.
- Create student-owned storage path.
- Persist metadata after successful storage write.
- Surface storage failure without creating misleading successful metadata.
- Preserve fixture-mode document creation behavior.
- Keep existing document library endpoint contracts compatible.

Manual validation:

- Upload a small PDF in fixture/local mode if supported by the local UI path.
- Validate Supabase-mode storage only with local environment values and without printing secrets.
- Confirm the document appears in the mobile library with an extraction-pending status.

---

# 10. Exit Criteria

Sprint 12 is complete when:

1. PDF upload is implemented through the API boundary.
2. File bytes are stored in a private student-owned storage path in Supabase mode.
3. Document metadata persists and remains visible in the mobile library.
4. Processing status clearly prepares Sprint 13 text extraction.
5. Fixture mode remains stable.
6. Relevant tests pass.
7. Documentation and checklist status are updated.
8. Graphify is refreshed.

---

# 11. Known Carry-Over

From Sprint 11:

- Supabase CLI migration-history validation remains blocked by `LegacyDbConfigLoginRoleStatusError`
  / HTTP 403.
- Full live RLS validation still requires project access and two local-only authenticated test-user
  sessions.

From Sprint 12 to Sprint 13:

- Text extraction remains pending.
- Concept extraction remains pending.
- PLKG enrichment remains pending.
- BLIE retrieval and quiz generation remain pending.

