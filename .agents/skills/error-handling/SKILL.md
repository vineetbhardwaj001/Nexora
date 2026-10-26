---
name: error-handling
description: Design professional, secure, actionable error handling for APIs, forms, async workflows, and production systems.
---

# Error Handling Skill

## Goal
Make failures predictable, safe, observable, and understandable. Handle errors at the right boundary; never hide failures or show raw implementation details to end users.

## Workflow
1. Inspect framework, API contracts, error conventions, logging, and monitoring before changing code.
2. Classify failures: validation, authentication, authorization, not found, conflict, rate limit, network/offline, timeout, dependency unavailable, server/internal, cancellation, or unknown.
3. Choose recovery: correct a field, retry safely, refresh, sign in, contact support, or exit safely.
4. Centralize error normalization where appropriate. Avoid duplicated handlers and catch blocks that silently swallow exceptions.
5. Preserve diagnostic causes while exposing only safe user-facing messages.
6. Log structured metadata such as request/correlation ID, operation and error category. Never log passwords, tokens, cookies, API keys, payment data, or sensitive personal data.
7. Test failure and recovery paths.

## Message standards
Messages must be specific, actionable, honest, concise, contextual, and safe. Do not blame the user or expose stack traces, SQL, internal paths, secrets, raw provider payloads, or implementation details.

Examples:
- Network: "We couldn't connect. Check your connection and try again."
- Expired session: "Your session has expired. Sign in again to continue."
- Permission: "You don't have access to this action. Contact your administrator if you think this is a mistake."
- Conflict: "These changes are out of date. Refresh the page to review the latest version."
- Rate limit: "You've made requests too quickly. Wait a moment before trying again." Include retry timing only when known.
- Upload size: "This file is larger than the 10 MB limit. Choose a smaller file." State limits only when confirmed by configuration.
- Save failure: "We couldn't save your changes. Try again." Promise edits are preserved only if verified.
- Unknown: "We couldn't complete that action. Try again. If it continues, contact support with reference ID {requestId}." Use only when a real ID exists.

## Technical requirements
- Handle rejected promises and async failures at the correct boundary.
- Use typed errors or stable error codes where supported.
- Separate user-facing copy from diagnostic details.
- Never blindly retry non-idempotent actions. Retry only when safe, bounded and appropriate; respect Retry-After and use exponential backoff with jitter for transient failures where appropriate.
- Avoid duplicate toasts, repeated submissions and race conditions. Cancel or ignore stale requests when needed.
- Fail closed for security-sensitive operations.
- Never return stack traces or internal exception details to production clients.
- Make errors accessible: associate field errors with inputs, announce dynamic errors, and manage focus where appropriate.
- Follow actual contracts; never invent status codes, payload fields, retry timings or request IDs.

## Required output
Report error categories, message map, recovery behavior, logging/PII protections, retry policy, tests run and remaining risks.
