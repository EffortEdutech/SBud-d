# AI Study Buddy

# Volume G2 – Monorepo & Repository Architecture

**Version:** 1.0 (Architecture Freeze)

---

# 1. Introduction

The Monorepo & Repository Architecture defines the organization of all source code, documentation, shared libraries, services, infrastructure, and AI engineering assets.

The objective is to provide a single, coherent repository that supports long-term maintainability and AI-assisted development.

---

# 2. Repository Philosophy

One repository.

One architecture.

One source of truth.

Every component shares the same engineering standards, tooling, and documentation.

---

# 3. High-Level Repository Structure

```text
ai-study-buddy/

├── apps/
│   ├── mobile/
│   ├── admin/
│   └── web/
│
├── services/
│   ├── api/
│   ├── blie/
│   ├── document-intelligence/
│   ├── curriculum/
│   ├── assessment/
│   ├── study-group/
│   ├── notification/
│   └── subscription/
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── sdk/
│   ├── shared/
│   └── prompts/
│
├── database/
│   ├── schema/
│   ├── migrations/
│   ├── seeds/
│   └── policies/
│
├── infrastructure/
│
├── docs/
│
├── knowledge/
│
├── agents/
│
├── scripts/
│
├── tools/
│
├── tests/
│
├── AGENTS.md
├── README.md
└── ROADMAP.md
```

---

# 4. Applications Layer

The `apps/` directory contains user-facing applications.

Examples:

- Mobile application.
- Administrator portal.
- Future web application.

Applications contain presentation logic only.

Business rules remain in backend services.

---

# 5. Services Layer

Each service owns one business capability.

Examples:

- BLIE.
- Curriculum.
- Assessment.
- Study Groups.
- Notifications.

Services communicate through APIs and events.

---

# 6. Shared Packages

Reusable code belongs in `packages/`.

Examples:

- UI components.
- Shared TypeScript types.
- SDKs.
- Validation.
- Prompt templates.
- Utilities.

Duplication across services should be avoided.

---

# 7. Database Layer

The `database/` directory contains:

- Schema definitions.
- Migrations.
- Seed data.
- Security policies.

Database changes are version controlled.

---

# 8. Documentation Layer

The `docs/` directory stores all approved architecture volumes and implementation guides.

It is the authoritative engineering reference.

---

# 9. Knowledge Layer

The `knowledge/` directory contains AI-generated engineering knowledge, Graphify outputs, and repository relationship maps for use with Obsidian.

---

# 10. Agents Layer

The `agents/` directory stores AI agent definitions, reusable prompts, engineering workflows, and task templates.

This enables consistent behaviour across AI coding assistants.

---

# 11. Infrastructure Layer

The `infrastructure/` directory defines deployment configuration, environment provisioning, networking, monitoring, and automation.

Infrastructure is managed as code.

---

# 12. Testing Layer

The `tests/` directory contains:

- Unit tests.
- Integration tests.
- End-to-end tests.
- Performance tests.
- AI evaluation suites.

Testing is treated as a first-class engineering activity.

---

# 13. Repository Governance

Every change must:

1. Follow the Engineering Constitution.
2. Respect the approved architecture.
3. Update documentation where required.
4. Include appropriate tests.
5. Pass automated validation before merging.

---

# Architecture Freeze

The Monorepo & Repository Architecture establishes a unified engineering workspace for AI Study Buddy.

The repository shall:

1. Maintain a single source of truth.
2. Separate applications, services, shared packages, and infrastructure.
3. Integrate seamlessly with AI-assisted development workflows.
4. Preserve documentation and engineering knowledge alongside the codebase.
5. Scale from MVP to a globally distributed platform without requiring repository restructuring.

The guiding principle is:

**The repository is more than source code—it is the complete engineering operating system for AI Study Buddy.**

---

**End of Volume G2**
