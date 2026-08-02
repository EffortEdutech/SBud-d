# MVP Security Review

Status: Sprint 19 operational security baseline
Last updated: 2026-08-02

---

# 1. Scope

This review covers the MVP implementation through Sprint 19:

- student profile and authentication pattern,
- academic profile and dashboard,
- document library metadata and storage path convention,
- BLIE local provider abstraction,
- PLKG foundation,
- study preparation and revision,
- offline and synchronization baseline,
- real document upload, baseline extraction/concept mapping, retrieval-backed BLIE priorities/quiz,
- local operational health, metadata-only request logging, and release-readiness assertions.

---

# 2. Security Posture

Current controls:

- no committed `.env` files,
- no committed AI provider keys,
- no committed Supabase service-role keys,
- Supabase migrations use student-owned tables,
- RLS policies use `TO authenticated` and `auth.uid()` ownership checks,
- BLIE request logging avoids student question text and response content,
- API request completion logging is metadata-only and strips query values from logged paths,
- mobile API calls use backend endpoints rather than direct database access for app business flows.

---

# 3. Data Isolation

Student-owned entities prepared with RLS:

- `student_profiles`,
- `academic_profiles`,
- `academic_semesters`,
- `academic_subjects`,
- `learning_documents`,
- `plkg_nodes`,
- `plkg_edges`,
- `study_preparation_plans`,
- `study_revision_items`,
- `sync_queue_events`.

MVP Stabilization Pass 1 has wired Supabase repository paths for the student-owned MVP tables.
Live persistence must be validated with:

```text
docs/development/SUPABASE_LIVE_VALIDATION.md
```

---

# 4. Known Security Gaps

- Durable encrypted mobile storage is not implemented yet.
- Production monitoring provider, dashboards, and alerting are not wired yet.
- Real file upload signed URL flow is not implemented yet.
- Real AI provider integration is implemented behind the provider abstraction but still requires controlled local-only credential validation.
- Production authentication enforcement is represented by patterns and local guards, not a full deployed auth gateway.

These are not blockers for local MVP validation, but they are blockers for broad production release.

---

# 5. Release Requirements

Before public release:

- confirm Supabase RLS policies in the live project,
- complete same-student and cross-student RLS validation with two authenticated test users,
- confirm private Storage bucket policies,
- confirm no service-role keys exist in client/mobile configuration,
- confirm production logs do not contain request bodies, query values, authorization headers, student question text, AI responses, uploaded document content, or private tokens,
- confirm account deletion/export requirements are planned before real student onboarding.
