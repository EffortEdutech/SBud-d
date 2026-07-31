# Offline and Synchronization API

Sprint 9 adds the baseline offline and synchronization model. Sprint 17 hardens the local mobile
snapshot and pending queue lifecycle.

The MVP keeps cloud services as the system of record while allowing the mobile app to keep a local
learning snapshot and pending sync queue. The mobile app now persists those local values through a
dependency-free offline storage facade. Expo Web uses browser `localStorage` when available; native
mobile currently falls back to volatile memory until an encrypted storage dependency is approved. In
Supabase mode, accepted sync queue events are persisted server-side through the API boundary.

## Endpoints

Base path: `/api/v1`

### `GET /sync/status`

Returns current sync status, offline-available sections, pending queue counts, and conflict rules.
In Supabase mode, queue counts are read from `sync_queue_events` for the authenticated student.

### `GET /sync/conflict-rules`

Returns MVP conflict handling rules:

- document metadata: server authoritative,
- PLKG learning activity: append only,
- study reflection: client merge by newest valid update,
- dashboard and study snapshots: server authoritative refreshes.

### `POST /sync/push`

Accepts locally queued changes, persists accepted events in Supabase mode, and returns the accepted
local items marked as `synced` so the mobile queue can clear them.

Request:

```json
{
  "items": [
    {
      "id": "local-sync-1",
      "studentId": "demo-student",
      "entityType": "study_reflection",
      "entityId": "study-revision-plkg-concept-recursion",
      "operation": "update",
      "status": "pending",
      "payload": {
        "confidenceLevel": 75
      },
      "retryCount": 0,
      "lastError": null,
      "createdAt": "2026-07-13T00:00:00.000Z",
      "updatedAt": "2026-07-13T00:00:00.000Z"
    }
  ]
}
```

## Mobile Baseline

The mobile app now keeps:

- cached dashboard summary,
- cached document library metadata,
- cached PLKG summary,
- cached study summary,
- cached latest BLIE response,
- pending offline queue for document metadata, PLKG learning activity, and study reflections.

The Sync tab shows:

- connection status,
- active local storage mode,
- pending/failed counts,
- offline-available sections,
- queued events,
- MVP conflict rules.

On app launch, the mobile shell hydrates the learning snapshot and pending queue before showing the
local sync status. If the API is unavailable, the app can restore cached dashboard, library, PLKG,
study, and BLIE response data from the last successful learning snapshot.

## Security Notes

- No secrets or Supabase service-role keys are required.
- The offline storage facade stores learning snapshot and queued event data only, not bearer tokens,
  passwords, API keys, or service-role credentials.
- SQL reference enables RLS on `sync_queue_events`.
- The queue is student-owned and scoped by `auth.uid()` in Supabase policies.
- Supabase mode requires an authenticated bearer token; mobile clients continue to call the API and
  do not write directly to Supabase tables.
- Cloud remains authoritative for MVP snapshots.
