# MVP Release Readiness

Status: Sprint 10 baseline
Last updated: 2026-07-13

---

# 1. Release Gate

The MVP can move toward controlled testing when all required checks pass:

- `corepack pnpm build`
- `corepack pnpm check`
- `corepack pnpm mvp:readiness`
- Supabase migration history matches local migration files
- no `.env` or secret-like files are tracked
- release notes and known issues are current
- cross-cutting audit is current

---

# 2. Core Workflow Coverage

Sprint 10 adds an MVP readiness test covering the vertical student learning journey:

1. academic dashboard loads subjects,
2. document library loads learning resources,
3. BLIE answers with retrieved context,
4. BLIE response includes PLKG context,
5. PLKG summary returns graph state,
6. Study summary returns revision items,
7. Sync status keeps cloud as system of record.

The test lives at:

```text
tests/mvp/mvp-release-readiness.test.ts
```

---

# 3. Security Gate

The release gate checks that tracked files do not include:

- `.env` files,
- private key files,
- secret token files,
- service-role key files.

The check intentionally does not read local `.env` files.

---

# 4. Migration Gate

The release gate verifies that the expected MVP migration files exist:

- student profiles,
- academic profile,
- learning documents,
- PLKG foundation,
- study preparation and revision,
- sync queue events.

Before deployment, run:

```powershell
npx --yes supabase@latest migration list --workdir database
```

Local and remote migration IDs must match.

---

# 5. Cross-Cutting Gate

The release gate verifies required architecture and release documents exist, including:

- Engineering Constitution,
- Monorepo architecture,
- Technology stack,
- MVP roadmap,
- security review,
- known issues,
- release notes draft,
- cross-cutting audit.

---

# 6. Rollback Plan

For the current MVP baseline:

1. Stop deployment if validation fails.
2. Do not run new migrations against production until backup status is confirmed.
3. Revert the application deployment to the last known good commit.
4. If a migration was applied, use Supabase backup/restore procedures or a reviewed compensating migration.
5. Re-run `corepack pnpm mvp:readiness` before retrying release.

---

# 7. Post-Release Monitoring

For controlled testing, monitor:

- API health,
- BLIE request failures,
- document upload/metadata failures,
- PLKG learning activity creation,
- study reflection updates,
- sync queue pending and failed counts.

No production observability provider is wired in Sprint 10. This is a release-readiness baseline, not a production operations rollout.
