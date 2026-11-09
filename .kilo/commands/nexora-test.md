---
description: Project-aware customer persona testing with evidence-only reporting.
---

Read .agents/skills/nexora-project-aware-testing/SKILL.md and follow it exactly.

1. Inspect the current workspace only. Never assume a project path or target URL.
2. Run node qa/cli.js discover --project . --personas 8 when available.
3. Read generated project analysis, customer hypotheses, synthetic personas and skill assignments.
4. Verify inferred routes and workflows against source and actual running UI.
5. Ask for exact test URL/environment if unavailable. Never invent one.
6. Execute only journeys that available browser/Playwright tooling can actually perform. Read-only by default.
7. Use actual independent subagents only if the host launched them; otherwise label reviewer passes sequentially.
8. Write a timestamped report. Mark every item PLANNED_NOT_EXECUTED, EXECUTED_PASS, EXECUTED_FAIL, BLOCKED or NOT_RUN. Never fabricate screenshots, reviews, agents or test results.

The native CLI discovers the codebase and prepares a project-specific plan. It does not itself provide autonomous LLM agents or business-workflow browser interaction.
