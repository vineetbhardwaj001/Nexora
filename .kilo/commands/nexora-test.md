---
description: Project-aware customer persona testing with evidence-only reporting.
agent: code
---

# /nexora-test — Project-aware Product QA

Arguments: $ARGUMENTS


Read .agents/skills/nexora-project-aware-testing/SKILL.md and follow it exactly.

1. Inspect the current workspace only. Never assume a project path or target URL.
2. Run node qa/cli.js discover --project . --personas 8 when available.
3. Read generated project analysis, customer hypotheses, synthetic personas and skill assignments.
4. Verify inferred routes and workflows against source and actual running UI.
5. Ask for exact test URL/environment if unavailable. Never invent one.
6. For each selected persona, run `node qa/cli.js reason --report <discovery-dir> --persona <persona-id> --url <verified-url>`, read the generated decision request, and use this coding agent's own model to produce one schema-compliant next-step JSON decision.
7. Validate each proposal with `node qa/cli.js validate-decision --file <decision.json>`. Validation is not execution. Execute only a validated action supported by actual browser tools and observed UI. Read-only by default; never invent selectors or state.
8. Use actual independent subagents only if the host launched them; otherwise label reviewer passes sequentially.
9. Write a timestamped report. Mark every item PLANNED_NOT_EXECUTED, EXECUTED_PASS, EXECUTED_FAIL, BLOCKED or NOT_RUN. Never fabricate screenshots, reviews, agents or test results.

The native CLI discovers the codebase and prepares a project-specific plan. It does not itself provide autonomous LLM agents or business-workflow browser interaction.
