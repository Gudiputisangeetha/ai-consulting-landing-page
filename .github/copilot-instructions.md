Project: AI Consulting Landing Page (static single-page)

Summary
- Minimal static site with three primary files: `index.html`, `style.css`, and `script.js`.
- `README.md` contains an initial spec comment: a single-page AI consulting landing page (hero, services, why, contact form).
- No build system, no package.json, no tests present in repository root.

Big Picture / Architecture
- Purpose: a small, self-contained landing page. Keep changes lightweight and framework-free unless the user requests otherwise.
- File responsibilities:
  - `index.html`: document structure, semantic sections (hero, services, why, contact form).
  - `style.css`: all presentational rules. Scoped selectors are preferred to avoid global collisions.
  - `script.js`: unobtrusive client-side behavior (form handling, small interactions). Keep code simple and vanilla JS.
- Data flows: user -> DOM (form) -> optional API (not present). If adding an integration, create a small adapter module in `script.js` or a new file and document the endpoint in `README.md`.

Developer Workflows
- Local preview: open `index.html` in a browser for quick checks. For a local static server (recommended for relative path issues):
  - Python: `python -m http.server 8000` (run in project root)
  - Node: `npx serve .` (if Node installed)
- Debugging: use Browser DevTools (Console, Network, Elements). Edit `style.css`/`script.js` and refresh.
- Commits: keep changes small and focused. When adding a new UI section, update `index.html`, then add styles to `style.css`, and behaviors to `script.js`.

Project-Specific Conventions & Patterns
- Vanilla-first: prefer plain HTML/CSS/JS. Do not introduce build tools, bundlers, or frameworks without explicit instruction.
- Progressive enhancement: interactive features should degrade gracefully. Keep the contact form usable without JavaScript when possible (use `action`/`method` attributes or clearly document that an API will be used).
- Accessibility: use semantic HTML (header, main, section, footer), label form fields, and add ARIA attributes where necessary.
- CSS scope: prefer section-specific classes (e.g., `.hero`, `.services`, `.contact-form`) and avoid excessive global element selectors.
- JS structure: keep `script.js` small and modular. Example pattern used in this repo when adding behavior:
  - Wrap entry code in `document.addEventListener('DOMContentLoaded', () => { /* init */ })`.
  - Expose small helper functions for DOM updates and form validation.

Integration Points & External Dependencies
- There are no external services defined in the repo. If you add an external API, do the following:
  - Document the endpoint and expected request/response shape in `README.md`.
  - Add a small adapter function in `script.js` (or `api.js`) that centralizes fetch calls and error handling.
  - Keep secrets out of the repo. For server-side integrations, recommend the user store secrets in environment variables on the server.

Editing Guidelines & Examples
- Add a new section (example):
  1. Add semantic HTML to `index.html`:
     - `<section class="services" id="services">` with internal headings and list items.
  2. Add styles to `style.css` using `.services { ... }` and `.services .card { ... }`.
  3. Add interactive behavior (optional) to `script.js` inside `DOMContentLoaded`.

- Form changes (example):
  - Update HTML form markup in `index.html` and ensure `<label for>` is present.
  - Add client-side validation in `script.js` but do not remove server-side validation if an API is introduced later.

Merging policy for existing instruction files
- If a `.github/copilot-instructions.md` already exists, preserve any top-level SUMMARY/CONTEXT sections and merge new bullets under a `Project-Specific Notes` section. Do not delete historical rationale.

What not to change without asking
- Do not add heavy frameworks (React/Vue/Angular) or a build system.
- Do not move files into nested directories unless you update the README with run instructions.

If something is ambiguous
- Ask the human owner before introducing new infrastructure (servers, CI, package managers).

Next steps for contributors (quick checklist)
- Preview locally via static server.
- Add feature in `index.html` → style in `style.css` → behavior in `script.js`.
- Update `README.md` with any public API/endpoint or deployment notes.

If you need more context or want me to expand this file with examples/snippets, tell me which area to elaborate on.
