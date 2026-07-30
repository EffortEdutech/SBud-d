# AI Study Buddy Implementation Checklist

Version: 0.2
Status: Living checklist
Last updated: 2026-07-30

---

# Status Legend

- `[ ]` Not started
- `[/]` In progress
- `[!]` Blocked
- `[?]` Needs decision
- `[x]` Done

When work progresses, update this checklist in the same commit or handoff as the implementation change.

---

# Current Sprint

Current sprint: Sprint 12 - Real Document Upload And Storage

Current goal:

Implement the first step of the True Learning MVP wow moment: API-first PDF upload into private
student-owned storage with persisted metadata and visible processing status.

Accepted carry-over:

Sprint 11 is accepted with a known live-validation blocker. Supabase CLI migration-history
validation and full live RLS validation remain open.

Product scope revision:

Controlled Demo MVP -> True Learning MVP -> Public Version 1.

Product-defining wow moment:

Lecture PDF upload -> concept extraction -> PLKG enrichment -> BLIE preparation priorities -> quick
quiz.

---

# Sprint 0 - Engineering Workspace Foundation

## Planning

- [x] Read `AGENTS.md`.
- [x] Read key architecture-freeze docs.
- [x] Query Graphify before implementation planning.
- [x] Create sprint plan.
- [x] Create living implementation checklist.
- [x] Confirm package manager and workspace tool.
- [x] Confirm whether root Git repository should be initialized.
- [x] Confirm first implementation target after repository skeleton.

## Repository Foundation

- [x] Create root `README.md`.
- [x] Create root `ROADMAP.md`.
- [x] Create monorepo folders from Volume G2.
- [x] Create placeholder `.gitkeep` files only where needed.
- [x] Document repository folder responsibilities.
- [x] Update `.gitignore` if new tooling requires it.

## Workspace Tooling

- [x] Decide package manager.
- [x] Create workspace config.
- [x] Add baseline TypeScript config.
- [x] Add formatting config.
- [x] Add linting command placeholder.
- [x] Add test command placeholder.
- [x] Add root command scripts.

## Documentation Updates

- [x] Update `AGENTS.md` with install/dev/build/lint/test commands once known.
- [x] Update planning docs after planning artifact creation.
- [x] Refresh Graphify after Sprint 0 structure changes.

## Sprint 0 Exit Criteria

- [x] Repository structure exists.
- [x] Setup instructions are documented.
- [x] Baseline commands are documented.
- [x] Graphify has been refreshed after Sprint 0 structure changes.
- [x] Sprint 1 scope is confirmed.

---

# Sprint 1 - Tooling, Standards, and CI Foundation

## Engineering Standards

- [x] TypeScript baseline configured.
- [x] Formatting configured.
- [x] Linting configured.
- [x] Test baseline configured.
- [x] Shared coding standards documented.
- [x] Dependency approval rule documented.

## Validation

- [x] Install command runs successfully.
- [x] Lint command runs successfully.
- [x] Test command runs successfully.
- [x] Build or typecheck command runs successfully.
- [x] CI/local validation script exists.

## Sprint 1 Exit Criteria

- [x] Clean checkout can install dependencies.
- [x] Baseline checks pass.
- [x] Developer commands are documented.
- [x] Graphify refreshed if structure changed.

---

# Sprint 2 - Application and Backend Shells

## Mobile Shell

- [x] Create `apps/mobile`.
- [x] Initialize Expo app.
- [x] Add navigation shell.
- [x] Add dashboard placeholder.
- [x] Add environment-safe config pattern.

## API Shell

- [x] Create `services/api`.
- [x] Initialize NestJS app.
- [x] Add health endpoint.
- [x] Add API version prefix.
- [x] Add basic error handling.

## Shared Packages

- [x] Create `packages/types`.
- [x] Create `packages/shared`.
- [x] Define first shared health/status type.

## Verification

- [x] Mobile app starts locally.
- [x] API starts locally.
- [x] Mobile/API connection strategy is documented or working.
- [x] Baseline tests pass.

---

# Sprint 3 - Data and Authentication Foundation

## Database

- [x] Create `database/schema`.
- [x] Create `database/migrations`.
- [x] Create `database/policies`.
- [x] Define migration workflow.
- [x] Create student profile schema.

## Authentication

- [x] Configure Supabase Auth integration pattern.
- [x] Implement sign-up.
- [x] Implement sign-in.
- [x] Implement sign-out.
- [x] Implement authenticated API user context.

## Security

- [x] Add no-secrets documentation.
- [x] Define Row Level Security baseline.
- [x] Validate student data isolation.

---

# Sprint 4 - Academic Profile and Dashboard Slice

## Academic Profile

- [x] Programme setup.
- [x] Semester setup.
- [x] Subject enrolment.
- [x] Academic goals placeholder.

## Dashboard

- [x] Current semester summary.
- [x] Subject list.
- [x] Learning status placeholder.
- [x] BLIE recommendation placeholder.

## API

- [x] Academic profile endpoints.
- [x] Subject endpoints.
- [x] Validation and error states.

---

# Sprint 5 - Document Library Foundation

## Upload

- [x] Document upload UI.
- [x] Storage integration.
- [x] Metadata persistence.
- [x] Upload progress state.

## Library

- [x] Document list.
- [x] Document detail.
- [x] Processing status.
- [x] Empty/error states.

## Security

- [x] Student-owned storage paths.
- [x] Student-only document access.
- [x] Upload validation.

---

# Sprint 6 - BLIE Minimum Useful Chat

## BLIE Service

- [x] Create BLIE service boundary.
- [x] Create AI provider abstraction.
- [x] Create chat request/response types.
- [x] Add context assembly placeholder.
- [x] Add retrieval-before-generation hook.

## Mobile Experience

- [x] BLIE chat screen.
- [x] Subject context selector.
- [x] Loading state.
- [x] Error state.
- [x] Response display.

## Safety

- [x] Do not commit AI provider secrets.
- [x] Add request logging without sensitive content.
- [x] Add response validation placeholder.

---

# Sprint 7 - Basic PLKG Foundation

## Data Model

- [x] PLKG node schema.
- [x] PLKG edge schema.
- [x] Student ownership constraints.
- [x] Basic query API.

## Learning Memory

- [x] Create initial graph from academic profile.
- [x] Add node from learning activity.
- [x] Retrieve context for BLIE.

## Experience

- [x] PLKG list or simple visualization.
- [x] Knowledge gap placeholder.
- [x] Learning growth indicator.

---

# Sprint 8 - Study Preparation and Revision MVP

## Preparation

- [x] Preparation plan model.
- [x] Prerequisite recommendation placeholder.
- [x] Dashboard preparation card.

## Revision

- [x] Revision item model.
- [x] Flashcard placeholder.
- [x] Quiz placeholder.
- [x] Revision progress state.

## BLIE/PLKG Integration

- [x] Preparation uses subject context.
- [x] Revision uses PLKG context.
- [x] Recommendations are traceable to learning state.

---

# Sprint 9 - Offline and Synchronization Baseline

## Offline

- [x] Local storage strategy.
- [x] Offline dashboard access.
- [x] Offline subject resources.
- [x] Pending changes queue.

## Synchronization

- [x] Sync status model.
- [x] Sync status UI.
- [x] Conflict rules for MVP entities.
- [x] Reconnect behavior.

---

# Sprint 10 - MVP Quality, Security, and Release Readiness

## Testing

- [x] Functional tests for core flows.
- [x] Integration tests for API/data.
- [x] BLIE behavior checks.
- [x] PLKG consistency checks.
- [x] Offline/sync checks.

## Security

- [x] Auth review.
- [x] Authorization review.
- [x] Storage access review.
- [x] Data isolation review.
- [x] No-secrets review.

## Release

- [x] Deployment checklist.
- [x] Rollback notes.
- [x] Monitoring plan.
- [x] MVP known issues.
- [x] Release notes draft.

---

# Cross-Cutting Checklist

## Architecture Compliance

- [x] Changes follow Volume G0 Engineering Constitution.
- [x] Repository structure follows Volume G2.
- [x] Technology choices follow Volume G3.
- [x] Delivery remains aligned with Volume G13.

## Documentation

- [x] Update docs when commands change.
- [x] Update docs when schemas change.
- [x] Update docs when APIs change.
- [x] Update docs when architecture decisions change.

## Graphify

- [x] Query Graphify before broad source inspection.
- [x] Refresh Graphify after meaningful code structure changes.
- [x] If Graphify is incomplete, request central rebuild.

## Security

- [x] Never read or print `.env` files.
- [x] Never commit secrets.
- [x] Keep student-owned data isolated.
- [x] Minimize data sent to external AI providers.

---

# MVP Stabilization Pass 1 - Supabase Persistence Wiring

## Planning

- [x] Confirm Sprint 10 and Cross-Cutting Checklist baseline is complete.
- [x] Confirm Supabase CLI project linking and migration history alignment were completed by the project owner.
- [x] Query Graphify before planning the repository wiring path.
- [x] Prepare dedicated stabilization plan.
- [x] Confirm data mode environment variable names in `.env.example`.
- [/] Confirm live validation test user approach without committing secrets.

## Data Mode and API Boundary

- [x] Add a server-side data mode switch for `fixture` and `supabase`.
- [x] Keep fixture mode as the default local/demo mode when Supabase variables are unavailable.
- [x] Keep mobile clients behind API endpoints.
- [x] Keep service-role keys out of mobile and tracked files.
- [x] Document the mode switch and failure behavior.

## Supabase Repository Wiring

- [x] Add a server-only Supabase client boundary.
- [x] Wire academic profile persistence.
- [x] Wire subject persistence.
- [x] Wire document metadata persistence.
- [x] Wire PLKG node persistence.
- [x] Wire PLKG edge persistence.
- [x] Wire study preparation/revision persistence.
- [x] Wire sync queue event persistence.
- [x] Wire dashboard aggregation from persisted data.

## Validation

- [x] Add mocked Supabase adapter tests.
- [x] Keep fixture-mode MVP readiness passing.
- [ ] Validate live Supabase RLS with authenticated student access.
- [ ] Validate cross-student access is blocked.
- [!] Validate migration list remains aligned. Blocked on 2026-07-15 by Supabase CLI access-control response: `LegacyDbConfigLoginRoleStatusError` / HTTP 403.
- [ ] Refresh Graphify after meaningful structure changes.

## Documentation

- [x] Update Supabase setup docs after repository wiring.
- [x] Update local development docs with fixture/Supabase mode commands.
- [x] Update API docs if response behavior changes.
- [x] Update release known issues after persistence wiring status changes.
- [x] Add live Supabase validation runbook.

---

# Product Completion Master Plan And Checklist

## Planning

- [x] Confirm Sprint 0 through Sprint 10 represent local MVP baseline, not product completion.
- [x] Read architecture-freeze product, PRD, engineering, monorepo, and MVP roadmap docs.
- [x] Query Graphify for post-MVP/product-completion planning context.
- [x] Read current roadmap, sprint plan, implementation checklist, and MVP stabilization plan.
- [x] Add `docs/planning/PRODUCT_COMPLETION_MASTER_PLAN.md`.
- [x] Link root roadmap to the product completion master plan.
- [x] Extend sprint plan beyond Sprint 10.
- [x] Extend this checklist beyond Sprint 10.
- [x] Add `docs/planning/RELEASE_TARGET_SCOPE.md`.
- [x] Revise near-term scope into Controlled Demo MVP, True Learning MVP, and Public Version 1.
- [x] Record the real user wow moment as the organising product outcome.

## Phase 2 - MVP Stabilization And Live Data Readiness

- [/] Complete MVP Stabilization Pass 1.
- [!] Unblock Supabase CLI migration-history validation.
- [ ] Complete live same-student RLS validation.
- [ ] Complete live cross-student denial validation.
- [x] Add visible live-mode API/mobile validation flow.
- [/] Confirm Supabase-mode dashboard data visibly changes in the app.
- [ ] Preserve fixture mode for safe local demos.
- [x] Record controlled MVP readiness decision.

## Sprint 11 - Live Validation And Demo Visibility

- [/] Confirm live validation test-user approach without exposing tokens.
- [!] Run `docs/development/SUPABASE_LIVE_VALIDATION.md`.
- [ ] Record live validation results without secrets.
- [x] Add API/mobile live-mode smoke indicators.
- [/] Show persisted academic/dashboard changes in UI.
- [x] Show sync/persistence status clearly in UI.
- [x] Redesign mobile shell around the real student learning journey.
- [x] Run `corepack pnpm check`.
- [x] Run `corepack pnpm mvp:readiness`.
- [x] Refresh Graphify.
- [x] Accept Sprint 11 with known live-validation blocker.

Current blocker:

- 2026-07-30: Supabase CLI migration list still returns `LegacyDbConfigLoginRoleStatusError` / HTTP 403. Full live RLS validation still requires project access plus two local-only authenticated test-user sessions.

## Sprint 12 - Real Document Upload And Storage

- [x] Prepare Sprint 12 implementation plan.
- [x] Confirm MVP file type is PDF only.
- [x] Confirm mobile uploads through the API boundary.
- [x] Confirm private bucket target is `student-documents`.
- [x] Confirm storage path convention is `{studentId}/{subjectId}/{documentId}/{fileName}`.
- [x] Confirm text extraction, concept extraction, PLKG enrichment, and BLIE retrieval remain out of
  scope for Sprint 12.
- [x] Inspect document upload source files directly before editing.
- [x] Implement API upload endpoint.
- [x] Implement server-side private storage write path.
- [x] Persist document metadata after successful upload.
- [x] Show processing status in mobile UI.
- [x] Add validation and failure tests.
- [x] Update development and release docs after implementation.
- [x] Run `corepack pnpm check`.
- [x] Run `corepack pnpm mvp:readiness`.
- [x] Run local fixture-mode multipart upload smoke test.
- [x] Refresh Graphify.

## Phase 3 - True MVP Completion

- [ ] Sprint 12 - Real Document Upload And Storage.
- [ ] Sprint 13 - Document Text Extraction Baseline.
- [ ] Sprint 14 - Concept Extraction And PLKG Enrichment.
- [ ] Sprint 15 - Real BLIE Provider Integration.
- [ ] Sprint 16 - Retrieval-Backed BLIE Preparation And Quiz.
- [ ] Sprint 17 - Durable Offline Storage And Sync Hardening.
- [ ] Sprint 18 - MVP UX Polish And Empty/Error State Completion.
- [ ] Sprint 19 - MVP Performance, Security, And Observability Baseline.
- [ ] Sprint 20 - Controlled MVP Release Candidate.

## True Learning MVP Wow Moment Checklist

- [ ] Student uploads a lecture PDF into a subject workspace.
- [ ] File bytes are stored in private student-owned storage.
- [ ] Document processing status is visible.
- [ ] Text extraction produces usable learning text.
- [ ] Concept extraction identifies priority learning concepts.
- [ ] PLKG is enriched from extracted concepts.
- [ ] BLIE retrieves student-owned context before generating guidance.
- [ ] BLIE shows three things to understand before the next class.
- [ ] BLIE generates a quick quiz or flashcards from processed knowledge.
- [ ] Student can revise from the generated guidance.

## Phase 4 - Closed Beta Readiness

- [ ] Sprint 21 - Beta Onboarding And Support Flow.
- [ ] Sprint 22 - Beta Analytics And Feedback Capture.
- [ ] Sprint 23 - Staging Deployment And Release Operations.
- [ ] Sprint 24 - Mobile Build Pipeline.
- [ ] Sprint 25 - Closed Beta Security And Privacy Review.
- [ ] Sprint 26 - Closed Beta Release.

## Phase 5 - Public Version 1 Completion

- [ ] Sprint 27 - Account, Profile, And Settings Completion.
- [ ] Sprint 28 - Subscription System.
- [ ] Sprint 29 - Notes And Personal Learning Hub Completion.
- [ ] Sprint 30 - Revision Centre Completion.
- [ ] Sprint 31 - Progress Dashboard And Learning Analytics Completion.
- [ ] Sprint 32 - Study Groups MVP.
- [ ] Sprint 33 - Web Application Baseline.
- [ ] Sprint 34 - Public Release Security And Compliance Review.
- [ ] Sprint 35 - App Store And Web Launch Readiness.
- [ ] Sprint 36 - Public Version 1 Launch.

## Phase 6 - Learning Intelligence Expansion

- [ ] Curriculum intelligence roadmap broken into sprint plans.
- [ ] Knowledge extraction roadmap broken into sprint plans.
- [ ] Learning analytics roadmap broken into sprint plans.
- [ ] Assessment tracking roadmap broken into sprint plans.
- [ ] Revision engine roadmap broken into sprint plans.

## Phase 7 - Collaboration And Knowledge Sharing

- [ ] Study groups roadmap broken into sprint plans.
- [ ] Shared resources roadmap broken into sprint plans.
- [ ] Group subscriptions roadmap broken into sprint plans.
- [ ] Collaborative AI roadmap broken into sprint plans.
- [ ] Shared revision tools roadmap broken into sprint plans.

## Phase 8 - Intelligence Expansion And Platform Growth

- [ ] Advanced BLIE reasoning plan approved.
- [ ] Predictive learning plan approved.
- [ ] Voice capability plan approved.
- [ ] Marketplace plan approved.
- [ ] Creator programme plan approved.
- [ ] Career guidance plan approved.
- [ ] Global scale and operational hardening plan approved.
