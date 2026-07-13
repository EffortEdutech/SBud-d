# MVP Known Issues

Status: Sprint 10 baseline
Last updated: 2026-07-13

---

# Known Issues

## In-Memory Local Data

Several API modules use deterministic in-memory fixtures for local MVP validation. Data resets when the API restarts.

Impact: acceptable for local validation; not acceptable for production persistence.

## Offline Queue Is Not Durable

Sprint 9 uses an in-memory mobile queue and cache because no durable encrypted mobile storage dependency has been approved.

Impact: offline actions do not survive app restart.

## Document Upload Is Metadata-Only

The document library supports metadata creation and storage path conventions, but real file upload and processing are not production-complete.

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
