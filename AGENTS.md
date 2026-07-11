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

This project is in Sprint 1: Tooling, Standards, and CI Foundation.

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

Implementation folders are scaffolded, but application and service code have not started yet. Sprint 1 is limited to tooling, standards, validation, and CI foundation. Do not invent implementation structure that conflicts with Volume G2.

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
corepack pnpm graph:update
~~~

Current command behavior:

- `dev`, `build`, `lint`, `typecheck`, and `test` run package-level scripts when packages exist.
- `format` formats active tooling, config, and code files.
- `format:check` checks active tooling, config, and code files without rewriting frozen architecture documents.
- `lint` runs ESLint.
- `typecheck` runs TypeScript.
- `test` runs Vitest.
- `check` runs format check, lint, typecheck, and test.
- `graph:update` refreshes Graphify through `scripts/graphify.ps1`.

These commands are baseline workspace commands. Production dependencies require explicit approval. Supabase is not configured yet and is deferred until the data/authentication sprint.

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
