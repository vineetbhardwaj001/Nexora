---
name: untangle-codebase
description: Thoroughly map and redesign code structure to reduce hidden dependencies, needless coupling, special cases and dead code. Use only when the user explicitly requests a codebase untangling/refactor; invoke through the Nexora orchestrator's untangle mode.
disable-model-invocation: true
argument-hint: "[optional area or concern to focus on]"
---

Start a thorough refactor of this codebase and complete it to the end.

Treat this as a goal.

**Why do this at all?**

- **Better output:** agents write better code in a well-structured codebase.
- **Cheaper & faster changes:** agents spend fewer tokens searching and more on the problem.
- **Fewer silent breaks:** agents break less without noticing.
- **Faster debugging:** agents find root causes faster.

**1. Ask**

Besides untangling the codebase, there are two other things you may do:

| Addition | What it does |
| --- | --- |
| **Comments** | Remove comments that only restate the code. |
| **Tests** | Remove tests that wouldn't catch a real bug, and fix the ones that fail without one. |

List these (with their exact descriptions) for the user and ask which ones to do. Then do only those.

**2. List every problem**

Don't change anything yet.

Go through the codebase asking one thing: **should these pieces change together?** Write down every place the code gets the answer wrong, as in the decision log example. There are only three ways to get it wrong.

**Hidden links:** pieces that must change together, where the code doesn't show it.

- Copies of logic or values: change one and the others must change too, but nothing says so.
- A module that reads a global or file set by another module: change that module and this one breaks, but nothing shows it (self-contained code).
- A feature split across folders by layer, or related code in different folders: one change needs all of them, but the layout hides that (domain-driven code, colocation).
- A call order or convention callers just have to know: change it and callers break, but nothing warns them (explicit over implicit).

**Needless links:** pieces tied together that change for different reasons.

- Callers that depend on internals: the internals change for their own reasons, and the callers break anyway (encapsulation).
- Stable code that imports something more volatile: the stable code has to change whenever the volatile code does (dependency direction).
- A general function with a parameter only one workflow understands: the function has to change whenever that workflow does (caller vocabulary).
- A shallow module: its interface changes whenever its internals do, so its callers change with it (deep modules).

**Surplus:** pieces with no reason of their own to change.

- Wrappers: they only change when the thing they wrap does (pass-through wrappers).
- Extension points and config for things that never vary: nothing will ever change them (speculative generality).
- Dead code: nothing uses it, so nothing will ever need it to change (dead code).

Also write down every **special case**: code that exists for one situation instead of following from how the system works. Each one is a requirement the design never accounted for, so use them to work out what the system needs to be.

- An `if` for one value
- A parameter for a specific caller
- A swallowed exception
- A retry or sleep
- A disabled test

**3. Redesign from first principles**

Work out the fixes as if the system had known today's requirements from the start. Look for the one fix behind several problems, which often looks nothing like them. Don't fix special cases one by one.

Ask the same thing of every fix, even one that looks better in the code: pieces that change together end up together, pieces that don't aren't tied, and everything depends on what changes less.

Write each fix above the problems it solves in a decision log.

**4. Fix everything on the list**

Remove the special cases the redesign makes unnecessary, and keep the ones the system still needs. Don't go looking for unrelated bugs separately. A structural fix may fix some along the way, which is fine.

If the user chose Comments:

- Comments that restate the implementation, like `// sort first so the binary search works`, only change when it does, so they have no reason of their own to change. Remove them, even if they're phrased as a why.
- Comments about something outside the code, like `// the proxy drops websockets, so we poll`, change when that does, and the code can't show it. Keep them.
- Comments that explain a workaround on the codebase, like `// wait 100ms because the cache isn't ready yet`, only change when the problem behind the workaround does. They go when the redesign removes that problem.

If the user chose Tests, do this last, because tests are your regression safety net. A test should fail on a regression, and only then:

- Tests that repeat the implementation only change when it does, so they have no reason of their own to change. They check the same interpretation against itself, so remove them.
- Tests tied to internals break when the code changes but behavior doesn't, so they change for the wrong reason. Rewrite them to depend on behavior, which changes less.
- Tests that can't fail pass whatever the code does, so no change ever affects them. They aren't checking anything, so remove them.

**5. Check, and repeat until done**

Have available specialist/subagents search for special cases, hidden links, needless links and surplus. Do not claim independent subagents ran unless the tool actually created and executed them. If no subagent facility exists, perform independent review passes yourself and label them honestly.

Do not stop until there is nothing worth fixing left, within the agreed scope and safety boundaries.

You're done when:

- As few special cases are left in the system as possible.
- A typical change lands in one place.
- Every import is reasonable, and nothing imports anything more volatile than itself.
- Independent review passes have no remaining high-value structural findings.
- Intended behavior is the same as when you started, apart from bugs the refactor fixed. Test this at the end.

**Nexora safety and execution additions**

- First inspect Git status, branch, uncommitted work, project instructions, package scripts, tests and runtime constraints. Never overwrite user changes.
- Build a read-only inventory and decision log before editing. Include exact paths and line references.
- Preserve public APIs, persisted data, auth/security behavior and user-visible behavior unless explicitly approved.
- Never remove tests just because they are difficult, slow, flaky or currently failing. Demonstrate that a test is behaviorally vacuous or redundant and explain the regression risk before deletion.
- Never delete comments that document external contracts, security rationale, compliance, data formats, workarounds or non-obvious operational constraints.
- Ask before destructive migrations, public contract changes, auth changes, broad file moves, production operations, or any action outside the approved scope.
- Work incrementally; run focused tests after each structural slice and the full relevant suite at the end.
- If the repository is too large, stage the work by bounded domain and maintain a persistent decision log rather than silently skipping areas.
- Report unresolved findings instead of claiming perfection. Do not invent subagent execution.

## Output

Create or update a decision log with: finding, category (hidden link / needless link / surplus / special case), evidence, proposed redesign, affected paths, risk and verification.

Finish with a report containing scope, before/after architecture, files changed, behavior-preservation evidence, commands and actual test results, removed items with rationale, unresolved risks and recommended next steps.
