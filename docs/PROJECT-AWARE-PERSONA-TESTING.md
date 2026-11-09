# Nexora Project-Aware Persona Testing

## What it does
The project-aware layer inspects the current repository, creates evidence-backed product/domain hypotheses, suggests likely customer segments, generates synthetic persona profiles and assigns reusable skills from a 100-item QA catalog.

It is a planning and orchestration foundation. The CLI does not run autonomous LLM agents, interview real customers or complete business workflows.

## Discover a project
Run from the Nexora repository or an installed product workspace:

    node qa/cli.js discover --project . --personas 8

Options: --project path (defaults to current directory), --personas 1-1000 (defaults to 8), --out path (existing files are never overwritten).

Outputs:
- project-analysis.json: framework hints, file inventory, route-file hints, features and limitations.
- customer-hypotheses.json: inferred customer segments with confidence/evidence basis.
- personas.json: synthetic profiles with personality, decision style, technical confidence, device/context, interests where relevant, patience and goals.
- skill-assignments.json: relevant skill IDs from the 100-item catalog.
- mission-plan.md: proposed missions only, not executed tests.

The discovery engine reads repository metadata, README and file paths. It skips dependency/build folders and does not inspect environment files or secrets. Domain/route inference is heuristic and must be checked by the host coding agent.

## Single command
Use /nexora-test in Kilo Code or the nexora-test prompt in compatible VS Code/GitHub Copilot versions. If unavailable, open the project-aware testing skill. Command discovery depends on host tool/version.

The host agent verifies routes, inspects actual UI, selects missions and uses available browser control. Model reasoning is not proof that a test ran.

## 100-skill catalog
qa/skill-library.json contains 100 reusable definitions across discovery, onboarding, e-commerce, booking, forms, usability, mobile, accessibility, safe security checks and reliability.

A skill describes an ability. A persona describes a synthetic user. An agent is a model/tool instance. One persona can receive multiple skills; a skill can be reused by multiple personas. The catalog is not 100 running agents.

## Honest reporting
Statuses: PLANNED_NOT_EXECUTED, EXECUTED_PASS, EXECUTED_FAIL, BLOCKED, NOT_RUN. Only an executed, reproducible failure with evidence can become a confirmed bug. Missing browser control, URL, login or test data is blocked/not run. A plan is not a QA report.

Keep separate counts for synthetic profiles, planned/executed missions, browser contexts, actual model/subagent instances, human participants and HTTP virtual users.

## Current boundaries
- Domain and route discovery are static heuristics, not full AST analysis or live route crawling.
- CLI creates a plan; it does not call an LLM or autonomously execute business workflows.
- Existing Playwright runtime remains bounded, read-only same-origin navigation.
- Host-agent browser interaction is required for click/type/form assertions.
- State-changing journeys require authorized staging, disposable data and explicit permission.
- k6 remains a separate opt-in load-test harness.
