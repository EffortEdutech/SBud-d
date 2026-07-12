# Document Library API

Status: Sprint 5 foundation
Last updated: 2026-07-12

---

# 1. Scope

Sprint 5 introduces the document library metadata contract.

The local API stores document metadata in memory so the mobile Library tab can exercise the
student flow before Supabase Storage and background document intelligence workers are linked.

No real file bytes are uploaded in this sprint.

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

---

# 5. Security

The reference SQL enforces:

- `learning_documents.student_id` ownership checks through RLS.
- `TO authenticated` policies.
- private `student-documents` bucket access.
- storage object paths scoped to the authenticated student's id.

Do not commit `.env` files, service-role keys, storage tokens, or Supabase secrets.
