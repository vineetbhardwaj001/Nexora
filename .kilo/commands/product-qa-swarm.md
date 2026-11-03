---
description: Open the real product in a browser and run evidence-based multi-persona QA, UX/security review, and optional authorized 100+ virtual-user load tests.
agent: code
---
# /product-qa-swarm — Real Browser Product QA

Arguments: $ARGUMENTS

1. Read `.agents/skills/product-qa-swarm/SKILL.md` completely and follow its safety gates.
2. Discover available browser automation and project test tools. Prefer existing Playwright/browser integration; source review is not a browser test.
3. If no exact target URL is supplied in arguments or current task, ask for the real URL. Confirm environment and authorization; never guess.
4. Inspect the live rendered site in a real browser. Record URL, environment, viewport, browser, screenshot, routes, console and network failures.
5. Build distinct persona journeys from actual screens and roles. Use isolated contexts and synthetic data. Use real supported subagents if available; otherwise run separate role-based passes and label them accurately.
6. Execute browser interactions and assert observable outcomes. Capture screenshots, traces/videos where available, sanitized logs. A click without verified result is not a pass.
7. Review functional behavior, UX, responsive states, accessibility and safe security boundaries. No real customer data or destructive production actions.
8. Treat 100+ virtual-user load testing as separate opt-in. Do not run without explicit authorization for exact staging host, VU ceiling, ramp and duration. Use host allowlisting and abort thresholds. Never load-test production by default.
9. Create a timestamped report with persona matrix, executed/blocked checks, evidence, reproducible findings, severity, UX recommendations, security limitations and separate browser/load metrics.
10. Re-check findings against evidence. Never invent execution, independent testers, screenshots, timings or passes.
11. Give GO / CONDITIONAL GO / NO-GO / INCONCLUSIVE recommendation with coverage limitations.
If URL is missing, ask only for URL and whether local, staging or production. If load authorization is missing, skip load execution and provide a plan only.
