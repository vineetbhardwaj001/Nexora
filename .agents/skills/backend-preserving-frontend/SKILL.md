---
name: backend-preserving-frontend
description: Create a frontend for an existing backend without modifying backend routes, schemas, authentication, server configuration or backend dependencies.
---

# Backend-Preserving Frontend Skill

Default to frontend-only. Backend paths are read-only unless the user explicitly approves a separate backend change.

Before editing:
- Inspect repo tree and Git status.
- Map protected backend paths, API methods/routes, request/response contracts, authentication, roles, errors and realtime events.
- Do not expose secret values.
- Analyze the product idea and each UI reference image separately.
- Propose page map, design tokens, component plan and domain-specific frontend structure.

While implementing:
- Edit only approved frontend paths and agent reports.
- Use real existing endpoints; never invent backend routes or silently treat mock data as live.
- Centralize API client/config and feature API services.
- Keep pages/components/hooks/styles/types separated where useful.
- Include responsive and accessible UI plus loading/empty/error/success/auth states.
- If an API is missing, report the limitation and ask before backend changes.

After implementing:
- Run frontend-specific lint/typecheck/tests/build.
- Inspect the final Git diff and confirm protected backend files are unchanged.
- Report exact files changed, commands and actual results, API gaps and remaining risks.
