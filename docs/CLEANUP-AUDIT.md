# Nexora cleanup audit

**Date:** 2026-11-13  
**Audited ref:** `main` (repository default branch at audit time)  
**Repository:** https://github.com/vineetbhardwaj001/Nexora  
**Scope:** source and repository-tree inspection. Runtime commands could not be executed in this environment; see verification section.

## Executive finding

The current `main` branch supports two complementary pieces:
1. A portable, guided AI-engineering toolkit: installer, shared rules, reusable skills, Kilo commands and GitHub Copilot prompt files.
2. A separate local Persona Lab MVP: deterministic synthetic persona generation, bounded read-only Playwright navigation and a separately gated k6 smoke-load harness.

Recommended identity candidate: **Reusable AI coding-agent skills and installer, with an optional local Persona Lab for synthetic-profile planning and bounded browser smoke checks.** This is more accurate than calling Nexora a universal autonomous-agent runtime or a 100-customer testing platform.

## Source-of-truth findings

| Feature | Source files | Status on `main` | Evidence / boundary |
|---|---|---|---|
| Installer | `bin/nexora.js`, `package.json` | IMPLEMENTED | CLI has `init`, `doctor`, `list`, `version`, `help`; installer copies a managed file manifest. Existing files are skipped by default; `--force` backs up before replacement. |
| Persona Lab planning | `qa/cli.js`, `qa/personas.js` | IMPLEMENTED | `plan` generates deterministic synthetic profiles and writes `personas.json`; no browser is started. |
| Persona Lab browser run | `qa/cli.js`, `qa/runner.js` | IMPLEMENTED (bounded MVP) | `run` uses Playwright Chromium, same-origin navigation, screenshots and status/console/page/network error collection. It does not submit forms or mutate application state. |
| Persona generation | `qa/personas.js` | IMPLEMENTED | Deterministic rule-based profiles, 1–10,000; each profile is marked planned/not executed. Not an LLM or real participant. |
| 100 reusable QA skill catalog | PR #6 branch only | PLANNED on main / IMPLEMENTED IN OPEN PR | Current main tree has no `qa/skill-library.json`. PR #6 proposes 100 reusable skill definitions and project-aware assignments. Do not advertise as merged/current main functionality. |
| Reusable agent skills | `.agents/skills/*/SKILL.md`, `.agent/config/skills.json` | IMPLEMENTED | Skills are instruction files with registry states; an installed skill is not itself an autonomous agent. |
| Kilo commands | `.kilo/commands/*.md`, `kilo.jsonc` | IMPLEMENTED | Four command files exist: `nexora`, `pro-eng-scalable`, `product-qa-swarm`, `test-my-product`. Actual slash-command discovery depends on Kilo version/runtime. |
| GitHub Copilot prompts | `.github/prompts/*.prompt.md` | IMPLEMENTED | Eleven prompt files exist. They are prompt entry points, not universal slash-command support in every IDE. |
| MiroFish adapter | `.agents/skills/mirofish-product-simulation/SKILL.md`, `docs/MIROFISH-INTEGRATION.md` | PARTIAL / OPTIONAL | Instructions describe optional separately deployed MiroFish service. Current main does not vendor/deploy MiroFish or provide a verified native HTTP adapter/runtime. |
| Caldo untangle skill | `.agents/skills/untangle-codebase/SKILL.md`, `docs/UNTANGLE-CODEBASE.md`, `THIRD-PARTY-NOTICES.md` | IMPLEMENTED (skill package) | Upstream skill is vendored with MIT notice and opt-in invocation guard. Not a separate runtime. |
| k6 load harness | `load/k6-smoke.js`, `docs/PERSONA-LAB.md` | IMPLEMENTED (staging-only smoke harness) | Requires explicit authorization flag, staging environment, exact hostname allowlist, HTTPS for remote target, 1–100 VUs, 30–300 seconds; only GETs the target homepage. |
| Docs site | `docs/index.html`, `docs/guide.html`, `docs/assets/*` | IMPLEMENTED | Static HTML docs/landing pages, deployed by GitHub Pages workflow. CI checks asset references and JS syntax, not all internal links. |
| CI | `.github/workflows/ci.yml`, `docs-site.yml`, `publish-npm.yml` | IMPLEMENTED | CI validates config, Markdown, Python structural tests, npm tests, CLI help and docs assets. CI workflow currently targets pushes/PRs to main. |
| Security workflow | `.github/workflows/security.yml` | IMPLEMENTED (basic checks) | Secret-pattern scan and tracked-env-file scan; not a complete security audit or dependency vulnerability guarantee. |
| Project-aware `discover` command | PR #6 feature branch | PLANNED on main / IMPLEMENTED IN OPEN PR | Not present in current main `qa/cli.js`; PR #6 adds it on the open feature branch. |
| `reason` / `validate-decision` | PR #7 merged into PR #6 feature branch | PLANNED on main | Not present in current main `qa/cli.js`; PR #7 is merged into the feature branch, not into main. Also, those commands prepare/validate proposals; they do not call a model or execute browser actions. |
| Browser decision executor | Current `qa/runner.js` | PARTIAL | Existing runner performs fixed read-only navigation; no validated AI action-proposal execution loop. |
| Evidence ledger | No dedicated append-only ledger found in main tree | PLANNED | Browser report artifacts exist, but no dedicated immutable evidence ledger. |
| Independent reviewer agents | Skills/prompts describe review perspectives | PLANNED as autonomous independent runtime | Reviewer instructions exist; independent autonomous reviewer execution is not proven by source/runtime. |

## CLI command reconciliation

### Commands documented by README / source

- Installer: `node bin/nexora.js init --path <dir> --yes [--save-default]`
- Installer help: `node bin/nexora.js --help`
- Persona Lab through wrapper: `node bin/nexora.js qa plan --url <url> --personas N`
- Persona Lab direct: `node qa/cli.js plan --url <url> --personas N`
- Persona Lab browser run through wrapper: `node bin/nexora.js qa run --url <url> --personas N --browser-personas N --workers N --max-pages N`
- Persona Lab direct: `node qa/cli.js run --url <url> --personas N --browser-personas N --workers N --max-pages N`
- `doctor`, `list`, `version` are also present in the installer CLI.

### Unsupported or branch-only commands

- `discover`: absent from current main `qa/cli.js`; proposed by open PR #6.
- `reason`: absent from current main; added in PR #7 branch, merged into PR #6 feature branch.
- `validate-decision`: absent from current main; added in PR #7 branch, merged into PR #6 feature branch.
- The previous master prompt's command sequence must not be documented as current-main CLI usage until PR #6 (and its stacked PR #7 changes) is merged.

### Help-command execution status

Requested commands:
- `node bin/nexora.js --help`
- `node qa/cli.js --help`
- `npm test`

**Not executed.** A local clone was attempted, but the execution environment could not resolve github.com. Exact attempt output:

```text
Cloning into '/tmp/Nexora-audit'...
fatal: unable to access 'https://github.com/vineetbhardwaj001/Nexora.git/': Could not resolve host: github.com
```

Source-inspection inference only (not command output):
- `bin/nexora.js --help` is routed to the installer help handler.
- `qa/cli.js --help` is not a dedicated help command; the parser treats the first argument as an unsupported command, prints the Persona Lab usage text and sets a non-zero exit code.
- `npm test` runs `node --test` according to package.json. No pass/fail result is available from this audit.

## Agent directory responsibilities

- `.agent/`: canonical Nexora operating model/configuration — `CORE.md`, skill registry/autonomy settings, repository catalog and workflow documents.
- `.agents/`: portable/shared agent rules and the actual reusable skill packages under `.agents/skills/*/SKILL.md`.
- They are not exact duplicates. Some principles are repeated in `AGENTS.md`, `.agent/CORE.md`, `.agents/rules/nexora.md` and `.kilo/rules/nexora.md`; those overlaps need a clear source-of-truth and concise cross-links, not blind directory consolidation.
- `kilo.jsonc` explicitly loads `AGENTS.md`, `.kilo/rules/*.md`, and skill path `.agents/skills`.

## Prompt/command overlap

- **Preferred unified entry point:** `/nexora` (Kilo command) and `nexora` Copilot prompt. It routes among product QA, explicit untangling and scalable engineering.
- **Focused QA alternatives:** `/product-qa-swarm` overlaps the QA route in `/nexora`; `/test-my-product` overlaps QA and optionally describes MiroFish simulation. Keep these as focused/legacy aliases and make the unified route canonical.
- **Engineering overlap:** `/pro-eng-scalable` is the implementation-oriented engineering workflow; `/engineeringcouncil` is analysis/report-only specialist review. They share project discovery/review concepts but have different outputs and should be distinguished.
- **Prompt-only commands:** `/projectintelligence`, `/frontendarchitecture`, `/backendapi`, `/exactsameuiux`, `/professionalerrors`, `/smartvalidation`, `/meaningfulmessages`, `/design-ui`, `/frontend-only` are backed by GitHub prompt files; they are not all Kilo slash commands.
- README lists `/pro-eng-scalable` even though its Kilo command is a separate file and there is no corresponding `.github/prompts/pro-eng-scalable.prompt.md`. `/test-my-product` and `/product-qa-swarm` are Kilo commands, not GitHub prompt files.
- `/nexora-test` is introduced by PR #6 and is not present in main.

## Persona Lab count semantics

Current docs correctly separate deterministic profiles, browser contexts and HTTP VUs, but CLI usage/help is less explicit. Make this sentence identical in README, docs and CLI output:

**100 profiles != 100 real users != 100 LLM agents != 100 simultaneous browsers.**

Current runner caps browser workers at 3; it can process up to 100 browser persona contexts in bounded batches. The load harness is a separate k6 process and is not activated by Persona Lab.

## Load harness safety review

Source `load/k6-smoke.js` is fail-closed unless:
- `NEXORA_LOAD_AUTHORIZED=true`
- `NEXORA_LOAD_ENV=staging`
- URL is absolute and HTTPS for non-local targets
- URL hostname is in `NEXORA_LOAD_HOST_ALLOWLIST`
- VUs are integer 1–100
- duration is integer 30–300 seconds
- common preview hosts (`vercel.app`, `netlify.app`, `github.io`) are blocked by default

It sends a read-only homepage GET, uses a ramping VU scenario, and applies request-error/latency thresholds. This is a bounded smoke harness, not a full load-testing platform. The approval flag is an operator assertion, not an external authorization verification mechanism.

## README and documentation issues

- README is **266 lines**, above the requested ~250-line target.
- Duplicate subsection number: `### 3. Understand the project...` follows `### 3. Install...`.
- Repository map is stale/incomplete: it omits several current skill directories and `load/k6-smoke.js`, and the `tests/` map does not show all current files.
- Setup examples are primarily PowerShell/Windows; add macOS/Linux equivalents.
- README says Node.js 18 or newer; Node 18 is EOL. package.json `engines` is `>=18`, while CI currently runs Node 22. Recommend making Node 22 the compatibility floor and testing 22/24/26, with Node 26 as current Active LTS. See https://nodejs.org/en/about/previous-releases.
- Roadmap does not clearly list Persona Lab stabilization, a true browser decision executor, evidence ledger and independent reviewer runtime as milestones.
- The README is carrying detailed operator/workflow explanations that belong in docs pages.
- No dedicated general-purpose link checker is declared in package.json; CI currently checks docs asset references and JavaScript syntax, not every Markdown/HTML hyperlink.
- Static docs site has separate landing and guide pages; both need consistent feature status/command wording when README changes.
- Docs contain Windows-first command snippets in Persona Lab setup; add POSIX alternatives.

## Pull request state

- Exactly **one open PR** was returned by repository search: [PR #6](https://github.com/vineetbhardwaj001/Nexora/pull/6), `Add project-aware customer personas and 100-skill QA planning`. GitHub reports state=open, merged=false, base=main, head=`feature/project-aware-persona-engine`.
- [PR #7](https://github.com/vineetbhardwaj001/Nexora/pull/7) is closed and merged, but its base was `feature/project-aware-persona-engine`; its merge commit is on that feature branch. It is not a merge into main. PR #6 remains open and unmerged.
- Therefore `discover`, `reason`, and `validate-decision` are not part of the current main CLI at audit time.

## Proposed next work (after identity approval)

1. Select the one-line identity below.
2. Rewrite README to the requested 12-section structure and keep it under ~250 lines.
3. Split operator detail into PERSONA-LAB, COMMANDS, ARCHITECTURE, SAFETY and ROADMAP docs; preserve existing docs and archive superseded explanations rather than deleting them.
4. Reconcile CLI help and docs. Add a command-reference regression test that validates documented CLI commands against real help output.
5. Align engine requirement and CI matrix with supported Node LTS versions.
6. Update the existing Notion page only after saving the full prior page text in `docs/notion-backup-2026-11-13.md`.
7. Run local checks in a network-enabled clone and paste actual output. Do not treat this source audit as a test run.

## Scope caveat

This report is based on current main source/tree inspection plus PR/Notion metadata. The three requested local commands were not run because GitHub could not be cloned from this execution environment. No application or existing documentation files were modified during the audit; this audit report and Notion backup are standalone records.


---

## Implementation update — 2026-11-13 (cleanup branch)

The approved identity is **Option C**: reusable AI coding-agent engineering toolkit with installer, portable skills and optional synthetic-persona QA module.

Changes now committed to `docs/cleanup-audit-2026-11-13`:
- Rewrote README to the requested 12-section structure; previous README preserved at `docs/archive/README-2026-11-13.md`.
- Added `docs/COMMANDS.md`, `docs/ARCHITECTURE.md`, `docs/SAFETY.md`, `docs/ROADMAP.md`, and rewrote `docs/PERSONA-LAB.md`.
- Added `docs/NOTION-PAGE.md` as a copy-ready mirror of the canonical Notion update.
- Added explicit `node qa/cli.js --help` / `-h` support, unknown-command errors and the exact Persona Lab count disclaimer in CLI output.
- Added `tests/cli-docs.test.js` to check README/commands against actual help output.
- Added `tests/docs-links.test.js` to check local Markdown and HTML links/anchors.
- Raised package engine floor to Node >=22; updated CI matrix to Node 22, 24 and 26. Node 26 is Active LTS as of 2026-11-13; 22 and 24 remain supported LTS lines.
- Updated AGENTS, Kilo rules/command, docs landing page, docs guide and docs structure to match current capabilities and command boundaries.
- The exact count statement is present in README, Persona Lab guide, CLI help and shared rules.

### Verification after changes

The code execution environment still cannot clone the repository (GitHub DNS lookup failure). Therefore:
- `npm test`: NOT RUN.
- `node bin/nexora.js --help`: NOT RUN.
- `node qa/cli.js --help`: NOT RUN.
- Markdownlint and Python structural tests: NOT RUN.
- Link checker: IMPLEMENTED as `tests/docs-links.test.js`, NOT RUN.
- GitHub Actions: pending pull request creation/runner execution; no passing status is claimed.

The audit is source inspection plus committed proposed changes, not a successful runtime verification report. Re-run all checks in GitHub Actions and a local checkout before merging.


### First GitHub Actions result and corrective commits

The first PR-triggered workflow run (#165) provided real execution evidence:
- Python structural tests: passed.
- Documentation-site asset/JS checks: passed.
- Agent configuration validation: passed.
- Security secret-pattern and tracked-env-file checks: passed.
- Node test matrix initially failed on all three versions because an existing test still asserted `engines.node === ">=18"` and the new docs consistency test expected the README to list the `version` command. Both mismatches were corrected in later commits.
- Markdown lint initially found duplicate headings and missing final newline in the raw Notion backup, plus emphasis-style headings in the new README. README headings were converted to proper headings; the raw backup was excluded from lint to preserve it as a faithful snapshot.

The corrections are committed on this branch. The connector did not return a new PR-triggered workflow run for the corrected head commit, so **the corrected test suite and Markdown lint are awaiting a fresh CI run**. The initial workflow run remains failed; do not call the branch green based on the fixes alone.

Additional integration correction:
- Added `docs/COMMANDS.md`, `docs/ARCHITECTURE.md`, `docs/SAFETY.md` and `docs/ROADMAP.md` to both the installer manifest and npm package allowlist, because installed AGENTS/rules link to those references.
- Updated the existing CLI regression test to expect Node >=22 and verify the technical guides are installable.
