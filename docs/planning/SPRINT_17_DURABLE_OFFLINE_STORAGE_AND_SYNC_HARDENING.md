# Sprint 17 - Durable Offline Storage And Sync Hardening

Status: Implemented and verified with native-storage carry-over
Last updated: 2026-07-31

---

# Goal

Make offline study data and pending sync actions survive app reloads where durable storage is already
available, harden sync queue transitions, and keep the mobile app behind the API boundary.

# Scope

- Add a dependency-free offline storage facade for the mobile app.
- Hydrate cached learning snapshots and pending sync queue items on app launch.
- Persist dashboard, document library, PLKG, study, and BLIE response snapshots after successful
  learning API calls.
- Persist queued offline actions and sync status transitions.
- Show the active local storage mode in the Sync tab.
- Keep secrets, bearer tokens, passwords, service-role keys, and provider keys out of local offline
  storage.

# Implementation Notes

The storage facade uses browser `localStorage` when available, which makes Expo Web suitable for
controlled reload/restart validation without adding a production dependency.

Native mobile currently falls back to volatile memory. Durable encrypted native persistence still
requires an approved mobile storage dependency, so that remains a closed-beta carry-over rather than
being silently solved by this sprint.

# Verification

- `corepack pnpm format`
- `corepack pnpm check`
- `corepack pnpm mvp:readiness`
- `.\scripts\graphify.ps1 update .`
- `git diff --check`

# Carry-Over

- Approve and implement encrypted durable native storage for the mobile app.
- Add device-level restart validation once the native storage dependency is selected.
- Expand sync conflict testing with real intermittent network conditions.
