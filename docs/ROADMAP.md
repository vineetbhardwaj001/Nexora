# Nexora roadmap

Status is based on the current `main` branch inspected on 2026-11-13. Open pull requests are not merged functionality.

## Core toolkit

- [x] Installer CLI and managed file manifest — IMPLEMENTED.
- [x] Shared agent rules, skill registry and reusable skill packages — IMPLEMENTED.
- [x] Kilo command files and GitHub Copilot prompt assets — IMPLEMENTED.
- [ ] Expand compatibility matrix with tested IDE/tool versions — PLANNED.

## Persona Lab

- [x] Deterministic synthetic profile generation — IMPLEMENTED.
- [x] Bounded, read-only Playwright same-origin navigation — IMPLEMENTED.
- [x] Screenshot and console/page/network error collection — IMPLEMENTED.
- [ ] Improve journey-level assertions and coverage reporting — PLANNED.
- [ ] Add safe, opt-in authenticated staging fixtures — PLANNED.
- [ ] Add validated browser action executor for explicitly approved non-destructive interactions — PLANNED.

## AI planning and review

- [ ] Merge project-aware discovery and skill assignment from PR #6 — OPEN PR.
- [ ] Merge host-model decision request/validation workflow from stacked PR #7 — IN PR #6 FEATURE BRANCH, NOT MAIN.
- [ ] Add independent reviewer execution with separately recorded evidence — PLANNED.

## Evidence and integrations

- [ ] Add append-only evidence ledger linking each finding to its source artifact — PLANNED.
- [ ] Add optional MiroFish HTTP adapter after upstream API/version and AGPL implications review — PLANNED.
- [x] Keep k6 staging smoke harness separate and fail-closed — IMPLEMENTED.
- [ ] Expand load scenarios only with explicit authorization and abort controls — PLANNED.

## Release quality

- [ ] Add end-to-end install verification across supported operating systems.
- [ ] Add a full Markdown/HTML link checker.
- [ ] Publish release notes and compatibility evidence for each release.
