---
name: validation
description: Implement reliable client-side and API-contract-aware validation for forms, files, settings, and user input with clear correction guidance.
---

# Validation Skill

## Goal
Prevent invalid or unsafe input early, provide understandable correction guidance, and keep rules consistent with the actual product and backend contract.

## Workflow
1. Inspect current forms, schemas, API contracts, database constraints, permissions and validation libraries.
2. Document fields, types, required/optional status, length/range/format constraints, cross-field rules, normalization and conditional requirements.
3. Distinguish client-side UX validation from authoritative server-side validation. Client checks never replace server validation or authorization.
4. Prefer shared schemas/types where supported without forcing unnecessary dependencies.
5. Validate on submit and, where appropriate, on blur; avoid noisy errors before users have had a fair chance to enter data.
6. Preserve valid user input after validation failures.
7. Test valid, invalid, boundary, empty, malformed, duplicate, stale and adversarial inputs.

## Standards
- Required: identify the missing field.
- Format: show expected format without repeating sensitive values.
- Length/range: use only limits defined by product/backend requirements.
- Cross-field: explain which values must agree.
- Uploads: verify actual configured type/size limits; do not trust filename or client MIME alone.
- API validation: map actual server field errors safely.
- Dates: validate real dates and meaningful ranges; avoid ambiguous parsing.
- Numbers: handle units, precision, min/max and integer expectations.
- Normalize strings only when semantically safe; do not silently alter passwords or meaningful whitespace.
- Prevent double submission while pending; use server-supported idempotency where appropriate.
- Never rely on client validation to protect business rules, authorization or the database.

## Message examples
- "Enter your work email address."
- "Enter a valid email address, such as name@example.com."
- "Password must meet the requirements shown above." Show the actual implemented policy.
- "Choose a start date that is on or before the end date."
- "Select a supported file format: PDF, PNG, or JPG." List only formats actually accepted.
- "This name is already in use. Try a different name." Use only when the API confirms a uniqueness conflict.
- "Some fields need your attention. Review the highlighted fields and try again."

## Accessibility and UX
Associate fields with labels, help text and errors using semantic markup/ARIA. Indicate errors with text as well as color. Focus the summary or first invalid field when useful. Announce dynamic errors accessibly. Avoid disruptive validation on every keystroke. Show pending/success/error states and preserve form data after failures unless security requirements demand otherwise.

## Required output
Report validation rules, source of truth, client/server responsibilities, message copy, accessibility behavior, boundary tests and contract gaps. Ask before modifying an existing backend.
