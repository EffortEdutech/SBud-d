# Offline and Synchronization API

Sprint 9 adds the baseline offline and synchronization model.

The MVP keeps cloud services as the system of record while allowing the mobile app to keep a local
learning snapshot and pending sync queue. The local mobile queue is in-memory for this baseline
because no new mobile storage dependency has been approved yet. In Supabase mode, accepted sync
queue events are persisted server-side through the API boundary.

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
- pending offline queue for document metadata, PLKG learning activity, and study reflections.

The Sync tab shows:

- connection status,
- pending/failed counts,
- offline-available sections,
- queued events,
- MVP conflict rules.

## Security Notes

- No secrets or Supabase service-role keys are required.
- SQL reference enables RLS on `sync_queue_events`.
- The queue is student-owned and scoped by `auth.uid()` in Supabase policies.
- Supabase mode requires an authenticated bearer token; mobile clients continue to call the API and
  do not write directly to Supabase tables.
- Cloud remains authoritative for MVP snapshots.
