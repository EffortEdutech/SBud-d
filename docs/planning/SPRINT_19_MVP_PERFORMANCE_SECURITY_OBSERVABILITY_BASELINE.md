# Sprint 19 - MVP Performance, Security, And Observability Baseline

Status: Implemented
Last updated: 2026-08-02

---

# 1. Goal

Add a controlled MVP operational baseline before release-candidate preparation.

Sprint 19 does not make SBud-d production-operated. It makes the local and controlled validation experience honest and visible: the API reports performance/security/observability readiness, request logs follow a metadata-only policy, release tests assert the baseline, and the mobile Sync tab shows the operational state testers should care about.

---

# 2. Scope

Included:

- API health `operational` block.
- Performance budget visibility.
- Security posture visibility without secrets.
- Metadata-only API request completion logging.
- Mobile Sync-tab operational baseline panel.
- Tests and release-readiness assertions for the baseline.
- Documentation updates across development, release, planning, README, and agent guidance.

Excluded:

- Production monitoring provider integration.
- Alert routing and on-call workflow.
- External metrics dashboards.
- Real load testing infrastructure.
- Incident automation.

These excluded items remain required before closed beta or public release.

---

# 3. Operational Health Contract

`GET /api/v1/health` now includes an optional `operational` block with:

- `readiness`: `baseline_ready` or `needs_attention`.
- `uptimeSeconds`.
- `performanceBudgets`:
  - API p95 target: 750 ms.
  - document upload max: 50 MB.
  - memory RSS warning: 512 MB.
  - mobile startup target: 3000 ms.
  - sync queue warning: 25 pending items.
- `security`:
  - health response does not expose secrets.
  - service-role keys are not allowed in client configuration.
  - student content is not allowed in logs.
  - tracked secret-file scan is enforced by MVP readiness.
  - live RLS status is `pending`, `ready`, or `blocked` depending on fixture/Supabase readiness.
- `observability`:
  - mode: `local_baseline`.
  - log policy: `metadata_only`.
  - monitored signals list.
  - external provider and alerting booleans.

The health response must never expose Supabase keys, bearer tokens, AI provider keys, model secrets, provider model values, student question text, generated answers, or document contents.

---

# 4. Logging Policy

The API bootstrap now emits metadata-only request completion logs:

- event name,
- HTTP method,
- safe path without query string values,
- status code,
- duration in milliseconds.

The logger must not print:

- request body,
- query values,
- authorization headers,
- bearer tokens,
- Supabase keys,
- AI provider keys,
- student prompts,
- generated BLIE responses,
- uploaded document text.

---

# 5. Mobile Visibility

The mobile Sync tab now shows:

- operational readiness,
- log policy,
- alerting configured/not configured,
- API p95 target,
- memory warning threshold,
- live RLS status,
- monitored signals.

This is intended for controlled MVP validation and demo confidence, not as a production operations dashboard.

---

# 6. Verification

Sprint 19 verification gates:

```powershell
corepack pnpm format
corepack pnpm typecheck
corepack pnpm check
corepack pnpm mvp:readiness
.\scripts\graphify.ps1 update .
git diff --check
```

Release-readiness tests assert:

- metadata-only log policy,
- API p95 target remains within the MVP budget,
- student content remains disallowed in operational logging policy.

---

# 7. Carry-Over

Production observability remains open:

- external monitoring provider,
- metrics dashboard,
- alert routing,
- incident response playbook automation,
- production load/performance test harness.

Recommended next target:

Sprint 20 - Controlled MVP Release Candidate.