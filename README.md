# Dorsa Khalili — The Workbench

A compact, interactive portfolio built with React, TypeScript, Vite, GSAP, and Lenis. The stack is a custom CSS 3D keyboard with locally served brand logos. All keys are native buttons; pointer, touch, focus, and physical shortcuts share the same selection state. No WebGL download or continuously running canvas is required.

## Development

```sh
npm ci
npm run dev
```

The preview runs at `http://localhost:5173`. On hosts with exhausted file watchers:

```sh
CHOKIDAR_USEPOLLING=true npm run dev -- --host 0.0.0.0
```

## Interaction

- Hover or focus a key for a short description; select it to highlight related work without moving cards. Workflow tools have no fabricated project associations.
- Physical shortcuts are printed on the keys. They only operate while the keyboard is visible, and ignore interactive elements, editing targets, modifiers, and open dialogs.
- Work and Contact keys navigate to the relevant sections.
- Project cards show actual posters and preview muted footage on pointer intent. Offscreen previews pause. Touch and reduced-motion users keep the same controls without hover playback.
- Native project dialogs provide video controls, captions, Escape dismissal, focus containment, and focus restoration.
- The compact career path reveals one short context line per role. Full details remain in the supplied résumé.
- Pointer lighting, key tilt, smooth scrolling, and GSAP scroll reveals respect reduced motion. Back to top appears after 400px.

## Verification

```sh
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` optionally selects an existing Chromium executable. Browser checks cover selection and project relationships, physical shortcuts, dialogs and focus restoration, all five Dreamaan scenes, real video and poster loading, career selection, mobile navigation, card alignment, responsive overflow, intent-based preview playback, and axe accessibility checks.

## Content and provenance

`src/data/workbench.ts` holds résumé-backed roles, project contributions, and stack associations. `public/Dorsa-Khalili-CV.pdf` is the supplied résumé. Local fonts and their licenses are in `public/fonts/`.

All project footage is static media; no Dreamaan credentials or runtime API connection ships with this portfolio.

- **Dreamaan:** current development preview at `fa24be25`, including redesign work in progress. Login still plus Home, project, organization, and Studio clips. Studio shows one real generation; failed jobs are hidden and the generation wait is shortened. Dorsa’s contribution is identified as part of a team project. See `public/media/dreamaan-tour-provenance.json`; earlier captured stills retain their original provenance.
- **Game Hub:** original application at `459731aa`. RAWG returned HTTP 522; the user-approved offline catalog uses cached real Steam metadata and artwork in the actual application. This limitation is disclosed in the project dialog. See `public/media/gamehub-provenance.json`.
- **Calorie Tracker:** unmodified source served locally, with demonstration meal and workout entries entered through the actual UI. The clip shows tracking, persistence after reload, and filtering. See `public/media/calorie-provenance.json`.

The keyboard concept was inspired by [Naresh Khatri’s portfolio](https://nareshkhatri.dev/). Its geometry, layout, styling, and interaction implementation here are original CSS/React; no upstream 3D models or code are bundled. Brand SVG sources are pinned in `public/logos/sources.json`; their license notices remain in `THIRD_PARTY_LICENSES/`. The previously adapted beUI marquee component and its license remain available in source but are no longer part of the homepage.

## Deployment

`npm run build` generates `dist/`, configured for static hosting at the domain root. The existing Vercel production deployment is [dorsakhalili.vercel.app](https://dorsakhalili.vercel.app/). The redesign is developed on a separate branch for review before merging to `main`.
