---
description: Run Caldo's explicit whole-codebase untangling workflow for hidden dependencies, needless coupling, surplus abstractions and special cases.
agent: code
---

# /untangle-codebase — Nexora structural refactoring workflow

Arguments: $ARGUMENTS

1. Read `AGENTS.md`, `.agent/CORE.md`, `.agent/config/skills.json`, and applicable nested instructions.
2. Read `.agents/skills/untangle-codebase/SKILL.md` completely. This is the upstream Caldo skill; preserve its requested sequence and decision-log method.
3. Inspect the workspace and Git status before changes. Preserve all pre-existing user modifications and untracked files.
4. Start by asking the user which optional additions to include, using the exact choices from the upstream skill:
   - **Comments** — Remove comments that only restate the code.
   - **Tests** — Remove tests that wouldn't catch a real bug, and fix the ones that fail without one.
   Do not include either addition unless the user explicitly chooses it. If the user already answered in the current invocation, do not ask again.
5. Inventory the whole codebase before editing. Record every verified hidden link, needless link, surplus abstraction, and special case in a decision log. Do not begin refactoring while still discovering the problem list.
6. Redesign from first principles. Group related findings under structural fixes; avoid isolated symptom patches. Preserve intended behavior and public contracts.
7. Execute the approved structural changes in small, reviewable steps. Search imports, callers, routes, schemas, configs and tests before moving or deleting anything.
8. Use real subagents only when the current coding tool exposes them. Otherwise perform separate focused review passes and clearly state that no independent subagents were available; never claim parallel agents ran when they did not.
9. Keep destructive changes, database migrations, public API changes, auth/security behavior changes, production actions, paid services and external tests behind explicit approval.
10. Run relevant existing tests and checks after refactoring. If the user selected the Tests addition, do that cleanup last so tests remain a regression safety net until structural work is complete.
11. Repeat focused review passes until no worthwhile, evidence-backed structural issues remain or a documented blocker prevents further work.
12. Produce a report containing: initial problem inventory, decision log (fixes mapped to problems), changed files, behavior-preservation evidence, exact checks and outcomes, remaining special cases, unresolved risks, and whether subagents actually ran.

Begin with inspection and the two-choice clarification. Do not claim the codebase is untangled, tests passed, or subagents ran without execution evidence.
