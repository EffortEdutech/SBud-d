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

Current sprint: Sprint 10 - MVP Quality, Security, and Release Readiness

Current goal:

Prepare the MVP for controlled validation with release gates, security review, and release documentation.

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
