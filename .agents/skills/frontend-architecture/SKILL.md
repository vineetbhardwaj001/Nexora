---
name: frontend-architecture
description: Plan or refactor a scalable, understandable frontend architecture based on the actual framework, product domains, routes, and API contracts.
---

# Frontend Architecture Skill

## Purpose
Use for requests such as "make a scalable folder structure", "organize all frontend pages", "separate components and routes", or "/frontendarchitecture".

## Workflow
1. Inspect the repository, current framework, package scripts, routes, source tree, and Git status.
2. Identify existing patterns worth preserving and code that is genuinely duplicated or misplaced.
3. If a backend exists, read the backend-preserving-frontend skill and map real API contracts before planning integration.
4. Organize by real product domains and clear responsibilities, not arbitrary folder counts.
5. Separate route/page composition, reusable UI components, feature-specific components, API services, hooks, schemas/types, utilities, and styling where the stack benefits from it.
6. Keep app bootstrap and route registration easy to scan. Prefer importing a page-level module from the router instead of placing every implementation detail in the root app file.
7. Avoid giant components, duplicate API clients, circular dependencies, premature abstractions, and one-file-per-trivial-element structures.
8. Define boundaries for shared components versus feature-specific components.
9. Document naming conventions, import direction, data-fetching ownership, form validation, error states, and testing placement.
10. Present the proposed tree and explain where existing files move before making broad refactors. If implementation was requested, preserve behavior and user changes.

## Suggested domain pattern
Adapt to the actual project rather than copying blindly:
- app/: bootstrap, routes, providers, layouts
- pages/ or routes/: route-level composition
- features/: domain modules with components, API calls, hooks, schemas, and types
- components/ui/: genuinely shared primitives
- components/layout/: shared application shell
- lib/ or services/: shared infrastructure such as API client
- hooks/: cross-feature hooks only
- styles/: global styles and design tokens
- types/: shared types only
- tests/: tests organized by feature or behavior

Do not force this exact structure if the current framework has a better convention.

## Guardrails
- Keep backend read-only unless a separate backend change is explicitly approved.
- Do not add dependencies without checking whether existing packages already solve the problem.
- Do not migrate frameworks as part of a folder-structure request.
- Do not move files without updating imports, routes, tests, and configuration.
- Preserve CSS conventions chosen by the project; do not introduce utility CSS if the project uses classic CSS and the user prefers that.
- Report migration risks and actual verification results.

## Required output
Provide the current structure, proposed structure, responsibility of each folder, migration sequence, API boundaries, testing strategy, and list of files changed or still to move.
