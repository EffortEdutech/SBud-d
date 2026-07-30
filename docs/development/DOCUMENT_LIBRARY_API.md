# Document Library API

Status: Sprint 12 real PDF upload baseline
Last updated: 2026-07-30

---

# 1. Scope

Sprint 5 introduced the document library metadata contract. Sprint 12 adds the first real file
upload path for PDF learning materials.

The API defaults to an in-memory fixture repository so the mobile Library tab can exercise
the student flow locally. MVP Stabilization Pass 1 adds a Supabase-backed metadata path
when `SBUD_API_DATA_MODE=supabase`.

`POST /documents` remains available for metadata-only records. `POST /documents/upload` accepts a
PDF file and stores bytes through the API boundary before creating metadata.

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

`POST /documents/upload` is PDF-only for Sprint 12.

---

# 3. Processing States

Document processing follows the states from Volume H8:

- `uploaded`
- `processing`
- `understanding`
- `connected`
- `failed`

Sprint 12 uses `processing` with the label `PDF uploaded. Waiting for text extraction.` after a
successful upload. OCR, text extraction, BLIE, and PLKG enrichment remain deferred to later True
Learning MVP sprints.

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

---

# 5. Security

The reference SQL enforces:

- `learning_documents.student_id` ownership checks through RLS.
- `TO authenticated` policies.
- private `student-documents` bucket access.
- storage object paths scoped to the authenticated student's id.

Do not commit `.env` files, service-role keys, storage tokens, or Supabase secrets.
