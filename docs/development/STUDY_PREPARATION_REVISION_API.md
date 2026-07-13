# Study Preparation and Revision API

Sprint 8 adds the first Study Preparation and Revision MVP slice.

The local API uses deterministic in-memory guidance generated from academic subjects and PLKG context. Supabase persistence is prepared by SQL reference files and a migration, but the local app still avoids live database writes while the MVP shape is being validated.

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

## Security Notes

- No AI provider secrets are required.
- No Supabase service-role keys are committed.
- The SQL migration enables RLS and scopes preparation/revision rows to `auth.uid()`.
- Recommendations include trace metadata so future BLIE and PLKG decisions remain inspectable.
