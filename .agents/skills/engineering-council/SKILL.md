---
name: engineering-council
description: Run a phased, evidence-based multi-discipline engineering council review with adversarial design debate, up to 100 risk-based test scenarios, remediation planning, and founder/CEO/CTO reporting.
---

# Engineering Council — Whole-Project Review Skill

## Purpose
Use for requests such as `/engineeringcouncil`, 'full team project review', '100 test scenarios', or 'review my whole software like an experienced engineering team'.

This is an ANALYSIS → REVIEW → TEST → RECOMMEND workflow. It is not automatically permission to rewrite the product, change production systems, run destructive tests, or deploy.

## Honesty and simulation policy
- Simulate specialist reviewer perspectives; do not claim real engineers, customers, hackers, or 100 people were recruited.
- Do not invent quotes or claim a discussion occurred between autonomous agents unless the environment actually supports separate agents and their outputs are available.
- When using one model, label it a structured multi-perspective review, not independent consensus.
- Use '10+ years experience' only as a quality lens/persona framing, never as a claim about the model's real employment history.
- Distinguish static analysis, synthetic test scenarios, tests actually executed, load tests actually run, external penetration tests, and real-user research.
- A 100-scenario plan is not evidence that 100 tests passed. Report exact execution count and results.
- No production load, brute force, destructive fuzzing, data deletion, credential attacks, or live penetration testing without explicit scope and written authorization.
- Never expose secrets, personal data, tokens, or production customer records.

## Phase 0 — Scope and safety
1. Confirm repository root is accessible and inspect Git status, current branch, uncommitted changes, project instructions and environment.
2. Identify production versus local/test environment. Default to local, isolated, synthetic data.
3. Define protected paths, data, external services and prohibited actions.
4. Build a risk-based test boundary: read-only first; write operations only in disposable fixtures or an approved test environment.
5. If an operation could be destructive, costly, externally visible or affect real users, stop and request explicit approval.

## Phase 1 — Complete project intelligence
Read and follow the project-intelligence-audit skill. Inspect repository structure, actual stack, backend entry points, routes, controllers, services, middleware, frontend routes/pages/components/state/API clients, database schemas/relations/indexes/constraints/migrations, auth/RBAC/ABAC/tenant boundaries, jobs/queues/cache/realtime/storage/deployment/observability, docs/PRDs/API contracts/tests.
Trace key business flows end to end. Cite source paths, symbols and line ranges. Record inspected and uninspected areas and evidence status.

## Phase 2 — Specialist review board
Create separate written review perspectives. These are simulated roles unless actual subagents are available:
1. Founder / Product Strategist — user problem, differentiation, MVP scope and adoption assumptions.
2. CEO / Business Operator — operating model, cost, support burden, delivery risk and growth constraints.
3. CTO / Principal Architect — architecture, system boundaries, reliability and technical direction.
4. Product Manager — requirements, journeys, acceptance criteria and priorities.
5. UX Researcher / UI Designer — usability, information architecture, accessibility and interaction clarity.
6. Frontend Principal Engineer — rendering, state, routing, component boundaries, API usage and browser performance.
7. Backend Principal Engineer — API contracts, service boundaries, concurrency, idempotency and error handling.
8. Database Architect — data model, normalization, constraints, indexes, transactions and migrations.
9. Security Architect / Defensive Red Teamer — threat model, authZ, sessions, secrets and attack surfaces.
10. QA / SDET Lead — coverage, reproducibility, flaky tests and release gates.
11. Performance / SRE Engineer — latency, throughput, saturation, availability and resilience.
12. DevOps / Platform Engineer — environments, CI/CD, secrets, backups, rollback and infrastructure cost.
13. SEO / Discoverability Specialist — crawlability, indexation, metadata, canonical URLs, sitemap, robots, structured data and web performance where relevant.
14. Data Governance / Analytics Lead — data quality, lineage, retention, privacy, access, event definitions and auditability.
15. Privacy / Compliance Reviewer — minimization, consent, retention and applicable obligations; legal issues must be verified by qualified counsel.

For each perspective, state top concerns, evidence, verified defects versus risks, practical options, trade-offs, cost/effort and verification method. Do not force SEO analysis on private dashboards/APIs; mark not applicable with reason.

## Phase 3 — Structured engineering debate
For each high-priority issue, document: problem/evidence; reviewer A proposal; reviewer B challenge or counterexample; optional reviewer C perspective; rebuttal/revised options; decision criteria (correctness, security, reliability, maintainability, user impact, cost, reversibility); final recommendation; rejected alternatives; dissent and evidence still needed.
Do not manufacture consensus. Prefer the simplest safe solution that meets verified requirements.

## Phase 4 — Security, identity and authorization
Map authentication versus authorization, RBAC/ABAC, least privilege, tenant/resource scope, object-level access/IDOR, session/token lifecycle, refresh/revocation/expiry, account recovery, MFA if present, CSRF/CORS/XSS/injection/SSRF where relevant, rate limiting, audit logs, secrets, file uploads and external integrations.
Create a permissions matrix from code. Explicitly distinguish 'who are you?' from 'may you do this to this resource?'. Evaluate role escalation and cross-tenant access defensively.
Use local test accounts, synthetic fixtures and approved environments. Never attack real accounts or third-party infrastructure. Label findings confirmed, suspected or runtime-unverified.

## Phase 5 — Database and data-management council
Review entity boundaries, normalization trade-offs, keys/constraints, referential integrity, indexes, query plans when safe, N+1 patterns, transactions/isolation, race conditions, migration/rollback, retention/archive, PII classification, lineage, backups and restore tests.
For schema/index recommendations include migration risk, backfill, lock/downtime and rollback. Do not change schema in review phase.

## Phase 6 — Up to 100 scenario tests
Build up to 100 distinct, risk-based scenarios across relevant modules; use fewer if parts do not exist. Do not pad with duplicates.
Suggested allocation: 15 product/user journey; 15 frontend/browser/responsive/accessibility; 15 API/backend/contracts; 15 auth/authorization/tenant isolation; 15 database/integrity/concurrency/lifecycle; 10 performance/load/resilience; 5 SEO when applicable; 5 DevOps/deploy/backup/monitoring; 5 analytics/privacy/data governance.
Each scenario must include ID, category, actor/persona, business context, preconditions/fixtures, steps, expected result, risk/severity, test level, automation availability, safe environment, execution status (NOT RUN/PASSED/FAILED/BLOCKED/NOT APPLICABLE), and evidence/artifact.
Use varied synthetic personas: first-time, returning, admin, staff, unauthorized, cross-tenant actor, accessibility user, low-bandwidth, mobile, high-volume, concurrent user and support/operator. Do not call synthetic personas real people.
A 100-case plan is not 100 passing tests. Only report actual execution results.

## Phase 7 — Load, scale and failure analysis
Estimate capacity only from evidence. Analyze request paths, DB pools/queries, CPU/memory/network, caches, queues, external quotas, uploads, hot tenants/keys, concurrency, backpressure, timeouts, retry/circuit breakers, graceful degradation and observability.
Define load-test environment, traffic model, ramp, duration, concurrency, request mix, datasets, SLOs, stop conditions and cleanup. No production load testing without explicit written authorization. If no load runner exists, provide a plan, not fabricated results.

## Phase 8 — Real-world case studies and reference patterns
Use web research when external context materially helps. Prefer official documentation, advisories, standards, architecture papers and public postmortems.
For each example record source/date/context, problem or solution, lesson, applicability, what not to copy, and citation. Do not invent case studies. Separate repository evidence from external research.

## Phase 9 — Prioritized problem register
For each finding include ID, title, evidence, root/likely cause, user/business impact, security/data/reliability impact, severity (Critical/High/Medium/Low), confidence (Confirmed/Probable/Unverified), proposed fix, alternatives, effort estimate (S/M/L/XL), dependencies, owner role, acceptance criteria, verification tests and rollback/mitigation.
Use a transparent severity/likelihood/exposure method and explain scoring. Do not let a score replace judgment.

## Phase 10 — Founder, CEO and CTO synthesis
Give distinct perspectives: Founder (user problem, differentiation, trust, adoption, MVP); CEO (execution cost, operating risk, team/support); CTO (technical architecture, security, reliability, scale, data and sequencing).
Then recommend ONE direction: why best, now/defer/avoid, benefits, risks/trade-offs, estimates with assumptions, measurable success criteria and decision gates. Avoid generic motivational advice.

## Phase 11 — Team ownership and roadmap
Assign findings to responsible roles, not invented human names. Use a RACI-style table: Responsible, Accountable, Consulted, Informed.
Roadmap order: blockers/safety; foundation/architecture; core workflows; security/data integrity; performance/resilience; SEO/accessibility if relevant; observability/release readiness.
Every task needs dependencies, owner role, acceptance criteria, tests and rollback notes.

## Phase 12 — Final documentation package
Create `docs/engineering-council/` and write:
1. `00_EXECUTIVE_SUMMARY.md`
2. `01_PROJECT_INTELLIGENCE.md`
3. `02_ARCHITECTURE_AND_DATA_FLOW.md`
4. `03_API_AND_AUTHORIZATION_REVIEW.md`
5. `04_DATABASE_AND_DATA_GOVERNANCE.md`
6. `05_SECURITY_THREAT_MODEL.md`
7. `06_UX_SEO_ACCESSIBILITY_REVIEW.md`
8. `07_PERFORMANCE_AND_CAPACITY.md`
9. `08_100_SCENARIO_TEST_PLAN.md`
10. `09_TEST_EXECUTION_RESULTS.md`
11. `10_ENGINEERING_DEBATE_AND_DECISIONS.md`
12. `11_PROBLEM_REGISTER_AND_PRIORITIES.md`
13. `12_FOUNDER_CEO_CTO_RECOMMENDATION.md`
14. `13_TEAM_OWNERSHIP_AND_ROADMAP.md`
15. `AI_HANDOFF_CONTEXT.md`
Use professional report structure: title, version/date, scope, summary, methodology, assumptions, evidence, findings, recommendations, tables, diagrams, test results, appendices and glossary. Add Mermaid architecture, sequence, ER and decision diagrams where evidence supports them.

## Phase 13 — Quality gate
Verify findings have evidence or a hypothesis label; cases are unique; statuses are truthful; high/critical findings have mitigation and owner; one best recommendation is justified; dissent and uncertainty remain visible; no secrets/production personal data are present; no unapproved risky action occurred; Git diff shows no unapproved application edits. Run safe doc checks if available.

## Default behavior
On `/engineeringcouncil`, complete Phases 0–12 as analysis-first. Do not ask permission to read local files. Ask before third-party integrations/installations, destructive tests, production tests, schema changes or implementation.
If the repository is large, maintain a coverage ledger and continue module by module. State clearly when a report is partial.
After delivering reports, STOP. Do not implement fixes automatically. Wait for a separate implementation request.

## Completion message
Return audit coverage, inspected modules, scenarios designed, scenarios actually executed and pass/fail/blocked counts, critical/high findings, unresolved questions, documentation paths, one recommended next action, and a clear note that simulated review is not independent human review or a certified penetration test.
