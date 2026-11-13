---
description: Discover project-specific customers, assign Nexora QA skills and execute evidence-backed testing.
mode: agent
---

Read .agents/skills/nexora-project-aware-testing/SKILL.md first.

Use only the current workspace. Run node qa/cli.js discover --project . --personas 8 if installed. Inspect all generated artifacts and verify inferred routes/features against source. Select relevant skills from qa/skill-library.json; do not run every skill by default.

Ask for exact product URL/environment if unavailable. Execute actual browser journeys only with available browser/Playwright control and approved test accounts. Keep read-only by default. Never claim a mission, agent, browser session, human participant or reviewer ran without execution evidence.

Generate a timestamped report with explicit statuses: PLANNED_NOT_EXECUTED, EXECUTED_PASS, EXECUTED_FAIL, BLOCKED or NOT_RUN. A report with no executed missions is a plan, not a QA result. Never fabricate findings or PASS counts.
