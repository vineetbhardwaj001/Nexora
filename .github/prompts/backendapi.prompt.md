---
description: Audit backend APIs and produce verified contracts for frontend integration.
---

Run `.agents/skills/backend-api-audit/SKILL.md`.

Inspect actual route registration, mounted prefixes, controllers, services, validation, auth/roles, tenant checks, database effects, response/error handlers, API docs, and frontend consumers. Produce API_CONTRACT_REFERENCE.md and a screen/action-to-endpoint matrix. Mark unverified behavior clearly. Do not invent endpoints or payloads, expose secrets, call production APIs without authorization, or modify backend code.

If the IDE cannot load the skill automatically, read its SKILL.md directly and follow it.
