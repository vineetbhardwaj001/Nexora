# MiroFish Integration — Operator Guide

This note explains how to use the MiroFish-assisted single command safely. MiroFish is an **optional simulation service**, not the browser driver and not an HTTP load generator.

## Command

```text
/test-my-product https://your-preview-or-staging-url.example
```

Use a real URL and state whether it is local, preview, staging or production. Production testing is read-only/non-destructive by default.

## Architecture

```text
Kilo Code /test-my-product
        |
        v
Nexora QA Orchestrator
        |
        +--> Product discovery / route & role inventory
        |
        +--> Optional MiroFish (separate service)
        |       seed/context -> graph -> simulation -> report
        |       outputs: synthetic personas & hypotheses
        |
        +--> Real browser / Playwright
        |       open actual product -> click/type/navigate
        |       assertions -> screenshots / traces / logs
        |
        +--> Optional k6 / Locust
        |       authorized HTTP virtual-user traffic
        |
        v
Timestamped evidence-based QA report
```

MiroFish simulation outputs are hypotheses. They are not observed customer behavior, browser assertions or load results. Keep simulation-agent counts, executed browser personas, browser contexts and HTTP virtual users as separate metrics.

## MiroFish upstream setup (separate project)

Upstream repository: https://github.com/666ghj/MiroFish

The inspected upstream README describes these prerequisites:
- Node.js 18+
- Python 3.11 or 3.12
- `uv`
- LLM API key and compatible API base/model
- Zep Cloud API key

In the MiroFish clone, use its documented setup:
```powershell
Copy-Item .env.example .env
# Edit .env locally; never commit the keys
npm run setup:all
npm run dev
```

Its README advertises frontend `http://localhost:3000` and Flask backend `http://localhost:5001`. Verify both services are actually running before connecting. Do not expose the backend publicly without appropriate network controls.

MiroFish's current upstream source has Flask blueprints for `/api/graph`, `/api/simulation` and `/api/report`. Before wiring an HTTP adapter, inspect the exact handlers in `backend/app/api/graph.py`, `simulation.py`, and `report.py` for required multipart fields, JSON bodies, polling behavior and response fields. Do not guess request schemas.

## Current limitations

The PR adds the single Kilo command and integration instructions. It does not vendor MiroFish, deploy it, create provider credentials, implement and run a production-ready MiroFish HTTP client, or claim a completed simulation. Those require local service setup and API contract validation. If MiroFish is offline or credentials are absent, the command should continue with deterministic QA personas.

The browser tools available in a connected ChatGPT session may only allow reading open tabs; the Kilo/Playwright environment must supply actual browser control for click/type/screenshot/trace testing. Never call a page "browser-tested" unless those interactions occurred.

## License reminder

The inspected upstream repository declares AGPL-3.0. Keep MiroFish as a distinct service and obtain appropriate legal review before modifying, redistributing, embedding or offering a network service based on it. This guide is not a legal opinion.

## Load testing

MiroFish simulations are not load tests. For actual HTTP concurrency use k6 or the project's established load tool only after explicit approval of the exact staging hostname, maximum VUs, ramp-up, duration, rate and abort thresholds. Never default to sending 100+ requests/users to production.
