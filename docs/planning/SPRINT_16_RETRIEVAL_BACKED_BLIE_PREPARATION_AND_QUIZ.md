# Sprint 16 - Retrieval-Backed BLIE Preparation And Quiz

Status: Implemented and verified
Last updated: 2026-07-31

---

# 1. Goal

Complete the True Learning MVP wow-moment output:

Lecture PDF upload -> text extraction -> concept extraction -> PLKG enrichment -> BLIE retrieves the
student-owned context -> BLIE returns three preparation priorities and a quick quiz.

---

# 2. Scope

Included:

- Auth-aware BLIE retrieval for Supabase mode.
- Academic, subject, document, and PLKG retrieval before generation.
- Document snippets that include extracted concept labels when available.
- Shared fixture-mode PLKG memory so local document concept mapping is visible to BLIE and study
  guidance.
- Structured BLIE response fields:
  - `preparationPriorities`
  - `quickQuiz`
- Local deterministic provider output for controlled demos.
- OpenAI-compatible provider prompt/parsing for the same structured response shape.
- Mobile BLIE response rendering for priorities and quiz questions.
- Tests that map document concepts into PLKG and prove BLIE retrieves them for generated guidance.

Excluded:

- New AI provider dependencies.
- Live provider key validation.
- Production-grade retrieval ranking/vector search.
- Durable offline storage.
- Full OCR or high-fidelity PDF parsing.

---

# 3. Student Outcome

After processing learning material, a student can ask BLIE for preparation guidance and see:

1. Three retrieved-context-backed topics to understand before the next class.
2. Why each topic matters.
3. A concrete action for each topic.
4. A quick quiz grounded in the same retrieved context.

---

# 4. Verification Plan

- `corepack pnpm check`
- `corepack pnpm mvp:readiness`
- Local fixture-mode upload -> extract -> map concepts -> BLIE chat smoke test when practical.
- `.\scripts\graphify.ps1 update .`
- `git diff --check`

---

# 5. Carry-Over To Sprint 17

Sprint 17 should harden durable offline storage and synchronization so generated preparation and
revision artifacts remain useful across app restarts and connectivity changes.
