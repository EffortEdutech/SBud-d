# Supabase Setup

Status: Linked project baseline
Last updated: 2026-07-14

---

# 1. Current State

The Supabase CLI project has been initialized, linked, and aligned with the current local migration history by the project owner.

Sprint 3 adds:

- the first student profile migration,
- Row Level Security policies,
- mobile auth client pattern,
- API authenticated user context pattern,
- placeholder environment variable names.

No real Supabase URL, publishable key, anon key, service-role key, or JWT secret is committed.

---

# 2. Migration Workflow

Create new migration files with the Supabase CLI:

```powershell
npx --yes supabase@latest migration new <name> --workdir database
```

The CLI writes migrations under:

```text
database/supabase/migrations
```

Reference schema and policy snapshots may live under:

```text
database/schema
database/policies
```

The migration file is the execution source of truth.

---

# 3. Environment Variables

Mobile public variables:

```text
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
EXPO_PUBLIC_API_BASE_URL
```

API server variables:

```text
SBUD_API_DATA_MODE
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
PORT
```

Use `SBUD_API_DATA_MODE=fixture` for default local/demo validation. Use
`SBUD_API_DATA_MODE=supabase` only when local Supabase variables are configured.

Do not expose or commit service-role keys.

---

# 4. Security Baseline

For tables in the exposed `public` schema:

- enable Row Level Security,
- grant only the required table privileges,
- create ownership policies with `TO authenticated`,
- combine `TO authenticated` with `(select auth.uid()) = owner_column`,
- use both `USING` and `WITH CHECK` for updates,
- do not use user-editable metadata for authorization.

The first table, `public.student_profiles`, is owned by `student_profiles.id`, which references `auth.users.id`.

---

# 5. Completed Live Setup Baseline

The project owner has completed:

1. Supabase CLI initialization under `database/supabase`.
2. Project linking.
3. Migration history alignment for the MVP migration files.

Continue to add real values to local `.env` files only. Do not commit `.env` files or secrets.

---

# 6. Next Supabase Work

MVP Stabilization Pass 1 wires API repositories to Supabase persistence behind the
existing API boundary.

Current wired API persistence:

- Academic profile.
- Academic subjects.
- Dashboard academic aggregation.
- Document metadata.
- PLKG nodes and edges.

Still fixture-backed:

- Study preparation and revision.
- Sync queue events.

Before controlled live validation:

1. Run `npx --yes supabase@latest migration list --workdir database`.
2. Confirm local and remote migration IDs match.
3. Run Supabase database advisors.
4. Confirm Data API exposure/grants match the project settings.
5. Verify RLS with at least two authenticated test users.
