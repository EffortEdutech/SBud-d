# AI Study Buddy

# Volume F5 – Cost & Infrastructure Architecture

**Version:** 1.0 (Architecture Freeze)

---

# 1. Introduction

AI Study Buddy is designed as a global consumer AI education platform.

The infrastructure must support:

* Millions of students.
* Continuous learning activity.
* Large document processing.
* Personal Learning Knowledge Graph (PLKG) growth.
* AI-powered assistance.

The architecture must balance:

* Intelligence quality.
* Response speed.
* Operational cost.
* Scalability.

---

# 2. Infrastructure Philosophy

The platform follows a layered intelligence approach.

```text
Simple Tasks

↓

Efficient Models

↓

Complex Tasks

↓

Advanced AI Models

↓

Critical Reasoning

↓

Premium Intelligence
```

Not every interaction requires the most expensive AI model.

---

# 3. Infrastructure Architecture

High-level structure:

```text
                 Student Apps

                     │

                API Gateway

                     │

        ┌────────────┴────────────┐

        BLIE Orchestration Layer

                     │

    ┌────────────────┼────────────────┐

Knowledge Services   AI Services   Data Services

                     │

              Cloud Infrastructure
```

---

# 4. Core Infrastructure Components

## Application Servers

Responsible for:

* User requests.
* Authentication.
* Subscription management.
* Application logic.

---

## Database Infrastructure

Stores:

* Student profiles.
* Academic information.
* Learning history.
* PLKG data.

---

## Object Storage

Stores:

* Lecture PDFs.
* Images.
* Documents.
* Generated learning materials.

---

## AI Processing Infrastructure

Handles:

* Document understanding.
* Knowledge extraction.
* AI conversations.
* Graph updates.

---

# 5. AI Cost Management Strategy

BLIE uses AI routing.

Every request is classified:

## Level 1 — Simple Intelligence

Examples:

* Flashcard generation.
* Short summaries.
* Basic explanations.

Uses:

* Small language models.
* Cached responses.

---

## Level 2 — Learning Intelligence

Examples:

* Concept explanation.
* Revision planning.
* Knowledge connection.

Uses:

* Medium AI models.
* Retrieval from PLKG.

---

## Level 3 — Advanced Reasoning

Examples:

* Complex problem solving.
* Deep subject analysis.
* Learning strategy.

Uses:

* Advanced AI models.

---

# 6. AI Model Strategy

BLIE should support multiple AI providers.

Architecture:

```text
BLIE

↓

AI Router

↓

Small Model
Medium Model
Large Model
Local Model
```

Benefits:

* Cost control.
* Flexibility.
* Future upgrades.
* Reduced dependency.

---

# 7. Knowledge Retrieval Before AI Generation

A major cost reduction principle:

Do not send everything to AI.

Instead:

```text
Student Question

↓

PLKG Search

↓

Relevant Knowledge Retrieval

↓

Small Context

↓

AI Response
```

Benefits:

* Lower token usage.
* Faster responses.
* More personalized answers.

---

# 8. Document Processing Economics

Student uploads:

Lecture PDF

The pipeline:

```text
Upload

↓

Storage

↓

Processing Queue

↓

AI Extraction

↓

Knowledge Update
```

Processing should be asynchronous.

The student does not need to wait.

---

# 9. Background Processing

Heavy tasks run through queues.

Examples:

* PDF analysis.
* OCR.
* Knowledge extraction.
* Flashcard generation.
* Graph enrichment.

Architecture:

```text
Task Queue

↓

AI Workers

↓

Database Update

↓

Student Notification
```

---

# 10. Storage Cost Strategy

Different data types require different storage.

## Hot Data

Frequently accessed:

* Current semester.
* Recent notes.
* Active subjects.

Fast storage.

---

## Warm Data

Occasionally accessed:

* Previous semesters.
* Older materials.

Lower-cost storage.

---

## Archive Data

Long-term academic memory.

Optimized for cost.

---

# 11. Subscription Economics

The platform supports:

## Free Tier

Purpose:

* User acquisition.
* Product discovery.

Limits:

* AI usage.
* Storage.
* Processing.

---

## Premium Tier

Provides:

* Higher AI usage.
* Larger PLKG.
* More document processing.
* Advanced learning features.

---

## Study Group Tier

Provides:

* Shared learning resources.
* Group collaboration.
* Reduced subscription cost.

---

# 12. Cost Optimization Through Shared Intelligence

The platform separates:

## Global Intelligence

Shared:

* Curriculum knowledge.
* Common concepts.
* Subject structures.

---

## Personal Intelligence

Private:

* Student understanding.
* Learning history.
* Personal notes.

This dramatically reduces repeated processing.

---

# 13. Infrastructure Scaling Model

Growth stages:

## Stage 1 — MVP

Supports:

* Thousands of students.

Architecture:

* Managed cloud services.
* Limited AI processing.
* Simple scaling.

---

## Stage 2 — Growth

Supports:

* Hundreds of thousands of students.

Add:

* AI queues.
* Worker scaling.
* Better caching.

---

## Stage 3 — Global Scale

Supports:

* Millions of students.

Add:

* Distributed services.
* Regional deployment.
* AI optimization.

---

# 14. Local AI Opportunity

Future versions may introduce local intelligence.

Possible uses:

* Offline explanations.
* Flashcard generation.
* Personal memory search.

Architecture:

```text
Cloud BLIE

+

Local Student AI Assistant

+

Synchronization
```

However, the primary architecture remains cloud-based for accessibility.

---

# 15. Infrastructure Success Criteria

A successful infrastructure enables:

* Affordable subscription pricing.
* Reliable AI assistance.
* Fast response times.
* Sustainable operational costs.
* Growth from MVP to millions of students.

---

# Architecture Freeze

AI Study Buddy infrastructure follows these principles:

1. AI cost must scale with business revenue.
2. Expensive AI reasoning is used selectively.
3. Knowledge retrieval reduces AI dependency.
4. Shared intelligence reduces duplication.
5. Background processing improves efficiency.
6. The architecture supports millions of students sustainably.

The goal:

**Deliver a powerful personal AI learning companion while maintaining healthy economics for a global student subscription platform.**

---

**End of Volume F5**
