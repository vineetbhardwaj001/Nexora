# Nexora Persona Lab — Operator Guide

Persona Lab is Nexora's local, MiroFish-inspired QA runtime. It separates three different activities:

1. **Synthetic persona generation** — deterministic, diverse scenario profiles (up to 10,000) for planning and coverage.
2. **Real browser checks** — a small, bounded number of Playwright browser contexts navigate the actual target and capture screenshots, HTTP statuses, console errors and failed requests.
3. **HTTP load testing** — a separate k6 script, disabled unless the operator supplies explicit staging authorization, an exact host allowlist, VU ceiling and duration.

Persona profiles are not autonomous LLM agents or real people. Browser checks execute only the explicitly requested number of profiles in isolated contexts. The runtime intentionally avoids pretending that 100 profiles equal 100 concurrent users.

## Install into an existing product

From the Nexora repository, run PowerShell:

```powershell
node .\bin\nexora.js init --path "C:\New folder (4)\AVR-FRONTEND\AVR-FROTEND" --yes
```

The installer adds only missing files and skips existing files. Review skipped files before deciding whether to merge them manually. It does not replace existing project configuration.

Open the **AVR-FROTEND** folder itself in VS Code after installation. Do not keep the Nexora repository as the only workspace root.

## Generate 100 synthetic personas (planning only)

From the product folder:

```powershell
node .\qa\cli.js plan --url "https://your-preview-or-staging.example" --personas 100
```

This writes personas.json under reports/qa/<timestamp>/. It does not open a browser or send HTTP load traffic.

## Run bounded browser checks

Install Playwright in the product project only if it is not already installed:

```powershell
npm install -D playwright
npx playwright install chromium
```

Then run:

```powershell
node .\qa\cli.js run --url "https://your-preview-or-staging.example" --personas 100 --browser-personas 100 --workers 2 --max-pages 5
```

The default is 100 generated profiles, 3 executed browser personas and 2 browser workers. To execute all 100 profiles in separate browser contexts, use --browser-personas 100 --workers 2 --max-pages 5. Workers are capped at 3; browser contexts are opened in small batches rather than all at once. The runner performs read-only same-origin navigation and screenshots; it does not submit forms, create records, send messages, or trigger payments. Output includes personas.json, browser-results.json, README.md and evidence/.

If the target requires authentication, configure approved test accounts and add a project-specific authenticated test flow before claiming protected journeys were covered. Never put passwords or tokens in command-line arguments, committed files or reports.

## Optional k6 load test (separate and explicitly authorized)

Do not run this against production or a public Vercel preview. Use a dedicated staging hostname and written approval from its owner. Install k6 separately using its official Windows instructions.

PowerShell example (replace values only after approval):

```powershell
$env:NEXORA_LOAD_AUTHORIZED = "true"
$env:NEXORA_LOAD_ENV = "staging"
$env:NEXORA_LOAD_URL = "https://staging.example.com/"
$env:NEXORA_LOAD_HOST_ALLOWLIST = "staging.example.com"
$env:NEXORA_LOAD_VUS = "5"
$env:NEXORA_LOAD_DURATION_SECONDS = "30"
k6 run .\load\k6-smoke.js
```

The script fails closed unless the authorization flag is true, environment is staging, hostname exactly matches the allowlist, HTTPS is used for remote targets, VUs are 1–100, and duration is 30–300 seconds. It ramps gradually, uses a read-only homepage GET and has error/latency thresholds. Each VU sleeps for one second between requests, so the approximate request rate scales with the active VU count (about one homepage GET per VU per second; actual rate varies with response time). The operator must still approve the precise VU count, duration, expected request rate, test window and abort criteria. Start with 1–5 VUs; 100 VUs is not the default.

## Known MVP boundaries

- Persona generation is deterministic and rule-based, not a MiroFish social simulation or autonomous LLM swarm.
- The browser crawler checks accessible same-origin pages; it does not infer business workflows or safely submit forms automatically.
- It does not prove multi-tenant isolation, authorization correctness, accessibility conformance or real-user sentiment.
- Browser workers are deliberately capped at 3 for developer machines with modest RAM; 100 persona contexts can run sequentially in a small worker pool.
- MiroFish remains an optional, separately deployed AGPL-3.0 service. Nexora does not vendor its source or require its credentials.
- Never report synthetic persona count as browser-user count, human participants or HTTP VUs.
