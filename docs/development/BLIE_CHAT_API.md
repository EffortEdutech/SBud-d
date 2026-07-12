# BLIE Chat API

Status: Sprint 6 foundation
Last updated: 2026-07-12

---

# 1. Scope

Sprint 6 introduces the minimum useful BLIE chat contract.

The API uses a local deterministic provider behind a provider interface. This proves the BLIE
orchestration path without committing AI provider secrets or depending on a live AI account.

---

# 2. Endpoint

Base URL:

```text
http://localhost:4801/api/v1
```

Endpoint:

```text
POST /blie/chat
```

Example request:

```json
{
  "message": "Explain recursion with a simple example",
  "subjectId": "subject-programming",
  "preferredMode": "simple"
}
```

---

# 3. Processing Flow

Every Sprint 6 request follows the approved BLIE sequence:

1. Validate the learning question.
2. Detect the learning intent.
3. Retrieve academic profile context.
4. Retrieve subject context.
5. Retrieve document context.
6. Add the PLKG placeholder retrieval hook.
7. Generate a structured educational response through the provider abstraction.
8. Validate the response shape.

---

# 4. Response Shape

BLIE responses include:

- explanation
- connection
- example
- check understanding
- next step
- retrieved context
- reasoning trace

The trace exposes the current intent, retrieval status, provider, validation status, and context
summary so students can see that BLIE is grounded before generation.

---

# 5. Safety

Do not commit:

- AI provider API keys
- model credentials
- service-role keys
- `.env` files

API request logs must avoid student question text and generated response content.
