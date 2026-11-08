---
description: Untangle the current codebase using Caldo's evidence-first structural refactoring skill.
mode: agent
---

Read `.agents/skills/untangle-codebase/SKILL.md` completely and follow it as the authoritative workflow.

Start by inspecting the repository and Git status. Ask whether the user also wants either optional addition, using the exact descriptions from the skill:
- **Comments** — Remove comments that only restate the code.
- **Tests** — Remove tests that wouldn't catch a real bug, and fix the ones that fail without one.

Do not include either optional addition without explicit selection. Inventory all hidden links, needless links, surplus and special cases before editing. Write a decision log mapping structural fixes to findings, redesign from first principles, make incremental changes, preserve intended behavior and public contracts, then run relevant regression checks.

Use independent subagents only if the current VS Code agent environment actually exposes them. Otherwise perform separate focused review passes and disclose that limitation. Never claim tests or reviews ran without evidence. Ask before destructive changes, migrations, public API changes, authentication/security behavior changes, production actions, paid services or external testing.

Optional focus: ${input:scope:Whole codebase}
