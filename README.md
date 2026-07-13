# AI Study Buddy

AI Study Buddy is a B2C personal AI learning companion for university students.

The product is built around:

- BLIE, the Buddy Learning Intelligent Engine.
- Each student's Personal Learning Knowledge Graph.
- A cloud-first, offline-capable learning experience.
- A TypeScript monorepo architecture.

This repository is currently in Sprint 10: MVP Quality, Security, and Release Readiness.

---

# Architecture Source of Truth

Approved architecture documents live in `docs/v1`.

Start with:

- `docs/v1/Volume A - Product Vision & Strategy.md`
- `docs/v1/Volume B - Product Requirements Document (PRD).md`
- `docs/v1/Volume G0 - Engineering Constitution.md`
- `docs/v1/Volume G2 - Monorepo & Repository Architecture.md`
- `docs/v1/Volume G13 - MVP Delivery Roadmap.md`

If filenames use en dashes on disk, open the matching `Volume ...` file under `docs/v1`.

Planning documents live in `docs/planning`.

---

# Repository Structure

```text
.
|-- apps/
|   |-- mobile/
|   |-- admin/
|   `-- web/
|-- services/
|   |-- api/
|   |-- blie/
|   |-- document-intelligence/
|   |-- curriculum/
|   |-- assessment/
|   |-- study-group/
|   |-- notification/
|   `-- subscription/
|-- packages/
|   |-- ui/
|   |-- types/
|   |-- sdk/
|   |-- shared/
|   `-- prompts/
|-- database/
|   |-- schema/
|   |-- migrations/
|   |-- seeds/
|   `-- policies/
|-- infrastructure/
|-- docs/
|-- knowledge/
|-- agents/
|-- scripts/
|-- tools/
`-- tests/
```

This structure follows `Volume G2 - Monorepo & Repository Architecture`.

---

# Workspace Tooling

Package manager:

- pnpm workspaces

Baseline commands:

```powershell
corepack pnpm install
corepack pnpm format:check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm check
corepack pnpm mvp:readiness
corepack pnpm graph:update
```

Current command behavior:

- `pnpm dev` runs package-level `dev` scripts.
- `pnpm build` runs package-level `build` scripts.
- `pnpm format` formats active tooling, config, and code files.
- `pnpm format:check` checks active tooling, config, and code files without rewriting frozen architecture documents.
- `pnpm lint` runs ESLint.
- `pnpm test` runs Vitest.
- `pnpm typecheck` runs TypeScript.
- `pnpm check` runs format check, lint, typecheck, and test.
- `pnpm mvp:readiness` runs the release readiness gate.
- `pnpm graph:update` refreshes Graphify through the pinned Windows PowerShell path.

Sprint 1 installs development-only tooling dependencies. Production dependencies still require explicit approval.

Local validation script:

```powershell
.\scripts\check.ps1
```

Supabase is approved in the architecture, but the project is not connected to Supabase yet. Supabase setup is deferred until the data/authentication sprint and must not introduce secrets into the repository.

Sprint 2 local development:

```powershell
corepack pnpm --filter @sbud-d/api dev
corepack pnpm --filter @sbud-d/mobile dev
```

Local ports:

- API: `http://localhost:4801/api/v1/health`
- Expo: `http://localhost:4800`

See `docs/development/LOCAL_DEVELOPMENT.md`.

Sprint 3 Supabase foundation:

- Migration workflow: `database/supabase/migrations`
- Student profile schema: `public.student_profiles`
- RLS policy reference: `database/policies/student_profiles_rls.sql`
- Setup guide: `docs/development/SUPABASE_SETUP.md`

Supabase is not linked to a live project yet. Use `.env.example` for required variable names only, and keep real `.env` files local.

Sprint 4 academic endpoints:

- `GET /api/v1/academic/profile`
- `PUT /api/v1/academic/profile`
- `GET /api/v1/academic/subjects`
- `POST /api/v1/academic/subjects`
- `GET /api/v1/dashboard`

Sprint 5 document library endpoints:

- `GET /api/v1/documents/library`
- `GET /api/v1/documents`
- `GET /api/v1/documents/:id`
- `POST /api/v1/documents`

Document storage is prepared for a private Supabase Storage bucket named `student-documents`
with student-owned object paths:

```text
{studentId}/{subjectId}/{documentId}/{fileName}
```

Sprint 6 BLIE endpoint:

- `POST /api/v1/blie/chat`

Sprint 6 uses a local provider abstraction for deterministic learning responses. Do not commit
AI provider secrets; real provider wiring remains behind the provider interface.

Sprint 7 PLKG endpoints:

- `GET /api/v1/plkg/summary`
- `GET /api/v1/plkg/nodes`
- `GET /api/v1/plkg/edges`
- `POST /api/v1/plkg/learning-activity`

Sprint 7 introduces the first student-owned PLKG node and edge model with Supabase-ready RLS.

Sprint 8 study endpoints:

- `GET /api/v1/study/summary`
- `GET /api/v1/study/preparation`
- `GET /api/v1/study/revision`
- `POST /api/v1/study/revision/reflection`

Sprint 8 adds preparation plans, revision items, deterministic flashcard/quiz placeholders, and
traceable recommendations from subject and PLKG context.

Sprint 9 sync endpoints:

- `GET /api/v1/sync/status`
- `GET /api/v1/sync/conflict-rules`
- `POST /api/v1/sync/push`

Sprint 9 adds a mobile Sync tab, local learning snapshot cache, pending offline queue, and
Supabase-ready sync queue event schema.

Sprint 10 release readiness:

- `docs/release/MVP_RELEASE_READINESS.md`
- `docs/release/SECURITY_REVIEW.md`
- `docs/release/RELEASE_NOTES_DRAFT.md`
- `docs/release/MVP_KNOWN_ISSUES.md`
- `docs/release/CROSS_CUTTING_AUDIT.md`

Run the local release gate:

```powershell
corepack pnpm mvp:readiness
```

---

# Development Rules

Before implementation work:

1. Read `AGENTS.md`.
2. Read the key architecture-freeze documents.
3. Query Graphify if `graphify-out/graph.json` exists.
4. Inspect relevant files directly before editing.
5. Update `docs/planning/IMPLEMENTATION_CHECKLIST.md` as progress changes.
6. Refresh Graphify after meaningful structure changes.
7. Follow `docs/development/ENGINEERING_STANDARDS.md` for tooling and dependency rules.

Security rule:

- Never read, print, or commit `.env` files or secrets.
