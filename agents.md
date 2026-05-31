# AGENTS.md

## Project Context

This workspace is for building Vibe Coding full-stack web/app projects.

The user acts as product manager and expects Codex to support the full delivery flow:
Product Spec Builder -> Design Brief Builder -> Design Maker -> Dev Planner -> Dev Builder -> Bug Fixer -> Code Review -> Release Builder.

## Working Style

- Respond in Chinese unless the user requests otherwise.
- Prefer clear product thinking before implementation.
- When requirements are vague, clarify assumptions and produce a structured spec.
- When implementation is requested, read the existing project before editing.
- Keep changes scoped to the requested feature.
- Do not introduce new frameworks or dependencies without explaining why.

## Skill Usage

- For PRD, user story, scope, and acceptance criteria tasks, prefer `product-spec-builder`.
- For UX requirements and design briefs, prefer `design-brief-builder`.
- For visual design, Figma, layouts, and UI direction, prefer `design-maker`.
- For architecture, task breakdown, API contracts, and implementation plans, prefer `dev-planner`.
- For code implementation, prefer `dev-builder`.
- For errors, failing tests, or broken behavior, prefer `bug-fixer`.
- For quality checks, PR review, and risk analysis, prefer `code-review`.
- For build, deploy, changelog, release notes, and launch checks, prefer `release-builder`.

## Quality Bar

- Every feature should have acceptance criteria.
- Every meaningful code change should be verified with tests, linting, build, or browser/manual checks where applicable.
- Frontend work should be visually checked on desktop and mobile when possible.
- Release work should include rollback notes and post-release validation.