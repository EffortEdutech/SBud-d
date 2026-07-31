# BLIE Chat API

Status: Sprint 16 retrieval-backed preparation and quiz
Last updated: 2026-07-31

---

# 1. Scope

Sprint 6 introduced the minimum useful BLIE chat contract.

Sprint 15 keeps the local deterministic provider as the default and adds an opt-in
OpenAI-compatible provider behind the same provider interface. This lets controlled validation use a
real model without committing AI provider secrets or moving educational logic into the model layer.

Sprint 16 extends the BLIE response so retrieved document/PLKG context produces the True Learning
MVP output: three preparation priorities and a quick quiz.

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
6. Retrieve PLKG context for the selected subject.
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
- three preparation priorities
- quick quiz
- retrieved context
- reasoning trace

The trace exposes the current intent, retrieval status, provider, validation status, and context
summary so students can see that BLIE is grounded before generation. Sprint 7 connects this
grounding path to the basic student-owned PLKG.

MVP Stabilization Pass 1 keeps BLIE provider-independent while allowing PLKG retrieval to use
Supabase-backed PLKG nodes in `SBUD_API_DATA_MODE=supabase`.

Sprint 15 provider modes:

- `SBUD_BLIE_PROVIDER=local`: default deterministic provider for fixture-safe development.
- `SBUD_BLIE_PROVIDER=openai-compatible`: sends the retrieved BLIE context package to a Chat
  Completions-compatible endpoint.

OpenAI-compatible mode uses these server-only variables:

```text
SBUD_BLIE_OPENAI_API_KEY=<local-only secret>
SBUD_BLIE_OPENAI_BASE_URL=https://api.openai.com/v1
SBUD_BLIE_MODEL=gpt-4o-mini
```

Do not paste the key into chat and do not commit `.env` files.

The provider request asks for JSON object output with the same response keys used by local mode:

```json
{
  "explanation": "...",
  "connection": "...",
  "example": "...",
  "checkUnderstanding": "...",
  "nextStep": "...",
  "preparationPriorities": [
    {
      "id": "priority-1",
      "title": "Recursion",
      "reason": "This appears in retrieved PLKG context.",
      "recommendedAction": "Review Recursion first and explain it in your own words.",
      "sourceContextIds": ["plkg-concept-recursion"]
    }
  ],
  "quickQuiz": {
    "title": "Quick check for Functions and control flow",
    "questions": [
      {
        "id": "quick-quiz-1",
        "prompt": "Why does Recursion matter for Programming Fundamentals?",
        "answer": "A strong answer connects Recursion to a subject goal and one example.",
        "explanation": "This checks understanding from retrieved student-owned context.",
        "sourceContextIds": ["plkg-concept-recursion"]
      }
    ]
  }
}
```

In Supabase mode, BLIE chat accepts the same authenticated bearer token pattern as the other
student-owned endpoints. Mobile still calls the API boundary; it does not access the database or
provider directly.

---

# 5. Safety

Do not commit:

- AI provider API keys
- model credentials
- service-role keys
- `.env` files

API request logs must avoid student question text and generated response content.

The health endpoint may report whether a provider mode appears configured, but it must not expose
provider API keys, bearer tokens, prompt text, generated answer content, or model credentials.
