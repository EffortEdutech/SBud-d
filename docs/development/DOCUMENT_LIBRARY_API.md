# Document Library API

Status: Sprint 14 concept extraction and PLKG enrichment
Last updated: 2026-07-31

---

# 1. Scope

Sprint 5 introduced the document library metadata contract. Sprint 12 added the first real file
upload path for PDF learning materials. Sprint 13 adds baseline embedded-text extraction for
uploaded PDFs. Sprint 14 adds baseline concept extraction and PLKG enrichment.

The API defaults to an in-memory fixture repository so the mobile Library tab can exercise
the student flow locally. MVP Stabilization Pass 1 adds a Supabase-backed metadata path
when `SBUD_API_DATA_MODE=supabase`.

`POST /documents` remains available for metadata-only records. `POST /documents/upload` accepts a
PDF file and stores bytes through the API boundary before creating metadata. `POST
/documents/:id/extract` triggers the baseline text extraction step for an existing document.
`POST /documents/:id/concepts` maps extracted concepts into the student's PLKG.

In Supabase mode, requests must include an authenticated bearer token. Mobile clients still
call the API; they must not write directly to Supabase tables or Supabase Storage.

---

# 2. Endpoints

Base URL:

```text
http://localhost:4801/api/v1
```

Endpoints:

- `GET /documents/library`
- `GET /documents`
- `GET /documents/:id`
- `POST /documents`
- `POST /documents/upload`
- `POST /documents/:id/extract`
- `POST /documents/:id/concepts`

Example metadata create request:

```json
{
  "subjectId": "subject-programming",
  "fileName": "lecture-4-recursion.pdf",
  "mimeType": "application/pdf",
  "fileSizeBytes": 2048,
  "topicLabel": "Recursion"
}
```

Example PDF upload request shape:

```text
multipart/form-data
field: subjectId
field: title
field: topicLabel
file: file = application/pdf
```

`POST /documents/upload` is PDF-only for the current MVP processing flow.

Example extraction request:

```text
POST /documents/DOCUMENT_ID/extract
```

The extraction response returns the updated document, including `extractedText`, an updated summary,
and processing status `understanding`.

Example concept mapping request:

```text
POST /documents/DOCUMENT_ID/concepts
```

The concept mapping response returns the updated document, including `extractedConcepts`,
`conceptCount`, and processing status `connected`.

---

# 3. Processing States

Document processing follows the states from Volume H8:

- `uploaded`
- `processing`
- `understanding`
- `connected`
- `failed`

Sprint 12 uses `processing` with the label `PDF uploaded. Waiting for text extraction.` after a
successful upload.

Sprint 13 moves a document to `understanding` with the label `Readable text extracted. Ready for
concept extraction.` after baseline text extraction succeeds.

Sprint 14 moves a document to `connected` with the label `Concepts mapped to your PLKG.` after
baseline concepts are stored and PLKG nodes/edges are created.

OCR, real-provider concept extraction, BLIE retrieval, and student concept edit/reject UI remain
deferred to later True Learning MVP sprints.

---

# 4. Storage Path

Prepared private Supabase Storage bucket:

```text
student-documents
```

Prepared object path pattern:

```text
{studentId}/{subjectId}/{documentId}/{fileName}
```

This path pattern is required for student-owned storage policies.

In Supabase mode the API uploads file bytes to private storage and creates metadata in:

```text
public.learning_documents
```

The stored path still follows the student-owned pattern above.

In Supabase mode, text extraction downloads the object from the private bucket through the API
server and persists extracted text in:

```text
public.learning_documents.extracted_text
```

Migration:

```text
database/supabase/migrations/20260731000000_add_document_extracted_text.sql
database/supabase/migrations/20260731003000_add_document_extracted_concepts.sql
```

Sprint 14 persists concept transparency data in:

```text
public.learning_documents.extracted_concepts
```

The PLKG enrichment step writes to:

```text
public.plkg_nodes
public.plkg_edges
```

---

# 5. Security

The reference SQL enforces:

- `learning_documents.student_id` ownership checks through RLS.
- `TO authenticated` policies.
- private `student-documents` bucket access.
- storage object paths scoped to the authenticated student's id.

Do not commit `.env` files, service-role keys, storage tokens, or Supabase secrets.

---

# 6. Baseline Limitations

The Sprint 13 extractor is dependency-free and only targets readable embedded text. It does not
perform OCR and should not be treated as a full PDF parser.

The Sprint 14 concept extractor is also dependency-free. It identifies topic labels, repeated terms,
and significant phrases from extracted text. It proves the document -> concept -> PLKG pipeline, but
it is not a substitute for real AI-assisted educational concept extraction.
