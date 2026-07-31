# MVP Known Issues

Status: Sprint 15 real provider integration
Last updated: 2026-07-31

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

## Offline Queue Is Not Durable

Sprint 9 uses an in-memory mobile queue and cache because no durable encrypted mobile storage dependency has been approved.

Impact: offline actions do not survive app restart.

## Document Processing Uses Baseline Extraction And Concept Mapping

The document library now supports metadata creation, Sprint 12 PDF upload through the API boundary,
Sprint 13 baseline embedded-text extraction, and Sprint 14 baseline concept mapping into the PLKG.
In Supabase mode, uploaded PDF bytes are written to the private `student-documents` bucket before
metadata is created, extraction downloads the student-owned object through the API server, and
concept mapping writes student-owned PLKG nodes/edges.

Impact: document intake is now real for PDFs and simple readable text/concepts can be surfaced, but
document intelligence remains incomplete.

The baseline extractors are not OCR, not full PDF parsing, and not real AI educational concept
analysis. Stronger retrieval-backed BLIE preparation and quiz responses remain later True Learning
MVP work.

Live Supabase storage upload, extraction, and concept enrichment validation is still pending local
Supabase-mode execution with an authenticated test user.

## Real AI Provider Requires Local Configuration

BLIE now supports `local` and `openai-compatible` provider modes behind the provider abstraction.
Local deterministic mode remains the default. Real-provider mode requires a server-only local API
key and model/base-url configuration.

Impact: no external AI provider cost or secret exposure in default mode. Real model quality,
latency, cost, and response behavior are not validated until controlled local-only provider
credentials are configured and tested.

## Production Observability Not Wired

Release readiness docs define monitoring needs, but no production monitoring provider is configured.

Impact: controlled testing only until observability is implemented.

## App Store Release Not Prepared

Expo local development works, but app store signing, build profiles, and release channels are not configured.

Impact: MVP is not app-store ready.
