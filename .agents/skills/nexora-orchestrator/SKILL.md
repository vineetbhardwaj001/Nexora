---
name: nexora-orchestrator
description: Unified Nexora entry point for product QA, codebase untangling, engineering audits and implementation planning. Use when the user asks to test a product, refactor/untangle a codebase, or run a coordinated Nexora engineering workflow.
---

# Nexora Unified Orchestrator

Use this as the single task router behind the `/nexora` Kilo command. Route by the user's intent; do not run every workflow on every request.

## Routing

- **Product testing / QA / "test my website"**: load `.agents/skills/product-qa-swarm/SKILL.md` and `.agents/skills/mirofish-product-simulation/SKILL.md`. If qa/cli.js is installed, use Persona Lab: run `node qa/cli.js plan --url <exact-url> --personas 100` for a plan, or `node qa/cli.js run --url <exact-url> --personas 100 --browser-personas 3 --workers 2` for bounded real-browser navigation. Run MiroFish only when its separately configured service is available. Browser verification remains mandatory for actual UI claims. Preserve the distinction between synthetic profiles, executed browser personas and HTTP virtual users.
- **Untangle / restructure / reduce technical debt**: explicitly load `.agents/skills/untangle-codebase/SKILL.md`. Respect its `disable-model-invocation: true`: do not trigger it implicitly. Before execution, show the optional additions exactly and ask whether to include them: Comments — remove comments that only restate the code; Tests — remove tests that wouldn't catch a real bug, and fix the ones that fail without one. Only perform selected additions.
- **General engineering audit / architecture / scoped fixes**: load `.agents/skills/pro-eng-scalable/SKILL.md` and relevant existing specialist skills; honor its mode and safety gates.
- **Ambiguous request**: ask one concise question to identify whether the user wants product testing, codebase untangling, or engineering improvement.

## Shared safeguards

1. Inspect the repository and current git state before edits.
2. Use the existing project stack and existing skills; avoid duplicate tools or redundant agents.
3. Distinguish a plan, a simulated persona, a browser journey and an executed virtual user.
4. A real-browser test requires opening the exact supplied URL and recording observable evidence.
5. Load testing is a separate opt-in action, with exact host, VU cap, duration, ramp, credentials and abort limits approved first.
6. Do not claim tools, subagents, tests, simulations or browser sessions ran unless execution evidence exists.
7. Keep secrets out of files and reports. Use synthetic data and authorized accounts.
8. Preserve unrelated files and user changes; ask before destructive or costly operations.
9. Produce a concise report with route selected, skills loaded, work actually executed, evidence, checks, limitations and next steps.

## Invocation examples

- `/nexora test https://staging.example.com`
- `/nexora untangle src/`
- `/nexora improve audit-only`
- `/nexora` — infer the route from the request, asking one question only if genuinely ambiguous.
