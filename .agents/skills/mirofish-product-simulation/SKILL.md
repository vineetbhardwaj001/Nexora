---
name: mirofish-product-simulation
description: Integrate MiroFish as an optional multi-agent simulation layer for product research and synthetic persona hypothesis generation; never substitute simulation for real browser QA.
---

# MiroFish Product Simulation Adapter

## Verified upstream characteristics
Upstream: https://github.com/666ghj/MiroFish (AGPL-3.0).
The inspected upstream README describes a multi-agent prediction/simulation engine: seed materials are transformed into a graph/environment, agents simulate interactions, and a report agent generates predictions and supports deep interaction. It is not a browser automation or HTTP load-testing tool.

Repository layout observed: Python Flask backend under `backend/app`, API blueprints for graph/simulation/report, Vue 3 + Vite frontend in `frontend/`, Node root scripts, and `backend/run.py` as Flask app startup. README specifies Node.js 18+, Python 3.11–3.12 and uv; the example environment includes LLM API configuration and Zep Cloud key. Verify current upstream files before every setup/API integration because upstream can change.

## Integration rules
1. Keep MiroFish optional. Nexora QA must still run deterministic personas + browser tests if MiroFish is unavailable.
2. Never clone/copy MiroFish source into Nexora or vendor AGPL code without a deliberate licensing review. Prefer running a separate MiroFish service and integrating via its documented HTTP API; maintain clear service separation and notices.
3. Before calling the API, inspect the exact upstream API blueprint files `backend/app/api/graph.py`, `simulation.py`, `report.py`, service orchestration and data models. Derive exact paths, HTTP methods, request/response fields and state lifecycle from source. Never infer endpoints based only on frontend guesses.
4. Build a thin adapter with base URL from environment, strict timeout, bounded retries only for safe idempotent operations, structured errors, request IDs and redacted logs. Never log keys, uploads or user secrets.
5. Do not send customer PII, production database exports, auth tokens, session cookies or sensitive uploads as seed material. Use user-approved, minimal, sanitized product descriptions and synthetic journeys.
6. Configure explicit model, population/agent count, simulation rounds and spend limits only if supported by actual upstream schema. Fail closed if budget limits cannot be enforced.
7. Simulation results are hypotheses: likely friction, persona diversity, task alternatives and edge cases. They are not proof of real user sentiment, functional success, browser behavior, load or system throughput.
8. Save run metadata, model/config identifiers, seed summary, persona count, rounds, timestamps, errors and limitations. Sanitize output before writing reports.
9. Check upstream license (AGPL-3.0) and dependency implications before redistributing, modifying, embedding, or offering a network service based on MiroFish. For commercial deployment, get legal review; do not provide definitive legal interpretation.
10. Do not add hard runtime dependency on MiroFish to Nexora CLI. Make the service integration opt-in and document independent startup/configuration.

## Required validation
- Verify MiroFish health with its documented health route only after inspecting its actual implementation.
- Validate API compatibility against the current upstream source/version.
- Use a tiny synthetic seed and small simulation for integration smoke tests.
- Record actual run ID and observed results.
- If LLM/Zep credentials are not configured, mark simulation stage skipped and continue browser QA.
