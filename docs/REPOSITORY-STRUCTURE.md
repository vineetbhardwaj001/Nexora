# Repository Structure Guide

This guide explains the current repository layout and where each kind of change belongs. The folder names are intentionally not all consolidated: some AI coding tools discover configuration only from specific paths.

## Top-level map

```text
.
├── AGENTS.md                    # Shared repository-level instructions
├── README.md                    # Project overview, setup, roadmap
├── CONTRIBUTING.md               # Contributor workflow
├── LICENSE                      # MIT license
├── package.json                 # Node.js metadata and CLI test command
├── bin/
│   └── nexora.js                 # Current terminal CLI entry point
├── tests/
│   ├── cli.test.js               # Node.js CLI tests
│   └── test_agent_config.py      # Python structural/configuration tests
├── .agent/                       # Nexora's canonical planning/workflow config
│   ├── CORE.md                   # Core operating principles
│   ├── config/skills.json        # Skill catalog and autonomy settings
│   ├── repo-catalog.md           # Repository reference notes
│   └── workflows/                # Reusable project workflows
├── .agents/                      # Shared agent rules and portable skills
│   ├── rules/nexora.md
│   └── skills/<skill-name>/SKILL.md
├── .kilo/                        # Kilo Code-specific rules
│   └── rules/nexora.md
├── kilo.jsonc                    # Kilo Code project configuration
├── .github/
│   ├── copilot-instructions.md   # GitHub Copilot repository instructions
│   ├── prompts/                  # Reusable prompt files
│   ├── ISSUE_TEMPLATE/           # Issue forms/templates
│   └── workflows/                # CI, security, docs deploy, npm staging
├── docs/
│   ├── index.html                # Marketing landing page and star calls to action
│   ├── guide.html                 # Detailed setup and product documentation
│   ├── STRUCTURE.md              # Landing page and guide maintenance guide
│   ├── REPOSITORY-STRUCTURE.md   # This repository layout guide
│   └── assets/
│       ├── css/styles.css        # Documentation styling and responsive layout
│       └── js/docs.js            # Documentation interactions
└── .markdownlint-cli2.jsonc      # Markdown lint configuration
```

## Where should I make a change?

| If you want to… | Start here |
|---|---|
| Change CLI menu, commands, or terminal presentation | `bin/nexora.js` |
| Change Node.js CLI tests | `tests/cli.test.js` |
| Change Python structural tests | `tests/test_agent_config.py` |
| Add or edit a reusable skill | `.agents/skills/<skill-name>/SKILL.md` |
| Change shared repository instructions | `AGENTS.md` and, if relevant, `.agent/CORE.md` |
| Update a workflow or planning procedure | `.agent/workflows/` |
| Change Kilo Code-specific behavior | `.kilo/` and `kilo.jsonc` |
| Change GitHub Copilot instructions/prompts | `.github/copilot-instructions.md` or `.github/prompts/` |
| Change docs copy, sections, or navigation | `docs/index.html` |
| Change docs colors, spacing, or responsive layout | `docs/assets/css/styles.css` |
| Change docs search, theme, menu, or copy buttons | `docs/assets/js/docs.js` |
| Change docs build/deployment | `.github/workflows/docs-site.yml` |
| Change CI/security checks | `.github/workflows/ci.yml` or `.github/workflows/security.yml` |

## Why keep both `.agent/` and `.agents/`?

They currently serve different purposes in this repository:

- `.agent/` holds Nexora's core configuration, skill catalog, repository notes, and workflow documents.
- `.agents/` holds reusable skill folders and shared rules.

Do not merge or rename these directories casually. Update references and tests together, and first confirm the target tools' discovery conventions. The same caution applies to `.kilo/` and `.github/`: these are tool/platform-specific locations, not accidental duplicates.

## Safe change workflow

1. Inspect the current files and Git diff before editing.
2. Make a focused change in the directory responsible for it.
3. Preserve existing user-created files and tool-specific discovery paths.
4. Run `npm test`, `node bin/nexora.js --help`, and the relevant Python structural tests.
5. Run Markdown and docs asset checks when documentation changes.
6. Report exact checks and outcomes. Do not claim a tool adapter is supported without testing it in that tool.

## Documentation website

For the standalone documentation site, read [the docs maintenance guide](STRUCTURE.md). It covers local preview, asset responsibilities, responsive design, accessibility, and GitHub Pages deployment.
