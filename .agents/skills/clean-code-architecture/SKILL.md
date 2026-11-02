---
name: clean-code-architecture
description: Improve maintainability through evidence-based modular design, clear naming, separation of concerns, dependency boundaries, and safe incremental refactoring. Use when organizing folders, reducing coupling, splitting oversized modules, or improving code readability.
---

# Clean Code Architecture

## Purpose
Help developers produce maintainable, modular, understandable software without unnecessary abstraction or broad rewrites.

## Before changing code
1. Read repository instructions and inspect Git status.
2. Identify the actual language, framework, architecture, conventions, build and test commands.
3. Trace the target module's callers, dependencies, public interfaces and data flow.
4. Separate verified defects from style preferences.
5. Explain the smallest safe change that achieves the goal.

## Design principles
- Give each module a clear, cohesive responsibility.
- Keep business rules independent of UI and transport layers where the existing architecture permits.
- Keep presentation components focused; move reusable business logic into appropriate hooks, services or domain modules.
- Prefer explicit dependencies and stable interfaces over hidden global state.
- Group files by meaningful feature/domain when that improves discoverability; use shared folders only for genuinely shared code.
- Follow framework conventions rather than imposing a universal folder template.
- Use descriptive names that communicate purpose and domain language.
- Keep validation, error handling and side effects at clear boundaries.
- Avoid premature abstractions, speculative layers, excessive wrappers, giant index files and circular dependencies.
- Do not split files solely to meet an arbitrary line count.

## Safe refactoring
1. State the current behavior and expected behavior.
2. Search all imports, dynamic imports, route registrations, scripts, tests and deployment references.
3. Define the new module boundary and migration map.
4. Make one logical change at a time.
5. Preserve public APIs and data contracts unless explicitly approved.
6. Update focused tests and documentation.
7. Run relevant tests, type checks, lint and build commands that actually exist.
8. Inspect the final diff for unrelated changes.

## Naming and file boundaries
Follow ecosystem conventions. Examples include PascalCase for React components, camelCase for JavaScript functions, snake_case for Python modules and descriptive test names. Do not rename public endpoints, database fields, environment variables or exported interfaces casually.

## Beginner-friendly explanations
For significant changes explain:
- What the file/module does.
- Why the boundary exists.
- Which modules depend on it.
- Where a future change should be made.
- How to verify that change.

## Safety
Do not delete or move files without dependency analysis. Do not rewrite a working system merely to match a preferred template. Ask before destructive migrations, public contract changes or production operations. Never claim unrun checks passed.
