# Academic Profile API

Status: Sprint 4 baseline
Last updated: 2026-07-12

---

# 1. Purpose

Sprint 4 adds the first academic profile and dashboard API slice.

The API currently uses an in-memory development repository. Supabase schema and RLS files are prepared, but live persistence is still pending project linking and migration application.

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

The future Supabase-backed version maps to:

- `public.academic_profiles`
- `public.academic_semesters`
- `public.academic_subjects`

RLS policy references live in:

```text
database/policies/academic_profile_rls.sql
```
