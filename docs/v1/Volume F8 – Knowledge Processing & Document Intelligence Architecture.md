# AI Study Buddy

# Volume F8 – Knowledge Processing & Document Intelligence Architecture

**Version:** 1.0 (Architecture Freeze)

---

# 1. Introduction

The Knowledge Processing & Document Intelligence Architecture defines how BLIE transforms raw learning materials into structured academic knowledge.

Students may upload:

* Lecture slides (PDF)
* Lecture notes
* Assignment documents
* Tutorial sheets
* Images
* Whiteboard photos
* Personal handwritten notes

BLIE processes these materials and continuously enriches the student's Personal Learning Knowledge Graph (PLKG).

---

# 2. Vision

To convert every learning resource into meaningful, connected knowledge that supports understanding rather than simple document storage.

Knowledge should become searchable, explainable, and connected throughout the student's academic journey.

---

# 3. Architecture Principles

The document intelligence pipeline follows six principles.

## Knowledge First

Documents are temporary inputs.

Knowledge is the permanent asset.

---

## Structure Before Storage

Information must be organised into concepts and relationships.

---

## Incremental Learning

Every uploaded document strengthens the existing PLKG rather than creating isolated information.

---

## Student Context

Knowledge extraction considers:

* Degree programme
* Semester
* Subject
* Existing PLKG
* Current learning progress

---

## Human Verification

Students may review, edit, or remove extracted knowledge.

BLIE assists but does not replace student ownership.

---

## Continuous Enrichment

Knowledge continues evolving as more learning materials are added.

---

# 4. Knowledge Processing Pipeline

Every uploaded document follows the same processing flow.

```text
Upload Document

↓

Document Classification

↓

Text & Image Extraction

↓

Content Understanding

↓

Concept Identification

↓

Relationship Mapping

↓

PLKG Enrichment

↓

Learning Intelligence Ready
```

---

# 5. Stage 1 – Document Classification

BLIE first determines what has been uploaded.

Examples:

* Lecture slides
* Tutorial sheet
* Assignment
* Textbook chapter
* Lab manual
* Student notes
* Whiteboard image

The document type influences later processing.

---

# 6. Stage 2 – Content Extraction

BLIE extracts all available information.

Supported content includes:

* Digital text
* OCR from images
* Tables
* Diagrams
* Mathematical expressions
* Figures
* Captions

The objective is to recover as much educational content as possible.

---

# 7. Stage 3 – Semantic Understanding

BLIE analyses the meaning of the content.

It identifies:

* Main topics
* Learning objectives
* Definitions
* Key concepts
* Examples
* Procedures
* Formula explanations
* References between sections

This transforms text into educational understanding.

---

# 8. Stage 4 – Concept Identification

BLIE extracts important learning concepts.

Example:

Lecture:

"Introduction to Database Normalization"

Extracted concepts:

* Database
* Normalization
* Functional Dependency
* First Normal Form
* Second Normal Form
* Third Normal Form

Each concept becomes a candidate knowledge node.

---

# 9. Stage 5 – Relationship Discovery

BLIE discovers how concepts relate.

Examples:

```text
Normalization

requires

Functional Dependency
```

```text
Second Normal Form

extends

First Normal Form
```

```text
Third Normal Form

depends_on

Second Normal Form
```

These relationships become part of the student's PLKG.

---

# 10. Stage 6 – Knowledge Validation

Before creating new knowledge nodes, BLIE checks:

* Does this concept already exist?
* Is this another name for an existing concept?
* Is this subject-specific terminology?
* Does it strengthen an existing relationship?

Duplicate knowledge should be avoided whenever possible.

---

# 11. Stage 7 – PLKG Enrichment

Validated knowledge is added to the student's Personal Learning Knowledge Graph.

The enrichment process may:

* Create new concepts.
* Strengthen existing concepts.
* Add relationships.
* Link learning resources.
* Update mastery indicators.

The graph grows continuously rather than restarting with each upload.

---

# 12. Cross-Subject Knowledge Integration

Knowledge often spans multiple subjects.

Example:

Statistics

↓

Supports

Machine Learning

↓

Supports

Artificial Intelligence

BLIE connects concepts across semesters and subjects to help students understand the bigger picture.

---

# 13. Student Note Integration

Personal notes receive the same intelligent treatment.

BLIE can:

* Extract concepts.
* Link notes to existing knowledge.
* Associate notes with lecture materials.
* Recommend related concepts.

Student-created knowledge becomes part of the PLKG.

---

# 14. Learning Resource Relationships

Each uploaded resource is linked to the knowledge it supports.

Example:

Lecture 5.pdf

↓

Explains

↓

Database Normalization

↓

Related Quiz

↓

Student Notes

↓

Revision Flashcards

A single resource may support many connected learning activities.

---

# 15. Knowledge Quality Improvement

As additional materials are uploaded, BLIE continuously improves understanding by:

* Merging duplicate concepts.
* Expanding concept descriptions.
* Discovering new relationships.
* Improving prerequisite mappings.
* Refining learning recommendations.

Knowledge quality improves over time rather than remaining static.

---

# 16. Personalization During Processing

Knowledge extraction is personalised.

The same document may produce different learning guidance depending on the student's PLKG.

Examples:

Student A

Strong in prerequisite concepts.

BLIE recommends advanced exploration.

Student B

Weak prerequisite foundation.

BLIE recommends prerequisite revision before continuing.

---

# 17. Future Intelligence

Future versions may support:

* Handwritten note recognition.
* Formula understanding.
* Diagram interpretation.
* Lecture audio transcription.
* Video lecture analysis.
* Automatic concept timeline generation.

These capabilities extend the same knowledge processing pipeline without changing the core architecture.

---

# Architecture Freeze

The Knowledge Processing & Document Intelligence Architecture defines how BLIE transforms educational resources into structured learning intelligence.

The pipeline shall:

1. Accept diverse learning materials.
2. Extract educational meaning.
3. Identify concepts and relationships.
4. Enrich the student's Personal Learning Knowledge Graph.
5. Improve learning recommendations through continuous knowledge growth.

The permanent asset is **not the uploaded document**.

The permanent asset is the **student's continuously evolving Personal Learning Knowledge Graph (PLKG)**, enriched and maintained by BLIE throughout the entire university journey.

---

**End of Volume F8**
