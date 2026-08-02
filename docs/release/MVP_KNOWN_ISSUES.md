# MVP Known Issues

Status: Sprint 19 MVP operational baseline
Last updated: 2026-08-02

---

# Known Issues

## In-Memory Local Data

Fixture mode uses deterministic in-memory repositories for local MVP validation. Data resets when the API restarts.

Impact: acceptable for local validation; not acceptable for production persistence.

MVP Stabilization Pass 1 has wired Supabase repository paths for the academic profile, subjects,
dashboard aggregation, document metadata, PLKG node/edge, study preparation/revision, and sync queue
event slices.

## Live Supabase RLS Validation Pending

The live validation runbook exists at `docs/development/SUPABASE_LIVE_VALIDATION.md`, but
migration-history confirmation is currently blocked by Supabase project access returning
`LegacyDbConfigLoginRoleStatusError` / HTTP 403.

Impact: controlled live validation cannot be marked complete until project access is resolved and
two authenticated test users pass same-student and cross-student RLS checks.

Sprint 11 is accepted with this known blocker carried forward.

## Native Offline Queue Durability Needs Dependency Approval

Sprint 17 adds a dependency-free offline storage facade for the mobile learning snapshot and pending
sync queue. Expo Web persists those values with browser `localStorage` when available, and the app
hydrates cached dashboard, library, PLKG, study, BLIE response, and pending queue state on launch.

Native mobile currently falls back to volatile memory because no encrypted durable mobile storage
dependency has been approved.

Impact: Expo Web can demonstrate restart survival for controlled validation, but native app restart
durability remains a carry-over before closed beta.

## Document Processing Uses Baseline Extraction And Concept Mapping

The document library now supports metadata creation, Sprint 12 PDF upload through the API boundary,
Sprint 13 baseline embedded-text extraction, and Sprint 14 baseline concept mapping into the PLKG.
In Supabase mode, uploaded PDF bytes are written to the private `student-documents` bucket before
metadata is created, extraction downloads the student-owned object through the API server, and
concept mapping writes student-owned PLKG nodes/edges.

Impact: document intake is now real for PDFs and simple readable text/concepts can be surfaced, but
document intelligence remains incomplete.

The baseline extractors are not OCR, not full PDF parsing, and not real AI educational concept
analysis. Sprint 16 adds retrieval-backed BLIE preparation priorities and a quick quiz, but the
underlying extraction and ranking remain MVP baselines.

Live Supabase storage upload, extraction, and concept enrichment validation is still pending local
Supabase-mode execution with an authenticated test user.

## Real AI Provider Requires Local Configuration

BLIE now supports `local` and `openai-compatible` provider modes behind the provider abstraction.
Local deterministic mode remains the default. Real-provider mode requires a server-only local API
key and model/base-url configuration.

Impact: no external AI provider cost or secret exposure in default mode. Real model quality,
latency, cost, and response behavior are not validated until controlled local-only provider
credentials are configured and tested.

## Retrieval Ranking Is Baseline

BLIE now retrieves academic, subject, document, and PLKG context before producing preparation
priorities and a quick quiz. Ranking is deterministic and uses simple source priority rather than
vector search or advanced graph traversal.

Impact: the controlled MVP can demonstrate the learning loop, but production-quality retrieval still
requires stronger ranking, source confidence, and evaluation.

## Mobile UX Still Needs Device-Level Review

Sprint 18 improves the controlled mobile shell with learning-loop progress, action-oriented empty
states, and clearer feedback for offline/error/success states.

Impact: the MVP is easier to experience during controlled testing, but final mobile polish still
needs device-level review across Expo Go/native layouts, accessibility, and real student feedback.

## Production Observability Provider Not Wired

Sprint 19 adds local operational health visibility and metadata-only API request completion logs. The mobile Sync tab now shows readiness, log policy, performance budgets, RLS status, and monitored signals.

No production monitoring provider, metrics dashboard, alert routing, or incident automation is configured yet.

Impact: controlled testing can use the local baseline, but closed beta still needs production observability and alerting.

## App Store Release Not Prepared

Expo local development works, but app store signing, build profiles, and release channels are not configured.

Impact: MVP is not app-store ready.
