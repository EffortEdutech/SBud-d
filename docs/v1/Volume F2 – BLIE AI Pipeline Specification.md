# AI Study Buddy

# Volume F2 – BLIE AI Pipeline Specification

**Version:** 1.0 (Architecture Freeze)

---

# 1. Introduction

The **Buddy Learning Intelligent Engine (BLIE)** is responsible for transforming educational information into personalized intelligence.

BLIE receives information from:

* Curriculum structure
* Student learning materials
* Student interactions
* Assessments
* Learning activities

It processes this information, updates the Personal Learning Knowledge Graph (PLKG), and provides personalized learning assistance.

---

# 2. BLIE Architecture Overview

The BLIE pipeline consists of six intelligence stages:

```
Input Collection

↓

Knowledge Extraction

↓

Knowledge Understanding

↓

Knowledge Graph Update

↓

Learning Intelligence

↓

Personalized Response
```

---

# 3. Stage 1 — Input Collection Layer

BLIE receives learning inputs from multiple sources.

## Academic Inputs

* Degree programme
* Semester
* Subjects
* Curriculum structure
* Learning objectives

These create the initial learning foundation.

---

## Student Inputs

Examples:

* PDF lecture notes
* Images
* Personal notes
* Questions
* Conversations
* Quiz attempts
* Assignments

---

## Learning Behaviour Inputs

BLIE observes:

* Topics studied
* Time spent learning
* Revision frequency
* Quiz performance
* Areas of difficulty

---

# 4. Stage 2 — Knowledge Extraction Pipeline

When a student uploads material:

Example:

Lecture PDF

```
PDF/Image

↓

Document Processing

↓

Text Extraction

↓

Semantic Analysis

↓

Concept Identification

↓

Knowledge Mapping
```

---

## Document Understanding

BLIE identifies:

* Topics
* Concepts
* Definitions
* Formulas
* Examples
* Relationships
* Important explanations

Example:

Input:

"Binary Search Tree is a data structure where each node has values smaller on the left and larger on the right."

BLIE extracts:

```
Binary Search Tree

belongs_to

Data Structures

requires

Tree Concept

related_to

Searching Algorithm
```

---

# 5. Stage 3 — Knowledge Understanding Layer

Extraction alone is not enough.

BLIE must understand relationships.

It identifies:

## Concept Relationships

Example:

```
Integration

requires

Differentiation
```

---

## Subject Relationships

Example:

```
Machine Learning

requires

Statistics

requires

Probability
```

---

## Learning Dependencies

Example:

```
Programming Objects

requires

Functions

requires

Variables
```

---

# 6. Stage 4 — PLKG Update Pipeline

After understanding information, BLIE updates the student's Personal Learning Knowledge Graph.

The update process:

```
New Knowledge

↓

Find Existing Concepts

↓

Create New Nodes

↓

Create Relationships

↓

Update Student Understanding

↓

Store Learning History
```

---

Example:

Before:

```
Student

knows

Functions
```

After learning:

```
Student

knows

Functions

↓

understands

Recursion

↓

preparing_for

Algorithms
```

---

# 7. Stage 5 — BLIE Reasoning Engine

This is where BLIE becomes intelligent.

When a student asks:

> "Why don't I understand this topic?"

BLIE does not only search documents.

It analyses:

* Current topic
* Previous knowledge
* Related concepts
* Learning history
* Assessment results
* Known weaknesses

---

Reasoning flow:

```
Student Question

↓

Intent Understanding

↓

PLKG Exploration

↓

Knowledge Gap Detection

↓

Context Assembly

↓

AI Reasoning

↓

Personalized Explanation
```

---

# 8. Learning Preparation Pipeline

A unique capability of AI Study Buddy.

Before a topic starts:

```
Upcoming Topic

↓

Curriculum Graph Analysis

↓

Prerequisite Identification

↓

Compare Student PLKG

↓

Find Missing Knowledge

↓

Generate Preparation Plan
```

Example:

Upcoming:

"Neural Networks"

BLIE identifies:

Required:

```
Linear Algebra
Probability
Python
```

Student status:

```
Linear Algebra 80%

Probability 45%

Python 90%
```

BLIE recommends:

"Review probability concepts before starting Neural Networks."

---

# 9. AI Tutor Pipeline

When students request help:

Example:

"Explain recursion."

BLIE:

1. Finds the concept.
2. Checks previous understanding.
3. Determines appropriate explanation level.
4. Provides examples.
5. Updates learning state.

Response adapts to the individual student.

---

# 10. Revision Intelligence Pipeline

BLIE creates personalized revision activities.

Inputs:

* Knowledge graph
* Exam date
* Learning progress
* Weak concepts

Outputs:

* Flashcards
* Quizzes
* Summary notes
* Revision plans

---

# 11. Assessment Intelligence Pipeline

BLIE analyses learning performance.

Example:

Quiz result:

```
Data Structures

Score: 55%
```

BLIE updates:

```
Student

struggles_with

Tree Traversal
```

Then:

* Recommend revision.
* Generate practice questions.
* Link prerequisite concepts.

---

# 12. Memory Pipeline

BLIE maintains long-term learning memory.

Memory types:

## Academic Memory

* Subjects
* Concepts
* Notes
* Learning history

---

## Learning Behaviour Memory

* Preferred learning style
* Frequently studied topics
* Weak areas

---

## Progress Memory

* Mastery level
* Improvements
* Achievements

---

# 13. AI Model Architecture Principle

BLIE should not depend on a single AI model.

The architecture separates:

## Intelligence Layer

Responsible for:

* Reasoning
* Planning
* Personalization

---

## Knowledge Layer

Responsible for:

* PLKG
* Documents
* Curriculum

---

## AI Model Layer

Responsible for:

* Language understanding
* Generation
* Summarization

This allows future flexibility in selecting AI models.

---

# 14. Continuous Learning Loop

BLIE improves through every interaction:

```
Student Learning

↓

AI Interaction

↓

Knowledge Update

↓

Better Understanding

↓

Better Recommendations

↓

Improved Learning
```

---

# Architecture Freeze

BLIE is defined as the intelligence engine responsible for:

1. Extracting knowledge from learning materials.
2. Building and updating the Personal Learning Knowledge Graph.
3. Understanding student learning progress.
4. Providing proactive learning guidance.
5. Supporting preparation, learning, and revision.

BLIE is not a question-answering chatbot.

BLIE is the intelligence layer that transforms AI Study Buddy into a personal learning companion.
