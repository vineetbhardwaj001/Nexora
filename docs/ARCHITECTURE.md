# Nexora architecture

## Product boundary

Nexora is a reusable AI coding-agent engineering toolkit with an optional local Persona Lab. The repository is not a Next.js application and does not provide a hosted Nexora dashboard or server API in the current main branch.

## Main layers

| Layer | Location | Responsibility |
|---|---|---|
| Installer CLI | `bin/nexora.js` | Copies managed instructions, skills, prompts and QA utilities into a target project. |
| Core operating model | `.agent/` | Core guidance, skill registry, autonomy policy and workflows. |
| Portable skill content | `.agents/` | Shared rules and reusable skill packages. |
| Kilo integration | `.kilo/`, `kilo.jsonc` | Kilo command files and workspace configuration. |
| Copilot prompt assets | `.github/prompts/`, `.github/copilot-instructions.md` | Prompt entry points and repository-level instructions. |
| Persona Lab | `qa/` | Deterministic profile generator, bounded Playwright runner and CLI. |
| Load smoke harness | `load/` | Separate k6 HTTP smoke test with fail-closed staging gates. |
| Documentation | `docs/` | Operator guides, static HTML documentation site and project reference. |
| Automation | `.github/workflows/` | CI, docs deployment and basic secret-pattern checks. |

## .agent versus .agents

- `.agent/` is Nexora's local operating configuration: `CORE.md`, `config/skills.json`, repository catalog and workflows.
- `.agents/` contains portable shared rules and skill packages that agent tools can read.
- They serve different purposes; they are not interchangeable duplicates. Some principles are intentionally echoed in `AGENTS.md`, Kilo rules and Copilot instructions. Keep the core policy in one canonical location and link to it from tool-specific files.

## Persona Lab data flow

1. `qa/personas.js` deterministically derives profile attributes from a seed.
2. `qa/cli.js plan` writes `personas.json` and stops without browser or load execution.
3. `qa/cli.js run` calls `qa/runner.js` for the requested browser cohort.
4. The runner opens Chromium via a Playwright dependency installed in the target project, discovers same-origin links, navigates pages, captures screenshots and collects console/page/network errors.
5. The CLI writes a human-readable report and structured browser result artifacts under the selected report directory.

The current runner performs navigation and observation only. It is not an AI action-decision loop and does not submit forms or mutate product state.

## MiroFish boundary

MiroFish is an optional, separately operated simulation service described by a skill and integration guide. It is not a bundled Nexora dependency, browser driver or load generator. Its outputs are hypotheses and must not be reported as browser evidence.

## Evidence and execution semantics

A generated persona is a planned synthetic scenario. A browser result records a page navigation outcome and artifacts. Neither establishes that all product functionality is correct. A dedicated append-only evidence ledger and independent reviewer runtime remain planned.
