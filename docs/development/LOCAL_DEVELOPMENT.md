# AI Study Buddy Local Development

Status: Sprint 2 baseline
Last updated: 2026-07-11

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

Start the API:

```powershell
corepack pnpm --filter @sbud-d/api dev
```

The API listens on:

```text
http://localhost:4801/api/v1/health
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

Do not commit `.env` files. Supabase is not configured in Sprint 2.
