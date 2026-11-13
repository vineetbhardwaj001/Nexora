# Nexora safety and execution policy

## Installer

- Default installation adds missing managed files and preserves existing files.
- Use `--force` only after reviewing the target diff; conflicting files are backed up before replacement.
- Keep local default paths and credentials outside the repository.

## Persona Lab browser runner

- Accepts only absolute HTTP or HTTPS URLs and rejects embedded URL credentials.
- Discovers and visits same-origin links only.
- Bounds work to at most 100 browser persona contexts, 3 workers and 20 pages per run.
- Captures screenshots, HTTP status, console errors, page errors and failed requests.
- Does not click controls, fill forms, submit transactions, create/delete records or send external messages.
- Use a staging target with sanitized data. Do not infer authorization merely because a URL is reachable.

The current runner does not implement a general domain allowlist or authenticated test account workflow. Treat the supplied target as an explicit operator-selected target and verify ownership/authorization before running it.

## k6 load harness

The separate `load/k6-smoke.js` harness fails closed unless all required environment settings are present:

| Setting | Required behavior |
|---|---|
| `NEXORA_LOAD_AUTHORIZED` | Must equal `true` |
| `NEXORA_LOAD_ENV` | Must equal `staging` |
| `NEXORA_LOAD_URL` | Exact absolute target URL |
| `NEXORA_LOAD_HOST_ALLOWLIST` | Hostname must exactly match an allowlisted hostname |
| `NEXORA_LOAD_VUS` | Integer from 1 to 100 |
| `NEXORA_LOAD_DURATION_SECONDS` | Integer from 30 to 300 |

Remote targets must use HTTPS. Common public preview hosts are blocked by default. The script runs a read-only homepage GET, ramps virtual users and applies error/latency thresholds. Each virtual user sleeps between requests. It is a bounded smoke harness, not capacity certification.

The authorization environment variable is an operator assertion; it does not independently verify written approval. The operator must obtain permission from the staging owner and set conservative limits.

## Explicitly out of scope

The current browser runner must not be described as performing:
- payments or purchases
- booking or reservation creation
- emails, SMS or other external messages
- account creation or deletion
- destructive data changes
- production load testing

Any future state-changing executor requires explicit authorization, disposable fixtures, environment allowlisting, auditable assertions and an abort strategy.

## Reporting rules

- Distinguish generated profiles, browser contexts, actual HTTP virtual users and external simulation agents.
- A plan is not an execution.
- A page navigation is not an assertion that the full journey passed.
- A screenshot is evidence of a rendered state at a point in time, not proof of correctness.
- Report blocked, skipped, failed and unverified outcomes separately.
- Never claim tests passed unless the exact command ran and its output was observed.
