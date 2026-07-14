# MVP Known Issues

Status: MVP Stabilization Pass 1 baseline
Last updated: 2026-07-14

---

# Known Issues

## In-Memory Local Data

Fixture mode uses deterministic in-memory repositories for local MVP validation. Data resets when the API restarts.

Impact: acceptable for local validation; not acceptable for production persistence.

MVP Stabilization Pass 1 has started Supabase repository wiring for the academic profile,
subjects, dashboard, and document metadata slices. PLKG, study, and sync repositories still
need Supabase adapters.

## Offline Queue Is Not Durable

Sprint 9 uses an in-memory mobile queue and cache because no durable encrypted mobile storage dependency has been approved.

Impact: offline actions do not survive app restart.

## Document Upload Is Metadata-Only

The document library supports metadata creation and storage path conventions, including a
Supabase-backed metadata repository mode. Real file upload and processing are not
production-complete.

Impact: document intelligence remains a prepared foundation.

## AI Provider Is Local Deterministic

BLIE uses a local deterministic provider through the provider abstraction.

Impact: no external AI provider cost or secret exposure, but real model quality is not represented.

## Production Observability Not Wired

Release readiness docs define monitoring needs, but no production monitoring provider is configured.

Impact: controlled testing only until observability is implemented.

## App Store Release Not Prepared

Expo local development works, but app store signing, build profiles, and release channels are not configured.

Impact: MVP is not app-store ready.
