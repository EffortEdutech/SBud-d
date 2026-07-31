# AI Study Buddy Product Completion Master Plan

Version: 0.3
Status: Living product-completion plan
Last updated: 2026-07-31

---

# 1. Purpose

This document extends the completed Sprint 0 through Sprint 10 MVP baseline into a full product-completion plan.

It does not replace the architecture-freeze volumes. It translates them into an operational path from the current post-MVP stabilization state toward:

- a controlled live MVP,
- a closed beta product,
- a public Version 1 product,
- the longer-term AI Study Buddy platform described in the approved roadmap.

The plan is intentionally staged. AI Study Buddy is a living product, so "completion" means the target release is complete and stable, not that the product stops evolving.

---

# 2. Source Of Truth

Primary references:

- `docs/v1/Volume A - Product Vision & Strategy.md`
- `docs/v1/Volume B - Product Requirements Document (PRD).md`
- `docs/v1/Volume G0 - Engineering Constitution.md`
- `docs/v1/Volume G1 - Engineering Strategy & Development Roadmap.md`
- `docs/v1/Volume G2 - Monorepo & Repository Architecture.md`
- `docs/v1/Volume G13 - MVP Delivery Roadmap.md`
- `docs/planning/SPRINT_PLAN.md`
- `docs/planning/IMPLEMENTATION_CHECKLIST.md`
- `docs/planning/MVP_STABILIZATION_PASS_1.md`
- `docs/planning/RELEASE_TARGET_SCOPE.md`

Supporting context:

- `docs/AI_WORKSPACE_CONTEXT.md` is the local Obsidian bridge when the central vault is outside the sandbox.

---

# 3. Completion Definitions

## Local MVP Baseline

Status: Done.

The local MVP baseline means Sprint 0 through Sprint 10 and the Cross-Cutting Checklist are complete in fixture/local mode. It proves the monorepo, API/mobile shell, academic profile, document metadata, BLIE chat, PLKG, study, sync, and release-readiness scaffolds work locally.

This is not a live product.

## Controlled Live MVP

Status: In progress.

The controlled live MVP means the existing MVP capabilities persist student-owned data in Supabase mode, pass live RLS validation, and can be demonstrated safely with test or controlled users.

This is not yet a public launch.

## Closed Beta Product

Status: Not started.

Closed beta means real students can use a stable end-to-end product with live data, real document processing, real BLIE provider wiring, durable offline behavior, monitoring, and support playbooks.

This is still a limited release.

## Public Version 1 Product

Status: Not started.

Version 1 means the PRD Version 1 scope is operationally ready for public individual-student use:

- onboarding and account management,
- academic profile,
- PLKG,
- AI Study Buddy / BLIE,
- PDF and image learning,
- notes,
- study preparation,
- revision tools,
- progress dashboard,
- study groups,
- subscription system.

## Long-Term Platform Completion

Status: Future.

The long-term platform includes the later engineering roadmap:

- advanced learning intelligence,
- collaboration,
- intelligence expansion,
- marketplace and creator ecosystem,
- voice and multimodal learning,
- career guidance,
- global scale.

This is a continuing product roadmap, not a single terminal milestone.

---

# 4. Current Position

Current state:

- Sprint 0 through Sprint 10 are complete.
- Cross-Cutting Checklist is complete.
- MVP Stabilization Pass 1 is mostly implemented.
- Supabase-backed repositories are wired behind API boundaries for the first MVP entities.
- Fixture mode remains the default safe local mode.
- Sprint 11 has started to make live validation and API data mode visible through the mobile UI.
- Sprint 11 is accepted with a known live-validation blocker.
- Sprint 12 completed Real Document Upload And Storage.
- Sprint 13 completed the Document Text Extraction Baseline.
- Sprint 14 completed Concept Extraction And PLKG Enrichment.
- Sprint 15 completed Real BLIE Provider Integration behind the BLIE provider abstraction.
- Sprint 16 completed Retrieval-Backed BLIE Preparation And Quiz.
- Sprint 17 completed a dependency-free durable offline storage/sync hardening baseline for Expo Web
  and documented native encrypted storage as a carry-over.
- Sprint 18 completed MVP UX polish for the controlled mobile shell, including visible learning-loop
  progress, action-oriented empty states, and clearer status feedback.
- The near-term product scope has been revised around three release targets: Controlled Demo MVP,
  True Learning MVP, and Public Version 1.
- The product-defining wow moment is now: upload a lecture PDF, extract concepts, enrich PLKG, and
  have BLIE provide three preparation priorities plus a quick quiz.

Current blockers:

- Live Supabase CLI migration-history validation is blocked by a Supabase access-control response.
- Live RLS validation still requires two authenticated test users and local-only bearer tokens.
- Baseline document text extraction is implemented for readable embedded PDF text.
- Baseline concept extraction and PLKG enrichment are implemented.
- Real BLIE provider mode is implemented but live provider validation requires a local-only API key.
- BLIE now produces three preparation priorities and a quick quiz from retrieved context in the
  controlled local flow.
- Durable encrypted native mobile offline storage remains deferred pending dependency approval.
- Device-level Expo Go/native visual review remains pending after Sprint 18.
- Production deployment, observability, app-store release, and subscription flows remain future work.

---

# 5. Master Phase Plan

## Phase 0 - Engineering Foundation

Status: Done.

Goal:

Create the safe engineering base.

Covered by:

- Sprint 0 - Engineering Workspace Foundation.
- Sprint 1 - Tooling, Standards, and CI Foundation.
- Sprint 2 - Application and Backend Shells.
- Sprint 3 - Data and Authentication Foundation.

Completion criteria:

- Monorepo exists.
- Baseline commands pass.
- Mobile/API shells run.
- Supabase/auth conventions exist.
- No secrets are tracked.

## Phase 1 - Local MVP Baseline

Status: Done.

Goal:

Build the first local vertical MVP across the core learning journey.

Covered by:

- Sprint 4 - Academic Profile and Dashboard Slice.
- Sprint 5 - Document Library Foundation.
- Sprint 6 - BLIE Minimum Useful Chat.
- Sprint 7 - Basic PLKG Foundation.
- Sprint 8 - Study Preparation and Revision MVP.
- Sprint 9 - Offline and Synchronization Baseline.
- Sprint 10 - MVP Quality, Security, and Release Readiness.
- Cross-Cutting Checklist.

Completion criteria:

- Fixture-mode local MVP works.
- API/mobile contracts exist.
- Release-readiness docs exist.
- `corepack pnpm mvp:readiness` passes.

## Phase 2 - MVP Stabilization And Live Data Readiness

Status: In progress.

Goal:

Turn the local MVP into the Controlled Demo MVP described in
`docs/planning/RELEASE_TARGET_SCOPE.md`.

Planned targets:

- Complete MVP Stabilization Pass 1.
- Resolve Supabase CLI/project-access blocker.
- Run live RLS validation checklist.
- Validate same-student writes and cross-student denial.
- Add a mobile/API live-mode smoke validation workflow.
- Confirm Supabase-mode dashboard data visibly changes in the app.
- Preserve fixture mode for demos and development.

Exit criteria:

- Supabase mode persists the targeted MVP entities.
- RLS blocks cross-student access in live validation.
- API contracts remain compatible with mobile.
- No secrets or service-role keys are exposed.
- The UI clearly demonstrates live persisted data for the controlled MVP.
- A controlled tester can experience the student journey without the app feeling like a technical
  validation panel.

## Phase 3 - True MVP Completion

Status: In progress.

Goal:

Complete the True Learning MVP: real upload -> extraction -> PLKG enrichment -> BLIE retrieval ->
revision loop.

Planned sprint sequence:

- Sprint 11 - Live Validation And Demo Visibility. Accepted with known live-validation blocker.
- Sprint 12 - Real Document Upload And Storage.
- Sprint 13 - Document Text Extraction Baseline.
- Sprint 14 - Concept Extraction And PLKG Enrichment.
- Sprint 15 - Real BLIE Provider Integration.
- Sprint 16 - Retrieval-Backed BLIE Preparation And Quiz.
- Sprint 17 - Durable Offline Storage And Sync Hardening.
- Sprint 18 - MVP UX Polish And Empty/Error State Completion.
- Sprint 19 - MVP Performance, Security, And Observability Baseline.
- Sprint 20 - Controlled MVP Release Candidate.

Exit criteria:

- Students can complete the real learning loop using live data.
- Uploaded lecture PDFs are stored, processed, and transformed into visible learning knowledge.
- Extracted knowledge enriches PLKG.
- BLIE uses retrieval-backed student context to produce preparation and revision guidance.
- Offline learning remains useful and sync is reliable.
- MVP is safe for controlled student testing.

## Phase 4 - Closed Beta Readiness

Status: Not started.

Goal:

Prepare the product for a small real-user beta.

Planned sprint sequence:

- Sprint 21 - Beta Onboarding And Support Flow.
- Sprint 22 - Beta Analytics And Feedback Capture.
- Sprint 23 - Staging Deployment And Release Operations.
- Sprint 24 - Mobile Build Pipeline.
- Sprint 25 - Closed Beta Security And Privacy Review.
- Sprint 26 - Closed Beta Release.

Exit criteria:

- Beta users can onboard without developer help.
- Monitoring and support workflows are active.
- Feedback can be captured and reviewed.
- Builds are reproducible.
- Known risks are documented and accepted.

## Phase 5 - Public Version 1 Completion

Status: Not started.

Goal:

Complete the Version 1 PRD scope for public individual-student use.

Planned sprint sequence:

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

- PRD Version 1 modules are implemented or explicitly deferred by decision.
- Student subscription lifecycle is operational.
- Mobile and web release paths are ready.
- Privacy, security, support, and monitoring are production-ready.
- Public launch release gate passes.

## Phase 6 - Learning Intelligence Expansion

Status: Future.

Goal:

Move from useful MVP companion to proactive learning intelligence.

Planned capability groups:

- Curriculum intelligence.
- Deeper knowledge extraction.
- Learning analytics.
- Assessment tracking.
- Stronger revision engine.
- Better flashcards, quizzes, practice questions, and exam preparation.
- Personalized semester progress guidance.

Exit criteria:

- BLIE proactively prepares, guides, and reinforces learning across a semester.
- PLKG grows through verified learning events and processed knowledge.
- Learning analytics improve student decisions without exposing private data unnecessarily.

## Phase 7 - Collaboration And Knowledge Sharing

Status: Future.

Goal:

Add collaborative learning while preserving individual PLKG ownership.

Planned capability groups:

- Study groups.
- Shared resources.
- Selective note sharing.
- Group subscription.
- Collaborative AI workflows.
- Shared revision tools.

Exit criteria:

- Sharing is explicit and permissioned.
- Individual PLKG data is not leaked into group contexts.
- Group features add learning value without weakening privacy.

## Phase 8 - Intelligence Expansion And Platform Growth

Status: Future.

Goal:

Expand AI Study Buddy into the broader educational intelligence platform.

Planned capability groups:

- Advanced BLIE reasoning.
- Predictive learning.
- Voice capabilities.
- Marketplace.
- Creator programme.
- Career guidance.
- Global scale and operational hardening.

Exit criteria:

- Advanced capabilities extend the approved architecture.
- AI provider independence remains intact.
- Operational cost and safety are continuously measured.

---

# 6. Near-Term Execution Order

Recommended next targets:

1. Keep Sprint 11 live-validation blocker visible and resolve it when Supabase access allows.
2. Keep Sprint 17 native encrypted storage carry-over visible until dependency approval.
3. Prepare MVP performance, security, and observability baselines.
4. Run device-level UX review when the local mobile app is available.
5. Prepare a controlled MVP release candidate.

---

# 7. Product Completion Checklist

## Current Controlled MVP

- [x] Local MVP baseline complete.
- [x] Cross-Cutting Checklist complete.
- [x] Supabase repository wiring mostly complete.
- [ ] Live Supabase migration-history check unblocked.
- [ ] Live same-student RLS validation complete.
- [ ] Live cross-student denial validation complete.
- [ ] Controlled live-data demo flow visible in mobile UI.
- [ ] Controlled MVP release decision recorded.
- [ ] Controlled Demo MVP release target accepted.

## True MVP

- [x] Real document upload writes file bytes to private storage.
- [/] Document text extraction works for MVP file types.
- [x] Extracted concepts are visible to the student.
- [x] Processed document knowledge enriches PLKG.
- [x] BLIE uses a real provider through the provider abstraction.
- [x] Retrieval-before-generation is implemented with trusted student context.
- [x] BLIE produces three preparation priorities from processed knowledge.
- [x] BLIE produces a quick quiz or flashcards from processed knowledge.
- [x] Study preparation and revision use processed knowledge.
- [ ] Durable encrypted native offline storage dependency is approved and implemented.
- [/] Sync queue survives app restarts where browser `localStorage` is available; native restart
  durability remains pending dependency approval.
- [x] MVP mobile UX shows learning-loop progress and action-oriented empty/error states.
- [ ] MVP observability baseline is active.
- [ ] Controlled MVP release candidate passes.

## Closed Beta

- [ ] Beta onboarding flow is complete.
- [ ] Beta support workflow is documented.
- [ ] Staging deployment is operational.
- [ ] Mobile build pipeline is operational.
- [ ] Beta analytics and feedback capture are active.
- [ ] Closed beta privacy/security review passes.
- [ ] Closed beta release is approved.

## Public Version 1

- [ ] Account, profile, and settings are complete.
- [ ] Subscription system is complete.
- [ ] Notes and learning hub are complete.
- [ ] Revision centre is complete.
- [ ] Progress dashboard is complete.
- [ ] Study groups MVP is complete.
- [ ] Web application baseline is complete.
- [ ] Public release security/compliance review passes.
- [ ] App store and web launch readiness passes.
- [ ] Public Version 1 launch is approved.

## Long-Term Platform

- [ ] Learning intelligence expansion roadmap is broken into sprint plans.
- [ ] Collaboration roadmap is broken into sprint plans.
- [ ] Intelligence expansion roadmap is broken into sprint plans.
- [ ] Marketplace and creator programme plans are approved.
- [ ] Voice and multimodal learning plans are approved.
- [ ] Career guidance plan is approved.
- [ ] Global scale and operational hardening plan is approved.

---

# 8. Governance

At the start of each new sprint:

1. Confirm which master phase the sprint belongs to.
2. Confirm the exact user-visible outcome.
3. Confirm whether live data, AI provider usage, or new dependencies are involved.
4. Update `docs/planning/IMPLEMENTATION_CHECKLIST.md`.
5. Keep secrets out of tracked files and chat.

At the end of each sprint:

1. Run relevant checks.
2. Update implementation status.
3. Update known issues and release docs when applicable.
4. Refresh Graphify after meaningful structure changes.
5. Record the next target.

---

# 9. Next Recommended Sprint

Recommended next sprint:

Sprint 19 - MVP Performance, Security, And Observability Baseline.

Goal:

Add the controlled MVP baseline for performance awareness, security validation, and operational
observability before release-candidate preparation.

Why this is next:

- Sprint 12 made document upload real.
- Sprint 13 made readable document text available.
- Sprint 14 transformed uploaded lecture text into PLKG learning memory.
- Sprint 15 lets BLIE use a real model while preserving retrieval-before-generation.
- Sprint 16 made BLIE return retrieved-context-backed preparation priorities and a quick quiz.
- Sprint 17 made offline snapshot and queue hydration visible and restart-safe for Expo Web.
- Sprint 18 made the controlled mobile MVP easier to experience with clear progress and next-action
  states.
