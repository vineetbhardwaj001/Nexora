Here is the result of "fetch" for the Page with URL https://app.notion.com/p/4125b5b00b048188b1e7d4057d84c5b3 as of 2026-11-09T13:16:33.620Z:
<page url="https://app.notion.com/p/4125b5b00b048188b1e7d4057d84c5b3" icon="🚀">
<ancestor-path></ancestor-path>
<properties>
{"title":"Nexora — Unified Engineering & Product QA Workflow"}
</properties>
<iconMetadata>{"type":"emoji","emoji":"🚀"}</iconMetadata>
<content>
## Purpose

Nexora now has one recommended Kilo Code entry point: <code>/nexora</code>. It routes each request to one focused workflow instead of launching every skill for every task.

## Single command

```txt
/nexora test https://staging.example.com
/nexora untangle src/
/nexora improve audit-only
```

- <b>test</b> — MiroFish-assisted persona hypothesis generation when the service is configured, followed by mandatory real-browser testing of the exact product URL. Keep simulated agents, executed browser personas, human participants and HTTP virtual users as separate counts.
- <b>untangle</b> — explicitly invokes Caldo AI's <code>untangle-codebase</code> skill. It first inventories hidden dependencies, needless coupling, surplus and special cases, then records a decision log before any refactor. It asks whether optional Comments and Tests work should be included; these are never silently assumed.
- <b>improve</b> — uses Nexora's scalable engineering workflow and the requested audit/architecture/fix mode.

## Installed sources

- Nexora repository: [https://github.com/vineetbhardwaj001/Nexora](https://github.com/vineetbhardwaj001/Nexora)
- Caldo upstream skill: [https://github.com/caldoai/skills](https://github.com/caldoai/skills)
- Upstream skill path: <code>skills/untangle-codebase/SKILL.md</code>
- Local copy: <code>.agents/skills/untangle-codebase/SKILL.md</code>
- Local upstream license: <code>.agents/skills/untangle-codebase/LICENSE</code>
- Attribution and license notes: <code>THIRD-PARTY-NOTICES.md</code>

The Caldo skill retains its upstream <code>disable-model-invocation: true</code> opt-in setting. Nexora only invokes it through the explicit untangle route. MIT license and upstream copyright notice are preserved.

## QA integrity and safety

- A browser test is only reported after the actual supplied URL is opened and the visible journey is executed.
- MiroFish synthetic simulations are hypotheses, not real browser sessions.
- A 100-user claim requires an executed, authorized 100-virtual-user HTTP load test.
- Load tests require explicit host, environment, VU cap, duration, ramp and abort thresholds; staging is the default.
- Never claim a tool, subagent, browser session, simulation or test ran without execution evidence.
- Preserve user changes and ask before destructive migrations, production operations, auth/security behavior changes or paid infrastructure.

## Repository implementation

The implementation is available for review on branch <code>feature/caldo-untangle-unified-command</code>. README, shared instructions, skill registry, installer manifest, tests and repository-structure documentation have been updated.

Pull request: [https://github.com/vineetbhardwaj001/Nexora/pull/3](https://github.com/vineetbhardwaj001/Nexora/pull/3)

## Verification status

This page documents the intended workflow. The new Kilo command has not yet been executed in the user's local VS Code/Kilo session, and no real product URL has been tested as part of this integration task. CI must be checked on the pull request before calling the integration verified.

## VS Code entry point — 8 November 2026

A matching VS Code / GitHub Copilot prompt is also included at <code>.github/prompts/nexora.prompt.md</code>. In compatible VS Code agent versions, use the <code>nexora</code> prompt; in Kilo Code, use <code>/nexora</code>. Both route to the same task-aware workflow.

The repository README and structure guide have been updated to document both entry points. Latest implementation PR: [Nexora #3](https://github.com/vineetbhardwaj001/Nexora/pull/3).

## CI verification update — 8 November 2026

GitHub Actions run #139 completed successfully on the latest PR commit: CLI installer tests, Markdown lint, Nexora structural tests, documentation asset validation, and agent configuration validation passed. Security run #139 also passed its secret-pattern and tracked-environment-file checks.

The PR remains open for review and merge. The local Kilo Code / VS Code command has not yet been executed in the user's environment, and no target product URL was tested during this repository integration.

## Prompt usage guide — 8 November 2026

The unified Nexora workflow is available in two editor entry points:

- <b>VS Code + GitHub Copilot:</b> open the Nexora repository, open Copilot Chat, select Agent mode, then choose the <code>nexora</code> prompt from the prompt picker. Source file: <code>.github/prompts/nexora.prompt.md</code>. If it does not appear, confirm the file exists and reload VS Code; discovery depends on the installed Copilot version.
- <b>Kilo Code:</b> open the repository and invoke <code>/nexora</code>.

The shared router is <code>.agents/skills/nexora-orchestrator/SKILL.md</code>. It chooses one workflow based on the request:

- <b>test</b> — product QA. Provide the exact URL and environment; real-browser evidence is required for claims about actual UI behavior. MiroFish simulation is optional and is not browser testing.
- <b>untangle</b> — explicitly loads Caldo's <code>untangle-codebase</code> skill; optional Comments and Tests work remains opt-in.
- <b>improve</b> — starts the scalable engineering workflow; use audit-only when you want a read-only review.

Three usage examples:

```txt
/nexora test https://staging.example.com
/nexora untangle src/
/nexora improve audit-only
```

Documentation updated on the PR branch: README prompt onboarding, the docs website guide, repository structure guide, and Caldo untangling guide. README keeps only these three unified-command usage examples.

---

## Nexora Persona Lab implementation update — 9 November 2026

This section extends the existing plan. Earlier sections are retained as historical planning and implementation notes; this update records what has since changed and what is newly proposed.

### 1. What was implemented since the earlier plan

The native Nexora Persona Lab runtime was merged into the <code>main</code> branch through [Pull Request #5](https://github.com/vineetbhardwaj001/Nexora/pull/5).

Implemented capabilities:

- Deterministic synthetic persona generation supporting up to 10,000 profiles.
- Playwright browser runner for up to 100 isolated persona contexts, processed through a bounded worker pool (maximum 3 workers).
- Same-origin, read-only browser navigation with screenshots, HTTP status, console/page errors and failed-request evidence.
- CLI planning and execution commands: <code>node bin/nexora.js qa plan|run</code>.
- Separate k6 read-only load-test harness with fail-closed staging authorization, exact hostname allowlist and bounded load settings.
- Installer/package integration, documentation and tests.
- Local per-user default project path configuration. A user can save a path with <code>init --save-default</code>; it is stored in the user's local Nexora config and is not committed to the public repository.

Merge details:

- PR: [Nexora #5 — Build native Nexora Persona Lab QA runtime](https://github.com/vineetbhardwaj001/Nexora/pull/5)
- Merge commit: <code>99184b935bb6a4ebd2cbbc419e852e2a8f075fb9</code>
- CI and security checks passed for the PR head commit.

### 2. Important distinction: current capability vs full vision

The current runtime generates synthetic profiles and runs scripted, read-only browser journeys. It does not yet provide 100 autonomous AI customers independently reasoning, choosing actions, making mistakes and writing experience-based reviews.

Keep these quantities separate in all reports:

- Synthetic persona profiles generated.
- AI agents actually invoked.
- Browser contexts or sessions actually executed.
- Human participants.
- HTTP virtual users used in a separately authorized load test.

Never describe synthetic profiles as real people or claim autonomous browser work without execution evidence.

### 3. New product direction — Universal Project-Aware Testing Skill

<b>Status: proposed architecture; not yet implemented or merged.</b>

The new idea is to expose Nexora through one simple command inside supported vibe-coding tools and coding agents. The skill should inspect the user's current project and dynamically design a relevant customer-testing campaign rather than forcing the same fixed personas onto every product.

Proposed high-level flow:

1. <b>Project intelligence:</b> inspect the codebase, framework, routes, screens, user roles, features and available workflows.
2. <b>Customer discovery:</b> infer likely customer/user segments from the product's actual purpose and visible functionality; label uncertain assumptions.
3. <b>Dynamic persona generation:</b> create project-specific synthetic customers with distinct goals, personality, nature, technical confidence, device preferences, interests/hobbies, patience and behaviour.
4. <b>Skill assignment:</b> select reusable testing abilities that match each persona and product. A skill is an ability/instruction package; a persona is a user identity/profile; an agent is the worker that executes a mission.
5. <b>Mission planning:</b> give each persona a realistic, bounded task and success criteria.
6. <b>Browser execution:</b> use Playwright to perform actual journeys in an authorized test environment, collecting screenshots, console errors, network failures and step-by-step evidence.
7. <b>Independent review:</b> have separate reviewers assess functionality, usability, accessibility and technical findings; verify reported defects against evidence.
8. <b>Reporting:</b> produce a consolidated report with persona context, mission outcome, reproducible steps, severity, evidence and recommendations.

Proposed command experience:

```txt
/nexora-test
```

The command is a target UX, not a claim that this command is already installed in every coding tool. Each supported agent/tool will need a compatible entry-point adapter connected to the shared Nexora core.

### 4. Proposed skill library and persona model

Do not create 100 fixed personalities and treat them as the skill library. Keep three separate layers:

- <b>Persona profiles:</b> who the simulated customer is.
- <b>Reusable skills:</b> what testing ability the customer/agent can apply.
- <b>Agent runtime:</b> who plans and executes the test mission.

Possible skill categories include:

- Discovery and navigation
- First-time user onboarding
- E-commerce product search, cart and checkout
- Appointment and booking workflows
- Form validation and error handling
- Mobile and responsive usability
- Accessibility and keyboard navigation
- Content clarity and trust signals
- Safe input/security checks
- Performance observation

A persona can use multiple compatible skills, and the same skill can be reused by many different personas. The system should generate only relevant personas and missions for the current project.

Example: an e-commerce project may produce a budget-conscious shopper, a careful buyer, an impatient mobile shopper and a beginner customer. An appointment platform may instead produce first-time patients, returning patients, reception staff and administrators. These are illustrative synthetic segments, not claims about a real user population.

### 5. Architecture proposal

```txt
Universal Skill / Tool Adapters
            |
      Nexora Orchestrator
            |
  Project Intelligence Agent
            |
    Customer Discovery
            |
   Dynamic Persona Engine
            |
       Skill Registry
            |
      Mission Planner
            |
   Browser Agent Runtime
       (Playwright)
            |
   Independent Reviewers
            |
       Report Engine

Separate: k6 Load-Test Harness
```

The existing Persona Lab runtime remains the execution foundation. The proposed intelligence/orchestration layer should extend it rather than replace working components.

### 6. Safety, reliability and implementation constraints

- Default to staging or an explicitly authorized test environment.
- Keep browser testing read-only unless a project-specific adapter, test account and explicit action permissions authorize state-changing workflows.
- Do not submit real payments, contact real customers or modify production records.
- Keep load testing separate from browser personas. Require explicit host authorization, exact allowlist, VU cap, duration, ramp and abort thresholds.
- Treat customer segments inferred from code as hypotheses; do not claim demographic or market research certainty.
- Never fabricate a completed journey, screenshot, browser session, review or defect.
- Authenticated workflows require project-specific test accounts/adapters; do not ask users to expose production secrets in prompts or reports.
- LLM-driven reasoning should be clearly distinguished from deterministic profile generation and scripted browser execution.
- Support multiple coding-agent entry points through adapters; do not assume one slash-command format works in every tool.

### 7. Roadmap

- [x] Merge the native Persona Lab runtime into <code>main</code> (PR #5).
- [x] Add deterministic synthetic personas and bounded Playwright execution.
- [x] Add separate guarded k6 harness.
- [x] Add local per-user default project path configuration.
- [ ] Design the universal project-aware skill and shared orchestration contract.
- [ ] Build project discovery and customer-segment hypothesis generation.
- [ ] Build dynamic persona profiles and compatibility-based skill assignment.
- [ ] Add mission planning and genuinely independent LLM-driven browser agents.
- [ ] Add independent evidence-based reviewer agents and report aggregation.
- [ ] Add and validate adapters for each supported coding tool.
- [ ] Test end-to-end on representative projects and document actual limitations.

### 8. Open architecture decision

Choose the reasoning model strategy before implementation:

- <b>Host-model-first:</b> use the coding agent's own model for discovery, persona reasoning and mission planning; Nexora supplies tools/runtime.
- <b>Provider-backed:</b> Nexora calls configured providers such as Gemini or Hugging Face for reasoning, with explicit free-tier/model constraints.
- <b>Hybrid:</b> prefer the host model when available and support an optional provider adapter as fallback.

This decision is unresolved. No model provider, cost or autonomous-agent capability should be described as implemented until it is built and tested.

### 9. Current project setup reminder

The user's AVR project path is configured through a local setup command, not hardcoded into the public Nexora repository. To save it on the user's machine, run:

```powershell
cd C:\Projects\Nexora
node .\bin\nexora.js init --path "C:\New folder (4)\AVR-FRONTEND\AVR-FROTEND" --yes --save-default
```

The local command must be executed by the user; this Notion update does not install Nexora into the local project.

---

## Repository implementation update — 9 November 2026 (PR #6)

The first project-aware Persona Lab layer has been added to the Nexora repository on feature branch <code>feature/project-aware-persona-engine</code>.

Pull request: [Nexora #6 — Add project-aware customer personas and 100-skill QA planning](https://github.com/vineetbhardwaj001/Nexora/pull/6)

### Added in this implementation

- Static project intelligence for framework hints, route-file hints, feature signals and product-domain hypotheses.
- Project-specific customer-segment hypotheses with confidence labels and evidence basis.
- A 100-item reusable QA skill catalog across discovery, onboarding, e-commerce, booking, forms, usability, mobile, accessibility, safe security checks and reliability.
- Dynamic synthetic persona planning with personality, decision style/nature, technical confidence, device/context, relevant interests, patience, goals and assigned skill IDs.
- CLI discovery command: <code>node qa/cli.js discover --project . --personas 8</code>.
- Planning outputs: project-analysis.json, customer-hypotheses.json, personas.json, skill-assignments.json and [mission-plan.md](http://mission-plan.md).
- New project-aware testing skill, Kilo command <code>/nexora-test</code>, compatible VS Code/Copilot prompt, installer registration, documentation and tests.

### Honest execution status

- The 100 entries are reusable skill definitions, not 100 running agents.
- The discovery CLI is static inspection and planning. It does not call an LLM, open a browser or execute product workflows.
- Customer segments are hypotheses, not real customer research or sentiment.
- All generated missions are marked <code>PLANNED_NOT_EXECUTED</code>.
- Real browser testing, autonomous model-driven actions and independent reviewer agents remain future implementation stages.
- CI status was not available from the GitHub workflow-status connector at the time of this update. No local test suite was executed in this integration session.
- PR #6 is open and has not been merged into main.

### Next implementation stages

1. Verify CI and fix any test/lint failures on PR #6.
2. Validate the discovery CLI locally on representative React, Next.js and non-JavaScript projects.
3. Add a structured mission executor that consumes persona/skill assignments and records evidence for each step.
4. Add optional host-model/provider adapters for reasoning, with explicit provider, privacy and cost controls.
5. Add real browser interaction for user-intent journeys, using authorized test accounts and safe fixtures.
6. Add genuinely independent reviewer-agent execution where the host supports it; otherwise label sequential review passes.
7. Add evidence-led report aggregation and status enforcement.
8. Validate command discovery and installation in supported coding-agent versions before advertising compatibility.

The full vision remains larger than this first PR. Do not describe autonomous AI customer testing as complete until those later stages are implemented and verified.

---

## Phase 4 implementation update — 9 November 2026

Phase 4 has started on a new feature branch stacked on Phase 3:

- Branch: <code>feature/ai-mission-decision-engine</code>
- Pull request: [Nexora #7 — Add host-model AI mission reasoning and decision validation](https://github.com/vineetbhardwaj001/Nexora/pull/7)
- PR #7 targets <code>feature/project-aware-persona-engine</code> because PR #6 is still open and has not yet merged to main.

### Architecture decision — resolved

Use the coding agent's own active model first (<code>host-agent-model</code>). Nexora provides the structured mission context, decision contract and validation layer. Gemini and Hugging Face adapters are optional future extensions; this phase does not call either provider or any external LLM API.

### Implemented in PR #7

- New <code>qa/mission-engine.js</code> to construct persona-specific reasoning requests, validate proposed next actions and create honest execution-record states.
- CLI <code>node qa/cli.js reason --report <discovery-dir> --persona <id> --url <verified-url></code> creates a structured decision-request JSON packet.
- CLI <code>node qa/cli.js validate-decision --file <decision.json></code> checks required fields, action types, URL protocol, optional origin allowlists and read-only safety rules.
- Proposed decisions remain <code>VALIDATED_PROPOSAL_NOT_EXECUTED</code>; no browser action or test pass is implied.
- Execution records require a real tool name, execution timestamp and evidence. Even then, the outcome remains <code>UNVERIFIED</code> until success criteria are asserted.
- Read-only by default; state-changing actions are blocked unless explicitly approved for staging with disposable data. Production mutations remain prohibited.
- Updated the project-aware skill, Kilo command, installer manifest, README and project-aware testing guide.
- Added tests for request construction, schema validation, URL allowlists, mutation blocking and evidence requirements.

### Verification status

- PR #7 is open and not merged.
- GitHub workflow runs and commit status checks were not returned by the connected GitHub status tools at the time of this update.
- The local test suite has not yet been run in a local checkout during this integration session.
- The host model is not invoked by the CLI itself: the coding agent must read the request packet and produce the JSON decision. Actual browser execution remains Phase 5.

### Remaining Phase 4 work

- Verify the new tests in GitHub Actions and fix any failures.
- Add stronger project-specific mission context and observed-state feedback between successive decisions.
- Validate host-model behavior in Kilo Code and VS Code/Copilot versions actually used.
- Add a durable, append-only decision/evidence ledger before moving to Phase 5 browser interaction.

Earlier plan and historical implementation notes are retained above; this section records the latest implementation state and the resolved host-model-first decision.
</content>
</page>