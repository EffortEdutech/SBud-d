# AI Study Buddy

# Volume H2 – Information Architecture & Navigation

**Version:** 1.0 (Architecture Freeze)

---

# 1. Introduction

The Information Architecture & Navigation Specification defines the structural organisation of AI Study Buddy.

The objective is to create a navigation experience that feels natural for university students while supporting a multi-year learning relationship.

The application structure follows the student's academic journey rather than being organised around technical features.

---

# 2. Information Architecture Principles

The information architecture follows these principles.

---

## Student Journey First

The application structure follows:

Semester → Subject → Topic → Knowledge → Mastery

rather than:

Feature → Tool → Setting.

---

## Context Before Action

Students should understand their current learning context before taking action.

Example:

Current semester

↓

Current subjects

↓

Current topics

↓

Recommended learning actions

---

## Progressive Discovery

New students should not see unnecessary complexity.

Advanced capabilities become available naturally as learning progresses.

---

## Personal Knowledge Foundation

Every major learning activity connects back to the student's Personal Learning Knowledge Graph (PLKG).

---

# 3. Application Information Model

The application hierarchy is:

```
Student

 └── Academic Journey

      └── Programme

           └── Semester

                └── Subject

                     └── Topic

                          └── Knowledge

                               └── Learning Progress
```

This hierarchy represents the student's academic reality.

---

# 4. Primary Application Areas

The application consists of five primary areas.

## 1. Home

Student command centre.

Purpose:

- Understand current learning status.
- See priorities.
- Access important activities.

---

## 2. Subjects

Academic workspace.

Purpose:

- Manage subjects.
- Access materials.
- Study topics.
- Track progress.

---

## 3. BLIE

Personal learning companion.

Purpose:

- Ask questions.
- Receive explanations.
- Get guidance.

---

## 4. Knowledge

Personal knowledge growth.

Purpose:

- Explore PLKG.
- Understand relationships.
- Track mastery.

---

## 5. Profile

Personal management.

Purpose:

- Account.
- Preferences.
- Subscription.
- Privacy.

---

# 5. Main Navigation Structure

The mobile application uses a simple primary navigation.

Recommended structure:

```
Home

Subjects

BLIE

Knowledge

Profile
```

The navigation remains available throughout the student journey.

---

# 6. Home Information Architecture

Home provides an overview of current learning.

Structure:

```
Home

 ├── Semester Overview

 ├── Today's Learning

 ├── Subject Progress

 ├── Upcoming Activities

 ├── BLIE Suggestions

 └── Recent Knowledge Growth
```

---

# 7. Subject Information Architecture

Subjects are the primary academic workspace.

Structure:

```
Subjects

 └── Subject

      ├── Overview

      ├── Topics

      ├── Materials

      ├── Study Preparation

      ├── Revision

      ├── Assessment

      ├── BLIE Support

      └── Knowledge Map
```

---

# 8. BLIE Information Architecture

BLIE is available across the application.

Structure:

```
BLIE

 ├── Conversation

 ├── Learning Questions

 ├── Explanations

 ├── Study Guidance

 ├── Revision Support

 └── Recommendations
```

BLIE remains context-aware.

A question from a subject page automatically includes subject context.

---

# 9. Knowledge Information Architecture

The Knowledge section represents the student's learning intelligence.

Structure:

```
Knowledge

 ├── Knowledge Graph

 ├── Topics

 ├── Mastery

 ├── Learning Gaps

 └── Growth History
```

---

# 10. Document Information Architecture

Documents exist within the learning context.

Structure:

```
Subject

 └── Materials

      ├── Uploaded Documents

      ├── Processed Knowledge

      ├── Extracted Concepts

      └── Related Topics
```

Documents are not isolated storage objects.

They become part of the student's knowledge journey.

---

# 11. Academic Lifecycle Navigation

The application supports the full university lifecycle.

## First Semester

Focus:

- Setup.
- Understanding subjects.
- Building initial knowledge.

---

## Middle Semesters

Focus:

- Knowledge expansion.
- Deeper subject relationships.
- Improved learning habits.

---

## Final Year

Focus:

- Advanced knowledge.
- Projects.
- Research.
- Graduation preparation.

---

# 12. Navigation Context

The application maintains student context.

Context includes:

- Current semester.
- Active subject.
- Current topic.
- Recent learning activity.

This allows BLIE and the interface to remain relevant.

---

# 13. Search Architecture

Search supports discovery across:

- Subjects.
- Topics.
- Documents.
- Knowledge nodes.
- Learning history.

Search results should prioritize relevance to the student's academic context.

---

# 14. Notification Architecture

Notifications support learning activities.

Categories include:

## Academic

Examples:

- Upcoming assessments.
- Subject milestones.

## Learning

Examples:

- Revision reminders.
- Recommended preparation.

## System

Examples:

- Synchronization.
- Processing completion.

Notifications should assist learning, not interrupt unnecessarily.

---

# 15. Offline Navigation

The application maintains usable navigation during offline mode.

Students can access:

- Downloaded materials.
- Cached knowledge.
- Previous learning activities.

Unavailable features should be clearly indicated.

---

# 16. Future Screen Mapping

The Information Architecture provides the foundation for future detailed specifications:

- H3 – Student Onboarding
- H4 – Dashboard
- H5 – Subject Workspace
- H6 – BLIE Experience
- H7 – PLKG Experience
- H8 – Document Experience
- H9 – Study Preparation & Revision
- H10 – Study Groups
- H11 – Analytics & Growth
- H12 – Profile & Settings

---

# 17. Architecture Freeze

The Information Architecture establishes how students navigate AI Study Buddy.

The application shall:

1. Organise around the student's academic journey.
2. Make subjects the primary learning workspace.
3. Integrate BLIE throughout the experience.
4. Make PLKG the foundation of personal knowledge.
5. Maintain simple and predictable navigation.
6. Support students from first semester until graduation.

Detailed screen designs and interaction specifications will be developed in subsequent Volume H documents.

---

**End of Volume H2**
