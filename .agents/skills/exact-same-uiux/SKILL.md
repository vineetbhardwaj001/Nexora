---
name: exact-same-uiux
description: Recreate a supplied UI screenshot or design reference with high visual fidelity while preserving real functionality, responsive behavior, and accessibility.
---

# Exact-Same UI/UX Skill

## Purpose
Use this skill when the user requests an exact or near-exact recreation of a supplied screenshot, mockup, or existing page, for example: "make this UI exactly the same", "match this screenshot", or "/exactsameuiux".

## Non-negotiable workflow
1. Inspect the repository, framework, existing page, design tokens, assets, routes, and Git status before editing.
2. Inspect every supplied reference image independently. Identify the target screen, viewport, visual hierarchy, layout, spacing, typography, colors, borders, shadows, icons, imagery, and visible states.
3. Separate observable facts from estimates. Do not claim exact font names, pixel dimensions, colors, or behavior unless measured or directly supported.
4. Identify existing assets and reusable components before creating replacements. Preserve original text, labels, logos, and content unless the user asks to change them.
5. Build a reference specification before coding: viewport, page frame, grid, container widths, alignment, spacing scale, typography hierarchy, colors, radii, borders, shadows, component states, and responsive rules.
6. Implement the closest faithful match using the existing stack and conventions. Prefer the project's current styling approach; do not introduce a new UI library without a reason.
7. Compare the implementation with the reference at the same viewport. Inspect screenshots if the environment supports them. Fix the largest visual differences first, then refine smaller details.
8. Verify responsive behavior, keyboard focus, semantic structure, contrast, reduced-motion preferences, and loading/empty/error/success states without compromising the reference design.
9. Run available lint, type-check, test, and build commands when safe. Report the actual results.

## Visual fidelity checklist
- Overall composition, section order, alignment, and proportions
- Container width, margins, padding, and whitespace
- Font family when identifiable, size, weight, line-height, and letter spacing
- Background, surface, text, border, and accent colors
- Buttons, fields, cards, tabs, navigation, icons, and corner radii
- Image crop, aspect ratio, object positioning, and overlays
- Shadows, gradients, borders, and layering
- Hover, active, disabled, focus, loading, and error states when specified
- Desktop and mobile differences supported by references or requirements

## Guardrails
- "Exact" means high-fidelity to the supplied reference, not permission to copy unrelated proprietary assets or fabricate unavailable interactions.
- Do not replace real product content with generic lorem ipsum unless explicitly requested.
- Do not add gratuitous redesign, extra sections, gradients, animations, or components absent from the reference.
- A static screenshot cannot prove motion, responsive behavior, or interaction logic; mark these as assumptions until verified.
- Keep backend files read-only by default. If the page needs an unsupported API, report the gap rather than inventing an endpoint.
- Preserve unrelated user changes and inspect the final diff.

## Required final report
Summarize the reference interpretation, files changed, important visual decisions, known deviations from the reference, responsive/accessibility behavior, checks run with actual results, and remaining blockers.
