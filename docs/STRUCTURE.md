# Documentation Site Structure

This folder contains the Nexora marketing landing page and detailed user guide. The site uses plain HTML, CSS, and JavaScript so it can be previewed locally without installing a frontend framework or build tool.

## File map

```text
docs/
├── index.html
├── guide.html
├── STRUCTURE.md
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        └── docs.js
```

| File | Responsibility |
|---|---|
| `index.html` | Public marketing landing page, product positioning, feature sections, GitHub star calls to action, and links into the guide. |
| `guide.html` | Detailed documentation, quick-start steps, compatibility notes, examples, safety principles, FAQ, and roadmap. |
| `assets/css/styles.css` | Colors, typography, spacing, responsive layouts, light/dark themes, and component styling. |
| `assets/js/docs.js` | Search/filter behavior, mobile navigation, theme toggle, copy buttons, active-section navigation, and back-to-top control. |
| `STRUCTURE.md` | This maintenance guide. |

## Where to make a change

- **Change the marketing hero, benefits, call to action, or landing-page copy:** edit `index.html`.
- **Change the detailed setup guide, compatibility information, examples, or roadmap:** edit `guide.html`.
- **Change colors, layout, spacing, typography, animations, or responsive breakpoints:** edit `assets/css/styles.css`. Landing-page styles use the `lp-` class prefix.
- **Change theme, menu, copy-to-clipboard, scroll, or navigation interactions:** edit `assets/js/docs.js`. The script supports both the landing page and detailed guide.
- **Add a new navigation section:** add a section with a unique `id` to the HTML and a corresponding link in the sidebar navigation.
- **Add a new asset:** put it under the appropriate `assets/css/`, `assets/js/`, or a new clearly named folder such as `assets/images/`. Use paths relative to `docs/index.html`.

## Design and accessibility guidance

1. Keep the visual system consistent with the current cream, forest-green, and lime palette. Use CSS variables near the top of the stylesheet for shared colors.
2. Use semantic HTML landmarks and headings in a logical order.
3. Ensure navigation and controls have accessible names, visible focus styles, and keyboard support.
4. Keep the layout usable on narrow screens and respect `prefers-reduced-motion`.
5. Keep links descriptive. External links that open a new tab should use `rel="noreferrer"`.
6. Do not add confidential information, API keys, real patient records, or other private data to docs or examples.
7. Label roadmap items as planned. Do not imply a provider, coding tool, or feature is supported until it has been tested.

## Preview locally

From the repository root, open `docs/index.html` in a browser for the marketing homepage, or `docs/guide.html` for the detailed guide. No npm package publish is required. If you prefer a local HTTP server and Python is installed, run:

```bash
python -m http.server 8000 --directory docs
```

Then visit `http://localhost:8000`.

## Deployment

The workflow in `.github/workflows/docs-site.yml` validates and deploys the contents of `docs/` to GitHub Pages. The repository owner may need to enable GitHub Pages once in **Settings → Pages** and set the source to **GitHub Actions**. The website URL should only be treated as live after the deployment workflow succeeds.
