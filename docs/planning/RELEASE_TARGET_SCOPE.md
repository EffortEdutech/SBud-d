# AI Study Buddy Release Target Scope

Version: 0.1
Status: Draft for product discussion
Last updated: 2026-07-30

---

# 1. Purpose

This document revises the near-term product scope into three clear release targets:

1. Controlled Demo MVP.
2. True Learning MVP.
3. Public Version 1.

The intent is to keep implementation focused on the real student learning experience instead of
continuing sprint-by-sprint without a visible product outcome.

This document does not replace the architecture-freeze volumes. It translates the approved product
vision into staged release outcomes that can be discussed, revised, built, and validated.

---

# 2. Product North Star

AI Study Buddy exists to help a student prepare before learning, understand during learning, and
revise after learning.

The product should not feel like a file manager, dashboard demo, or generic chatbot.

The core experience should feel like:

> "SBud-d understands what I am studying, turns my materials into knowledge, shows me what matters
> next, and helps me test my understanding."

---

# 3. Real User Wow Moment

The first product-defining wow moment is:

1. A student uploads a lecture PDF.
2. SBud-d extracts useful learning concepts.
3. SBud-d updates the student's Personal Learning Knowledge Graph.
4. BLIE identifies the student's next preparation priorities.
5. BLIE presents:
   - the three things the student should understand before the next class,
   - a short explanation for each,
   - a quick quiz to test readiness.

This is the learning loop we should build toward before expanding broadly.

---

# 4. Release Target 1 - Controlled Demo MVP

## Goal

Show SBud-d working convincingly with live data and a real student journey.

## Target User

Project owner, internal testers, demo observers, and controlled test users.

## Primary Promise

"I can see how SBud-d will work for a real student, using live persisted data, even if some
intelligence is still deterministic or simplified."

## Must-Have Experience

- Student can sign in with a test account.
- Student can see a student-facing home/dashboard.
- Student can define or load academic profile, semester, and subjects.
- Student can add a learning material record in a way that appears in the learning journey.
- Student can see persistence status and live API mode without exposing secrets.
- Student can ask BLIE a subject-aware question.
- Student can see PLKG, study preparation, revision, and sync states change in the UI.
- Demo can explain what is fixture, what is live, and what remains mocked.

## In Scope

- Live Supabase validation for current MVP entities.
- Same-student RLS validation.
- Cross-student access denial validation.
- Mobile UI flow that follows the student journey.
- Demo-ready dashboard, study, library, BLIE, PLKG, and sync visibility.
- Clear empty, loading, offline, and error states for demo paths.
- Documentation for how to run and validate the demo.

## Out Of Scope

- Real PDF byte upload.
- Real OCR/text extraction.
- Real AI provider quality.
- Production deployment.
- Subscription.
- Study groups.
- App store release.

## Exit Criteria

- A controlled tester can complete the demo flow without developer explanation for every screen.
- Supabase-mode data visibly persists and refreshes in the app.
- RLS validation is recorded without exposing tokens or secrets.
- The product owner can demonstrate the SBud-d learning journey from app launch to BLIE guidance.

---

# 5. Release Target 2 - True Learning MVP

## Goal

Deliver the real upload to extraction to PLKG enrichment to BLIE retrieval to revision loop.

## Target User

Small controlled student users.

## Primary Promise

"I can upload my lecture material and SBud-d turns it into useful preparation, knowledge memory,
BLIE guidance, and revision."

## Must-Have Experience

- Student uploads a lecture PDF.
- File bytes are stored in private student-owned storage.
- Text extraction runs for the MVP file types.
- Extracted concepts are visible to the student.
- PLKG is enriched from processed document content.
- BLIE uses retrieved student context before generating a response.
- Study preparation shows the top three priority concepts before the next class.
- Revision generates a quick quiz or flashcards from processed knowledge.
- Offline cache and sync queue survive app restart for MVP learning data.

## In Scope

- Real document upload and storage.
- Document processing status pipeline.
- PDF text extraction baseline.
- Concept extraction baseline.
- PLKG enrichment from extracted concepts.
- Retrieval-backed BLIE context.
- Real AI provider integration behind the existing provider abstraction.
- Study preparation and revision driven by processed knowledge.
- Durable offline storage and sync hardening.
- MVP UX polish for controlled student testing.
- Observability, security, and performance baseline for MVP operations.

## Out Of Scope

- Full public subscription lifecycle.
- Study groups.
- Web application.
- App store release.
- Marketplace, creator tools, voice, career guidance, and advanced collaboration.

## Exit Criteria

- A student can complete the real learning loop using one uploaded lecture PDF.
- BLIE responses cite or explain the student context used.
- PLKG changes are visible after document processing.
- Revision content is generated from student-owned knowledge.
- Offline learning remains useful after app restart.
- Controlled MVP release candidate passes security, quality, and demo validation.

---

# 6. Release Target 3 - Public Version 1

## Goal

Prepare AI Study Buddy for public individual-student use.

## Target User

Real university students using their own accounts, subjects, documents, and subscriptions.

## Primary Promise

"I can trust SBud-d as my personal AI learning companion throughout my academic journey."

## Must-Have Experience

- Student can onboard without developer help.
- Account, profile, preferences, and privacy controls are complete.
- Subscription lifecycle is operational.
- Notes and learning hub are complete.
- Revision centre supports summaries, flashcards, quizzes, practice questions, and planning.
- Progress dashboard and learning analytics are meaningful.
- Study groups MVP is implemented with privacy-safe sharing.
- Web application baseline exists.
- Mobile build pipeline and release channels are ready.
- Monitoring, support, and incident response are active.

## In Scope

- Full onboarding.
- Account/profile/settings completion.
- Subscription system.
- Notes and personal learning hub.
- Revision centre.
- Progress dashboard and analytics.
- Study groups MVP.
- Web application baseline.
- Production deployment and observability.
- App store and web launch readiness.
- Public release security and compliance review.

## Out Of Scope

- Marketplace and creator programme unless explicitly pulled forward.
- Voice and multimodal learning unless explicitly pulled forward.
- Career guidance unless explicitly pulled forward.
- Global-scale optimisation beyond the needs of Version 1 launch.

## Exit Criteria

- PRD Version 1 scope is implemented or explicitly deferred by product decision.
- Public release gate passes.
- Student data protection, support, monitoring, and operational readiness are accepted.
- App store and web launch paths are ready.

---

# 7. Feature Priority Matrix

## Priority A - Product-Defining

- Lecture PDF upload.
- Text extraction.
- Concept extraction.
- PLKG enrichment.
- Retrieval-backed BLIE.
- Three preparation priorities before class.
- Quick quiz or flashcards after processing.

## Priority B - MVP Trust Builders

- Real onboarding path.
- Student-owned persistence.
- RLS validation.
- Clear processing states.
- Durable offline queue.
- Error states that explain what the student can do next.

## Priority C - Version 1 Expansion

- Subscription.
- Notes hub.
- Study groups.
- Web app.
- Analytics.
- App store release.

## Priority D - Future Platform

- Marketplace.
- Voice learning.
- Career guidance.
- Creator programme.
- Advanced predictive learning.

---

# 8. Immediate Planning Decisions Needed

Before building the next feature sprint, decide:

1. Should Sprint 12 focus entirely on real document upload and private storage?
2. Which file types are MVP: PDF only, or PDF plus images?
3. Should text extraction run locally in the API first, or through a managed provider later?
4. Which AI provider should be used first for real BLIE responses?
5. What is the minimum acceptable PLKG enrichment after one uploaded document?
6. What should the first quick quiz include: multiple choice, short answer, or both?
7. What demo dataset should we use for repeated validation?

---

# 9. Recommended Next Planning Step

Prepare a Sprint 12 implementation plan for:

**Real Document Upload And Storage**

The sprint should be scoped as the first step toward the wow moment, not as a generic document
library feature.

Recommended Sprint 12 outcome:

"A student uploads a PDF into a subject workspace, the file is stored privately, document metadata
is persisted, processing status is visible, and the UI clearly shows this material is ready for the
next extraction sprint."
