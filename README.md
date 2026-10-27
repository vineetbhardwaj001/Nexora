# Nexora

<p align="center">
  <img src="https://img.shields.io/badge/Nexora-Universal%20Agent%20Kits-f3b84b?style=for-the-badge&labelColor=17251f" alt="Nexora">
</p>

<p align="center">
  <strong>One thoughtful toolkit. Your coding environment.</strong><br>
  Reusable agent instructions and skills for building real software with the AI coding tool you already love.
</p>

<p align="center">
  <a href="https://vineetbhardwaj001.github.io/Nexora/"><strong>Explore the Docs →</strong></a> ·
  <a href="https://github.com/vineetbhardwaj001/Nexora/actions/workflows/ci.yml">CI</a> ·
  <a href="https://github.com/vineetbhardwaj001/Nexora/actions/workflows/security.yml">Security</a> ·
  <a href="LICENSE">MIT License</a>
</p>

<p align="center">
  <img alt="Kilo Code" src="https://img.shields.io/badge/Kilo%20Code-adapter%20planned-f0c15a">
  <img alt="OpenCode" src="https://img.shields.io/badge/OpenCode-adapter%20planned-7b8e7a">
  <img alt="Antigravity" src="https://img.shields.io/badge/Antigravity-skills%20and%20rules-8c83d6">
</p>

Nexora is an early-stage, tool-aware **agent-pack and skills project**. The goal is to help developers reuse thoughtful workflows—planning, UI/UX, frontend integration, testing, and security—across compatible AI coding environments, instead of locking their work to a single editor.

> **Honest status:** Nexora is currently a starter kit and CLI, not a universal autonomous agent runtime. The documentation site and cross-tool architecture describe the intended direction; each adapter and feature must be implemented and tested against the target tool before being advertised as supported.

## Start here

### 1. Clone the repository

```bash
git clone https://github.com/vineetbhardwaj001/Nexora.git
cd Nexora
```

### 2. Run the current CLI locally

Requires Node.js 18 or newer.

```bash
npm install
npm test
node bin/nexora.js
```

Nexora is being tested from a Git clone first. **npm publishing is not part of the current workflow.**

### 3. Understand the project before installing it elsewhere

Read [AGENTS.md](AGENTS.md), [the core instructions](.agent/CORE.md), and [the skill configuration](.agent/config/skills.json). Back up project-specific agent files before merging instructions into another repository.

## The idea

- **Portable knowledge:** keep reusable skills and workflow instructions in a canonical source.
- **Tool-aware setup:** translate or install supported pieces into each coding tool's native format.
- **Human-led development:** explain what will change, preserve user work, and ask before destructive or costly actions.
- **Backend respect:** treat existing backend contracts as read-only by default when the task is frontend-only.
- **Evidence over hype:** distinguish implemented features from roadmap ideas and report tests that actually ran.

## Coding-tool compatibility

| Tool | Intended integration | Important note |
|---|---|---|
| Kilo Code | Shared skills plus native configuration where supported | Native agent/subagent behavior depends on Kilo Code's current format and version. |
| OpenCode | Shared skills plus native agent configuration where supported | A skill is not automatically the same as a native agent. |
| Google Antigravity | Supported skills and workspace rules | Do not claim native subagent delegation where the tool does not provide it. |
| Other tools | Evaluate adapter and format support first | No compatibility is implied just because a tool can read Markdown. |

Compatibility must be verified against official documentation and a real local test. Generated configuration should never overwrite unrelated user files silently.

## Prompt commands and reusable skills

The repository includes reusable skill instructions in `.agents/skills/` and prompt files in `.github/prompts/`. In compatible VS Code/GitHub Copilot versions, these prompt files can be invoked by their prompt names in Chat; other IDEs may require selecting the workflow or reading the skill file directly.

| Prompt command / name | What it does |
|---|---|
| `/exactsameuiux` | Recreate a supplied screenshot with high visual fidelity; compare layout, spacing, typography, colors, components, assets and responsive states. |
| `/projectintelligence` | Audit the complete repository and prepare project, API, database, integration and AI context reports without implementing features. |
| `/frontendarchitecture` | Plan a scalable, domain-oriented frontend folder structure and safe migration sequence. |
| `/backendapi` | Trace backend routes and produce verified API contracts, permissions and frontend integration gaps. |
| `/professionalerrors` | Improve error handling and user-facing failure/recovery messages using actual API behavior. |
| `/smartvalidation` | Build accessible, contract-aware form validation without inventing field constraints. |
| `/meaningfulmessages` | Improve success, error, empty, warning and confirmation copy with honest, actionable messaging. |
| `/design-ui` | Analyze design references separately and propose a coherent product-specific design system. |
| `/frontend-only` | Build frontend functionality against the existing backend while keeping backend files read-only by default. |

These names are prompt identifiers, not a promise that every coding tool exposes identical slash-command UX. Verify prompt discovery in the IDE/version you use. If a command is not listed, open its file in `.github/prompts/` or read the corresponding skill's `SKILL.md`.

Example:

```text
/exactsameuiux Recreate the attached dashboard screenshot as closely as possible. Preserve its text and layout, use the existing project stack, and do not change backend files.
```

## What Nexora helps with

- **Idea → plan:** turn a rough idea into users, scope, acceptance criteria, and milestones.
- **Reference-led UI/UX:** analyze design references before proposing a consistent interface.
- **Frontend + existing backend:** map real routes, auth, and API contracts before connecting UI.
- **Maintainable code:** choose meaningful component boundaries and project-domain folders.
- **Quality checks:** plan tests, accessibility checks, security review, and release readiness.

## Example: Clinic ERP agent pack

A future example pack could contain skills for:
1. Product architect — requirements, scope, and workflows.
2. Frontend developer — React screens and accessible forms.
3. Backend developer — API contracts and business rules.
4. Database specialist — schemas, relationships, and indexes.
5. QA engineer — integration and regression tests.
6. Security reviewer — authorization and sensitive-data handling.

Use synthetic patient data in demos and tests. This is an example of the intended pack design, not a claim that these six native agents are already implemented across every tool.

## Repository map

```text
.
├── AGENTS.md
├── .agent/
│   ├── CORE.md
│   ├── config/
│   └── workflows/
├── .agents/
│   ├── rules/
│   └── skills/
├── .kilo/
├── .github/
│   ├── prompts/
│   └── workflows/
├── bin/
├── tests/
├── docs/
│   ├── index.html
│   ├── guide.html
│   ├── STRUCTURE.md
│   └── assets/
│       ├── css/
│       │   └── styles.css
│       └── js/
│           └── docs.js
├── kilo.jsonc
└── package.json
```

## Safety by default

- Inspect repository state before editing.
- Do not invent APIs or pretend sample data is production data.
- Preserve user modifications and back up conflicts before replacing files.
- Never commit API keys or print secrets in logs.
- Ask before destructive changes, production deployment, database migrations, paid services, or scope-expanding tests.
- Never claim a test passed unless it actually ran.
- A model described as “free” must be verified against the provider's current pricing and limits. Do not silently fall back to paid models.

## Documentation

The documentation site is designed for quick onboarding, plain-language explanations, and copyable commands. Its HTML, CSS, and JavaScript are kept in separate files to make UI maintenance easier.

- **Docs homepage:** [Nexora Docs](https://vineetbhardwaj001.github.io/Nexora/)
- **Marketing homepage:** [`docs/index.html`](docs/index.html)
- **Detailed guide:** [`docs/guide.html`](docs/guide.html)
- **Styles:** [`docs/assets/css/styles.css`](docs/assets/css/styles.css)
- **Interactions:** [`docs/assets/js/docs.js`](docs/assets/js/docs.js)
- **Maintenance guide:** [`docs/STRUCTURE.md`](docs/STRUCTURE.md)
- **Repository folder map:** [`docs/REPOSITORY-STRUCTURE.md`](docs/REPOSITORY-STRUCTURE.md)
- **Local preview:** open `docs/index.html` for the landing page or `docs/guide.html` for the detailed guide.
- **Source files:** browse the [docs folder](docs/) in GitHub.

GitHub Pages deploys from the `docs-site.yml` workflow. If Pages has not been enabled for this repository, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.

## Development and tests

```bash
npm test
node bin/nexora.js --help
```

GitHub Actions also validates key configuration, Markdown, structural tests, and baseline secret patterns. These checks are useful safeguards, not proof that every IDE integration works at runtime. See the [latest workflow runs](https://github.com/vineetbhardwaj001/Nexora/actions).

## Roadmap

- [ ] Validate shared skill loading in each supported coding tool/version.
- [ ] Build tool-specific adapters with safe merge, backup, dry-run, and rollback.
- [ ] Add adapter compatibility tests and clearer diagnostics.
- [ ] Add agent-pack discovery and installation UX.
- [ ] Design free-only model configuration with a verified zero-cost allowlist and fail-closed behavior. This is future work, not implemented functionality.
- [ ] Establish release/versioning after local and cross-tool tests stabilize.

## Contributing

Bug reports, docs improvements, workflow fixes, and skills are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and submit focused changes with a clear use case. Do not include secrets, private data, or assets you do not have permission to share.

## License

Nexora is released under the [MIT License](LICENSE). Third-party projects retain their own licenses and terms.

---

<p align="center">
  Made with care for developers building useful things.<br>
  <strong>Developed by Vineet Bhardwaj</strong> · <a href="https://github.com/vineetbhardwaj001">GitHub</a>
</p>
