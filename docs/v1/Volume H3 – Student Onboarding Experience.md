# AI Study Buddy

# Volume H3 – Student Onboarding Experience

**Version:** 1.0 (Architecture Freeze)

---

# 1. Introduction

The Student Onboarding Experience defines how a new student enters the AI Study Buddy ecosystem.

The objective of onboarding is to transform a new user into an active learner by:

- Understanding the student's academic journey.
- Establishing their learning environment.
- Preparing the initial Personal Learning Knowledge Graph (PLKG).
- Introducing BLIE as a personal learning companion.

Onboarding is the foundation of a multi-year relationship.

---

# 2. Onboarding Philosophy

The onboarding experience follows these principles:

## Simple Start

Students should begin quickly without unnecessary complexity.

---

## Personal From Day One

The application begins understanding the student's academic context immediately.

---

## Guided Setup

Students are guided step-by-step rather than presented with complex configurations.

---

## Immediate Value

Students should experience the benefit of AI Study Buddy early.

---

# 3. Onboarding Journey Overview

The onboarding flow:

```
First Launch

↓

Welcome

↓

Account Creation

↓

Student Profile

↓

Academic Setup

↓

Programme Selection

↓

Semester Setup

↓

Subject Enrolment

↓

Learning Preferences

↓

Initial PLKG Creation

↓

BLIE Introduction

↓

Student Dashboard
```

---

# 4. First Launch Experience

Purpose:

Introduce the purpose of AI Study Buddy.

The first impression should communicate:

"You now have a learning companion for your university journey."

Key messages:

- Understand your subjects.
- Build your knowledge.
- Study smarter with AI assistance.

The experience should feel welcoming and professional.

---

# 5. Account Creation

Purpose:

Create the student's personal learning account.

Required functions:

- Registration.
- Authentication.
- Account verification.
- Secure login.

The process should minimise friction.

---

# 6. Student Profile Setup

The student provides basic academic identity information.

Information includes:

- Name.
- Preferred learning language.
- Academic level.
- Learning preferences.

The purpose is personalisation, not data collection.

---

# 7. Academic Profile Setup

This is the foundation of the student's learning environment.

The student defines:

- University.
- Programme.
- Field of study.
- Academic year.
- Current semester.

This information establishes the academic context for BLIE.

---

# 8. Programme Selection

The student selects their academic programme.

Example:

```
University

↓

Faculty

↓

Programme

↓

Year

↓

Semester
```

This allows AI Study Buddy to understand the student's curriculum journey.

---

# 9. Semester Setup

The student creates their current semester.

Information includes:

- Semester number.
- Academic period.
- Current subjects.

The semester becomes the first learning container.

---

# 10. Subject Enrolment

Students select their current subjects.

For each subject:

Information may include:

- Subject name.
- Subject code.
- Credit hours.
- Lecturer information (optional).
- Available materials.

After enrolment:

The Subject Workspace is created.

---

# 11. Initial PLKG Creation

After academic setup, the system creates the student's initial Personal Learning Knowledge Graph.

Initial graph sources:

- Programme structure.
- Semester subjects.
- Subject topics.
- Curriculum relationships.

At this stage, the PLKG represents:

"What the student needs to learn."

Over time it evolves into:

"What the student knows."

---

# 12. Learning Preference Setup

Students may configure learning preferences.

Examples:

- Preferred explanation style.
- Study goals.
- Learning pace.

These preferences help BLIE personalize interactions.

---

# 13. BLIE Introduction

This is the first emotional connection with the AI companion.

The student is introduced to BLIE as:

"A learning partner that understands your subjects and helps you prepare, learn, and revise."

The introduction should demonstrate:

- Asking questions.
- Getting explanations.
- Receiving study guidance.

---

# 14. First Learning Interaction

The onboarding should end with immediate educational value.

Examples:

BLIE may:

- Explain the student's first subject.
- Show upcoming topics.
- Suggest preparation steps.

The student should understand:

"This app already knows my learning journey."

---

# 15. Dashboard Transition

After onboarding completion:

The student enters the main learning environment.

The Dashboard should display:

- Current semester.
- Subjects.
- First learning recommendations.
- BLIE availability.
- Initial knowledge graph status.

---

# 16. Returning Student Experience

Returning users should not repeat onboarding.

Instead:

The application recognises:

- Academic progress.
- Previous learning history.
- Existing PLKG.
- Current semester.

The experience continues from where the student stopped.

---

# 17. Onboarding States

Every onboarding step requires defined states.

## Loading

Example:

Creating PLKG.

---

## Empty

Example:

No subjects selected.

---

## Error

Example:

Unable to load programme data.

---

## Offline

Example:

Setup partially completed without connection.

---

## Completed

Example:

Academic environment successfully created.

---

# 18. Privacy & Trust

During onboarding, students must understand:

- What information is collected.
- Why it is needed.
- How it improves learning.

Transparency builds trust from the beginning.

---

# 19. Architecture Freeze

The Student Onboarding Experience establishes the foundation of the student's relationship with AI Study Buddy.

The onboarding shall:

1. Introduce the purpose clearly.
2. Create a personalised learning environment.
3. Establish academic context.
4. Begin construction of the student's PLKG.
5. Introduce BLIE as a learning companion.
6. Deliver immediate educational value.

The onboarding experience is the beginning of the student's multi-year learning journey.

---

**End of Volume H3**
