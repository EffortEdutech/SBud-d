# Academic Profile API

Status: MVP Stabilization Pass 1 Supabase wiring
Last updated: 2026-07-15

---

# 1. Purpose

Sprint 4 adds the first academic profile and dashboard API slice.

The API defaults to an in-memory fixture repository for local/demo validation. MVP
Stabilization Pass 1 adds Supabase-backed repository paths for academic profile,
subjects, and persisted dashboard aggregation when `SBUD_API_DATA_MODE=supabase`.

In Supabase mode, requests must include an authenticated bearer token. Mobile clients
still call the API; they must not write directly to Supabase tables.

---

# 2. Endpoints

Base URL:

```text
http://localhost:4801/api/v1
```

Academic profile:

```text
GET /academic/profile
PUT /academic/profile
```

Subjects:

```text
GET /academic/subjects
POST /academic/subjects
```

Dashboard:

```text
GET /dashboard
```

---

# 3. Example Subject Payload

```json
{
  "name": "Database Systems",
  "code": "DBS101",
  "creditHours": 3,
  "lecturerName": "Optional lecturer name"
}
```

---

# 4. Persistence Path

Supabase-backed academic persistence maps to:

- `public.academic_profiles`
- `public.academic_semesters`
- `public.academic_subjects`

The dashboard endpoint also aggregates persisted document metadata, PLKG summary, and study summary
through their API service boundaries while keeping the existing `DashboardSummary` response shape.

RLS policy references live in:

```text
database/policies/academic_profile_rls.sql
```

The repository reads and writes using a server-side Supabase client with the request
bearer token so RLS can evaluate the authenticated student.
