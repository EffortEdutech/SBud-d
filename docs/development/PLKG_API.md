# PLKG API

Status: Sprint 7 foundation
Last updated: 2026-07-12

---

# 1. Scope

Sprint 7 introduces the first Personal Learning Knowledge Graph foundation.

The local API uses in-memory graph fixtures seeded from academic profile, subject, document,
and BLIE interaction context. Supabase persistence is prepared through migration and reference
SQL, but live project linking is still pending.

---

# 2. Endpoints

Base URL:

```text
http://localhost:4801/api/v1
```

Endpoints:

- `GET /plkg/summary`
- `GET /plkg/nodes`
- `GET /plkg/edges`
- `POST /plkg/learning-activity`

Example learning activity request:

```json
{
  "subjectId": "subject-programming",
  "label": "Asked BLIE about recursion",
  "description": "Student asked for a simple recursion example.",
  "sourceId": "blie-response-id"
}
```

---

# 3. Data Model

Sprint 7 models:

- `plkg_nodes`
- `plkg_edges`

Node states follow Volume H7:

- `introduced`
- `learning`
- `understanding`
- `mastered`
- `needs_review`

Relationship types include:

- `contains`
- `requires`
- `related_to`
- `explains`
- `generated_from`
- `reinforces`

---

# 4. BLIE Integration

Sprint 7 replaces the Sprint 6 PLKG placeholder with real PLKG context retrieval.

BLIE context assembly now includes:

- academic profile context
- selected subject context
- document context
- PLKG node context

---

# 5. Security

The reference SQL enforces:

- student-owned PLKG nodes
- student-owned PLKG edges
- `TO authenticated` RLS policies
- edge creation only between nodes owned by the authenticated student

Do not commit `.env` files, Supabase service-role keys, or AI provider secrets.
