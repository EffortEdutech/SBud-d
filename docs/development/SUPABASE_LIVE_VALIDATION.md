# Supabase Live Validation Checklist

Status: Ready for project-owner execution with Sprint 14 concept enrichment visibility
Last updated: 2026-07-31

---

# 1. Purpose

This checklist validates the live Supabase project after MVP Stabilization Pass 1 repository wiring.

It confirms:

- local and remote migration history are aligned,
- the API can run in `SBUD_API_DATA_MODE=supabase`,
- authenticated student-owned rows can be read and written,
- cross-student access is blocked by RLS,
- no service-role key is needed by the mobile app or tracked files.
- uploaded PDF text can be extracted through the API boundary and stored on the student-owned
  document row.
- extracted document concepts can be mapped into student-owned PLKG nodes and edges.

Do not paste secrets, bearer tokens, API keys, passwords, or `.env` contents into chat or tracked
files.

---

# 2. Required Local Inputs

Keep these values only in your local terminal or local `.env` files:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SBUD_API_DATA_MODE=supabase`
- two authenticated test-user access tokens:
  - `STUDENT_A_TOKEN`
  - `STUDENT_B_TOKEN`
- two matching test-user ids:
  - `STUDENT_A_ID`
  - `STUDENT_B_ID`

Apply these Sprint 13 and Sprint 14 migrations before extraction/enrichment validation:

```text
database/supabase/migrations/20260731000000_add_document_extracted_text.sql
database/supabase/migrations/20260731003000_add_document_extracted_concepts.sql
```

Use test accounts only. Do not use a real student account for validation.

---

# 3. Migration History Check

Run:

```powershell
npx --yes supabase@latest migration list --workdir database
```

Expected result:

- every local migration id appears in the remote column,
- no unexpected remote-only migration appears without review.

Current known blocker:

- On 2026-07-15, the command still returned `LegacyDbConfigLoginRoleStatusError` / HTTP 403.
- Resolution requires a Supabase account role with permission to access the linked project's CLI
  migration-history endpoint.

---

# 4. Start API in Supabase Mode

In a local terminal where your Supabase variables are already configured:

```powershell
$env:SBUD_API_DATA_MODE = "supabase"
$env:PORT = "4801"
corepack pnpm --filter @sbud-d/api dev
```

Expected result:

- API starts on `http://localhost:4801/api/v1`.
- Startup logs do not print Supabase keys or bearer tokens.

Health check:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:4801/api/v1/health"
```

Expected Sprint 11 health fields:

- `runtime.dataMode` is `supabase`,
- `runtime.supabaseConfigured` is `true`,
- `runtime.liveValidationStatus` is `ready_for_authenticated_validation`.

The response must not include Supabase URLs, keys, bearer tokens, passwords, or `.env` contents.

Mobile demo visibility:

1. Start Expo on port `4800`.
2. Confirm the app's `API runtime` panel shows `Supabase mode`.
3. Sign in through the `Live session` panel using a test user only.
4. Tap `Refresh API data`.
5. Confirm the dashboard and Sync tab reflect authenticated live API data.

---

# 5. Same-Student Read/Write Validation

Use `STUDENT_A_TOKEN` for this section.

Replace placeholder ids such as `SUBJECT_ID`, `REVISION_ITEM_ID`, and `STUDENT_A_ID` before
running commands that include them.

## 5.1 Academic Profile

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:4801/api/v1/academic/profile" `
  -Headers @{ Authorization = "Bearer $env:STUDENT_A_TOKEN" }
```

Expected:

- returns a profile for `STUDENT_A_ID`,
- does not return another student's profile.

## 5.2 Academic Subject

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:4801/api/v1/academic/subjects" `
  -Headers @{ Authorization = "Bearer $env:STUDENT_A_TOKEN" } `
  -ContentType "application/json" `
  -Body '{"name":"Live Validation Subject","code":"LVS101","creditHours":3}'
```

Expected:

- creates a subject owned by `STUDENT_A_ID`.

## 5.3 Document Metadata

Replace `SUBJECT_ID` with a subject id owned by Student A:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:4801/api/v1/documents" `
  -Headers @{ Authorization = "Bearer $env:STUDENT_A_TOKEN" } `
  -ContentType "application/json" `
  -Body '{"subjectId":"SUBJECT_ID","title":"Live Validation Note","fileName":"live-validation.txt","mimeType":"text/plain","fileSizeBytes":128,"topicLabel":"Validation"}'
```

Expected:

- creates metadata only,
- storage path starts with `STUDENT_A_ID/`,
- no real file bytes are uploaded for this metadata-only endpoint.

## 5.3A Document PDF Upload

Replace `SUBJECT_ID` with a subject id owned by Student A and `$samplePath` with a small local PDF
path. This uses PowerShell's .NET multipart support because `curl.exe` may not be available on every
Windows machine:

```powershell
Add-Type -AssemblyName System.Net.Http

$samplePath = "C:\path\to\small.pdf"
$client = [System.Net.Http.HttpClient]::new()
$client.DefaultRequestHeaders.Authorization =
  [System.Net.Http.Headers.AuthenticationHeaderValue]::new("Bearer", $env:STUDENT_A_TOKEN)

$form = [System.Net.Http.MultipartFormDataContent]::new()
$form.Add([System.Net.Http.StringContent]::new("SUBJECT_ID"), "subjectId")
$form.Add([System.Net.Http.StringContent]::new("Live Validation PDF"), "title")
$form.Add([System.Net.Http.StringContent]::new("Validation"), "topicLabel")

$fileBytes = [System.IO.File]::ReadAllBytes($samplePath)
$fileContent = [System.Net.Http.ByteArrayContent]::new($fileBytes)
$fileContent.Headers.ContentType =
  [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("application/pdf")
$form.Add($fileContent, "file", [System.IO.Path]::GetFileName($samplePath))

$response = $client.PostAsync("http://localhost:4801/api/v1/documents/upload", $form).
  GetAwaiter().
  GetResult()

$response.Content.ReadAsStringAsync().GetAwaiter().GetResult()

$response.Dispose()
$form.Dispose()
$client.Dispose()
```

Expected:

- uploads file bytes to the private `student-documents` bucket,
- creates a `learning_documents` row owned by `STUDENT_A_ID`,
- storage path starts with `STUDENT_A_ID/SUBJECT_ID/`,
- processing status is `processing`,
- processing label says the PDF is waiting for text extraction.

Save the returned document id as `DOCUMENT_ID` for the next section.

## 5.3B Document Text Extraction

Replace `DOCUMENT_ID` with the id returned from the PDF upload step:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:4801/api/v1/documents/DOCUMENT_ID/extract" `
  -Headers @{ Authorization = "Bearer $env:STUDENT_A_TOKEN" }
```

Expected:

- the API downloads the student's private storage object,
- `extractedText` is populated when the PDF contains readable embedded text,
- `learning_documents.extracted_text` is updated for `STUDENT_A_ID`,
- processing status is `understanding`,
- processing label says readable text is ready for concept extraction.

## 5.3C Document Concept Mapping And PLKG Enrichment

Replace `DOCUMENT_ID` with the id returned from the PDF upload step:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:4801/api/v1/documents/DOCUMENT_ID/concepts" `
  -Headers @{ Authorization = "Bearer $env:STUDENT_A_TOKEN" }
```

Expected:

- `extractedConcepts` contains baseline concept objects,
- `learning_documents.extracted_concepts` is updated for `STUDENT_A_ID`,
- `conceptCount` matches the extracted concept count,
- processing status is `connected`,
- a document `resource` node and document-sourced `concept` nodes exist in `plkg_nodes`,
- `plkg_edges` contains student-owned `explains` and subject `contains` relationships where
  applicable.

## 5.4 PLKG Learning Activity

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:4801/api/v1/plkg/learning-activity" `
  -Headers @{ Authorization = "Bearer $env:STUDENT_A_TOKEN" } `
  -ContentType "application/json" `
  -Body '{"label":"Live validation learning activity","description":"RLS validation event","subjectId":"SUBJECT_ID","sourceId":"live-validation"}'
```

Expected:

- creates a `learning_activity` node owned by `STUDENT_A_ID`,
- creates a relationship only if a matching student-owned subject PLKG node exists.

## 5.5 Study Summary and Reflection

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:4801/api/v1/study/summary" `
  -Headers @{ Authorization = "Bearer $env:STUDENT_A_TOKEN" }
```

Expected:

- returns Student A preparation and revision items,
- may seed study rows for Student A if none exist yet.

Then record a reflection using a revision item id returned by the summary:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:4801/api/v1/study/revision/reflection" `
  -Headers @{ Authorization = "Bearer $env:STUDENT_A_TOKEN" } `
  -ContentType "application/json" `
  -Body '{"revisionItemId":"REVISION_ITEM_ID","confidenceLevel":80,"reflection":"Live validation reflection."}'
```

Expected:

- updates only Student A's revision item,
- returns `status = completed`.

## 5.6 Sync Queue Event

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:4801/api/v1/sync/push" `
  -Headers @{ Authorization = "Bearer $env:STUDENT_A_TOKEN" } `
  -ContentType "application/json" `
  -Body '{"items":[{"id":"local-live-validation-1","studentId":"STUDENT_A_ID","entityType":"study_reflection","entityId":"REVISION_ITEM_ID","operation":"update","status":"pending","payload":{"confidenceLevel":80},"retryCount":0,"lastError":null,"createdAt":"2026-07-15T00:00:00.000Z","updatedAt":"2026-07-15T00:00:00.000Z"}]}'
```

Expected:

- accepts the Student A queue item,
- persists a `sync_queue_events` row for Student A,
- returns the local queue id as `synced` so the mobile queue can clear it.

## 5.7 Dashboard

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:4801/api/v1/dashboard" `
  -Headers @{ Authorization = "Bearer $env:STUDENT_A_TOKEN" }
```

Expected:

- returns Student A academic overview,
- dashboard labels reflect Student A documents, PLKG, and study data,
- no Student B data appears.

---

# 6. Cross-Student Denial Validation

Use both `STUDENT_A_TOKEN` and `STUDENT_B_TOKEN`.

Validation pattern:

1. Create a row using Student A.
2. Try to access or update that row using Student B.
3. Confirm Student B receives no row or a not-found/error response.
4. Confirm the database row remains owned by Student A.

Minimum cross-student checks:

- Student B cannot read Student A academic profile data.
- Student B cannot read Student A document metadata by id.
- Student B cannot read Student A PLKG nodes/edges.
- Student B cannot update Student A study revision item.
- Student B cannot read Student A sync queue events.

If any Student B request returns Student A data, stop validation and treat it as a release-blocking
RLS failure.

---

# 7. Supabase Dashboard Checks

In the Supabase dashboard, confirm:

- RLS is enabled for every student-owned public table.
- Policies use `TO authenticated`.
- Ownership predicates use `(select auth.uid()) = student_id` or the appropriate owner column.
- No service-role key is present in mobile configuration.
- `student-documents` remains a private bucket.
- Database advisors do not report unresolved critical security findings for MVP tables.

Student-owned tables:

- `student_profiles`
- `academic_profiles`
- `academic_semesters`
- `academic_subjects`
- `learning_documents`
- `plkg_nodes`
- `plkg_edges`
- `study_preparation_plans`
- `study_revision_items`
- `sync_queue_events`

---

# 8. Result Recording

Record results in `docs/planning/MVP_STABILIZATION_PASS_1.md` without secrets:

- migration history: passed / blocked,
- same-student read/write validation: passed / failed,
- cross-student denial validation: passed / failed,
- database advisors: passed / blocked / findings,
- date and initials.

Do not record test-user emails, access tokens, API keys, or full response bodies that include private
student data.
