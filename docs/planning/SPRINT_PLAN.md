# AI Study Buddy Sprint Plan

Version: 0.1
Status: Living implementation plan
Last updated: 2026-07-14

---

# 1. Purpose

This sprint plan converts the architecture-freeze documents into an execution roadmap for building AI Study Buddy.

The plan follows:

- `docs/v1/Volume G0 - Engineering Constitution.md`
- `docs/v1/Volume G1 - Engineering Strategy & Development Roadmap.md`
- `docs/v1/Volume G2 - Monorepo & Repository Architecture.md`
- `docs/v1/Volume G3 - Technology Stack Specification.md`
- `docs/v1/Volume G12 - Deployment Roadmap.md`
- `docs/v1/Volume G13 - MVP Delivery Roadmap.md`

This document is operational. It may be updated as work progresses, but it must remain aligned with the architecture-freeze volumes.

---

# 2. Current Status

The project has completed the local MVP baseline through Sprint 10 and the Cross-Cutting Checklist.

Existing repository state:

- Architecture and UX documents exist under `docs/v1`.
- Project guidance exists in `AGENTS.md` and `CLAUDE.md`.
- Graphify output exists under `graphify-out`.
- Source implementation folders exist under the approved Volume G2 monorepo layout.
- API/mobile MVP slices exist through academic profile, documents, BLIE chat, PLKG, study, sync, and release readiness.

Current implementation status:

- Current phase: Post-MVP stabilization.
- Next target: MVP Stabilization Pass 1 - Supabase Persistence Wiring.

---

# 3. Delivery Principles

Implementation shall follow these principles.

## Architecture First

Implementation follows the approved documentation. If implementation pressure conflicts with architecture, the architecture is reviewed before code is changed.

## Vertical Slices

Each meaningful capability should move through:

1. Documentation alignment.
2. Technical design.
3. Database/API/backend implementation.
4. Mobile/web interface implementation.
5. Tests.
6. Verification.
7. Graphify refresh.
8. Checklist update.

## Foundation Before Features

The engineering workspace, repo structure, package management, linting, formatting, testing, and basic app/service shells must exist before feature delivery accelerates.

## Small Reviewable Changes

Each sprint should produce clear, reviewable deliverables.

## Living Checklist

`docs/planning/IMPLEMENTATION_CHECKLIST.md` is the tracking source for progress.

---

# 4. Sprint Cadence

Recommended sprint length:

- 1 week for solo/AI-assisted development.
- 2 weeks if multiple workstreams are active.

Sprint ceremony rhythm:

- Sprint start: confirm scope and blockers.
- Daily or session start: update current checklist status.
- Sprint close: verify deliverables, update docs, refresh Graphify, record carry-over.

Status labels:

- `Not Started`
- `In Progress`
- `Blocked`
- `Review`
- `Done`

---

# 5. Sprint Roadmap

## Sprint 0 - Engineering Workspace Foundation

Goal:

Create the repo foundation required to build safely.

Primary references:

- Volume G0
- Volume G2
- Volume G3
- Volume G13 Phase 1

Deliverables:

- Root `README.md`.
- Root `ROADMAP.md`.
- Monorepo folder skeleton aligned with Volume G2.
- Package manager decision recorded.
- Initial workspace configuration.
- Baseline scripts documented.
- Graphify refresh after structure creation.

Exit criteria:

- Repository structure exists.
- Setup instructions are documented.
- No production dependency is added without approval.
- Checklist is updated.

---

## Sprint 1 - Tooling, Standards, and CI Foundation

Goal:

Establish consistent engineering standards before application code grows.

Deliverables:

- TypeScript workspace baseline.
- Formatting and linting configuration.
- Test runner baseline.
- Commit/check scripts.
- CI workflow draft or local validation script.
- Development command documentation.

Exit criteria:

- A clean checkout can install dependencies and run baseline checks.
- Developer commands are documented in `AGENTS.md` or project docs.
- Graphify is refreshed if structure changes.

---

## Sprint 2 - Application and Backend Shells

Goal:

Create the first runnable shells for the product.

Deliverables:

- `apps/mobile` Expo shell.
- `services/api` NestJS shell.
- Shared TypeScript package foundation.
- Basic health endpoint.
- Basic mobile home/dashboard placeholder.
- Local development instructions.

Exit criteria:

- Mobile app starts locally.
- API starts locally.
- Mobile can call API health endpoint or documented placeholder.
- Checks pass.

---

## Sprint 3 - Data and Authentication Foundation

Goal:

Implement the first platform foundation slice for student identity.

Primary references:

- Volume B Account module.
- Volume F1 Database & Data Model Specification.
- Volume G13 Phase 1.
- Volume H3 Student Onboarding Experience.

Deliverables:

- Database folder structure.
- Initial schema/migration convention.
- Supabase project integration plan.
- Authentication flows.
- Student profile data model.
- Authenticated API access pattern.
- Privacy/security notes.

Exit criteria:

- Student can sign up/sign in in the chosen development environment.
- Authenticated user identity is available to backend.
- No secrets are committed.

---

## Sprint 4 - Academic Profile and Dashboard Slice

Goal:

Allow a student to define their learning context.

Primary references:

- Volume B Core User Journey.
- Volume H3 Student Onboarding Experience.
- Volume H4 Dashboard Experience.
- Volume H5 Subject Workspace Experience.

Deliverables:

- Programme setup.
- Semester setup.
- Subject enrolment.
- Initial student dashboard.
- API endpoints for academic profile.
- Persistence and validation.

Exit criteria:

- A student can create a usable academic profile.
- Dashboard reflects selected semester and subjects.
- Tests cover the core flow.

---

## Sprint 5 - Document Library Foundation

Goal:

Create the first learning material upload and management slice.

Primary references:

- Volume F8 Knowledge Processing & Document Intelligence Architecture.
- Volume G8 Document Intelligence Implementation Blueprint.
- Volume H8 Document Library & Knowledge Processing Experience.

Deliverables:

- Document upload UI.
- Supabase Storage integration plan/implementation.
- Document metadata schema.
- Processing status model.
- Basic document list and detail view.

Exit criteria:

- Student can upload and view learning resources.
- Metadata is stored.
- Processing states are visible.
- Security rules prevent cross-student access.

---

## Sprint 6 - BLIE Minimum Useful Chat

Goal:

Deliver the first useful BLIE interaction while preserving provider independence.

Primary references:

- Volume D BLIE.
- Volume F2 BLIE AI Pipeline Specification.
- Volume F7 BLIE Memory Architecture.
- Volume F9 BLIE Retrieval & Reasoning Architecture.
- Volume G6 BLIE Implementation Blueprint.
- Volume H6 BLIE Experience.

Deliverables:

- BLIE service boundary.
- AI provider abstraction.
- Chat endpoint.
- Basic context assembly.
- Mobile BLIE chat interface.
- Response validation placeholder.
- Logging and error handling.

Exit criteria:

- Student can ask BLIE a subject-related question.
- Provider logic is isolated.
- No API keys are committed or printed.
- Failure states are handled clearly.

---

## Sprint 7 - Basic PLKG Foundation

Goal:

Create the first version of student-owned learning memory.

Primary references:

- Volume E PLKG.
- Volume F1 Database & Data Model Specification.
- Volume F7 BLIE Memory Architecture.
- Volume G7 PLKG Implementation Blueprint.
- Volume H7 PLKG Experience.

Deliverables:

- PLKG node/edge schema.
- Student ownership enforcement.
- Basic graph creation from academic profile.
- First learning activity updates.
- Simple visualization or list representation.

Exit criteria:

- Each student has an independent PLKG.
- Basic knowledge nodes can be created and queried.
- BLIE can retrieve relevant context from the PLKG layer.

---

## Sprint 8 - Study Preparation and Revision MVP

Goal:

Make the app proactively useful before and after learning.

Primary references:

- Volume B Learning Preparation and Revision.
- Volume F10 Curriculum Intelligence.
- Volume F11 Assessment & Learning Analytics.
- Volume H9 Study Preparation & Revision Experience.

Deliverables:

- Preparation plan model.
- Revision item model.
- Basic flashcard or quiz generation placeholder.
- Dashboard recommendations.
- Learning gap indicators.

Exit criteria:

- Student receives basic preparation/revision guidance.
- Guidance is tied to subjects and PLKG context.
- UI clearly separates preparation, study, and revision.

---

## Sprint 9 - Offline and Synchronization Baseline

Goal:

Support meaningful offline learning and safe sync.

Primary references:

- Volume F3 Synchronization & Offline Architecture.
- Volume F14 Mobile Application Architecture.
- Volume G5 Mobile Application Implementation Blueprint.

Deliverables:

- Local storage strategy.
- Offline resource access.
- Pending-change queue.
- Basic sync status UI.
- Conflict-handling rules for MVP data.

Exit criteria:

- Key learning data remains usable offline.
- Sync status is visible.
- Reconnect restores cloud consistency for MVP flows.

---

## Sprint 10 - MVP Quality, Security, and Release Readiness

Goal:

Prepare the MVP for controlled testing.

Primary references:

- Volume F6 Security, Privacy & Student Data Protection.
- Volume F16 DevOps, Deployment & Monitoring.
- Volume G11 Testing Strategy.
- Volume G12 Deployment Roadmap.
- Volume G13 MVP Delivery Roadmap.

Deliverables:

- Functional test pass.
- Integration test pass.
- Security review.
- Performance baseline.
- Error logging and monitoring plan.
- Staging/release checklist.
- MVP known issues list.

Exit criteria:

- Core MVP workflows operate reliably.
- No known critical security issue remains open.
- Release checklist is complete.
- Deployment process is documented.

---

## MVP Stabilization Pass 1 - Supabase Persistence Wiring

Goal:

Move the local MVP baseline from fixture-backed API data toward controlled Supabase-backed persistence while preserving fixture mode for local/demo validation.

Primary references:

- Volume F1 Database & Data Model Specification.
- Volume F3 Synchronization & Offline Architecture.
- Volume F6 Security, Privacy & Student Data Protection.
- Volume F15 API & Backend Service Architecture.
- Volume G0 Engineering Constitution.
- `docs/planning/MVP_STABILIZATION_PASS_1.md`.

Deliverables:

- Data mode strategy for fixture mode and Supabase mode.
- Server-side Supabase client boundary for API repositories.
- Supabase-backed repository adapters for academic profile and subjects.
- Supabase-backed repository adapters for document metadata.
- Supabase-backed repository adapters for PLKG nodes and edges.
- Supabase-backed repository adapters for study preparation/revision and sync queue events.
- Dashboard aggregation from persisted API data.
- Mocked adapter tests plus live validation checklist for RLS.
- Updated setup, security, and release docs.

Exit criteria:

- Fixture mode still passes `corepack pnpm mvp:readiness`.
- Supabase mode can read/write the targeted MVP entities for an authenticated student.
- Cross-student access is blocked by RLS in live validation.
- Mobile clients continue to call API endpoints rather than direct database writes.
- No `.env`, service-role key, JWT secret, API key, or private token is tracked.

---

# 6. MVP Release Gate

The MVP is release-ready only when:

1. Student registration and login work.
2. Student can set programme, semester, and subjects.
3. Student can upload learning material.
4. BLIE can provide useful learning assistance.
5. PLKG can store and retrieve basic student learning context.
6. Dashboard reflects learning state.
7. Offline learning baseline works.
8. Synchronization is stable for MVP data.
9. Security rules protect student-owned data.
10. Tests and documentation are current.

---

# 7. Ongoing Maintenance

At the end of every sprint:

1. Update `docs/planning/IMPLEMENTATION_CHECKLIST.md`.
2. Update roadmap/status notes if scope changes.
3. Refresh Graphify after meaningful structure changes.
4. Record blockers and carry-over items.
5. Keep architecture changes out of implementation unless explicitly approved.
