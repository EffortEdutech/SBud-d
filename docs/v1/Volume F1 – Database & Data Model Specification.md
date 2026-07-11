# AI Study Buddy

# Volume F1 – Database & Data Model Specification

**Version:** 1.0 (Architecture Freeze)

---

# 1. Introduction

The AI Study Buddy database architecture is designed to support a long-term personal learning companion for university students.

The system manages:

* Student identity
* Academic journey
* Learning materials
* AI interactions
* Learning progress
* Personal Learning Knowledge Graph (PLKG)

The architecture combines structured data storage with graph-based knowledge representation.

---

# 2. Database Architecture Principles

The database follows five principles:

## Student Ownership

Every student's learning data belongs to that individual student.

---

## Knowledge First

Information should become connected knowledge, not remain isolated files.

---

## Long-Term Memory

The database must preserve the student's academic journey from Semester 1 until graduation.

---

## Separation of Data Types

Operational data and knowledge graph data are separated but connected.

---

## Scalability

The architecture must support millions of students while maintaining individual personalization.

---

# 3. High-Level Data Architecture

The system consists of three data layers:

```
Application Database

        │

Learning Knowledge Layer

        │

Personal Learning Knowledge Graph
```

---

# 4. Application Database Layer

The relational database manages core application functions.

---

# 4.1 User Domain

## Student

Stores the student's account and profile.

Entity:

```
Student
```

Attributes:

* student_id
* name
* email
* profile_image
* created_date
* subscription_status

---

# 4.2 Academic Domain

## Programme

Represents the student's academic programme.

Example:

```
Bachelor Computer Science
```

Attributes:

* programme_id
* name
* institution
* duration

---

## Semester

Represents academic progression.

Example:

```
Semester 1
Semester 2
```

Attributes:

* semester_id
* programme_id
* sequence

---

## Subject

Represents courses taken by students.

Example:

```
Programming Fundamentals
Calculus
Database Systems
```

Attributes:

* subject_id
* name
* code
* semester

---

## Student Subject Enrollment

Connects students to subjects.

```
Student

      enrolled_in

Subject
```

Attributes:

* student_id
* subject_id
* semester
* status

---

# 5. Learning Content Domain

Stores all learning materials.

---

## Learning Material

Represents uploaded or generated content.

Types:

* PDF
* Image
* Note
* AI Summary
* Flashcard
* Quiz

Attributes:

* material_id
* student_id
* subject_id
* type
* title
* storage_location
* created_date

---

## Document Processing Record

Tracks AI processing.

Attributes:

* document_id
* extraction_status
* OCR_status
* processing_date

---

# 6. Learning Activity Domain

Tracks student interactions.

---

## Learning Session

Represents a study session.

Attributes:

* session_id
* student_id
* subject_id
* start_time
* duration

---

## AI Conversation

Stores interaction history.

Attributes:

* conversation_id
* student_id
* question
* response
* timestamp

---

## Assessment Activity

Tracks learning performance.

Examples:

* Quiz result
* Practice attempt
* Assignment review

Attributes:

* activity_id
* student_id
* concept_id
* score
* date

---

# 7. Personal Learning Knowledge Graph (PLKG)

The PLKG represents the student's academic intelligence layer.

---

# 7.1 Core Graph Entities

## Knowledge Node

The fundamental unit of knowledge.

Examples:

```
Derivative

Python Function

Database Normalization
```

Attributes:

* node_id
* name
* type
* description

---

## Knowledge Node Types

Examples:

```
Subject

Topic

Concept

Formula

Skill

Question

Mistake

Resource
```

---

# 7.2 Knowledge Relationships

Relationships define understanding.

Examples:

```
Concept

requires

Concept
```

Example:

```
Integration

requires

Differentiation
```

---

```
Material

explains

Concept
```

---

```
Student

struggled_with

Concept
```

---

```
Student

mastered

Concept
```

---

# 8. Student Knowledge Profile

Each student has a personalized layer.

Example:

```
Student

understands

Concept
```

Attributes:

* confidence_level
* mastery_score
* last_reviewed
* learning_status

---

# 9. Curriculum Knowledge Layer

The system maintains a curriculum foundation.

Example:

```
Computer Science

 ├── Programming

 ├── Algorithms

 └── Database
```

This provides the initial structure when a student enrolls.

---

# 10. Knowledge Evolution

The PLKG records growth over time.

Example:

Initial:

```
Calculus

Unknown
```

After learning:

```
Calculus

Understanding: 70%
```

After revision:

```
Calculus

Understanding: 90%
```

---

# 11. Data Flow

The overall flow:

```
Student Input

↓

Application Database

↓

AI Processing

↓

Knowledge Extraction

↓

PLKG Update

↓

BLIE Reasoning

↓

Personalized Learning
```

---

# 12. Multi-Student Scalability

The system separates:

## Shared Knowledge

Common curriculum concepts.

Example:

```
Calculus Fundamentals
```

Used by many students.

---

## Personal Knowledge

Individual learning state.

Example:

```
Student A struggles with Integration

Student B masters Integration
```

This prevents unnecessary duplication.

---

# 13. Database Security Principles

The system must enforce:

* Student data ownership
* Private learning history
* Secure document storage
* Controlled AI access
* Subscription-based feature access

---

# Architecture Freeze

The database architecture of AI Study Buddy consists of:

1. Relational Application Database
2. Curriculum Knowledge Layer
3. Personal Learning Knowledge Graph (PLKG)

The PLKG is the central knowledge structure that allows BLIE to understand, guide, and personalize each student's learning journey.

All future database, AI, and synchronization designs must conform to this model.
