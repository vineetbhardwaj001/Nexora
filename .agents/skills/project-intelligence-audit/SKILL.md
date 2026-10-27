---
name: project-intelligence-audit
description: Reverse-engineer an entire repository and create an evidence-based project report and self-contained AI handoff context before implementation.
---

# Project Intelligence Audit Skill

## Purpose
Use for requests such as "analyze the whole project", "give me a complete technical report", "understand my backend and frontend first", or "/projectintelligence".

## Rules
- Start at the repository root and inspect the full project, not just the currently discussed folder.
- Do not implement features during an audit-only task.
- Never expose secrets. Report environment variable names and redact values.
- Do not modify application code, schemas, migrations, dependencies, or deployment settings.
- Never claim a file, test, route, or feature was inspected or verified unless evidence supports that claim.
- Track inspected paths and explicitly list skipped or inaccessible areas.
- Treat source code as evidence of current behavior and PRDs as evidence of intended behavior.

## Audit workflow
1. Verify workspace access, repository root, Git status, and project structure.
2. Inventory backend, frontend, database, routes, controllers, services, middleware, tests, configuration, integrations, deployment files, and documentation.
3. Read relevant PRDs, API docs, README files, architecture notes, and setup instructions.
4. Identify actual technologies and versions from manifests and source usage.
5. Trace application startup and representative request flows end to end.
6. Inventory all registered API endpoints, including mounted prefixes, methods, authentication, roles, request validation, responses, errors, side effects, and evidence.
7. Inspect data models, fields, constraints, indexes, relationships, tenant ownership, transactions, and migrations.
8. Map authentication, sessions/tokens, role checks, resource ownership, and tenant isolation.
9. Inventory product modules, frontend routes/pages/components, state management, API clients, and real versus placeholder interactions.
10. Compare PRD requirements with backend, database, API documentation, frontend, and tests. Identify contradictions without silently resolving them.
11. Review reliability, security, performance, maintainability, accessibility, and test coverage defensively.
12. Prepare a prioritized implementation roadmap and list of unknowns.

## Required deliverables
Create or return:
- PROJECT_INTELLIGENCE_REPORT.md
- API_CONTRACT_REFERENCE.md
- DATABASE_REFERENCE.md
- FRONTEND_INTEGRATION_BLUEPRINT.md
- FRONTEND_PAGE_AND_COMPONENT_INVENTORY.md
- SECURITY_AND_TESTING_AUDIT.md
- AI_CONTEXT_PACK.md

Use a dedicated analysis docs directory when writing files. Inspect existing documentation before creating or replacing files.

## Evidence and status
Classify findings as VERIFIED, PARTIALLY VERIFIED, DOCUMENTED ONLY, MISSING, INFERRED, RUNTIME UNVERIFIED, or NOT INSPECTED. Attach file paths and symbol/line references where possible. Distinguish static analysis from tests actually run.

## Frontend handoff
The AI context pack must be self-contained and include the actual stack, repository structure, architecture, database, verified API contracts, auth/roles, frontend state, PRD gaps, protected backend boundaries, tests and observed results, implementation order, and unknowns. Never require a future chat to rely on "previous conversation".

## Completion report
State what was inspected, what remains uncertain, where files were saved, whether the audit is complete or partial, and the recommended next step. Do not begin implementation unless the user explicitly changes the task.
