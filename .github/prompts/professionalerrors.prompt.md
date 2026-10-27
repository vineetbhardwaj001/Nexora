---
description: Improve error handling across forms, APIs, async workflows, and user-facing failures.
---

Read and apply:
- `.agents/skills/error-handling/SKILL.md`
- `.agents/skills/meaningful-product-messages/SKILL.md`

Inspect actual API contracts and existing error conventions first. Centralize error normalization where appropriate, classify failures, preserve diagnostic causes securely, provide concise actionable user messages, prevent duplicate toasts/submissions, and retry only when safe and supported. Never expose stack traces, secrets, SQL, internal paths, or raw provider errors. Add tests for failure and recovery paths. Do not invent status codes, retry delays, request IDs, or guarantees.
