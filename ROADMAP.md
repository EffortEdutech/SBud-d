# AI Study Buddy Roadmap

Status: Living roadmap
Current sprint: Sprint 5 - Document Library Foundation
Last updated: 2026-07-12

---

# 1. Current Phase

AI Study Buddy is moving from documentation-first architecture into implementation.

Current focus:

- Add document library metadata endpoints.
- Add upload validation and processing status placeholders.
- Prepare student-owned Supabase Storage paths and RLS policies.
- Wire the mobile Library tab to the API with offline fallback.

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

# 8. Sprint 5 Current Scope

Sprint 5 establishes:

- Document metadata and processing status types.
- Document library and document detail endpoints.
- Upload metadata validation.
- Student-owned storage path convention.
- Private storage bucket policy reference.
- Mobile Library tab with empty, loading, connected, and metadata-upload states.
