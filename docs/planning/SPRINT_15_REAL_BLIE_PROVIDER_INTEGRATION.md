# Sprint 15 - Real BLIE Provider Integration

Status: Implemented and verified
Last updated: 2026-07-31

---

# 1. Goal

Wire a real AI provider path into BLIE without weakening the architecture-freeze rule that BLIE owns
educational logic and AI providers remain model services only.

Sprint 15 keeps local deterministic mode as the default and adds an opt-in OpenAI-compatible Chat
Completions provider for controlled validation.

---

# 2. Scope

Included:

- `SBUD_BLIE_PROVIDER=local|openai-compatible`.
- Server-only `SBUD_BLIE_OPENAI_API_KEY`.
- Optional `SBUD_BLIE_OPENAI_BASE_URL`.
- Optional `SBUD_BLIE_MODEL`.
- Async BLIE provider interface.
- OpenAI-compatible JSON response request through server-side `fetch`.
- Structured BLIE learning response parsing and validation.
- Health/runtime provider readiness visibility without exposing secrets or model names.
- Unit tests for provider selection, request shape, env parsing, and health status.

Excluded:

- Committing or reading real `.env` values.
- Adding an AI SDK dependency.
- Running live provider calls without a local-only key.
- Prompt/evaluation tuning beyond the structured baseline.
- Replacing retrieval-backed BLIE context assembly.
- Generating the three preparation priorities and quick quiz. That is Sprint 16.

---

# 3. Architecture Notes

BLIE still assembles academic, subject, document, and PLKG context before generation. The real
provider receives the retrieved context package and must return the same structured learning
response used by local mode:

- `explanation`
- `connection`
- `example`
- `checkUnderstanding`
- `nextStep`

The provider mode is selected inside the API service only. Mobile clients continue to call
`POST /api/v1/blie/chat` and never receive provider keys.

---

# 4. Verification Plan

- `corepack pnpm check`
- `corepack pnpm mvp:readiness`
- Local fixture-mode BLIE smoke test if an API process is available on port `4801`.
- `.\scripts\graphify.ps1 update .`
- `git diff --check`

Live real-provider validation requires setting a local-only API key in the shell or local `.env`
file. Do not paste the key into chat or commit it.

---

# 5. Carry-Over To Sprint 16

Sprint 16 should use the now-real provider path to produce the True Learning MVP output:

- three things the student must understand before the next class,
- a quick quiz or flashcards from processed document/PLKG knowledge,
- clear retrieval trace showing which student-owned context grounded the answer.
