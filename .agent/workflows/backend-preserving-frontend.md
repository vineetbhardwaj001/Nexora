# Backend-Preserving Frontend Workflow

## Objective
Build a frontend for an existing backend without changing backend behavior. Frontend-only is the default unless the user explicitly authorizes a separate backend change.

## Protected by default
Server entry points, controllers/routes, services/business logic, auth/session/token logic, middleware, database schemas/models/migrations, jobs/queues/realtime handlers, server config, backend manifests and lockfiles. Do not edit, rename, delete, reformat, move, regenerate or overwrite these paths.

## Before editing
1. Inspect repository tree and Git status; preserve all existing user changes.
2. Identify frontend/backend boundaries and write the protected path list.
3. Inspect API methods, paths, request/response shapes, auth requirements, roles, pagination, error handling, uploads and realtime events without exposing secret values.
4. Record the map in `.agent/reports/frontend-backend-map.md`.
5. Analyze the product idea and every supplied design reference separately.
6. Map each page to supported APIs; flag missing capabilities rather than inventing endpoints.
7. Propose page map, design tokens, component plan and folder structure.

## Implementation
- Edit only approved frontend paths and agent reports.
- Use existing API contracts and auth mechanisms.
- Centralize API client/config; use frontend environment variables for base URLs and never expose secrets.
- Keep API calls in services/feature API modules, not presentation components.
- Include loading, empty, success, validation, unauthorized, forbidden, network and server error states where relevant.
- Do not silently use mock data as live data.
- Avoid modifying root manifests/lockfiles if they affect backend dependencies.
- If an API is missing, explain the blocker and ask before proposing backend work.

## Verification
- Run frontend lint/typecheck/tests/build using actual project scripts.
- Compare final Git diff to baseline.
- Verify protected backend paths are unchanged. If a protected file changes accidentally, stop and report it; do not automatically revert unknown user changes.
- Report changed files, tests and exact outcomes, API limitations, assumptions, and backend diff evidence.
