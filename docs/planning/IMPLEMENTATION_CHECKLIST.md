# AI Study Buddy Implementation Checklist

Version: 0.1
Status: Living checklist
Last updated: 2026-07-11

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

Current sprint: Sprint 3 - Data and Authentication Foundation

Current goal:

Create the first student-owned data and authentication foundation without committing secrets.

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

- [ ] Programme setup.
- [ ] Semester setup.
- [ ] Subject enrolment.
- [ ] Academic goals placeholder.

## Dashboard

- [ ] Current semester summary.
- [ ] Subject list.
- [ ] Learning status placeholder.
- [ ] BLIE recommendation placeholder.

## API

- [ ] Academic profile endpoints.
- [ ] Subject endpoints.
- [ ] Validation and error states.

---

# Sprint 5 - Document Library Foundation

## Upload

- [ ] Document upload UI.
- [ ] Storage integration.
- [ ] Metadata persistence.
- [ ] Upload progress state.

## Library

- [ ] Document list.
- [ ] Document detail.
- [ ] Processing status.
- [ ] Empty/error states.

## Security

- [ ] Student-owned storage paths.
- [ ] Student-only document access.
- [ ] Upload validation.

---

# Sprint 6 - BLIE Minimum Useful Chat

## BLIE Service

- [ ] Create BLIE service boundary.
- [ ] Create AI provider abstraction.
- [ ] Create chat request/response types.
- [ ] Add context assembly placeholder.
- [ ] Add retrieval-before-generation hook.

## Mobile Experience

- [ ] BLIE chat screen.
- [ ] Subject context selector.
- [ ] Loading state.
- [ ] Error state.
- [ ] Response display.

## Safety

- [ ] Do not commit AI provider secrets.
- [ ] Add request logging without sensitive content.
- [ ] Add response validation placeholder.

---

# Sprint 7 - Basic PLKG Foundation

## Data Model

- [ ] PLKG node schema.
- [ ] PLKG edge schema.
- [ ] Student ownership constraints.
- [ ] Basic query API.

## Learning Memory

- [ ] Create initial graph from academic profile.
- [ ] Add node from learning activity.
- [ ] Retrieve context for BLIE.

## Experience

- [ ] PLKG list or simple visualization.
- [ ] Knowledge gap placeholder.
- [ ] Learning growth indicator.

---

# Sprint 8 - Study Preparation and Revision MVP

## Preparation

- [ ] Preparation plan model.
- [ ] Prerequisite recommendation placeholder.
- [ ] Dashboard preparation card.

## Revision

- [ ] Revision item model.
- [ ] Flashcard placeholder.
- [ ] Quiz placeholder.
- [ ] Revision progress state.

## BLIE/PLKG Integration

- [ ] Preparation uses subject context.
- [ ] Revision uses PLKG context.
- [ ] Recommendations are traceable to learning state.

---

# Sprint 9 - Offline and Synchronization Baseline

## Offline

- [ ] Local storage strategy.
- [ ] Offline dashboard access.
- [ ] Offline subject resources.
- [ ] Pending changes queue.

## Synchronization

- [ ] Sync status model.
- [ ] Sync status UI.
- [ ] Conflict rules for MVP entities.
- [ ] Reconnect behavior.

---

# Sprint 10 - MVP Quality, Security, and Release Readiness

## Testing

- [ ] Functional tests for core flows.
- [ ] Integration tests for API/data.
- [ ] BLIE behavior checks.
- [ ] PLKG consistency checks.
- [ ] Offline/sync checks.

## Security

- [ ] Auth review.
- [ ] Authorization review.
- [ ] Storage access review.
- [ ] Data isolation review.
- [ ] No-secrets review.

## Release

- [ ] Deployment checklist.
- [ ] Rollback notes.
- [ ] Monitoring plan.
- [ ] MVP known issues.
- [ ] Release notes draft.

---

# Cross-Cutting Checklist

## Architecture Compliance

- [ ] Changes follow Volume G0 Engineering Constitution.
- [ ] Repository structure follows Volume G2.
- [ ] Technology choices follow Volume G3.
- [ ] Delivery remains aligned with Volume G13.

## Documentation

- [ ] Update docs when commands change.
- [ ] Update docs when schemas change.
- [ ] Update docs when APIs change.
- [ ] Update docs when architecture decisions change.

## Graphify

- [ ] Query Graphify before broad source inspection.
- [ ] Refresh Graphify after meaningful code structure changes.
- [ ] If Graphify is incomplete, request central rebuild.

## Security

- [ ] Never read or print `.env` files.
- [ ] Never commit secrets.
- [ ] Keep student-owned data isolated.
- [ ] Minimize data sent to external AI providers.
