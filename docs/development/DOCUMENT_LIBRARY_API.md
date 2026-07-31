# Document Library API

Status: Sprint 13 document text extraction baseline
Last updated: 2026-07-31

---

# 1. Scope

Sprint 5 introduced the document library metadata contract. Sprint 12 added the first real file
upload path for PDF learning materials. Sprint 13 adds baseline embedded-text extraction for
uploaded PDFs.

The API defaults to an in-memory fixture repository so the mobile Library tab can exercise
the student flow locally. MVP Stabilization Pass 1 adds a Supabase-backed metadata path
when `SBUD_API_DATA_MODE=supabase`.

`POST /documents` remains available for metadata-only records. `POST /documents/upload` accepts a
PDF file and stores bytes through the API boundary before creating metadata. `POST
/documents/:id/extract` triggers the baseline text extraction step for an existing document.

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

`POST /documents/upload` is PDF-only for Sprint 12 and Sprint 13.

Example extraction request:

```text
POST /documents/DOCUMENT_ID/extract
```

The extraction response returns the updated document, including `extractedText`, an updated summary,
and processing status `understanding`.

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

OCR, concept extraction, BLIE retrieval, and PLKG enrichment remain deferred to later True Learning
MVP sprints.

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

# 6. Extraction Baseline Limitation

The Sprint 13 extractor is dependency-free and only targets readable embedded text. It does not
perform OCR and should not be treated as a full PDF parser.

This keeps the API/data/UI pipeline small and reviewable before Sprint 14 concept extraction and
PLKG enrichment.
