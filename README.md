# AI Study Buddy

AI Study Buddy is a B2C personal AI learning companion for university students.

The product is built around:

- BLIE, the Buddy Learning Intelligent Engine.
- Each student's Personal Learning Knowledge Graph.
- A cloud-first, offline-capable learning experience.
- A TypeScript monorepo architecture.

This repository is currently in Sprint 1: Tooling, Standards, and CI Foundation.

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
corepack pnpm graph:update
```

Current command behavior:

- `pnpm dev` runs package-level `dev` scripts when packages exist.
- `pnpm build` runs package-level `build` scripts when packages exist.
- `pnpm format` formats active tooling, config, and code files.
- `pnpm format:check` checks active tooling, config, and code files without rewriting frozen architecture documents.
- `pnpm lint` runs ESLint.
- `pnpm test` runs Vitest.
- `pnpm typecheck` runs TypeScript.
- `pnpm check` runs format check, lint, typecheck, and test.
- `pnpm graph:update` refreshes Graphify.

Sprint 1 installs development-only tooling dependencies. Production dependencies still require explicit approval.

Local validation script:

```powershell
.\scripts\check.ps1
```

Supabase is approved in the architecture, but the project is not connected to Supabase yet. Supabase setup is deferred until the data/authentication sprint and must not introduce secrets into the repository.

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
