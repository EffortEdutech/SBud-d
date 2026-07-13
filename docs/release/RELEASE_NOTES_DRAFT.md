# MVP Release Notes Draft

Status: Draft
Last updated: 2026-07-13

---

# AI Study Buddy MVP Baseline

This MVP baseline introduces the first complete local learning loop for AI Study Buddy.

Included:

- mobile dashboard and API health foundation,
- Supabase data/authentication foundation,
- academic profile and subject dashboard,
- document library metadata flow,
- BLIE minimum useful chat with provider abstraction,
- basic student-owned PLKG foundation,
- study preparation and revision MVP,
- offline and synchronization baseline,
- MVP quality/security/release readiness checks.

---

# Validation

Validated through:

- build,
- formatting,
- lint,
- TypeScript checks,
- unit tests,
- MVP readiness integration test,
- no tracked secret-file check,
- Graphify refresh after structure changes.

---

# Current Limitations

- Local API uses deterministic in-memory fixtures for several MVP flows.
- Supabase migrations are prepared, but live persistence wiring remains incremental.
- Real file upload and document processing are not production-complete.
- AI provider integration is not connected to real provider credentials.
- Durable encrypted offline storage is deferred.
- Production monitoring and alerting are not wired yet.

---

# Deployment Notes

Apply Supabase migrations before testing live persistence:

```powershell
npx --yes supabase@latest db push --workdir database
```

Run release validation:

```powershell
corepack pnpm mvp:readiness
```
