# Nexora — Unified Engineering & Product QA Workflow

> **One-line identity:** Nexora is a reusable AI coding-agent engineering toolkit with an installer, portable skills and an optional synthetic-persona QA module.

**Status:** Alpha · **Last updated:** 2026-11-13  
**Repository:** https://github.com/vineetbhardwaj001/Nexora

## What / Why

Nexora packages reusable engineering instructions, skills and tool-specific prompt entry points so developers can carry consistent workflows between projects. Its optional local Persona Lab generates deterministic synthetic profiles and runs bounded, read-only browser navigation.

It helps structure AI-assisted work; it does not guarantee correct AI output, complete bug detection or real customer feedback.

## Feature status

| Feature | Status | Current boundary |
|---|---|---|
| Installer, skills, Kilo commands and Copilot prompt assets | IMPLEMENTED | Tool discovery varies by client |
| Persona Lab deterministic profiles | IMPLEMENTED | Synthetic scenarios only |
| Playwright browser navigation | IMPLEMENTED | Read-only, bounded, max 3 workers |
| k6 staging smoke harness | IMPLEMENTED | Separate, gated, read-only GET |
| MiroFish adapter | PARTIAL | Optional integration instructions; no bundled native runtime |
| Project-aware discovery / 100-skill catalog | PLANNED ON MAIN | Open PR #6 |
| Host-model decision request/validation | PLANNED ON MAIN | PR #7 stacked on PR #6 feature branch |
| Browser action executor, evidence ledger, independent reviewer runtime | PLANNED | Not present on main |

**Persona Lab count rule:** 100 profiles != 100 real users != 100 LLM agents != 100 simultaneous browsers.

## Quick start

Node.js 22+.

```bash
git clone https://github.com/vineetbhardwaj001/Nexora.git
cd Nexora
npm install
npm test
node bin/nexora.js init --path "$HOME/code/my-project" --yes
```

Windows PowerShell:

```powershell
git clone https://github.com/vineetbhardwaj001/Nexora.git
Set-Location .\Nexora
npm install
npm test
node .\bin\nexora.js init --path "$HOME\source\my-project" --yes
```

## Modules

- **Persona Lab:** [operator guide](https://github.com/vineetbhardwaj001/Nexora/blob/main/docs/PERSONA-LAB.md)
- **MiroFish optional integration:** [guide](https://github.com/vineetbhardwaj001/Nexora/blob/main/docs/MIROFISH-INTEGRATION.md)
- **Caldo untangle skill:** [guide](https://github.com/vineetbhardwaj001/Nexora/blob/main/docs/UNTANGLE-CODEBASE.md)
- **Safety / k6:** [policy](https://github.com/vineetbhardwaj001/Nexora/blob/docs/cleanup-audit-final-ci-2026-11-13/docs/SAFETY.md)
- **Architecture:** [guide](https://github.com/vineetbhardwaj001/Nexora/blob/docs/cleanup-audit-2026-11-13/docs/ARCHITECTURE.md)

## Commands

```bash
node bin/nexora.js --help
node bin/nexora.js init --path <dir> --yes
node qa/cli.js --help
node qa/cli.js plan --url https://staging.example.com --personas 100
node qa/cli.js run --url https://staging.example.com --personas 100 --browser-personas 3 --workers 2 --max-pages 5
```

Kilo commands: `/nexora` (preferred), `/test-my-product` and `/product-qa-swarm` (focused overlapping QA aliases), `/pro-eng-scalable`. Copilot prompt files are separate prompt assets; exact client support varies.

`discover`, `reason` and `validate-decision` are not current-main CLI commands.

## Limits & Safety

The current browser runner performs bounded same-origin navigation and observation only. It does not submit forms, create/delete records, send messages, make payments or bookings. k6 is a separate staging-only harness with explicit authorization, exact host allowlist and bounded VU/duration gates. A plan, screenshot or page load is not proof of a successful end-to-end journey.

## Roadmap

- [ ] Merge and verify PR #6 project-aware discovery and skill assignment.
- [ ] Merge and verify PR #7 host-model decision proposal/validation (currently stacked on PR #6).
- [ ] Add safe browser action executor and observable assertions.
- [ ] Add append-only evidence ledger.
- [ ] Add independent reviewer execution.
- [ ] Improve authenticated staging fixtures and journey coverage.

## Known issues

- PR #6 is open and unmerged.
- Node engine floor on main is still >=18; cleanup branch proposes >=22 and CI matrix 22/24/26.
- Current branch changes and tests are not yet locally executed; CI status is pending.
- No general Markdown/HTML link checker is configured.

## Links

- Repository: https://github.com/vineetbhardwaj001/Nexora
- Docs site: https://vineetbhardwaj001.github.io/Nexora/
- PR #6: https://github.com/vineetbhardwaj001/Nexora/pull/6
- PR #7: https://github.com/vineetbhardwaj001/Nexora/pull/7
- Cleanup branch: https://github.com/vineetbhardwaj001/Nexora/tree/docs/cleanup-audit-final-ci-2026-11-13

## My Notes

- Local project path previously noted: `C:\New folder (4)\AVR-FRONTEND\AVR-FROTEND`.
- Local install command:

```powershell
node .\bin\nexora.js init --path "C:\New folder (4)\AVR-FRONTEND\AVR-FROTEND" --yes --save-default
```

- Full previous page content is preserved in [docs/notion-backup-2026-11-13.md](https://github.com/vineetbhardwaj001/Nexora/blob/docs/cleanup-audit-2026-11-13/docs/notion-backup-2026-11-13.md).
