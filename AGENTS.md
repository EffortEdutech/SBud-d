# AGENTS.md

## Project Identity

Project name: Sbud-d / AI Study Buddy

AI Study Buddy is a B2C personal AI learning companion for university students. It is built around BLIE, the Buddy Learning Intelligent Engine, and each student's Personal Learning Knowledge Graph.

This repository is part of the Effort Studio AI development workspace.

Central Obsidian vault:

~~~text
C:\Users\user\Documents\00 AI agent\AI-Knowledge
~~~

## Key References

Start with these approved architecture-freeze documents:

- `docs/v1/Volume A - Product Vision & Strategy.md`
- `docs/v1/Volume B - Product Requirements Document (PRD).md`
- `docs/v1/Volume G0 - Engineering Constitution.md`
- `docs/v1/Volume G2 - Monorepo & Repository Architecture.md`
- `docs/v1/Volume G13 - MVP Delivery Roadmap.md`

If file names use an en dash on disk, open the matching `Volume ...` file under `docs/v1`.

## AI Assistant Operating Rules

Before making changes:

1. Read this AGENTS.md.
2. Read CLAUDE.md only if it adds relevant project-specific guidance.
3. Read the key references above before making assumptions about product scope, architecture, roadmap, or implementation order.
4. Query graphify-out/graph.json if it exists.
5. Inspect project docs or source files directly before editing.
6. Preserve the architecture-freeze principles unless the user explicitly asks to revise them.
7. Prefer small, reviewable changes.
8. Do not introduce new production dependencies without approval.
9. Update docs when behavior, architecture, commands, schemas, APIs, or operating rules change.

## Current Project State

This project has completed Sprint 10: MVP Quality, Security, and Release Readiness, plus the Cross-Cutting Checklist audit. The next planned target is MVP Stabilization Pass 1: Supabase Persistence Wiring.

The approved monorepo skeleton from Volume G2 now exists:

- `apps`
- `services`
- `packages`
- `database`
- `infrastructure`
- `docs`
- `knowledge`
- `agents`
- `scripts`
- `tools`
- `tests`

Implementation folders are scaffolded, Sprint 2 added the first runnable mobile/API shells, Sprint 3 added the first Supabase data/authentication foundation, Sprint 4 added the academic profile/dashboard slice, Sprint 5 added the document library foundation, Sprint 6 added the minimum useful BLIE chat slice, Sprint 7 added the basic PLKG foundation, Sprint 8 added the first study preparation and revision MVP, Sprint 9 added the offline and synchronization baseline, Sprint 10 added MVP quality, security, and release readiness, and the Cross-Cutting Checklist completed the MVP baseline audit. Keep implementation aligned with Volume G2 and never commit Supabase or AI provider secrets.

## Architecture Invariants

- AI Study Buddy is a B2C product for individual university students.
- BLIE owns educational intelligence, personalization, memory, curriculum reasoning, and recommendation logic.
- AI providers are model services only; application logic must stay provider-independent.
- Every student owns an independent PLKG.
- Retrieval-before-generation is mandatory for trusted educational context.
- Cloud is the system of record; the mobile app must support meaningful offline learning.
- Privacy, security, maintainability, and documentation-before-implementation are mandatory engineering principles.

## Graphify Rules

Use Graphify for project navigation when graphify-out/graph.json exists:

~~~powershell
.\scripts\graphify.ps1 query "question" --graph "graphify-out\graph.json"
.\scripts\graphify.ps1 explain "symbol-or-file" --graph "graphify-out\graph.json"
.\scripts\graphify.ps1 path "A" "B" --graph "graphify-out\graph.json"
~~~

Refresh Graphify after meaningful structure changes:

~~~powershell
.\scripts\graphify.ps1 update .
~~~

~~~bash
./scripts/graphify.sh update .
~~~

The `.ps1` wrapper is for Windows. The `.sh` wrapper is for Linux/macOS and Claude sandboxes; it installs the PyPI package `graphifyy` on demand and then runs `graphify`.

Current graph scope includes the repository documentation and scaffolded monorepo folders. Markdown semantic extraction may require an LLM API key.

## Obsidian Rules

Use Obsidian for architecture rationale, ADRs, cross-project standards, roadmap context, meeting notes, and research.

Do not duplicate project implementation docs into Obsidian. Link to repository docs instead.

## Commands

Package manager:

- `pnpm` workspaces via Corepack.

Baseline commands:

~~~powershell
corepack pnpm install
corepack pnpm dev
corepack pnpm build
corepack pnpm format
corepack pnpm format:check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm check
corepack pnpm mvp:readiness
corepack pnpm graph:update
~~~

Sprint 2 local commands:

~~~powershell
corepack pnpm --filter @sbud-d/api dev
corepack pnpm --filter @sbud-d/mobile dev
~~~

Use the `4800` port series for localhost development:

- Expo mobile dev server: `4800`
- API server: `4801`

Current command behavior:

- `dev`, `build`, `lint`, `typecheck`, and `test` run package-level scripts when packages exist.
- `format` formats active tooling, config, and code files.
- `format:check` checks active tooling, config, and code files without rewriting frozen architecture documents.
- `lint` runs ESLint.
- `typecheck` runs TypeScript.
- `test` runs Vitest.
- `check` runs format check, lint, typecheck, and test.
- `mvp:readiness` runs install, build, check, tracked-secret-file validation, and required migration presence validation.
- `graph:update` refreshes Graphify through `scripts/graphify.ps1` using the pinned Windows PowerShell path.

These commands are baseline workspace commands. Supabase CLI project linking and migration history repair have been completed by the project owner; live secret values remain local only.

Sprint 3 Supabase notes:

- Use `.env.example` for variable names only.
- Do not commit `.env` files, service-role keys, JWT secrets, API keys, or private tokens.
- Migration files created by Supabase CLI live under `database/supabase/migrations`.
- Student-owned RLS policies must combine `TO authenticated` with an ownership predicate such as `(select auth.uid()) = id`.

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

Sprint 5 storage notes:

- Private Supabase Storage bucket: `student-documents`.
- Student-owned object path pattern: `{studentId}/{subjectId}/{documentId}/{fileName}`.
- Current implementation stores document metadata in memory for local API/mobile flow; Supabase persistence and real file upload are prepared by migration/reference SQL but still require repository wiring and live validation.

Sprint 6 BLIE endpoint:

- `POST /api/v1/blie/chat`

Sprint 6 BLIE notes:

- BLIE uses a local deterministic provider through an AI provider abstraction.
- No AI provider API keys, model secrets, or real provider credentials are committed.
- Context assembly must retrieve academic, subject, document, and PLKG placeholder context before response generation.
- Request logging must avoid student question text and response content.

Sprint 7 PLKG endpoints:

- `GET /api/v1/plkg/summary`
- `GET /api/v1/plkg/nodes`
- `GET /api/v1/plkg/edges`
- `POST /api/v1/plkg/learning-activity`

Sprint 7 PLKG notes:

- PLKG nodes and edges are student-owned.
- BLIE context assembly retrieves PLKG context before generation.
- Supabase persistence is prepared by migration/reference SQL but local API uses in-memory fixtures until repository wiring is implemented.

Sprint 8 study endpoints:

- `GET /api/v1/study/summary`
- `GET /api/v1/study/preparation`
- `GET /api/v1/study/revision`
- `POST /api/v1/study/revision/reflection`

Sprint 8 study notes:

- Preparation and revision guidance is tied to subjects and PLKG context.
- Flashcards and quiz prompts are deterministic MVP placeholders.
- Supabase persistence is prepared by migration/reference SQL but local API uses in-memory fixtures until live project persistence is complete.

Sprint 9 sync endpoints:

- `GET /api/v1/sync/status`
- `GET /api/v1/sync/conflict-rules`
- `POST /api/v1/sync/push`

Sprint 9 sync notes:

- Mobile caches dashboard, document library, PLKG, and study snapshots for offline access.
- Offline document metadata, PLKG learning activity, and study reflection actions are queued locally until sync.
- Local queue storage is in-memory for the baseline; durable encrypted device storage requires an approved mobile storage dependency.

Sprint 10 release readiness notes:

- MVP release readiness docs live under `docs/release`.
- `corepack pnpm mvp:readiness` is the local release gate.
- The current MVP is suitable for controlled local/staging validation, not broad production release.
- Cross-cutting audit status is captured in `docs/release/CROSS_CUTTING_AUDIT.md`.

MVP Stabilization Pass 1 planning notes:

- Planning artifact: `docs/planning/MVP_STABILIZATION_PASS_1.md`.
- Goal: wire Supabase-backed persistence behind API repository boundaries while preserving fixture mode for local/demo validation.
- `SBUD_API_DATA_MODE=fixture|supabase` controls API persistence mode; fixture mode remains the default.
- The server-only Supabase API client boundary lives under `services/api/src/supabase`.
- Academic profile, subjects, and dashboard aggregation are the first Supabase-backed repository slice.
- Initial persistence targets: academic profile, subjects, document metadata, PLKG nodes/edges, study preparation/revision, sync queue events, and dashboard aggregation.
- Mobile clients must continue using API endpoints; do not bypass the API boundary with direct database writes.
- Do not introduce service-role keys into mobile or tracked files.

## Security Rules

- Never read or print `.env` files.
- Never expose secrets, API keys, service-role keys, private tokens, or credentials.
- Keep student data privacy and protection aligned with Volume F6 and the Engineering Constitution.

## Done Criteria

A task is complete when:

- requested setup or changes are implemented,
- relevant checks were run or blockers are explained,
- documentation is updated if needed,
- Graphify is refreshed after meaningful structural changes when possible,
- the final response explains what changed and how it was verified.
