# MVP Known Issues

Status: Sprint 12 real PDF upload baseline
Last updated: 2026-07-30

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

## Document Processing Is Upload-Only

The document library now supports metadata creation and Sprint 12 PDF upload through the API
boundary. In Supabase mode, uploaded PDF bytes are written to the private `student-documents`
bucket before metadata is created.

Impact: document intake is now real for PDFs, but document intelligence remains incomplete.

Text extraction, concept extraction, PLKG enrichment, and BLIE retrieval remain later True Learning
MVP work.

Live Supabase storage upload validation is still pending local Supabase-mode execution with an
authenticated test user.

## AI Provider Is Local Deterministic

BLIE uses a local deterministic provider through the provider abstraction.

Impact: no external AI provider cost or secret exposure, but real model quality is not represented.

## Production Observability Not Wired

Release readiness docs define monitoring needs, but no production monitoring provider is configured.

Impact: controlled testing only until observability is implemented.

## App Store Release Not Prepared

Expo local development works, but app store signing, build profiles, and release channels are not configured.

Impact: MVP is not app-store ready.
