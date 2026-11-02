---
name: pro-eng-scalable
description: Orchestrate Nexora's existing skills for a complete, safe, scalable engineering improvement workflow across existing or new software projects. Use for whole-project audits, architecture and folder organization, maintainability, bug fixing, performance, security, testing, or coordinated project improvement.
---

# Pro Engineering Scalable — Master Workflow

## Mission
Coordinate the existing Nexora skills to help build professional, maintainable software that is easy to understand and safely modify in small parts. Apply principal-engineering practices as a quality standard, without claiming real employment experience.

This is an orchestrator, not a replacement for specialist skills. Reuse their instructions and avoid duplicating their full procedures.

## Operating modes
Read the user's requested mode from the command arguments:
- `audit-only`: read-only inspection and reports; do not edit application files.
- `architecture-only`: inspect and propose architecture/folder changes; do not migrate until approved.
- `fix-bugs`: reproduce and fix verified, in-scope bugs with regression tests.
- `frontend-only`: limit implementation to frontend paths; backend and shared contracts are read-only by default.
- `backend-only`: limit implementation to approved backend paths; preserve frontend contracts.
- `full-improvement`: complete prioritized improvement workflow, with approval gates for high-impact changes.
- no argument: guided full workflow. Inspect first, propose a prioritized plan, then proceed with reversible, clearly in-scope improvements. Ask before consequential changes.

Never interpret a mode or command as permission for destructive operations, production changes, secret changes, paid services, broad API/database migrations, or external security/load tests.

## Phase 0 — Discover project and protect work
1. Read `AGENTS.md`, relevant nested instructions, `.agent/CORE.md`, `.agent/config/skills.json`, and applicable tool rules.
2. Identify the actual workspace/repository root, services, monorepo boundaries and package managers. Do not assume folder names, languages, frameworks or databases.
3. Inspect `git status`, branch and recent changes. Preserve all pre-existing user modifications.
4. Inventory entry points, source folders, configs, environment variable names (never values), build/test scripts, CI, deployment, docs, APIs, schemas and integrations.
5. For multi-service projects, identify each service and trace service-to-service communication.
6. Mark findings VERIFIED, PARTIALLY VERIFIED, NOT FOUND or UNVERIFIABLE. Never invent missing components.

## Phase 1 — Discover and orchestrate specialist skills
Read the complete `SKILL.md` for each relevant, existing skill before using it. Check the skill registry and actual filesystem; do not trust registry entries alone. Do not invoke missing skills or claim they ran.

Initial routing:
- Project discovery: `project-intelligence-audit`, `idea-product-strategy`
- Frontend structure: `frontend-architecture`, `ux-ui-design`, `exact-same-uiux` when relevant
- Backend/API: `backend-api-audit`, `backend-preserving-frontend` when relevant
- Maintainability: `clean-code-architecture`
- Quality: `error-handling`, `validation`, `meaningful-product-messages`
- Whole-system review: `engineering-council` for cross-functional or high-risk reviews

Also discover other installed skills dynamically. Respect each skill's enabled/ask-first/disabled status. Ask before running ask-first skills when required by the registry. Never silently enable disabled skills.

Create a concise skill execution ledger: skill name, file path, why relevant, loaded status, and output used. Avoid duplicate analysis. Run dependent phases sequentially; parallelize only independent read-only investigations.

## Phase 2 — Understand architecture and behavior
Analyze only applicable layers:
- product goals and critical user journeys
- frontend pages/routes, components, state, API clients and accessibility
- backend routes, controllers, services, repositories, middleware and background jobs
- database entities, relations, constraints, indexes, migrations and ownership boundaries
- authentication, authorization and tenant/resource isolation
- real-time events, queues, storage, AI/ML and external integrations
- build, deployment, observability, configuration and tests

Trace critical flows end to end. Cite exact file paths, symbols and line numbers when tools make them available. Separate facts, assumptions, risks and recommendations.

## Phase 3 — Architecture and folder structure
Recommend a project-specific structure based on actual technology, product domains, repository size and framework conventions. Do not force a universal template.

Evaluate:
- domain/feature cohesion and service boundaries
- separation of presentation, business logic, transport and data access
- clear entry points and predictable file locations
- reusable shared code only where genuinely shared
- tests close to modules where ecosystem conventions support it
- centralized configuration and design tokens where appropriate
- dependency direction and avoidance of circular imports

For each proposed move or rename:
1. Explain why it improves discoverability or isolation.
2. Search static and dynamic imports, route registrations, scripts, tests, CI and deployment references.
3. Provide old-path → new-path migration mapping.
4. Preserve exports, API contracts, database fields and environment names unless approved.
5. Split migration into small, reviewable steps.

Avoid overengineering small projects, arbitrary line-count rules, excessive wrappers, speculative abstractions and cosmetic file moves.

## Phase 4 — Maintainable implementation
Apply `clean-code-architecture` when present. Keep modules cohesive, names descriptive, side effects explicit, API access outside presentation components, and business logic testable. Explain important boundaries in beginner-friendly language: what a file does, why it exists, who depends on it, where future edits belong and how to test them.

## Phase 5 — Bugs, security and performance
For each bug record reproduction, expected/actual behavior, root cause, affected paths, severity and regression test. Fix verified in-scope defects only.

Review relevant security and performance risks: authorization boundaries, input validation, secret handling, unsafe file operations, query patterns, N+1 behavior, unnecessary renders/network calls, resource cleanup, memory leaks, concurrency, caching and timeouts.

Measure before claiming performance gains. Do not add infrastructure, caching, queues or microservices without evidence of need. Never expose secrets. Use only local/synthetic data unless an authorized test environment is explicitly provided.

## Phase 6 — Safe execution
For each logical change:
1. State objective and allowed file boundary.
2. Inspect target files and dependencies.
3. Make the smallest coherent change.
4. Update or add focused tests.
5. Run the relevant existing checks.
6. Review the diff for unrelated changes and regressions.
7. Explain the result and any remaining uncertainty.

Preserve unrelated code and user changes. Do not perform whole-project rewrites. Ask before deletion, destructive migrations, production deployments, changing auth/security behavior, public API contracts, database schemas, secrets, paid services or high-impact structural migrations.

## Phase 7 — Verification
Discover actual commands from package manifests, build files, CI and project docs. Run applicable unit/integration/API/UI tests, type checks, lint, build and security checks. Do not invent scripts or claim tests passed unless they ran.

Report exact commands, passed/failed/blocked/skipped results and evidence. Distinguish test plans from executed tests.

## Phase 8 — Documentation and handoff
Create or update only useful, relevant documentation; do not create empty boilerplate. Prefer a discoverable engineering index linking:
- project overview
- current architecture and service map
- folder structure and module ownership
- API/database contracts where applicable
- quality and security findings
- bug register
- test strategy
- migration/refactoring roadmap
- architecture decisions

Explain how a beginner can locate a feature, safely change it, and run its tests.

## Final report
Include:
1. Project/services discovered and stack verified.
2. Specialist skills actually loaded and used.
3. Existing versus recommended architecture.
4. Folder/file changes and migration map.
5. Verified bugs and fixes.
6. Security/performance findings.
7. Exact changed/created/moved/deleted files.
8. Tests actually executed and results.
9. Risks, blocked work and assumptions.
10. Prioritized next steps.

Clearly label current behavior, confirmed defects, implemented changes, recommendations and unverified items. Do not claim simulated reviewers are real independent engineers or claim unrun tests passed.
