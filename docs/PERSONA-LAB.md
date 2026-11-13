# Nexora Persona Lab

**Status: IMPLEMENTED (bounded MVP).** Persona Lab is an optional local QA module within Nexora. It generates deterministic synthetic scenario profiles and can run a small cohort through read-only Playwright browser navigation.

## What the counts mean

**100 profiles != 100 real users != 100 LLM agents != 100 simultaneous browsers.**

Profiles are deterministic test scenarios, not recruited people, autonomous LLM agents or evidence of customer sentiment. Browser contexts are a separate execution count; workers are capped at 3 and contexts are processed in batches. k6 virtual users are separate HTTP traffic and do not run as part of Persona Lab.

## Prerequisites

- Node.js 22+
- Run commands from the target project after Nexora is installed.
- For `run`, install Playwright and Chromium in the target project:

```bash
npm install -D playwright
npx playwright install chromium
```

If Playwright is missing, the runner prints an installation error and exits non-zero.

## Plan only

macOS/Linux:

```bash
node qa/cli.js plan --url https://staging.example.com --personas 100
```

Windows PowerShell:

```powershell
node .\qa\cli.js plan --url https://staging.example.com --personas 100
```

This creates `personas.json` under `reports/qa/<timestamp>/`. It does not open a browser or send HTTP load traffic.

## Bounded browser run

macOS/Linux:

```bash
node qa/cli.js run --url https://staging.example.com --personas 100 --browser-personas 3 --workers 2 --max-pages 5
```

Windows PowerShell:

```powershell
node .\qa\cli.js run --url https://staging.example.com --personas 100 --browser-personas 3 --workers 2 --max-pages 5
```

Options:
- `--personas`: 1–10,000 generated profiles.
- `--browser-personas`: 1–100 browser contexts to execute.
- `--workers`: 1–3 concurrent workers (hard cap).
- `--max-pages`: 1–20 same-origin pages.
- `--seed`: deterministic generation seed.
- `--out`: explicit output directory.

The runner visits the target and discovered same-origin links, captures screenshots and records HTTP status, console errors, page errors and failed network requests. It does not click, fill, submit or mutate product state. A page load with a 2xx/3xx status is only a navigation check, not a complete functional assertion.

## Reports

Artifacts include `personas.json`, browser result data, `README.md` and an `evidence/` directory. Review the actual output and screenshots; do not infer that a journey passed if it was not executed or asserted.

## Limitations

- Not a real user study, customer panel or sentiment measurement.
- Not an autonomous LLM agent swarm.
- Not a general-purpose AI browser action executor.
- Not an HTTP load test, security penetration test or full accessibility audit.
- Authentication-specific journeys need approved test accounts and a separately implemented test flow.
- Use staging and sanitized data. Never test destructive or consequential flows with real customer accounts.

See [Commands](COMMANDS.md), [Architecture](ARCHITECTURE.md) and [Safety](SAFETY.md).
