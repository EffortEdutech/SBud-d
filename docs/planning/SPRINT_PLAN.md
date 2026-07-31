# AI Study Buddy Sprint Plan

Version: 0.4
Status: Living implementation plan
Last updated: 2026-07-31

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

- Current phase: True Learning MVP planning, with Controlled Demo MVP live-validation carry-over.
- Current sprint: Sprint 15 - Real BLIE Provider Integration.
- Active implementation target: wire a real OpenAI-compatible BLIE provider behind the existing
  provider abstraction while preserving fixture-safe local mode and server-only secret handling.
- Master plan: `docs/planning/PRODUCT_COMPLETION_MASTER_PLAN.md`.
- Release target scope: `docs/planning/RELEASE_TARGET_SCOPE.md`.
- Sprint 12 plan: `docs/planning/SPRINT_12_REAL_DOCUMENT_UPLOAD_AND_STORAGE.md`.
- Sprint 13 plan: `docs/planning/SPRINT_13_DOCUMENT_TEXT_EXTRACTION_BASELINE.md`.
- Sprint 14 plan: `docs/planning/SPRINT_14_CONCEPT_EXTRACTION_AND_PLKG_ENRICHMENT.md`.
- Sprint 15 plan: `docs/planning/SPRINT_15_REAL_BLIE_PROVIDER_INTEGRATION.md`.
- Product-defining wow moment: lecture PDF upload -> concept extraction -> PLKG enrichment -> BLIE
  preparation priorities -> quick quiz.
- Sprint 11 status: Accepted with known live-validation blocker.

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

# 6. Product Completion Roadmap

Sprint 0 through Sprint 10 completed the local MVP baseline. Product completion continues through the master plan in `docs/planning/PRODUCT_COMPLETION_MASTER_PLAN.md`.

The roadmap is now organised around three release targets:

1. Controlled Demo MVP - live data and real student journey visibility.
2. True Learning MVP - upload -> extraction -> PLKG enrichment -> BLIE retrieval -> revision loop.
3. Public Version 1 - onboarding, subscriptions, study groups, web app, production operations, and
   public launch readiness.

## Phase 2 - MVP Stabilization And Live Data Readiness

Goal:

Deliver the Controlled Demo MVP.

Recommended sprint sequence:

- Sprint 11 - Live Validation And Demo Visibility. Accepted with known live-validation blocker.

Exit criteria:

- Supabase mode is live-validated.
- Cross-student RLS denial is confirmed.
- Mobile UI visibly demonstrates persisted live data.

Carry-over:

- Supabase CLI migration-history validation remains blocked by `LegacyDbConfigLoginRoleStatusError`
  / HTTP 403.
- Full live RLS validation remains open and must be completed when project access and local-only
  test-user sessions are available.

## Phase 3 - True MVP Completion

Goal:

Deliver the True Learning MVP around the real user wow moment.

Recommended sprint sequence:

- Sprint 12 - Real Document Upload And Storage.
- Sprint 13 - Document Text Extraction Baseline.
- Sprint 14 - Concept Extraction And PLKG Enrichment.
- Sprint 15 - Real BLIE Provider Integration. Implemented and verified.
- Sprint 16 - Retrieval-Backed BLIE Preparation And Quiz.
- Sprint 17 - Durable Offline Storage And Sync Hardening.
- Sprint 18 - MVP UX Polish And Empty/Error State Completion.
- Sprint 19 - MVP Performance, Security, And Observability Baseline.
- Sprint 20 - Controlled MVP Release Candidate.

Exit criteria:

- Students can complete the real MVP learning loop with live data.
- BLIE uses trusted retrieved student context.
- Document intelligence enriches PLKG.
- BLIE produces three preparation priorities and a quick quiz from uploaded lecture knowledge.
- Offline and sync behavior is reliable enough for controlled student testing.

## Phase 4 - Closed Beta Readiness

Goal:

Prepare the product for a small real-user beta.

Recommended sprint sequence:

- Sprint 21 - Beta Onboarding And Support Flow.
- Sprint 22 - Beta Analytics And Feedback Capture.
- Sprint 23 - Staging Deployment And Release Operations.
- Sprint 24 - Mobile Build Pipeline.
- Sprint 25 - Closed Beta Security And Privacy Review.
- Sprint 26 - Closed Beta Release.

Exit criteria:

- Beta users can onboard without developer help.
- Monitoring, support, feedback, and build workflows are active.

## Phase 5 - Public Version 1 Completion

Goal:

Complete the Version 1 PRD scope for public individual-student use.

Recommended sprint sequence:

- Sprint 27 - Account, Profile, And Settings Completion.
- Sprint 28 - Subscription System.
- Sprint 29 - Notes And Personal Learning Hub Completion.
- Sprint 30 - Revision Centre Completion.
- Sprint 31 - Progress Dashboard And Learning Analytics Completion.
- Sprint 32 - Study Groups MVP.
- Sprint 33 - Web Application Baseline.
- Sprint 34 - Public Release Security And Compliance Review.
- Sprint 35 - App Store And Web Launch Readiness.
- Sprint 36 - Public Version 1 Launch.

Exit criteria:

- PRD Version 1 scope is implemented or explicitly deferred by decision.
- Public release gate passes.

## Phase 6 - Learning Intelligence Expansion

Goal:

Expand from useful MVP companion to proactive learning intelligence.

Capability groups:

- Curriculum intelligence.
- Deeper knowledge extraction.
- Learning analytics.
- Assessment tracking.
- Stronger revision engine.

## Phase 7 - Collaboration And Knowledge Sharing

Goal:

Add collaborative learning while preserving independent PLKG ownership.

Capability groups:

- Study groups.
- Shared resources.
- Group subscriptions.
- Collaborative AI.
- Shared revision tools.

## Phase 8 - Intelligence Expansion And Platform Growth

Goal:

Grow toward the long-term AI Study Buddy platform.

Capability groups:

- Advanced BLIE reasoning.
- Predictive learning.
- Voice capabilities.
- Marketplace.
- Creator programme.
- Career guidance.
- Global scale and operational hardening.

---

# 7. MVP Release Gate

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

# 8. Ongoing Maintenance

At the end of every sprint:

1. Update `docs/planning/IMPLEMENTATION_CHECKLIST.md`.
2. Update roadmap/status notes if scope changes.
3. Refresh Graphify after meaningful structure changes.
4. Record blockers and carry-over items.
5. Keep architecture changes out of implementation unless explicitly approved.
