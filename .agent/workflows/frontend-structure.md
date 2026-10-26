# Frontend Structure Guide

Inspect the current framework and conventions first. This is a starting pattern, not a mandatory template.

```text
frontend/
  public/
  src/
    app/                 # app bootstrap, router, providers
    assets/              # images, icons, fonts
    components/
      ui/                # shared buttons, inputs, badges
      layout/            # navbar, sidebar, page shell
      feedback/          # loaders, alerts, empty states
    features/
      auth/
        api/
        components/
        hooks/
        pages/
        schemas/
        types/
      dashboard/
        api/
        components/
        hooks/
        pages/
      <product-domain>/
        api/
        components/
        hooks/
        pages/
        schemas/
        types/
    hooks/
    lib/                 # api client, env, errors
    styles/              # tokens.css, global.css
    types/
    utils/
    test/
  .env.example
  package.json
```

## Rules
- Use real product domain names such as `organizations`, `voice-agents`, or `subscriptions` only if the product needs them.
- Route-level screens belong in feature `pages/`; reusable domain elements in `components/`; API calls in `api/`; shared UI primitives in `components/ui/`; shared navigation in `components/layout/`.
- Centralize design tokens in `styles/tokens.css`.
- Keep components focused so a single card, button, page section or navbar can be changed locally.
- Avoid one giant page component, duplicate API logic, generic `misc` folders, speculative modules and unnecessary abstractions.
- Small projects may use a simpler structure if responsibilities remain clear.
- Never move backend folders to fit this example.
- For a requested UI change, identify the owning component/token, change the smallest relevant file, check shared consumers and run relevant frontend checks.
