---
name: nexora-project-aware-testing
description: Discover a project's likely customer segments, generate project-specific synthetic personas, select reusable QA skills, plan missions and execute evidence-backed product testing.
---

# Nexora Project-Aware Testing

## Honesty contract
A persona is a synthetic user profile. A skill is a reusable testing ability. An agent is a model/tool instance. These are different. A list of 100 skills is not 100 running agents. Never claim a synthetic persona is a real person or a planned mission was executed.

## Single-command entry point
Use /nexora-test in Kilo Code or the nexora-test prompt in compatible VS Code/GitHub Copilot versions. If unsupported, open this skill file and follow it directly.

## Phase 1 — Inspect the current project
1. Use only the opened workspace root; never assume a remembered personal path.
2. Read AGENTS.md and project-specific guidance.
3. Run: node qa/cli.js discover --project . --personas 8
4. Read project-analysis.json, customer-hypotheses.json, personas.json and skill-assignments.json.
5. Independently inspect route definitions, UI pages, backend contracts and test setup. Verify route hints.
6. Do not inspect environment values, credentials, private keys, production customer data or unrelated directories.
7. Static discovery is not a live browser test.

## Phase 2 — Project-specific personas
Create synthetic segments based on observed product purpose, routes, roles and features. Record evidence signals and label uncertain segments as hypotheses. Each persona should include:
- Stable synthetic ID, role/segment and goal.
- Personality (curious, cautious, impatient, methodical).
- Decision style/nature (exploratory, skeptical, detail-oriented, pragmatic).
- Technical confidence and product familiarity.
- Device/context preference (mobile, desktop, tablet, slow network, keyboard-only).
- Interests/hobbies only when relevant to the product scenario; never infer demographic facts.
- Patience/friction tolerance and accessibility preferences.
- Assigned skill IDs, mission and success condition.
- Status PLANNED_NOT_EXECUTED until evidence proves execution.

Do not manufacture demographics or claim market representativeness. Start with a small risk-based cohort and expand only when coverage justifies it.

## Phase 3 — Skill assignment
Read qa/skill-library.json. Select relevant skills based on product domain, features, route evidence, persona goal and risk. Record why each skill was selected. Do not execute every skill on every project. The catalog contains reusable instructions; it does not autonomously run them.

## Phase 4 — Mission planning
For each persona define starting URL, role/test account, starting state, synthetic fixture, numbered intent steps, expected observable outcome, allowed/prohibited actions, evidence and abort condition. Prefer read-only journeys. State-changing tests require staging, approved disposable test data and explicit permission.

## Phase 5 — Real browser execution
1. Obtain the exact target URL and environment; never guess.
2. Open the exact target in an actual browser controlled by the host or Playwright.
3. Use isolated contexts and approved test accounts.
4. Execute real user-intent actions and verify resulting state. A click without an assertion is not a pass.
5. Capture timestamps, final URL, screenshots/traces, console errors, failed requests and reproduction steps.
6. If browser control is unavailable, mark NOT_RUN — browser unavailable.
7. Missing login/data means BLOCKED, not passed.
8. Current native Persona Lab runner performs bounded read-only same-origin navigation/screenshots; it does not autonomously execute business workflows. Use host browser/Playwright interaction for those missions and identify the actual engine used.

## Phase 6 — Independent review
Use actual separate subagents only when the host launches them. Otherwise label passes as sequential reviewer roles, not parallel agents: functional, usability, accessibility, safe security and evidence skeptic. Each finding must reference evidence.

## Phase 7 — Report integrity
Every mission must use one status:
- PLANNED_NOT_EXECUTED
- EXECUTED_PASS
- EXECUTED_FAIL
- BLOCKED
- NOT_RUN

Only EXECUTED_FAIL with reproducible evidence can become a confirmed bug. Missing evidence means UNVERIFIED_OBSERVATION. Keep separate counts for synthetic personas, planned/executed missions, browser contexts, actual model/subagent instances, human participants and HTTP virtual users. Never create a PASS summary from an empty or incomplete run. Use INCONCLUSIVE when evidence or coverage is insufficient.

## Safety
Production defaults to read-only smoke checks. No real payments, messages, record deletion or production mutations. Load tests are separate and require explicit staging authorization, exact host allowlist, VU cap, rate, duration and abort thresholds. Never expose secrets. Preserve project files.

## Deliverables
Create reports/qa/<timestamp>/ without overwriting old reports:
- project-analysis.json
- customer-hypotheses.json
- personas.json
- skill-assignments.json
- mission-plan.md
- execution-ledger.json
- findings.md
- README.md

The discovery CLI creates planning artifacts only. The host agent populates execution results from actual tool output. Keep unexecuted items visibly marked.
