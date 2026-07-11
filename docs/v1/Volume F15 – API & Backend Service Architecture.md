# AI Study Buddy

# Volume F15 – API & Backend Service Architecture

**Version:** 1.0 (Architecture Freeze)

---

# 1. Introduction

The API & Backend Service Architecture defines the cloud services that power AI Study Buddy.

The backend is responsible for:

* Student authentication.
* BLIE orchestration.
* Personal Learning Knowledge Graph (PLKG).
* Document processing.
* Synchronization.
* Assessments.
* Study Groups.
* Subscription management.
* Notifications.

The architecture is designed for reliability, scalability, and future expansion.

---

# 2. Vision

To provide a modular backend platform capable of supporting millions of students while allowing new capabilities to be introduced without disrupting existing services.

---

# 3. Architecture Principles

The backend follows six principles.

## Service-Oriented

Each service owns a specific business capability.

---

## API-First

Every client communicates through well-defined APIs.

---

## Stateless Processing

Application services remain stateless whenever possible to simplify scaling.

---

## Event-Driven

Long-running operations execute asynchronously through events and background workers.

---

## Secure by Default

Every request is authenticated and authorized.

---

## Scalable

Services can scale independently according to demand.

---

# 4. High-Level Backend Architecture

```text id="f15arch01"
Mobile App

↓

API Gateway

↓

Backend Services

↓

BLIE Services

↓

Database + Storage + AI
```

The API Gateway provides a single entry point while routing requests to the appropriate service.

---

# 5. Core Backend Services

The platform is organised into domain services.

### Identity Service

Responsibilities:

* Authentication.
* User profiles.
* Device sessions.
* Account recovery.

---

### Student Service

Responsibilities:

* Academic profile.
* Degree programme.
* Semester progression.
* Subject enrolment.

---

### PLKG Service

Responsibilities:

* Knowledge nodes.
* Relationships.
* Mastery tracking.
* Knowledge graph updates.
* Graph queries.

---

### BLIE Service

Responsibilities:

* AI orchestration.
* Memory retrieval.
* Context assembly.
* Response generation.
* Personalization.

---

### Document Intelligence Service

Responsibilities:

* File ingestion.
* OCR.
* Content extraction.
* Concept detection.
* Knowledge enrichment.

---

### Curriculum Service

Responsibilities:

* Degree structures.
* Subjects.
* Weekly topics.
* Prerequisites.
* Learning outcomes.

---

### Assessment Service

Responsibilities:

* Quizzes.
* Learning analytics.
* Mastery evaluation.
* Readiness scoring.

---

### Study Group Service

Responsibilities:

* Group management.
* Shared resources.
* Collaboration.
* Group permissions.

---

### Subscription Service

Responsibilities:

* Plans.
* Billing.
* Usage quotas.
* AI allocation.
* Storage limits.

---

### Notification Service

Responsibilities:

* Push notifications.
* Study reminders.
* Assessment alerts.
* Synchronization updates.

---

# 6. API Gateway

The API Gateway manages:

* Authentication.
* Authorization.
* Request routing.
* Rate limiting.
* Logging.
* API versioning.

Clients never communicate directly with internal services.

---

# 7. BLIE Orchestration Layer

The BLIE Service coordinates multiple services before generating a response.

Example flow:

```text id="f15flow02"
Student Question

↓

BLIE

↓

Memory Service

↓

PLKG Service

↓

Curriculum Service

↓

Knowledge Retrieval

↓

AI Model

↓

Personalized Response
```

The orchestration layer keeps AI responses grounded in the student's learning context.

---

# 8. Event-Driven Processing

Heavy operations are executed asynchronously.

Examples:

* PDF processing.
* OCR.
* Knowledge extraction.
* Flashcard generation.
* Learning analytics.
* PLKG enrichment.

Architecture:

```text id="f15event03"
API Request

↓

Event Queue

↓

Worker Services

↓

Database Update

↓

Student Notification
```

This improves responsiveness for mobile users.

---

# 9. Synchronization API

The Synchronization Service supports:

* Upload local changes.
* Download cloud updates.
* Conflict detection.
* Merge strategies.
* Offline recovery.

The service works together with the mobile synchronization engine defined in Volume F14.

---

# 10. Internal Communication

Backend services communicate using secure internal APIs and events.

Examples:

PLKG Service publishes:

"Knowledge Updated"

↓

Assessment Service recalculates mastery.

↓

Notification Service prepares revision reminder.

Loose coupling allows services to evolve independently.

---

# 11. Storage Integration

Backend services access:

* Relational database.
* Graph relationships.
* Object storage.
* Search indexes.
* Vector indexes.

Each service only accesses the data required for its responsibilities.

---

# 12. Security Architecture

Every API request passes through:

```text id="f15security04"
Authentication

↓

Authorization

↓

Validation

↓

Business Logic

↓

Audit Logging
```

No service bypasses the security layer.

---

# 13. API Versioning

Public APIs are versioned to support future enhancements without breaking existing mobile applications.

Examples:

* Version 1.
* Version 2.
* Future extensions.

Backward compatibility should be maintained whenever practical.

---

# 14. Monitoring & Observability

Each service records:

* Request metrics.
* Processing time.
* Error rates.
* Queue length.
* AI usage.
* Synchronization status.

Operational insights support proactive maintenance.

---

# 15. Scalability

Services scale independently.

Examples:

Examination period:

Assessment Service expands.

Document upload week:

Document Intelligence Service expands.

Heavy AI usage:

BLIE workers expand.

Independent scaling improves efficiency and reduces infrastructure costs.

---

# 16. Future Service Expansion

Future services may include:

* Voice Intelligence Service.
* Career Guidance Service.
* Research Assistant Service.
* Marketplace Service.
* Alumni Learning Service.

The modular architecture supports these additions without redesigning the platform.

---

# Architecture Freeze

The API & Backend Service Architecture establishes a modular, scalable foundation for AI Study Buddy.

The backend shall:

1. Expose secure APIs for all client applications.
2. Separate business capabilities into independent services.
3. Coordinate BLIE through an orchestration layer.
4. Process heavy workloads asynchronously.
5. Support reliable synchronization.
6. Scale individual services independently.
7. Provide a stable platform for future expansion.

The guiding principle is:

**Every backend service has a single responsibility. BLIE unifies these services into one intelligent learning companion for every student.**

---

**End of Volume F15**
