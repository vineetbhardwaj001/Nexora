---
name: product-qa-swarm
description: Plan and execute evidence-based product QA using real browser automation, distinct user personas, functional and accessibility checks, security review, and controlled 100+ virtual-user load tests.
---
# Product QA Swarm — Real Product Testing
## Mission and honesty contract
Test the actual running product, not an imagined implementation. Open the supplied URL in a real browser automation session (Playwright or the browser tool available in the environment), interact with it, inspect rendered results, and preserve evidence. Do not mark a feature working because source code suggests it should work. Do not invent pages, credentials, APIs, results, screenshots, user feedback or test execution.
This skill coordinates specialist testing roles. It does not magically create independent human testers or guarantee parallel AI agents. Use actual available subagents when the host supports them; otherwise execute clearly separated role-based test passes and label them as simulated review roles. Distinct browser contexts and persona data are not independent human users.
## Required inputs and gates
Discover or ask for target URL and environment (local, preview, staging or production), explicit authorization, test accounts/roles and safe test data, critical journeys, and whether destructive actions, external integrations or load tests are allowed.
If URL is missing, ask for it. Do not substitute localhost, a guessed domain, a repository demo or a fabricated URL. Production defaults to non-destructive smoke tests only. Never create real orders, send messages, trigger payments, delete customer data, change settings or stress production without explicit authorization.
Load test requires explicit authorization, confirmed staging/performance environment and exact hostname, safe window, VU ceiling, rate/duration and abort thresholds. Without these, prepare a plan but do not run it. Never bypass CAPTCHA, MFA, paywalls, access controls, rate limits or security protections.
## Specialist roles
Create a test ledger with role, pass owner, scenario IDs and evidence. Use actual independent agents only if supported by the host; otherwise label the execution as role-based sequential passes.
1. QA Orchestrator — maps product surface, risk-based coverage, deduplication and execution tracking.
2. First-time Customer — landing page, value proposition, primary CTA, signup/onboarding and core task.
3. Returning Customer — login, resume work, history/settings, edit data and logout.
4. Power/Edge-case User — empty/invalid/long inputs, duplicate actions, refresh/back, slow network and interrupted flows.
5. Admin/Staff User — role-specific navigation and permitted actions with real test accounts.
6. Mobile User — narrow viewport, touch navigation, overflow, sticky UI and readability.
7. Accessibility Reviewer — keyboard navigation, focus, labels, landmarks, contrast and axe checks if installed.
8. Visual/UX Reviewer — hierarchy, clarity, consistency, empty/loading/error/success states and friction, grounded in observed screens.
9. Security Reviewer — safe checks of session, authorization, validation, sensitive-data exposure and tenant boundaries using approved accounts.
10. Performance Reviewer — browser timings/Core Web Vitals and separate controlled load testing.
11. Skeptical Evidence Reviewer — re-checks every claimed pass/fail against screenshots, traces, console/network logs or reproducible steps.
12. Report Editor — findings, severity, impact, reproduction and prioritized remediation.
## Phase 1 — Verify the actual target
1. Open the exact URL in a real browser. Record final URL, timestamp, environment, viewport and browser/version when available.
2. Verify navigation and rendered page; do not infer deployment health from repository source.
3. Capture initial screenshot. Record redirects, console errors and failed network requests.
4. Inspect rendered routes, visible navigation, CTAs, forms, dialogs and role entry points.
5. Record inaccessible areas caused by credentials, permissions, network or environment.
If browser automation is unavailable, do not claim real-browser testing. Explain the limitation and provide exact setup needed; source review is not a substitute.
## Phase 2 — Distinct user personas
Personas are data-driven scenarios with different goals, permissions, data and paths, not 100 copies of one script. Examples: first-time visitor, valid signup user, returning customer, incomplete profile, slow mobile user, keyboard-only user, limited staff, admin, empty/error-state user, duplicate/interrupted-flow user.
For each persona record ID, role, goal, starting state, fixture, steps, expected observable outcome, actual outcome, evidence and result. Use isolated browser contexts/storage states and unique disposable test data where authorized. Never use real customer information.
Run a representative risk-based set first, then meaningful variations and edge cases. Report counts of personas, scenarios, browser contexts and virtual users separately. Do not claim 100 distinct people tested when running 100 scripted contexts.
## Phase 3 — Real browser execution
Prefer existing browser tooling. If absent and installation is approved, use Playwright with Chromium; add Firefox/WebKit when relevant. Do not silently alter application dependencies.
For every scenario: create an isolated context when needed; navigate to the real URL; wait for meaningful UI readiness; use semantic locators; perform realistic clicks/types/selects/submits/navigation/refresh/back/logout; assert visible state, URL, persistence, expected API response and authorization; capture failure screenshots and traces/video where supported; record exact steps and outcome; clean up only disposable test-created data when authorized.
A click without verifying its outcome is not a pass. Do not hard-code assumed routes, labels, API fields or copy. Discover actual behavior/contracts; ambiguous expectations are 'needs product decision'.
## Phase 4 — Functional, UX, responsive and accessibility
Cover navigation/deep links/back-forward; auth/session; core CRUD with disposable records; validation and duplicate submits; loading/empty/success/failure/offline/retry; persistence; mobile/tablet/desktop; keyboard/focus/accessibility; console and network errors.
Visual review uses comparable screenshots at fixed viewport/state. Separate objective defects (overlap, clipping, broken assets) from subjective suggestions. Do not claim pixel-perfect comparison without a supplied reference and controlled viewport.
## Phase 5 — Safe security checks
Use only approved test accounts and non-destructive checks: protected pages deny unauthenticated access; role A cannot view/mutate role B or admin data; test tenant cannot access another test tenant's records; inspect obvious sensitive-data exposure without copying tokens; verify server validation; inspect headers/dependency audit if available.
Never brute force, enumerate real users, steal tokens, exploit third parties, mutate real tenant data or run destructive injection tests. Stop at minimal safe reproduction and report suspected vulnerabilities privately.
## Phase 6 — Separate 100+ virtual-user load test
Use k6 or established load framework for virtual-user concurrency. This is not the browser persona suite and must not be described as 100 human testers.
Preflight: explicit authorization; exact staging/performance host; allowlisted hostname and fail-closed config; synthetic data/test accounts; agreed VUs, ramp, duration, request rate and abort thresholds; owner approval for costs and external side effects.
Proposal only, not auto-run: ramp 1 → 5 → 20 → 50 → 100 VUs with short smoke stage, bounded duration, conservative rate and graceful ramp-down. Adjust to safe capacity and explicit limits. Never launch 100 VUs immediately.
Use realistic journeys and think time. Prefer API-level load tests for server capacity; browser automation is for functional journeys and a small number of concurrent browsers. Report browser sessions, API VUs and persona scenarios separately.
Define thresholds before execution: error rate, p95/p99 latency, throughput, resource saturation and business-flow success. Abort when approved limits are exceeded. Capture k6 summary and server metrics if available; never fabricate unavailable server metrics.
## Phase 7 — Findings and severity
Every finding includes ID/title, severity (P0 blocker, P1 critical, P2 major, P3 minor, P4 suggestion), category, persona/role/environment, exact URL, preconditions, numbered reproduction, expected/actual behavior, impact/frequency/confidence, evidence paths, supported root cause or 'unknown', recommended fix and regression test.
A failure without evidence/reproduction is an unverified observation, not a confirmed bug. A feature not reachable is not tested/blocked, not passed.
## Phase 8 — Evidence report
Create a timestamped reports/qa/<timestamp>/ directory or use the existing report convention without overwriting old reports. Include README executive summary, test-matrix, findings, UX review, security review, performance report, evidence screenshots/traces/videos/sanitized logs, and summary.json when useful.
Report counts separately: personas defined/executed, journeys, browser contexts, assertions passed/failed/skipped, confirmed bugs, blocked checks, virtual users and load-test duration. Include exact commands and timestamps. Never include credentials, tokens, personal data or secrets.
## Release recommendation
GO: critical journeys passed with sufficient coverage and no unresolved P0/P1. CONDITIONAL GO: limited P2/P3 or explicit accepted coverage gaps. NO-GO: reproducible P0/P1, broken critical flow, serious security/data-isolation failure or unsafe reliability/performance. INCONCLUSIVE: target inaccessible, credentials missing, unsafe environment or insufficient evidence. Always state coverage limitations.
## Final response
Summarize target actually opened, environment, roles, personas/journeys executed, browser evidence, severity findings, load-test status and VU count, release recommendation and report location. Separate executed/passed, executed/failed, blocked/not run and recommendations. Never say '100 users tested' unless an authorized load test actually ran at that VU count. Never claim all agents tested if only sequential role passes ran.


## Native Persona Lab runtime

When the installed project contains qa/cli.js, use it for repeatable local QA:
- Planning only: node qa/cli.js plan --url <exact-url> --personas 100
- Browser checks: node qa/cli.js run --url <exact-url> --personas 100 --browser-personas 3 --workers 2
- Require Playwright installed in the target project before browser execution.
- The MVP performs read-only same-origin navigation and captures screenshots/status/errors; it does not safely infer or submit business forms.
- Report synthetic profile count, browser personas executed and HTTP VUs separately. The runtime does not create autonomous LLM agents or human participants.
- Keep k6 separate and disabled unless the exact staging host, allowlist, VU ceiling, duration, rate and abort criteria are explicitly approved.
See docs/PERSONA-LAB.md for the operator guide.
