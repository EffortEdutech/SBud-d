# Study Preparation and Revision API

Sprint 8 adds the first Study Preparation and Revision MVP slice.

Fixture mode uses deterministic in-memory guidance generated from academic subjects and PLKG
context. Supabase mode persists preparation plans, revision items, and revision reflection status
updates behind the API repository boundary while preserving the existing endpoint contracts.

## Endpoints

Base path: `/api/v1`

### `GET /study/summary`

Returns preparation plans, revision items, and short progress labels.

### `GET /study/preparation`

Returns preparation plans for active subjects.

Each plan includes:

- subject context,
- current or upcoming topic,
- readiness state,
- prerequisites,
- preparation tasks,
- trace metadata linking the recommendation to PLKG nodes.

### `GET /study/revision`

Returns revision items prioritised from PLKG mastery and knowledge gap state.

Each item includes:

- revision status,
- priority and due label,
- flashcard placeholder,
- quiz placeholder,
- trace metadata linking the recommendation to PLKG nodes.

### `POST /study/revision/reflection`

Records a student reflection for one revision item.

Request:

```json
{
  "revisionItemId": "study-revision-plkg-concept-recursion",
  "confidenceLevel": 75,
  "reflection": "I can explain the idea now."
}
```

The MVP updates the returned item status deterministically:

- `confidenceLevel >= 70` returns `completed`.
- lower confidence returns `needs_support`.

In Supabase mode, the returned status and recommended action are written back to the
student-owned `study_revision_items` row.

## Security Notes

- No AI provider secrets are required.
- No Supabase service-role keys are committed.
- The SQL migration enables RLS and scopes preparation/revision rows to `auth.uid()`.
- Supabase mode requires an authenticated bearer token; mobile clients continue to call the API
  and do not write directly to Supabase tables.
- Recommendations include trace metadata so future BLIE and PLKG decisions remain inspectable.
