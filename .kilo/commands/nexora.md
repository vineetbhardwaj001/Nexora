---
description: "Single Nexora entry point: product QA, Caldo codebase untangling, or scalable engineering workflows."
agent: code
---

# Nexora — one command, task-aware routing

User request: $ARGUMENTS

Read `AGENTS.md`, `.agent/CORE.md`, `.agent/config/skills.json`, and `.agents/skills/nexora-orchestrator/SKILL.md` first.

Choose exactly one route based on the request:

1. **test / QA / website / product** — load `.agents/skills/product-qa-swarm/SKILL.md` and `.agents/skills/mirofish-product-simulation/SKILL.md`. Require the exact URL and environment. If Nexora Persona Lab exists, inspect docs/PERSONA-LAB.md and run the plan command:

   `node qa/cli.js plan --url <URL> --personas 100`

   If Playwright is installed and browser execution is authorized, run 3 browser personas by default. For the full 100-persona cohort, run:

   `node qa/cli.js run --url <URL> --personas 100 --browser-personas 100 --workers 2 --max-pages 5`

   This uses a bounded worker pool, not 100 simultaneous browser instances. Never equate synthetic profiles with human users. MiroFish remains optional. Real-browser evidence is mandatory for claims about actual UI behavior. HTTP load tests are separate and require explicit staging approval.
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

## Current CLI boundaries
The installed Persona Lab CLI currently exposes only `plan` and `run` (plus `--help`). Do not invoke or document `discover`, `reason` or `validate-decision` as current-main commands; those are branch-only proposals until merged and verified. For exact usage and status, read `docs/COMMANDS.md`.

Always state: **100 profiles != 100 real users != 100 LLM agents != 100 simultaneous browsers.**
