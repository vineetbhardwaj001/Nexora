# Nexora — AI Engineering Agent

<p align="center">
  <strong>From Idea to Production.</strong><br/>
  A skill-driven engineering companion for product planning, reference-led UI/UX, backend-safe frontend work, quality checks, and release readiness.
</p>

<p align="center">
  <a href="https://github.com/vineetbhardwaj001/Nexora/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/vineetbhardwaj001/Nexora/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/vineetbhardwaj001/Nexora/actions/workflows/security.yml"><img alt="Security checks" src="https://github.com/vineetbhardwaj001/Nexora/actions/workflows/security.yml/badge.svg"></a>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
  <img alt="Cross-platform" src="https://img.shields.io/badge/IDE-Kilo%20Code%20%7C%20Antigravity%20%7C%20Copilot-7057ff">
</p>

Nexora is a **cross-platform agent instruction and skill starter** for [Kilo Code](https://kilocode.ai/), [Google Antigravity](https://antigravity.google/), and [GitHub Copilot](https://github.com/features/copilot). It provides workflows and reusable instructions for turning an idea into a scoped product plan, designing UI from references, building a frontend against an existing backend, and checking software quality.

> **Project status:** early-stage starter kit. It is not yet a fully autonomous multi-agent runtime, and compatibility must be verified in each IDE/version. CI validates repository configuration and Markdown; passing CI does not prove that every IDE loads every skill correctly.

## Why Nexora?

- **Idea to plan:** define target users, MVP scope, user journeys, acceptance criteria, and delivery steps.
- **Reference-led UI/UX:** analyze each supplied screenshot independently before comparing styles.
- **Backend-safe frontend:** treat an existing backend as read-only by default; use real API contracts and report missing capabilities instead of silently changing server code.
- **Maintainable structure:** organize pages, components, API services, hooks, styles, and types around actual product domains.
- **Quality and safety:** encourage tests, security reviews, accessibility, documentation, and evidence-based production readiness.
- **User control:** use guided autonomy by default and ask before destructive, costly, or production actions.

## Quick start

### 1. Clone Nexora

```bash
git clone https://github.com/vineetbhardwaj001/Nexora.git
cd Nexora
```

### 2. Add it to a project

Back up existing agent instructions first. Merge these paths into the **root of your target project** rather than blindly overwriting project-specific rules:

- `AGENTS.md`
- `.agent/`
- `.agents/`
- `.kilo/`
- `kilo.jsonc`
- relevant files under `.github/`

### 3. Start with a read-only audit

Ask your coding agent:

> Read `AGENTS.md`, `.agent/CORE.md`, and `.agent/config/skills.json`. Inspect the repository and report which Nexora instructions and skills this IDE actually supports. Do not edit files yet.

### 4. Choose a workflow

| Goal | Workflow / prompt |
|---|---|
| Turn an idea into an MVP plan | `.github/prompts/idea-to-plan.prompt.md` |
| Analyze UI references | `.github/prompts/design-ui.prompt.md` |
| Build frontend without backend edits | `.github/prompts/frontend-only.prompt.md` |
| Map backend APIs and auth | `.agent/workflows/backend-preserving-frontend.md` |
| Choose a maintainable folder structure | `.agent/workflows/frontend-structure.md` |
| Configure skills | `.agent/workflows/setup.md` |

Workflow names are portable labels, not guaranteed slash commands. Invoke them through the native prompt/skill interface supported by your selected IDE.

## Core principles

1. Inspect the repository and Git status before editing.
2. Analyze each UI reference image separately before comparing styles.
3. Protect existing backend routes, schemas, auth logic, migrations, server configuration, and backend dependencies by default.
4. Use actual API contracts; never invent endpoints or present mock data as live production data.
5. Prefer small, focused components and meaningful product-domain folders.
6. Preserve user changes and never claim unrun tests passed.
7. Ask before destructive changes, production deployment, migrations, paid services, secrets changes, or out-of-scope security/load tests.

## Repository map

```text
.
├── AGENTS.md
├── .agent/
│   ├── CORE.md
│   ├── config/skills.json
│   ├── repo-catalog.md
│   └── workflows/
├── .agents/
│   ├── rules/
│   └── skills/
├── .github/
│   ├── prompts/
│   └── workflows/
├── .kilo/rules/
└── kilo.jsonc
```

- `.agent/config/skills.json` — skill status and safety policies.
- `.agents/skills/` — reusable skill instructions.
- `.agent/workflows/` — repeatable workflows and checklists.
- `.github/workflows/` — automated CI and baseline security checks.

## GitHub Actions

On pushes and pull requests to `main`, workflows validate key configuration files, lint Markdown, check whitespace, scan for common secret patterns, and look for tracked environment files. A weekly security scan is also scheduled.

These are baseline checks, not a substitute for a dedicated secret scanner, dependency audit, application security test, or runtime validation. Inspect the [Actions tab](https://github.com/vineetbhardwaj001/Nexora/actions) for the latest results.

## Optional integrations

Potential third-party skill sources are listed in `.agent/repo-catalog.md`. They are **not vendored or automatically installed**. Before integrating any source, inspect its current license, dependencies, setup instructions, security posture, and compatibility.

## Contributing

Bug reports, documentation improvements, workflow fixes, and new skills are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md), open an issue with a clear reproduction/use case, and submit focused pull requests. Do not include secrets, private data, or proprietary assets you do not have permission to share.

## License

Nexora is released under the [MIT License](LICENSE). This license applies to the original files in this repository. Third-party projects referenced in the catalog retain their own licenses and terms.

## Roadmap

- [ ] Validate skill loading in each supported IDE/version.
- [ ] Add automated schema and workflow tests.
- [ ] Add installer with backups, safe merge, validation, and rollback.
- [ ] Add tested skill discovery/routing.
- [ ] Add optional, license-reviewed third-party integrations.
- [ ] Add release/versioning process after compatibility tests stabilize.

**Maintainer:** [@vineetbhardwaj001](https://github.com/vineetbhardwaj001)

## Install with npm (CLI)

The CLI package is **not published yet**. After the first successful public npm publish, use:

```bash
npx nexora-agent-cli init
```

Install only missing files and leave existing files untouched:

```bash
npx nexora-agent-cli init --yes
```

Back up and replace conflicting Nexora files explicitly:

```bash
npx nexora-agent-cli init --force
```

Check an existing installation:

```bash
npx nexora-agent-cli doctor
```

Install into a different project folder:

```bash
npx nexora-agent-cli init --path ../my-app
```

The CLI requires Node.js 18 or newer. It does not install application dependencies, modify application source code, or guarantee automatic skill discovery in every IDE. Existing files are not overwritten by default; `--force` creates timestamped backups.

### Publish the CLI to public npm

The repository includes a release workflow at `.github/workflows/publish-npm.yml`. To enable publishing:

1. Sign in to the npm account that will own the package and check whether **`nexora-agent-cli`** is available.
2. Create an npm access token authorized to publish packages. Use the least-privileged token type supported by your npm account and workflow.
3. In GitHub, open **Settings → Secrets and variables → Actions** and add a repository secret named `NPM_TOKEN`. Never commit or paste the token into source files.
4. Ensure the CLI tests pass, update `package.json` to the intended release version, push the changes, and create a GitHub Release. The workflow runs tests, previews package contents, and then publishes to public npm.
5. Verify the package page and install command after the workflow succeeds.

```bash
npm view nexora-agent-cli
npx nexora-agent-cli init
npm install --global nexora-agent-cli
nexora doctor
```

**Publishing status:** the CLI source and release workflow are committed to GitHub, but this repository integration does not publish packages to npm by itself. The first public publish requires an authorized npm account/token and an available package name. Do not advertise the install command as live until the npm package page and install are verified.

## Package name and identity

The original name `nexora-agent` was found to be associated with a different published project, so this project uses the distinct intended name `nexora-agent-cli`. The package must be published by its maintainer before `npx` can install it. The terminal banner identifies this project as developed by Vineet Bhardwaj.

## Interactive terminal UI

Run Nexora without arguments to open its interactive terminal menu:

```bash
npx nexora-agent-cli
```

The terminal UI includes a branded Nexora header and quick actions to:
- Install skills and workflows into the current project
- Check which Nexora files are present
- Browse files included in the installer
- Open CLI help
- Open the maintainer's GitHub profile

You can also run a command directly:

```bash
npx nexora-agent-cli init
npx nexora-agent-cli doctor
npx nexora-agent-cli list
```

The terminal uses ANSI colors when supported and respects `NO_COLOR`. Existing files are not overwritten by default; choose the explicit overwrite option or use `--force` to create backups.

## Render deployment

Nexora currently ships a terminal CLI; this repository does not contain a verified public Render web-demo URL. If a web dashboard is deployed separately on Render, add its exact service URL here only after verifying that it is live.

### Follow Nexora on GitHub

Choose **5 — Follow Nexora on GitHub** in the interactive CLI to open the maintainer profile in your default browser. Click **Follow** on GitHub yourself if you want to follow the account; the CLI does not silently follow accounts or change account settings.

Maintainer profile: https://github.com/vineetbhardwaj001
