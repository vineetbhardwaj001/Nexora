---
name: backend-api-audit
description: Inspect a backend and document verified routes, request and response contracts, authentication, roles, data effects, and frontend integration gaps.
---

# Backend API Audit Skill

## Purpose
Use when asked to analyze backend APIs before frontend work, document API contracts, or run "/backendapi".

## Workflow
1. Inspect repository root, Git status, runtime, framework, route registration, middleware, controllers, services, schemas, and error handlers.
2. Find the final route path by tracing router mounts and prefixes. Do not infer paths from filenames.
3. For every endpoint, inspect the implementation chain and record method, final path, auth, role/permission checks, tenant scope, path/query/body fields, validation, status codes, response shape, errors, side effects, and evidence.
4. Inspect API docs and frontend API calls, then compare all three sources: implementation, documentation, and consumers.
5. Record WebSocket/realtime events separately, including verified event names and payload structures.
6. Identify documented-but-missing endpoints, undocumented implemented endpoints, mismatched frontend calls, and contracts that cannot be confirmed statically.
7. Check pagination, sorting, filtering, date/time formats, upload behavior, duplicate request protections, and rate limits only where supported by evidence.
8. Keep all secrets redacted and never make unauthorized production requests.
9. Do not change backend routes, schemas, auth, configuration, dependencies, or business logic during the audit.

## Output
Create API_CONTRACT_REFERENCE.md with:
- Module and purpose
- HTTP method and final path
- Authentication and authorization
- Tenant/resource ownership rules
- Parameters, headers, and request schema
- Validation rules
- Success response and status
- Error response shapes
- Database/external side effects
- Frontend consumer
- Evidence path and symbol/line range
- Verification status

Also create a screen/action-to-endpoint matrix and a prioritized integration-gap list. Clearly label assumptions and runtime-unverified behavior. Never fabricate request/response examples or claim tests passed when not run.
