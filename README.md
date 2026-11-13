# Nexora

**Reusable AI coding-agent skills and installer, with an optional synthetic-persona QA module.**

[![Alpha](https://img.shields.io/badge/status-alpha-orange)](https://github.com/vineetbhardwaj001/Nexora)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 1. What is Nexora?

Nexora is an open-source toolkit for installing reusable engineering instructions and skills into compatible AI coding environments. It includes guided workflows for product thinking, UI/UX, frontend/backend engineering, QA and code quality. An optional local Persona Lab can generate synthetic test profiles and run bounded, read-only browser checks.

Nexora helps structure an AI-assisted workflow; it does not make AI output infallible.

## 2. Why it exists

- Useful engineering instructions often get scattered across prompts, repositories and tools.
- Teams repeat the same discovery, architecture, validation and review setup for every project.
- AI-generated plans and synthetic test scenarios can be mistaken for verified execution unless evidence and limits are explicit.

## 3. Quick start

Prerequisite: Node.js 22 or newer. The package has no required runtime dependencies for installer-only use.

### macOS / Linux

```bash
git clone https://github.com/vineetbhardwaj001/Nexora.git
cd Nexora
npm install
npm test
node bin/nexora.js init --path "$HOME/code/my-project" --yes
```

### Windows PowerShell

```powershell
git clone https://github.com/vineetbhardwaj001/Nexora.git
Set-Location .\Nexora
npm install
npm test
node .\bin\nexora.js init --path "$HOME\source\my-project" --yes
```

The installer copies missing managed files into the target project and preserves existing files by default. Review the target project's Git diff after installation.

## 4. Core features

| Feature | Status | How to use | Main files |
|---|---|---|---|
| Project installer | IMPLEMENTED | `node bin/nexora.js init --path <dir> --yes` | `bin/nexora.js` |
| Guided agent rules | IMPLEMENTED | Open the target project in a compatible coding tool | `AGENTS.md`, `.agent/`, `.agents/rules/` |
| Reusable skill library | IMPLEMENTED | Invoke the relevant skill through the supported tool workflow | `.agents/skills/` |
| Kilo command pack | IMPLEMENTED | Use commands listed in [Commands](docs/COMMANDS.md) | `.kilo/commands/` |
| GitHub Copilot prompt pack | IMPLEMENTED | Open a prompt file in a compatible Copilot workflow | `.github/prompts/` |
| Persona profile planning | IMPLEMENTED | `node qa/cli.js plan --url <url> --personas 100` | `qa/personas.js`, `qa/cli.js` |
| Read-only Playwright browser checks | IMPLEMENTED | Install Playwright in target project, then use `qa run` | `qa/runner.js` |
| AI decision proposal engine | PLANNED ON MAIN | Not available on main; see open PR #6 | PR #6 / stacked PR #7 |

**Count semantics:** 100 profiles != 100 real users != 100 LLM agents != 100 simultaneous browsers. Persona profiles are deterministic synthetic scenarios. The browser runner caps workers at 3 and executes the requested browser contexts in batches.

## 5. Modules

- **Persona Lab — IMPLEMENTED (bounded MVP):** deterministic profile planning plus read-only Playwright navigation, screenshots and browser error collection. See [Persona Lab](docs/PERSONA-LAB.md).
- **MiroFish adapter — PARTIAL / OPTIONAL:** an instruction skill describes a separately operated MiroFish simulation service. Nexora does not bundle or deploy MiroFish, and no completed native service adapter is claimed. See [MiroFish integration](docs/MIROFISH-INTEGRATION.md).
- **Caldo untangle skill — IMPLEMENTED:** vendored MIT skill package for explicit, opt-in codebase refactoring. See [Untangle guide](docs/UNTANGLE-CODEBASE.md).
- **k6 smoke harness — IMPLEMENTED (staging-only):** separate, fail-closed HTTP GET smoke test with authorization, staging and hostname gates. See [Safety](docs/SAFETY.md).
- **Static docs site — IMPLEMENTED:** HTML/CSS/JS landing and guide pages deployed by GitHub Pages workflow when that workflow succeeds. See [Docs structure](docs/STRUCTURE.md).

## 6. Commands reference

See [CLI and prompt command reference](docs/COMMANDS.md) for the complete inventory and overlap notes.

| Command | Purpose |
|---|---|
| `node bin/nexora.js --help` | Installer help |
| `node bin/nexora.js init --path <dir> --yes` | Install managed Nexora files |
| `node bin/nexora.js doctor --path <dir>` | Inspect managed-file presence |
| `node bin/nexora.js list` | List managed files |
| `node bin/nexora.js version` | Print CLI version |
| `node qa/cli.js --help` | Persona Lab help |
| `node qa/cli.js plan --url <url> --personas N` | Generate profiles only |
| `node qa/cli.js run --url <url> --personas N --browser-personas N --workers N --max-pages N` | Run bounded browser checks |

The current main branch does **not** provide `discover`, `reason`, or `validate-decision` commands. Those are branch-only proposals in PR #6 / stacked PR #7, not main-branch commands.

## 7. What Nexora cannot do

- It cannot guarantee bug-free code or prevent every AI mistake.
- Synthetic profiles are not recruited people, customer interviews or measured customer sentiment.
- Persona profiles are not LLM agents and do not represent concurrent browser sessions.
- A generated plan is not an executed test; a screenshot or page load is not proof that every user journey works.
- The current browser runner does not submit forms, create records, send messages, make purchases or mutate application data.
- It is not a full security audit, penetration test, accessibility certification or production-readiness guarantee.
- MiroFish simulation, when separately configured, is hypothesis generation—not browser QA or HTTP load.
- The k6 harness is a small authorized staging smoke test, not a general-purpose capacity certification.

## 8. Safety defaults

- Installer preserves existing files unless the operator explicitly uses its overwrite option.
- Browser QA uses bounded, read-only same-origin navigation; use a staging URL and sanitized test data.
- Never place credentials in URLs, command arguments, committed files or reports.
- k6 is separate and fails closed unless staging, explicit authorization, an exact host allowlist and bounded VU/duration settings are supplied.
- Payments, emails, deletions, bookings and other consequential actions are out of scope for the current browser runner.
- Read [Safety](docs/SAFETY.md) before running any external test.

## 9. Repository map

```text
.
├── bin/                    # Installer CLI
├── .agent/                 # Core config, registry and workflows
├── .agents/
│   ├── rules/              # Shared agent rules
│   └── skills/             # Reusable skill packages
├── .kilo/                  # Kilo commands and rules
├── .github/
│   ├── prompts/            # Copilot prompt files
│   └── workflows/          # CI, docs and security workflows
├── qa/                     # Persona Lab generator, runner and CLI
├── load/                   # Separate k6 staging smoke harness
├── tests/                  # Node and Python tests
├── docs/                   # Guides and static docs site
├── AGENTS.md
├── CONTRIBUTING.md
├── kilo.jsonc
└── package.json
```

Directory responsibilities and trust boundaries are described in [Architecture](docs/ARCHITECTURE.md).

## 10. Roadmap

- [ ] Stabilize installer and publish cross-tool compatibility evidence.
- [ ] Merge and verify project-aware discovery and skill assignment (PR #6).
- [ ] Integrate and verify the host-model decision proposal workflow (stacked PR #7).
- [ ] Add an explicit, safe browser action executor with observable assertions.
- [ ] Add an append-only evidence ledger linking claims to artifacts.
- [ ] Add independent reviewer execution with separate evidence-based conclusions.
- [ ] Improve Persona Lab journey coverage and authenticated staging fixtures.
- [ ] Add verified optional MiroFish service adapter after upstream API and license review.
- [ ] Expand k6 scenarios only with explicit staging authorization and abort controls.

Roadmap items are not current capabilities unless marked IMPLEMENTED above.

## 11. Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md). Keep pull requests focused, preserve safety boundaries, add tests for behavior changes, and report the exact checks you ran. Never report unexecuted tests as passing.

## 12. License

Nexora is distributed under the MIT License. Third-party components retain their own notices; see [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
