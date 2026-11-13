# Commands reference

This page separates CLI commands from tool-specific prompt entry points. A filename is not proof that every IDE exposes a slash command.

## Installer CLI

Run from the Nexora repository:

| Command | Status | Purpose |
|---|---|---|
| `node bin/nexora.js --help` | IMPLEMENTED | Show installer CLI usage. |
| `node bin/nexora.js init --path <dir> --yes` | IMPLEMENTED | Install missing managed files into a project. |
| `node bin/nexora.js doctor --path <dir>` | IMPLEMENTED | Check managed-file presence. |
| `node bin/nexora.js list` | IMPLEMENTED | List installer manifest files. |
| `node bin/nexora.js version` | IMPLEMENTED | Print package version. |
| `node bin/nexora.js qa plan ...` | IMPLEMENTED | Forward arguments to Persona Lab plan. |
| `node bin/nexora.js qa run ...` | IMPLEMENTED | Forward arguments to Persona Lab run. |

Install options include `--yes`, `--force`, `--path` and `--save-default`. `--force` backs up a conflicting file before replacing it. Inspect the actual installer help for the complete option set.

## Persona Lab CLI

```bash
node qa/cli.js --help
node qa/cli.js plan --url https://staging.example.com --personas 100
node qa/cli.js run --url https://staging.example.com --personas 100 --browser-personas 3 --workers 2 --max-pages 5
```

- `plan` generates profiles only; it does not launch Playwright or send load traffic.
- `run` generates profiles and runs only the requested browser cohort.
- Limits: 1–10,000 generated profiles; 1–100 browser contexts; 1–3 workers; 1–20 pages.
- Browser contexts are processed in bounded batches. Worker count is capped at 3.
- `discover`, `reason`, and `validate-decision` are not implemented on current `main`. They must remain labelled PLANNED until merged and verified.

## Kilo Code command files

These files are installed under `.kilo/commands/`. Invocation behavior depends on the installed Kilo Code version.

| Command | Status | Scope | Relationship |
|---|---|---|---|
| `/nexora` | IMPLEMENTED | Unified router for engineering, QA and explicit untangle route | Preferred entry point |
| `/test-my-product` | IMPLEMENTED | Product QA with optional MiroFish hypotheses | Focused alias; overlaps QA path in `/nexora` |
| `/product-qa-swarm` | IMPLEMENTED | Product QA workflow and reporting | Focused/legacy QA alias; overlaps above |
| `/pro-eng-scalable` | IMPLEMENTED | Guided engineering workflow | Separate implementation-oriented workflow |

The `/nexora` route is the recommended starting point. Use focused commands when you explicitly want their narrower workflow.

## GitHub Copilot prompt files

These files live in `.github/prompts/`. They are prompt assets; whether they appear as slash commands depends on the Copilot client and its supported prompt workflow.

| Prompt file | Purpose |
|---|---|
| `nexora.prompt.md` | Unified Nexora workflow |
| `engineeringcouncil.prompt.md` | Cross-functional review and recommendations |
| `projectintelligence.prompt.md` | Project discovery and handoff |
| `frontendarchitecture.prompt.md` | Frontend architecture |
| `backendapi.prompt.md` | Backend/API audit |
| `frontend-only.prompt.md` | Frontend-scoped implementation |
| `design-ui.prompt.md` | UI/UX design workflow |
| `exactsameuiux.prompt.md` | Reference-based UI recreation |
| `professionalerrors.prompt.md` | Error handling |
| `smartvalidation.prompt.md` | Validation |
| `meaningfulmessages.prompt.md` | Product-facing messages |

The Copilot prompt pack overlaps the Kilo pack conceptually but is not the same command registry.

## Skill activation

The canonical skill content is under `.agents/skills/<skill-name>/SKILL.md`. The registry in `.agent/config/skills.json` marks skills as enabled, ask-first or disabled. Follow the registry and skill's activation instructions; do not infer autonomous execution from the existence of a skill file.
