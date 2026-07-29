# AI Workspace Context

This file is a project-local bridge to the Effort Studio central Obsidian vault.

It exists because some Codex or Claude sessions mount only the project folder. In those sessions, the central vault may be outside the sandbox even though it exists on the machine.

## Central Vault

~~~text
C:\Users\user\Documents\00 AI agent\AI-Knowledge
~~~

## How To Use This File

- Read this file only for architecture rationale, ADR, roadmap, cross-project context, and workspace operating rules.
- Do not use this file as a replacement for project docs or source files.
- If the central vault is accessible, prefer the live vault note listed below.
- If the central vault is not accessible, use this local bridge as the fallback context and mention that the live vault was outside the current sandbox.

## Live Vault Note

~~~text
C:\Users\user\Documents\00 AI agent\AI-Knowledge\Projects\Sbud-d\Overview.md
~~~

## Synced Project Overview

# Sbud-d Overview

## Purpose

Sbud-d is the AI Study Buddy architecture and future implementation workspace. AI Study Buddy is a B2C personal AI learning companion for university students, built around BLIE, the Buddy Learning Intelligent Engine, and each student's Personal Learning Knowledge Graph.

## Repository

~~~text
C:\Users\user\Documents\00 Sbud-d
~~~

## Project Docs

Start with:

~~~text
docs\v1\Volume A â€“ Product Vision & Strategy.md
docs\v1\Volume B â€“ Product Requirements Document (PRD).md
docs\v1\Volume G0 â€“ Engineering Constitution.md
docs\v1\Volume G2 â€“ Monorepo & Repository Architecture.md
docs\v1\Volume G13 â€“ MVP Delivery Roadmap.md
~~~

## Architecture Baseline

- Product: AI Study Buddy.
- Model: B2C subscription product for individual university students.
- Core intelligence: BLIE owns educational intelligence, personalization, memory, curriculum reasoning, and recommendations.
- Core data concept: each student owns an independent Personal Learning Knowledge Graph.
- Delivery model: mobile, web, backend services, packages, database, infrastructure, docs, knowledge, agents, scripts, tools, and tests in one monorepo.
- Current folder state: documentation-first project; source code folders are not created yet.

## AI Setup

Project-local assistant files:

~~~text
C:\Users\user\Documents\00 Sbud-d\AGENTS.md
C:\Users\user\Documents\00 Sbud-d\CLAUDE.md
~~~

Project-local Graphify wrappers:

~~~text
C:\Users\user\Documents\00 Sbud-d\scripts\graphify.ps1
C:\Users\user\Documents\00 Sbud-d\scripts\graphify.sh
~~~

## Current Graphify Scope

Initial documentation graph scope:

- `docs\v1`

Future code graph folders from Volume G2:

- `apps`
- `services`
- `packages`
- `database`
- `infrastructure`
- `tests`
- `tools`

Markdown semantic graph extraction requires an LLM API key for the current docs-only state. Once implementation folders exist, code-only extraction can run without semantic document extraction.

## Related Notes

- [[Architecture/AI Development Workspace]]
- [[Architecture/Graphify + Obsidian Workflow]]
- [[Architecture/Codex + Claude Code Workflow]]

