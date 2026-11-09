---
description: Route a request through Nexora's single unified engineering command.
mode: agent
---

Read `.agents/skills/nexora-orchestrator/SKILL.md` and follow its routing rules. Read `AGENTS.md`, `.agent/CORE.md`, and the skill registry first.

Choose exactly one route for this request:
- Product QA: load the product QA and MiroFish adapter skills. Require the exact target URL and environment. If qa/cli.js is installed, generate a plan with `node qa/cli.js plan --url <URL> --personas 100`. With Playwright installed and browser execution authorized, start with 3 browser personas. If the user requests all 100 browser personas, use `node qa/cli.js run --url <URL> --personas 100 --browser-personas 100 --workers 2 --max-pages 5`. This uses a bounded worker pool, not 100 simultaneous browsers. Real-browser evidence is mandatory for claims about UI behavior. Keep synthetic profiles, executed browser personas and HTTP VUs as separate counts.
- Codebase untangling: explicitly load Caldo's `.agents/skills/untangle-codebase/SKILL.md`; preserve its opt-in setting and ask before optional Comments or Tests work.
- Engineering improvement: load `.agents/skills/pro-eng-scalable/SKILL.md` and relevant specialists. Start with read-only audit unless implementation scope is explicit.

Do not run multiple routes unless explicitly requested. Preserve user changes, use actual tool execution as evidence, and never claim tests, browser sessions, simulations or independent subagents ran without proof. Ask before destructive migrations, production actions, auth/security changes, paid services or external load testing.

User request: ${input:request:What should Nexora do?}
