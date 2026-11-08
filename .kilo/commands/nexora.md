---
description: "Single Nexora entry point: product QA, Caldo codebase untangling, or scalable engineering workflows."
agent: code
---

# Nexora — one command, task-aware routing

User request: $ARGUMENTS

Read `AGENTS.md`, `.agent/CORE.md`, `.agent/config/skills.json`, and `.agents/skills/nexora-orchestrator/SKILL.md` first.

Choose exactly one route based on the request:

1. **test / QA / website / product** — load `.agents/skills/product-qa-swarm/SKILL.md` and `.agents/skills/mirofish-product-simulation/SKILL.md`. Execute the MiroFish-assisted, real-browser QA flow. Require the exact URL and environment. Browser journeys are mandatory for claims about actual UI behavior. MiroFish simulation is optional and is not browser testing or load.
2. **untangle / codebase refactor / reduce technical debt** — load `.agents/skills/untangle-codebase/SKILL.md` explicitly. Before making changes, show and ask which optional additions to include, using these exact descriptions:
   - **Comments** — Remove comments that only restate the code.
   - **Tests** — Remove tests that wouldn't catch a real bug, and fix the ones that fail without one.
   Do not proceed with either addition until the user chooses. Preserve the upstream skill's opt-in behavior. First produce the full structural decision log, then redesign, implement incrementally and verify.
3. **engineering / architecture / bugs / improvement** — load `.agents/skills/pro-eng-scalable/SKILL.md` and relevant existing skills. Honor the requested mode; if none is specified, begin with a read-only audit and ask before broad refactoring.

Do not run multiple routes unless the user explicitly asks for a combined workflow. Do not claim independent agents/subagents ran unless actual tool execution confirms it. Separate MiroFish synthetic agents, real browser personas, human participants and HTTP virtual users in every report. Require explicit authorization and bounded staging limits before load tests.

Examples:
- `/nexora test https://staging.example.com`
- `/nexora untangle src/`
- `/nexora improve audit-only`
- `/nexora` followed by a natural-language task
