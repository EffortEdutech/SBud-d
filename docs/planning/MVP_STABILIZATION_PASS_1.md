# MVP Stabilization Pass 1 - Supabase Persistence Wiring

Status: In Progress
Last updated: 2026-07-15

---

# 1. Purpose

The local MVP baseline is complete through Sprint 10 and the Cross-Cutting Checklist. This stabilization pass prepares the app for controlled live-data validation by wiring Supabase-backed persistence behind the existing API repository boundaries.

The goal is not to expand product scope. The goal is to make the current MVP slices persist student-owned data safely.

---

# 2. Scope

In scope:

- Data mode strategy for `fixture` and `supabase` modes.
- Server-side Supabase client boundary in the API service.
- Supabase-backed repositories for academic profile and subjects.
- Supabase-backed repositories for document metadata.
- Supabase-backed repositories for PLKG nodes and edges.
- Supabase-backed repositories for study preparation, revision, and sync queue events.
- Dashboard aggregation from persisted API data.
- RLS validation checklist for authenticated student ownership.
- Documentation updates for setup, development, release status, and known issues.

Out of scope:

- Real AI provider wiring.
- Service-role keys in mobile or tracked files.
- Direct mobile database writes.
- Durable encrypted mobile storage dependency.
- Full document file upload and processing pipeline.
- Production observability provider setup.
- App store release preparation.

---

# 3. Architecture Guardrails

- Mobile clients call API endpoints only.
- Business rules remain in API services.
- Supabase access is server-side for this pass.
- Fixture mode remains available for local/demo validation.
- Student ownership remains enforced by RLS and API authorization checks.
- `.env` files, API keys, JWT secrets, service-role keys, and private tokens are never tracked.
- BLIE remains provider-independent and retrieval-before-generation remains mandatory.

---

# 4. Graphify Findings

Graphify identified the relevant repository and service seams for persistence wiring:

- `services/api/src/academic/academic.repository.ts`
- `services/api/src/documents/document.repository.ts`
- `services/api/src/plkg/plkg.repository.ts`
- `services/api/src/study/study.repository.ts`
- `services/api/src/sync/sync.repository.ts`
- `services/api/src/blie/blie-context.ts`
- `services/api/src/app.module.ts`

These files are the likely implementation entry points. Source files must still be inspected directly before editing.

---

# 5. Implementation Sequence

## Step 1 - Data Mode Foundation

- Add documented data mode names to `.env.example`.
- Add API config parsing for fixture mode and Supabase mode.
- Keep fixture mode as the safe local fallback.
- Fail clearly if Supabase mode is selected without required server variables.

Status: Done.

## Step 2 - Supabase API Boundary

- Add a server-only Supabase client factory.
- Keep all client creation inside the API service boundary.
- Ensure logs never print Supabase keys or bearer tokens.
- Keep mobile using API base URL only.

Status: Done.

## Step 3 - Academic Persistence

- Wire academic profile reads and updates.
- Wire subject reads and creation.
- Preserve existing endpoint contracts.
- Add mocked repository tests.

Status: First implementation complete. Live RLS validation is still pending.

## Step 4 - Document Metadata Persistence

- Wire document metadata list/detail/create.
- Preserve the student-owned storage path convention.
- Leave real binary upload and document processing as a later pass unless explicitly approved.

Status: First implementation complete. Real file upload and background processing remain deferred.

## Step 5 - PLKG Persistence

- Wire PLKG summary, nodes, edges, and learning activity persistence.
- Ensure BLIE context assembly retrieves PLKG context through the repository boundary.
- Validate edge creation only connects nodes owned by the authenticated student.

Status: First implementation complete. Live RLS validation is still pending.

## Step 6 - Study and Sync Persistence

- Wire study preparation/revision persistence.
- Wire study reflection updates.
- Wire sync queue event persistence.
- Keep offline queue durability deferred until a storage dependency is approved.

Status: Study preparation/revision persistence and sync queue event persistence are complete. Offline
queue durability remains deferred.

## Step 7 - Dashboard and Release Readiness

- Aggregate dashboard state from persisted API data.
- Update release known issues.
- Run fixture-mode checks.
- Run live Supabase validation checklist.
- Refresh Graphify after code structure changes.

Status: Dashboard aggregation now combines persisted academic, document, PLKG, and study summaries.
Live Supabase RLS validation is still pending.

---

# 6. Checklist

## Planning

- [x] Confirm completed MVP baseline.
- [x] Confirm next target.
- [x] Query Graphify for relevant modules.
- [x] Prepare this plan.
- [x] Confirm data mode variable names.
- [ ] Confirm live validation user approach.

## Implementation

- [x] Data mode config.
- [x] Supabase API client boundary.
- [x] Academic repository adapter.
- [x] Document repository adapter.
- [x] PLKG repository adapter.
- [x] Study repository adapter.
- [x] Sync repository adapter.
- [x] Dashboard persisted aggregation.

## Validation

- [x] Unit tests for fixture mode.
- [x] Mocked Supabase adapter tests.
- [x] `corepack pnpm check`.
- [x] `corepack pnpm mvp:readiness`.
- [!] `npx --yes supabase@latest migration list --workdir database`.
- [ ] Live RLS read/write validation with authenticated student users.
- [ ] Cross-student access denial validation.
- [x] Graphify refresh.

## Documentation

- [x] Update Supabase setup docs.
- [x] Update local development docs.
- [x] Update API docs if behavior changes.
- [x] Update MVP known issues.
- [x] Update roadmap/checklist status.

---

# 7. Exit Criteria

This pass is complete when:

1. Fixture mode remains stable and passes the MVP readiness gate.
2. Supabase mode persists the targeted MVP entities for authenticated students.
3. RLS blocks cross-student access in live validation.
4. Existing API contracts remain compatible with the mobile app.
5. No secrets or local environment files are tracked.
6. Documentation and Graphify are current.

---

# 8. Current Blockers

- 2026-07-14: `npx --yes supabase@latest migration list --workdir database` reached Supabase but returned `LegacyDbConfigLoginRoleStatusError` with HTTP 403. Migration-history confirmation requires a Supabase account/role with the required project access.
