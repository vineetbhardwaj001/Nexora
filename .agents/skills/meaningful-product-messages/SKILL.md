---
name: meaningful-product-messages
description: Write consistent UI messages for validation, errors, success, loading, empty states, permissions, and destructive actions.
---

# Meaningful Product Messages Skill

## Voice
Use calm, respectful, plain language. State what happened and what the user can do next. Avoid blame, jargon, excessive exclamation marks, vague success claims and alarming language for routine errors.

## Message patterns
- Error: what failed + safe next step.
- Validation: what needs correction + expected format/rule.
- Success: what actually completed + relevant next step.
- Loading: what is happening, only when the wait needs explanation.
- Empty: why there is no content when known + useful next action.
- Permission: state access is unavailable without disclosing restricted resource details.
- Destructive confirmation: name the exact action and consequence, with a clear cancel option.
- Retry: offer only when retry is safe. Do not promise recovery or data preservation unless verified.

## Examples
- Success: "Changes saved." Only after confirmed success.
- Pending: "Saving changes…" only while the request is pending.
- Empty: "No projects yet. Create a project to get started."
- Search empty: "No results for “{query}”. Try a different search."
- Permission: "You don't have permission to manage billing."
- Validation: "Enter a name before continuing."
- Failure: "We couldn't save your changes. Try again."
- Destructive: "Delete “{name}”? This action can't be undone." Only if deletion is truly irreversible.

## Consistency and safety
Use the same wording for the same action across the product. Prefer active voice and short sentences. Avoid "Invalid input", raw HTTP errors, "Oops!!!", raw provider messages or exception text. Do not invent constraints, recovery options, success states or support IDs. Never include secrets, stack traces, internal hostnames, SQL or sensitive personal data in user-facing messages. Diagnostic detail belongs in protected logs. Copy alone is not error handling; implement and test the behavior too.
