# Document Library API

Status: MVP Stabilization Pass 1 Supabase metadata wiring
Last updated: 2026-07-14

---

# 1. Scope

Sprint 5 introduced the document library metadata contract.

The API defaults to an in-memory fixture repository so the mobile Library tab can exercise
the student flow locally. MVP Stabilization Pass 1 adds a Supabase-backed metadata path
when `SBUD_API_DATA_MODE=supabase`.

No real file bytes are uploaded in this pass. The API stores metadata only.

In Supabase mode, requests must include an authenticated bearer token. Mobile clients still
call the API; they must not write directly to Supabase tables.

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

---

# 3. Processing States

Document processing follows the states from Volume H8:

- `uploaded`
- `processing`
- `understanding`
- `connected`
- `failed`

Sprint 5 exposes these states but does not run OCR, extraction, BLIE, or PLKG enrichment yet.

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

In Supabase mode the API creates metadata in:

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
