# AI Study Buddy

# Volume F10 – Curriculum Intelligence & Learning Path Architecture

**Version:** 1.0 (Architecture Freeze)

---

# 1. Introduction

The Curriculum Intelligence & Learning Path Architecture enables BLIE to understand the academic structure of a student's degree programme and transform it into a personalized learning journey.

Instead of reacting only after a student encounters difficulty, BLIE continuously prepares the student by identifying prerequisite knowledge, monitoring readiness, and recommending learning activities before new topics begin.

---

# 2. Vision

To ensure every student begins each lecture, tutorial, laboratory session, and assessment with the necessary background knowledge already established.

BLIE becomes a proactive learning companion that continuously prepares students for academic success.

---

# 3. Core Architecture Principle

The learning journey combines three layers:

```text id="v3m9kd"
University Curriculum

        ↓

Global Knowledge Graph

        ↓

Student PLKG

        ↓

Personal Learning Path
```

The curriculum defines what should be learned.

The PLKG determines what the student is ready to learn.

---

# 4. Curriculum Intelligence Model

BLIE maintains a structured curriculum model containing:

* Degree programmes.
* Academic calendar.
* Semesters.
* Subjects.
* Weekly topics.
* Learning outcomes.
* Assessments.
* Recommended references.

This becomes the Global Curriculum Graph.

---

# 5. Curriculum Graph

The curriculum is represented as a connected graph.

Example:

```text id="f4r0a8"
Computer Science

↓

Semester 1

↓

Programming Fundamentals

↓

Variables

↓

Functions

↓

Arrays
```

Every learning component is connected to related concepts and future subjects.

---

# 6. Prerequisite Intelligence

Every concept contains prerequisite relationships.

Example:

```text id="j8u2sf"
Machine Learning

requires

Linear Algebra

requires

Matrices

requires

Basic Algebra
```

BLIE can determine whether the student is academically prepared before beginning a topic.

---

# 7. Student Readiness Analysis

Before each new learning topic, BLIE evaluates:

* Required concepts.
* Current mastery.
* Recent revision.
* Knowledge confidence.
* Previous assessment performance.

Example:

Upcoming Topic:

Binary Trees

BLIE determines:

```text id="r1t5qy"
Variables ✓

Functions ✓

Recursion ✗

Pointers ✗
```

Recommendation:

Review recursion and pointers before attending the lecture.

---

# 8. Learning Path Generation

BLIE generates an adaptive learning path instead of a fixed sequence.

Inputs include:

* Curriculum requirements.
* Student PLKG.
* Memory architecture.
* Learning behaviour.
* Available study time.
* Assessment schedule.

The recommended path changes as the student's understanding evolves.

---

# 9. Weekly Learning Preparation

At the beginning of each academic week, BLIE prepares a study plan.

Example:

Week 6

Upcoming Lecture:

Database Indexing

Preparation:

* Review database tables.
* Review primary keys.
* Understand search efficiency.

Estimated preparation time:

45 minutes.

---

# 10. Assessment Preparation Intelligence

BLIE continuously monitors upcoming assessments.

Example:

Mid-term examination in 14 days.

BLIE identifies:

* Topics not yet mastered.
* High-weight concepts.
* Forgotten knowledge.
* Revision priority.

A personalized revision roadmap is generated.

---

# 11. Knowledge Gap Detection

BLIE compares:

Expected curriculum knowledge

versus

Current PLKG.

Example:

Expected:

```text id="s5c7pn"
Object-Oriented Programming

↓

Inheritance

↓

Polymorphism

↓

Abstraction
```

Current PLKG:

Inheritance ✓

Polymorphism ✗

Abstraction ✗

BLIE detects missing concepts and recommends targeted study activities.

---

# 12. Cross-Subject Intelligence

Many concepts appear across multiple subjects.

Example:

Probability

↓

Statistics

↓

Machine Learning

↓

Artificial Intelligence

BLIE recognises these relationships and encourages reinforcement before advanced subjects begin.

---

# 13. Personalized Learning Pace

Students progress differently.

BLIE adapts recommendations based on:

* Mastery level.
* Learning speed.
* Study consistency.
* Available study hours.

The curriculum remains constant, but the learning journey becomes personal.

---

# 14. Learning Milestones

BLIE defines meaningful milestones.

Examples:

* Subject readiness.
* Weekly preparation complete.
* Mid-semester readiness.
* Examination readiness.
* Semester completion.

Milestones help students measure progress beyond grades alone.

---

# 15. Continuous Curriculum Adaptation

The learning path is recalculated whenever significant events occur.

Examples:

* New lecture notes uploaded.
* Quiz completed.
* Assessment results received.
* Student asks repeated questions.
* New concepts added to the PLKG.

Recommendations remain current throughout the semester.

---

# 16. Future Intelligence

Future enhancements may include:

* University-specific curriculum templates.
* Automatic timetable integration.
* AI-generated weekly study schedules.
* Career pathway recommendations.
* Professional certification preparation after graduation.

These extend the same architecture without changing the core design.

---

# Architecture Freeze

The Curriculum Intelligence & Learning Path Architecture establishes BLIE as a proactive academic companion.

BLIE shall:

1. Understand the curriculum structure.
2. Build prerequisite relationships.
3. Evaluate student readiness.
4. Detect knowledge gaps.
5. Generate adaptive learning paths.
6. Prepare students before learning begins.
7. Continuously update recommendations as the PLKG evolves.

The defining principle is:

**AI Study Buddy does not simply help students study today's lesson. It prepares them for tomorrow's lesson, the next semester, and ultimately graduation.**

---

**End of Volume F10**
