# AI Study Buddy Local Development

Status: MVP Stabilization Pass 1 baseline
Last updated: 2026-07-15

---

# 1. Local Ports

Use the `4800` port series for localhost development.

- Mobile Expo dev server: `4800`
- API server: `4801`

---

# 2. Commands

Install dependencies:

```powershell
corepack pnpm install
```

Run all checks:

```powershell
corepack pnpm check
```

Run the MVP release readiness gate:

```powershell
corepack pnpm mvp:readiness
```

Start the API:

```powershell
corepack pnpm --filter @sbud-d/api dev
```

The API listens on:

```text
http://localhost:4801/api/v1/health
```

Sprint 4 dashboard endpoint:

```text
http://localhost:4801/api/v1/dashboard
```

Sprint 5 document library endpoints:

```text
http://localhost:4801/api/v1/documents/library
http://localhost:4801/api/v1/documents
```

Sprint 6 BLIE chat endpoint:

```text
http://localhost:4801/api/v1/blie/chat
```

Sprint 7 PLKG endpoints:

```text
http://localhost:4801/api/v1/plkg/summary
http://localhost:4801/api/v1/plkg/nodes
http://localhost:4801/api/v1/plkg/edges
```

Sprint 8 study preparation and revision endpoints:

```text
http://localhost:4801/api/v1/study/summary
http://localhost:4801/api/v1/study/preparation
http://localhost:4801/api/v1/study/revision
```

Sprint 9 offline and synchronization endpoints:

```text
http://localhost:4801/api/v1/sync/status
http://localhost:4801/api/v1/sync/conflict-rules
```

Start the mobile app:

```powershell
corepack pnpm --filter @sbud-d/mobile dev
```

The Expo dev server uses:

```text
http://localhost:4800
```

---

# 3. Environment Pattern

The mobile app reads:

```text
EXPO_PUBLIC_API_BASE_URL
```

If it is not set, the mobile shell defaults to:

```text
http://localhost:4801/api/v1
```

Do not commit `.env` files.

The API data mode is controlled by:

```text
SBUD_API_DATA_MODE=fixture
```

Supported values:

- `fixture`: default local/demo mode using deterministic in-memory repositories.
- `supabase`: server-side Supabase repository mode for wired domains.

When `SBUD_API_DATA_MODE=supabase`, the API requires `SUPABASE_URL`,
`SUPABASE_PUBLISHABLE_KEY`, and authenticated bearer tokens for Supabase-backed
endpoints. Do not commit real values.

Sprint 3 Supabase variables are documented in:

```text
docs/development/SUPABASE_SETUP.md
```

Sprint 5 prepares the private `student-documents` storage bucket and student-owned
path convention in SQL. Real file upload still requires repository wiring and live validation.

MVP Stabilization Pass 1 begins Supabase repository wiring with the academic profile,
subjects, dashboard, document metadata, PLKG node/edge, and study preparation/revision slices.
Sync still uses fixture-backed repositories until its adapter is implemented.

Sprint 6 uses a local deterministic BLIE provider abstraction. Do not commit AI provider
keys or real provider credentials.

Sprint 7 uses in-memory PLKG fixtures for local API/mobile flow. Supabase persistence is
wired for PLKG nodes, edges, summary, and learning activity writes when
`SBUD_API_DATA_MODE=supabase`.

Sprint 8 uses in-memory study preparation and revision guidance in fixture mode. Supabase mode
persists preparation plans, revision items, and revision reflection status updates behind the API
repository boundary.

Sprint 9 uses an in-memory mobile cache and pending queue for the local offline baseline.
Durable encrypted local storage is deferred until a mobile storage dependency is approved.

Sprint 10 release readiness docs live in:

```text
docs/release
```

---

# 4. Expo Go Compatibility

The mobile shell uses Expo SDK 56.

If Expo Go reports an SDK mismatch, update dependencies from the mobile workspace:

```powershell
corepack pnpm --filter @sbud-d/mobile exec expo install expo@~56 react react-native @types/react
```

Then restart Metro:

```powershell
corepack pnpm --filter @sbud-d/mobile dev
```

---

# 5. Browser Appears Offline

Starting Expo Metro should not make Chrome or the machine go offline.

If Chrome reports offline right after starting Expo, check:

- whether Wi-Fi briefly reconnected,
- whether VPN, proxy, firewall, or antivirus changed LAN access,
- whether another process is using port `4800`,
- whether Windows prompted for network access behind another window.

Expo advertises the local LAN URL for device testing. That may trigger firewall or network prompts, but it should not disable internet access.
