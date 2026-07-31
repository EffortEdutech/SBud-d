# PLKG API

Status: Sprint 14 document concept enrichment baseline
Last updated: 2026-07-31

---

# 1. Scope

Sprint 7 introduced the first Personal Learning Knowledge Graph foundation.

The local API uses in-memory graph fixtures seeded from academic profile, subject, document,
and BLIE interaction context by default. MVP Stabilization Pass 1 adds a Supabase-backed
PLKG path when `SBUD_API_DATA_MODE=supabase`.

Sprint 14 adds document-derived concept enrichment through the Document Library API. Mobile clients
trigger this through `POST /documents/:id/concepts`; they still read PLKG through the PLKG API.

In Supabase mode, requests must include an authenticated bearer token. Mobile clients still
call the API; they must not write directly to Supabase tables.

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

Document concept enrichment endpoint:

```text
POST /documents/:id/concepts
```

This creates or reuses:

- a `resource` node for the source document,
- `concept` nodes for extracted document concepts,
- `explains` edges from document resource to concept,
- `contains` edges from subject to concept when a matching subject node exists.

---

# 3. Data Model

Sprint 7 models:

- `plkg_nodes`
- `plkg_edges`

Sprint 14 document concepts are persisted on `learning_documents.extracted_concepts` for document
transparency and mapped into PLKG nodes/edges for learning memory.

Supabase-backed PLKG persistence reads and writes:

- `public.plkg_nodes`
- `public.plkg_edges`

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

Sprint 7 replaced the Sprint 6 PLKG placeholder with real PLKG context retrieval.

BLIE context assembly now includes:

- academic profile context
- selected subject context
- document context
- PLKG node context

MVP Stabilization Pass 1 keeps retrieval-before-generation intact by awaiting PLKG context
assembly before BLIE response generation.

After Sprint 14, document-derived concept nodes are available to BLIE retrieval in the same PLKG
context path. Real provider integration and stronger retrieval-backed responses remain Sprint 15 and
Sprint 16 work.

---

# 5. Security

The reference SQL enforces:

- student-owned PLKG nodes
- student-owned PLKG edges
- `TO authenticated` RLS policies
- edge creation only between nodes owned by the authenticated student

Do not commit `.env` files, Supabase service-role keys, or AI provider secrets.
