# Nexora — AI Engineering Agent

**From Idea to Production.**

Nexora is a cross-platform, skill-driven engineering agent starter for Kilo Code, Google Antigravity, and GitHub Copilot. It helps plan products, analyze UI references, build maintainable frontends, preserve existing backends, test features, review security, and prepare software for production.

## Core principles
- Inspect the existing project before editing.
- Ask one question at a time when a blocking decision is missing.
- Analyze each supplied UI reference image separately, then choose a product-specific design direction.
- If a backend already exists, backend files are read-only by default. Build frontend against real API contracts; never silently change routes, schemas, auth logic, or server configuration.
- Use meaningful, product-specific feature folders and reusable components.
- Never invent test results, API endpoints, user counts, or production readiness.
- Ask before destructive actions, production deployment, migrations, paid resources, secrets changes, or out-of-scope security/load tests.

## Quick start
1. Clone this repository.
2. Copy/merge `AGENTS.md`, `.agent/`, `.agents/`, `.kilo/`, `kilo.jsonc`, and `.github/` into your project root.
3. Back up conflicting files; merge instructions instead of blindly overwriting them.
4. Open the project in your coding tool and ask it to read `AGENTS.md`, `.agent/CORE.md`, and `.agent/workflows/setup.md`.
5. For an existing backend, start with `audit-project` and then use `frontend-only`.

## Main workflows
- `idea-to-plan`: turn an idea into an MVP, user journeys, page map and implementation plan.
- `audit-project`: inspect a repository and map its architecture.
- `design-ui`: analyze supplied design references and propose a coherent design system.
- `frontend-only`: create a frontend while protecting the backend.
- `test-security`: test only systems the user owns or is authorized to assess.
- `production-readiness`: prepare evidence-based release checks.

Command names are portable workflow names; invoke them through each IDE's supported prompt/skill mechanism. Native loading behavior differs by tool/version, so validate the adapters in your environment.

## Skills
See `.agents/skills/` and `.agent/config/skills.json`.

## Third-party skill repositories
Optional sources are cataloged in `.agent/repo-catalog.md`. Review each repository's current README, license, dependencies, and compatibility before installing or copying code. Nothing from those repositories is silently vendored here.

## Security
Never commit secrets, real credentials, production data, or private user data. Use `.env.example` for variable names and placeholders only. Keep authorized security testing scoped and rate-limited.

## Status
This is a starter configuration and workflow library, not a verified autonomous multi-agent runtime. Run the checks required by your actual project and IDE before relying on it.
