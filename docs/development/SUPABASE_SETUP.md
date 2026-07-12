# Supabase Setup

Status: Sprint 3 baseline
Last updated: 2026-07-11

---

# 1. Current State

Supabase is not linked to a live project yet.

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
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
PORT
```

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

# 5. Deferred Until Live Supabase Setup

When the Supabase project exists:

1. Add real values to local `.env` files only.
2. Apply migrations to a development database.
3. Run Supabase database advisors.
4. Confirm Data API exposure/grants match the project settings.
5. Verify RLS with at least two authenticated test users.
