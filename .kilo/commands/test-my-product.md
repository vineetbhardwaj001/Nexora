---
description: Run one end-to-end product test using MiroFish-inspired swarm persona simulation plus real browser QA and optional authorized load testing.
agent: code
---

# /test-my-product — Single-command product testing

Arguments: $ARGUMENTS

## Mission
Use MiroFish as an optional agent-based scenario/persona simulation engine to explore how a population of distinct synthetic users may respond to the product. Then validate the resulting hypotheses against the actual live website with real browser automation. Simulation is research input, never proof that a page or workflow works.

## Execute in this order

1. Read `.agents/skills/product-qa-swarm/SKILL.md`, `.agents/skills/mirofish-product-simulation/SKILL.md`, registry/config and relevant QA/UX/security/performance skills.
2. Resolve target URL from $ARGUMENTS or conversation. If missing, ask for exact URL and whether it is local, preview, staging or production. Never guess or test MiroFish's own demo as the user's product.
3. Confirm authorization and test boundaries. Production defaults to non-destructive browse/read-only checks. Never send real emails/SMS, submit payments, create real orders, delete or edit customer data, bypass access controls or load-test production without explicit approval.
4. Inspect the actual project and runtime; discover its domain, product purpose, real routes, UI, APIs, test accounts, user roles and workflows. Do not invent them.
5. Build a research brief from observable facts: product summary, target audiences, roles, tasks, constraints, real UI entry points and unresolved questions. Sanitize secrets and personal data.
6. **MiroFish optional simulation stage**:
   - Verify that a local/remote MiroFish instance and its required LLM/Zep configuration are actually available. Never assume installed or ready.
   - Treat upstream as a separate Flask service. Inspected current routes include graph blueprint `/api/graph/*` (ontology generate, build, task/project reads), simulation blueprint `/api/simulation/*` (create, prepare, prepare/status, start, run-status, profiles, timeline, actions, posts, agent-stats), and report blueprint `/api/report/*` (generate, generate/status, report detail/chat). These are route families only; inspect exact handler parameters, response shapes and state transitions in upstream `backend/app/api/graph.py`, `simulation.py` and `report.py` at the pinned/installed version before use. Do not guess endpoint paths or payload fields.
   - Submit the research brief as seed/context and ask for simulated persona diversity, goals, adoption friction, confusing language, likely failed tasks, edge cases and alternative user journeys.
   - Use MiroFish for social persona simulation only when its actual supported model permits this use case; MiroFish's documented social-platform simulation is not a substitute for browser clicks and must not be marketed as literal customer usability evidence. Bound agent population, simulation rounds, context size, runtime and provider spend. Default to a small pilot cohort; only run 1000-agent or similarly large simulations after explicit cost/runtime approval.
   - Store simulation outputs as hypotheses with run ID/config, generated persona counts and limitations. Do not pass simulation-generated assumptions off as observed user behavior.
   - If unavailable, credentials absent, API incompatible, or setup would require unapproved cost, skip it and continue with deterministic QA personas.
7. Convert the simulation insights into a test matrix. Keep each persona distinct by role, goal, initial state, data, route sequence and constraints.
8. **Real browser verification is mandatory**: use available browser/Playwright tooling to open the exact target URL, inspect rendered pages and interact. Verify each step by visible outcome, URL, network/API response and persistence as applicable. Capture screenshots, traces/video where available, console/network errors and evidence.
9. Run first-time, returning, edge-case, mobile, keyboard/accessibility and admin/staff journeys only when those flows and test accounts actually exist. Use isolated contexts and synthetic disposable data.
10. Review functional correctness, UX friction, responsive behavior, accessibility, reliability and safe authorization boundaries. Categorize evidence-backed defects by P0-P4 severity.
11. Keep virtual-user load testing separate from MiroFish's agent simulation. Do not claim simulated agents create HTTP traffic. Run k6/Locust only with explicit authorization for exact staging host, max VUs, ramp-up, duration, request rate, test accounts and abort thresholds. Otherwise prepare a proposed load plan without executing it.
12. Skeptical reviewer re-checks every result against browser evidence. A simulation insight is not a browser pass. A click without assertion is not a pass. A blocked scenario is not a pass.
13. Create a timestamped `reports/qa/<timestamp>/` report containing:
    - `README.md`: environment, executive summary, release recommendation
    - `test-matrix.md`: personas, journeys, actual executions and result
    - `simulation-insights.md`: MiroFish run evidence, hypotheses and caveats (or why skipped)
    - `findings.md`: reproducible defects with severity, expected/actual and evidence
    - `ux-review.md`, `security-review.md`, `performance.md`
    - `evidence/`: sanitized screenshots, traces, videos and logs
    - `summary.json`: machine-readable counts where helpful
14. Count separately: simulated personas, browser personas executed, browser contexts, journeys executed, assertions pass/fail/blocked, confirmed bugs, virtual users (only when load test ran), MiroFish simulation rounds and cost if known. Never conflate these metrics.
15. Provide GO / CONDITIONAL GO / NO-GO / INCONCLUSIVE with coverage limitations, report path and highest-priority fixes.

## Required honesty
Do not call MiroFish agents real website users. Do not claim 100 users tested unless an authorized 100-VU HTTP load test actually ran. Do not claim browser testing if no browser was opened. Do not invent simulation output, routes, credentials, API schemas, timing or bug fixes. If this environment lacks a browser or MiroFish runtime, report the blocker and continue only with the supported parts.
