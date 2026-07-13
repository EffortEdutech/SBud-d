# AI Study Buddy Roadmap

Status: Living roadmap
Current sprint: Sprint 10 - MVP Quality, Security, and Release Readiness
Last updated: 2026-07-13

---

# 1. Current Phase

AI Study Buddy is moving from documentation-first architecture into implementation.

Current focus:

- Add MVP readiness integration coverage.
- Add no-tracked-secret-file release validation.
- Add release readiness, security review, known issues, and release notes docs.
- Add a local MVP release gate command.

---

# 2. MVP Delivery Path

The MVP follows `docs/v1/Volume G13 - MVP Delivery Roadmap.md`.

## Phase 1 - Foundation

Objective:

Create the stable engineering platform.

Sprint coverage:

- Sprint 0 - Engineering Workspace Foundation.
- Sprint 1 - Tooling, Standards, and CI Foundation.
- Sprint 2 - Application and Backend Shells.
- Sprint 3 - Data and Authentication Foundation.

## Phase 2 - Academic Foundation

Objective:

Allow students to define and manage their academic journey.

Sprint coverage:

- Sprint 4 - Academic Profile and Dashboard Slice.

## Phase 3 - Document Intelligence

Objective:

Transform student learning resources into structured educational knowledge.

Sprint coverage:

- Sprint 5 - Document Library Foundation.

## Phase 4 - BLIE

Objective:

Deliver personalized learning assistance through BLIE.

Sprint coverage:

- Sprint 6 - BLIE Minimum Useful Chat.

## Phase 5 - PLKG

Objective:

Build the first student-owned Personal Learning Knowledge Graph.

Sprint coverage:

- Sprint 7 - Basic PLKG Foundation.

## Phase 6 - Study Preparation

Objective:

Provide personalized preparation and revision guidance.

Sprint coverage:

- Sprint 8 - Study Preparation and Revision MVP.

## Phase 7 - Offline Learning

Objective:

Support meaningful offline learning and safe synchronization.

Sprint coverage:

- Sprint 9 - Offline and Synchronization Baseline.

## Phase 8 - Quality Validation

Objective:

Prepare a stable MVP for controlled testing and release.

Sprint coverage:

- Sprint 10 - MVP Quality, Security, and Release Readiness.

---

# 3. Sprint 0 Exit Criteria

Sprint 0 is complete when:

1. Root `README.md` exists. Done.
2. Root `ROADMAP.md` exists. Done.
3. Monorepo folders match Volume G2. Done.
4. Package manager decision is recorded. Done.
5. Initial workspace config exists. Done.
6. Baseline scripts are documented. Done.
7. `AGENTS.md` reflects known commands. Done.
8. `docs/planning/IMPLEMENTATION_CHECKLIST.md` is updated. Done.
9. Graphify is refreshed after structure changes. Done.
10. Sprint 1 scope is clear. Done.

---

# 4. Sprint 1 Completion

Sprint 1 established:

- TypeScript workspace baseline. Done.
- Formatting and linting configuration. Done.
- Test runner baseline. Done.
- Local validation script. Done.
- Dependency approval policy. Done.
- CI workflow draft. Done.

Sprint 1 is complete.

---

# 5. Sprint 2 Current Scope

Sprint 2 established:

- Expo mobile shell using localhost port `4800` for local development.
- NestJS API shell using localhost port `4801` for local development.
- Shared health/status types.
- Mobile/API connection strategy.
- Baseline checks across the new workspace packages.

Sprint 2 is complete.

---

# 6. Sprint 3 Completion

Sprint 3 established:

- Supabase migration workflow under `database/supabase`.
- Student profile schema with student-owned RLS policies.
- Supabase Auth client pattern for mobile sign-up, sign-in, and sign-out.
- Backend authenticated user context pattern.
- No committed secrets or live project credentials.

Sprint 3 is complete.

---

# 7. Sprint 4 Completion

Sprint 4 established:

- Academic profile setup placeholder.
- Current semester setup placeholder.
- Subject enrollment placeholder.
- Dashboard academic overview.
- BLIE guidance placeholder.
- Student-owned academic schema and RLS reference.

Sprint 4 is complete.

---

# 8. Sprint 5 Completion

Sprint 5 established:

- Document metadata and processing status types.
- Document library and document detail endpoints.
- Upload metadata validation.
- Student-owned storage path convention.
- Private storage bucket policy reference.
- Mobile Library tab with empty, loading, connected, and metadata-upload states.

Sprint 5 is complete.

---

# 9. Sprint 6 Completion

Sprint 6 established:

- BLIE chat request and response contract.
- API-side BLIE service boundary.
- Local provider abstraction for deterministic learning responses.
- Retrieval-first context assembly using academic, subject, document, and PLKG placeholder context.
- Mobile BLIE chat screen with subject context selector.
- Safe request logging without question or response content.

Sprint 6 is complete.

---

# 10. Sprint 7 Completion

Sprint 7 established:

- PLKG node and edge shared types.
- Student-owned PLKG schema and RLS reference.
- API PLKG summary, nodes, edges, and learning-activity endpoints.
- Initial graph seeded from academic profile, subjects, documents, and BLIE activity.
- BLIE retrieval from PLKG context before generation.
- Mobile PLKG overview with growth metrics and knowledge gaps.

Sprint 7 is complete.

---

# 11. Sprint 8 Completion

Sprint 8 established:

- Preparation plan and revision item shared types.
- Student-owned study preparation/revision schema and RLS reference.
- API study summary, preparation, revision, and reflection endpoints.
- Flashcard and quiz placeholders generated from PLKG context.
- Mobile Study tab with readiness, preparation, revision, and review actions.

Sprint 8 is complete.

---

# 12. Sprint 9 Completion

Sprint 9 established:

- Sync queue shared types.
- API sync status, conflict-rules, and push endpoints.
- Student-owned sync queue schema and RLS reference.
- Mobile learning snapshot cache for offline access.
- Mobile pending queue and Sync tab for reconnect behavior.

Sprint 9 is complete.

---

# 13. Sprint 10 Current Scope

Sprint 10 establishes:

- MVP readiness integration test.
- Local release gate script and `mvp:readiness` command.
- Tracked secret-file validation.
- Required migration file validation.
- Release readiness docs, security review, known issues, and release notes draft.
