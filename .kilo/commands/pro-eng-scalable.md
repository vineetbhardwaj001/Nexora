---
description: Run Nexora's universal guided engineering workflow for project discovery, architecture, maintainability, bug fixes, security, performance and tests. Optional modes: audit-only, architecture-only, fix-bugs, frontend-only, backend-only, full-improvement.
agent: code
---

# /pro-eng-scalable — Nexora Master Engineering Workflow

Arguments: $ARGUMENTS

1. Read `AGENTS.md`, `.agent/CORE.md`, `.agent/config/skills.json`, and applicable nested instructions.
2. Read `.agents/skills/pro-eng-scalable/SKILL.md` completely. Treat it as the orchestration contract.
3. Inspect the workspace root, Git status, existing changes, project structure, services, stack, package/build/test configuration and documentation. Preserve all pre-existing user changes.
4. Discover available skills by inspecting `.agents/skills/*/SKILL.md` and the registry. Verify each file exists before using it. Read complete relevant specialist skills. Reuse existing skills; do not duplicate their procedures. Respect disabled and ask-first registry states.
5. Interpret arguments:
   - `audit-only`: read-only audit and roadmap.
   - `architecture-only`: recommend structure and migration plan; no moves until approved.
   - `fix-bugs`: reproduce and fix verified in-scope bugs with tests.
   - `frontend-only`: edit frontend paths only; keep backend/contracts read-only by default.
   - `backend-only`: edit approved backend paths only; preserve frontend contracts.
   - `full-improvement`: prioritized project-wide improvement with approval gates.
   - no argument: guided full workflow; inspect and plan first.
6. Build a task-specific skill sequence. Use project-intelligence-audit first when available; then relevant architecture, frontend, backend/API, clean-code, validation, error-handling, UX and engineering-council skills as applicable. Do not invoke missing skills. Report missing registry entries.
7. Trace the actual architecture and critical flows. Identify verified defects, dependencies, risks and existing conventions. Do not assume technology or invent APIs/schemas.
8. Recommend a domain/feature-oriented structure appropriate to this stack. Explain module responsibilities, naming, dependencies and old-to-new path mapping. Avoid arbitrary moves and overengineering.
9. For implementation modes, work in small logical steps. Search all imports/references before moving files. Preserve public contracts, data shapes and unrelated code. Add regression tests.
10. Run only existing, relevant project checks. Report exact commands and actual results.
11. Ask before destructive operations, deletions, database migrations, public contract changes, authentication/security changes, production actions, paid services, secret changes or external security/load tests.
12. Update useful docs and produce the final report required by the master skill.

Begin with inspection, not edits. If the requested scope is unclear or a high-impact decision is needed, ask one focused question before proceeding. Never claim unexecuted tests passed.
