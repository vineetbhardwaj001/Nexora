# Caldo Codebase Untangling in Nexora

Nexora integrates Caldo AI's upstream `untangle-codebase` Agent Skill as an opt-in structural-refactoring workflow.

## Run it

In Kilo Code:

```text
/nexora untangle
/nexora untangle src/
```

The command routes to the Caldo skill. It does not run during ordinary product QA or general engineering tasks.

### Use through VS Code / GitHub Copilot

The unified prompt is also available to Copilot in compatible VS Code versions:

1. Open the Nexora repository in VS Code.
2. Open GitHub Copilot Chat and select **Agent** mode.
3. Choose **nexora** from the prompt picker. Its source is `.github/prompts/nexora.prompt.md`.
4. Ask for a codebase untangling task. The shared router selects the Caldo workflow only when the request is about untangling/refactoring.

If the prompt is not visible, confirm that the prompt file exists and reload VS Code. Prompt-file discovery depends on the installed Copilot version. In Kilo Code, continue to use the native `/nexora` command.

## What it examines

- **Hidden links:** modules or values that must change together but are not represented by the code structure.
- **Needless links:** callers coupled to implementation details or stable modules depending on volatile ones.
- **Surplus:** pass-through wrappers, speculative extension points and genuinely unused code.
- **Special cases:** one-off branches, swallowed exceptions, retries/sleeps and disabled tests that reveal missing design concepts.

The skill first inventories the codebase and creates a decision log. It then redesigns from first principles, applies the agreed changes incrementally, and verifies behavior.

## Optional additions require user choice

Before editing, the skill lists these additions and asks which to include:

| Addition | Exact meaning |
|---|---|
| Comments | Remove comments that only restate the code. |
| Tests | Remove tests that wouldn't catch a real bug, and fix the ones that fail without one. |

Neither addition is automatic. Nexora adds extra safeguards: do not delete tests merely because they fail, are slow or are difficult; prove they are behaviorally vacuous or redundant and explain the risk. Preserve comments documenting external contracts, security rationale and operational constraints.

## Safety and completion

- Inspect branch, working tree and user changes before editing.
- Inventory and record findings before refactoring.
- Preserve public APIs, data formats, authorization and behavior unless approved.
- Ask before destructive migrations, broad file moves, auth changes or production operations.
- Run focused checks after each slice and relevant full checks at the end.
- Report commands actually run, evidence, unresolved risks and any remaining structural findings.
- Never claim independent subagents ran unless they were actually created and executed.

## Upstream attribution

- Project: https://github.com/caldoai/skills
- Skill: https://github.com/caldoai/skills/tree/main/skills/untangle-codebase
- License: MIT; see [the preserved upstream license](../.agents/skills/untangle-codebase/LICENSE).
- Local skill: [`SKILL.md`](../.agents/skills/untangle-codebase/SKILL.md)
- Attribution: [`THIRD-PARTY-NOTICES.md`](../THIRD-PARTY-NOTICES.md)

The upstream skill's `disable-model-invocation: true` setting is preserved. Invoke through the explicit `/nexora untangle` route.
