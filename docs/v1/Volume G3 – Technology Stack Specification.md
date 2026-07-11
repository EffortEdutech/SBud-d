# AI Study Buddy

# Volume G3 – Technology Stack Specification

**Version:** 1.0 (Architecture Freeze)

---

# 1. Introduction

The Technology Stack Specification defines the approved technologies used to build AI Study Buddy.

The objective of this document is to establish a consistent and maintainable technology foundation that supports the architectural principles defined in Volumes A through G2.

Technology selections shall prioritise:

- Scalability
- Maintainability
- Developer productivity
- Cost efficiency
- AI integration
- Long-term sustainability

This document serves as the official technology reference for all implementation work.

---

# 2. Technology Principles

The platform shall follow these principles.

## Proven Technologies

Prefer mature, well-supported technologies with active communities.

---

## Open Standards

Use open standards wherever practical to reduce vendor lock-in.

---

## Type Safety

End-to-end type safety shall be maintained across the platform.

---

## Cloud-First

Cloud infrastructure remains the primary deployment environment.

---

## Offline-First

Mobile technologies shall support offline learning and synchronization.

---

# 3. Mobile Application

Purpose

Deliver the primary student learning experience.

Approved Technology

- React Native
- Expo

Responsibilities

- Student interface
- Offline learning
- Local storage
- Synchronization
- Push notifications

---

# 4. Backend Platform

Purpose

Provide APIs and business services.

Approved Technology

- NestJS
- TypeScript

Responsibilities

- Authentication
- Business logic
- BLIE orchestration
- API services
- Background processing

---

# 5. Database Platform

Purpose

Store structured application data.

Approved Technology

- PostgreSQL
- Supabase

Responsibilities

- Student data
- Academic records
- PLKG metadata
- Learning history
- Subscriptions
- Security policies

---

# 6. Object Storage

Purpose

Store uploaded learning resources.

Approved Technology

- Supabase Storage

Examples

- PDF documents
- Images
- Generated learning assets

Structured knowledge extracted from these files is stored in the database rather than as binary files.

---

# 7. Authentication

Purpose

Manage student identity.

Approved Technology

- Supabase Authentication

Responsibilities

- Registration
- Login
- Session management
- Access control

---

# 8. AI Layer

Purpose

Provide educational reasoning.

Architecture

BLIE remains responsible for:

- Context assembly
- Memory
- Retrieval
- Personalization
- AI orchestration

External AI models perform reasoning through the BLIE orchestration layer.

The application shall remain independent of any single AI provider.

---

# 9. Knowledge Processing

Purpose

Transform uploaded learning materials into structured knowledge.

Responsibilities

- OCR
- Text extraction
- Concept extraction
- Knowledge mapping
- PLKG enrichment

Processing pipelines follow the architecture defined in Volume F8.

---

# 10. API Architecture

Approved Standard

REST API

Responsibilities

- Mobile communication
- Authentication
- Synchronization
- BLIE requests
- Learning services

All APIs remain versioned and documented.

---

# 11. Development Language

Approved Language

TypeScript

The platform adopts a common programming language across frontend and backend wherever practical to improve consistency and maintainability.

---

# 12. Version Control

Approved Platform

Git

Responsibilities

- Source control
- Branch management
- Code review
- Release management

---

# 13. Documentation

Documentation remains part of the codebase.

Approved Format

- Markdown

Documentation includes:

- Architecture
- Engineering guides
- API references
- Implementation notes

---

# 14. Deployment

The platform follows the deployment architecture defined in Volume F16.

Deployment environments include:

- Development
- Testing
- Staging
- Production

Infrastructure is managed through automated deployment processes.

---

# 15. Monitoring

Operational monitoring follows the architecture defined in Volume F16.

Monitoring includes:

- Application health
- API performance
- AI usage
- Synchronization
- Error tracking
- Infrastructure health

---

# 16. Technology Governance

Technology changes shall be evaluated against:

- Engineering Constitution
- Existing architecture
- Long-term maintainability
- Migration impact
- Operational cost

Technology decisions shall support architectural stability rather than short-term trends.

---

# 17. Architecture Freeze

The Technology Stack Specification establishes the approved implementation technologies for AI Study Buddy.

The platform shall:

1. Maintain a consistent TypeScript-based engineering stack.
2. Use React Native and Expo for the mobile application.
3. Use NestJS for backend services.
4. Use PostgreSQL and Supabase for structured data.
5. Use Supabase Storage for learning resources.
6. Use Supabase Authentication for identity management.
7. Keep BLIE independent from specific AI providers.
8. Follow the deployment and operational architecture defined in Volume F16.

This technology stack provides a stable foundation for building AI Study Buddy from MVP to a globally scalable platform.

---

# Implementation Notes (Not Part of Current Architecture)

Future evaluations may consider alternative technologies if they provide significant architectural or operational advantages. Such evaluations require a formal architecture review and shall not modify the approved technology stack without an updated architecture decision.

---

**End of Volume G3**
