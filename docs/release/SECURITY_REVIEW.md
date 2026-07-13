# MVP Security Review

Status: Sprint 10 baseline
Last updated: 2026-07-13

---

# 1. Scope

This review covers the MVP implementation through Sprint 10:

- student profile and authentication pattern,
- academic profile and dashboard,
- document library metadata and storage path convention,
- BLIE local provider abstraction,
- PLKG foundation,
- study preparation and revision,
- offline and synchronization baseline.

---

# 2. Security Posture

Current controls:

- no committed `.env` files,
- no committed AI provider keys,
- no committed Supabase service-role keys,
- Supabase migrations use student-owned tables,
- RLS policies use `TO authenticated` and `auth.uid()` ownership checks,
- BLIE request logging avoids student question text and response content,
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

The local API still uses deterministic in-memory fixtures for MVP development flows. Live persistence must be reviewed again when repositories are wired to Supabase.

---

# 4. Known Security Gaps

- Durable encrypted mobile storage is not implemented yet.
- Production monitoring/alerting is not wired yet.
- Real file upload signed URL flow is not implemented yet.
- AI provider integration is not connected yet.
- Production authentication enforcement is represented by patterns and local guards, not a full deployed auth gateway.

These are not blockers for local MVP validation, but they are blockers for broad production release.

---

# 5. Release Requirements

Before public release:

- confirm Supabase RLS policies in the live project,
- confirm private Storage bucket policies,
- confirm no service-role keys exist in client/mobile configuration,
- confirm production logs do not contain student question text, AI responses, uploaded document content, or private tokens,
- confirm account deletion/export requirements are planned before real student onboarding.
