# AI Study Buddy Engineering Standards

Status: Sprint 1 baseline
Last updated: 2026-07-11

---

# 1. Purpose

This document records the baseline engineering standards for Sprint 1.

It supports:

- `docs/v1/Volume G0 - Engineering Constitution.md`
- `docs/v1/Volume G2 - Monorepo & Repository Architecture.md`
- `docs/v1/Volume G3 - Technology Stack Specification.md`
- `docs/v1/Volume G11 - Testing Strategy.md`

---

# 2. Tooling Baseline

The repository uses:

- pnpm workspaces through Corepack.
- TypeScript for implementation code.
- ESLint for linting JavaScript and TypeScript.
- Prettier for formatting active tooling, config, and code files.
- Vitest for the test runner baseline.

Architecture-freeze documents under `docs/v1` are not automatically reformatted by Sprint 1 tooling.

---

# 3. Commands

Run all validation:

```powershell
corepack pnpm check
```

Run the local validation script:

```powershell
.\scripts\check.ps1
```

Individual commands:

```powershell
corepack pnpm format:check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
```

---

# 4. Dependency Approval Rule

Production dependencies require explicit approval before installation.

Development-only dependencies may be added when they directly support the approved sprint scope, but they must be:

- aligned with the approved TypeScript stack,
- documented through `package.json` and `pnpm-lock.yaml`,
- validated through `corepack pnpm check`,
- limited to tooling, testing, formatting, linting, or local automation.

Supabase is approved by the architecture but is not configured yet. Supabase setup is deferred until the data/authentication sprint and must not commit secrets or environment files.

---

# 5. CI Baseline

GitHub Actions runs:

```powershell
pnpm install --frozen-lockfile
pnpm check
```

The CI workflow is intentionally minimal until application and service packages exist.
