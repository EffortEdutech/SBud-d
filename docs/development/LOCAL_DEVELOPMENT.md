# AI Study Buddy Local Development

Status: Sprint 5 baseline
Last updated: 2026-07-12

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

Sprint 4 dashboard endpoint:

```text
http://localhost:4801/api/v1/dashboard
```

Sprint 5 document library endpoints:

```text
http://localhost:4801/api/v1/documents/library
http://localhost:4801/api/v1/documents
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

Sprint 3 Supabase variables are documented in:

```text
docs/development/SUPABASE_SETUP.md
```

Sprint 5 prepares the private `student-documents` storage bucket and student-owned
path convention in SQL. Real file upload still requires live Supabase project linking.

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
