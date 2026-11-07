# Dorsa Khalili — Portfolio

A responsive portfolio built with React, TypeScript, Vite, Tailwind CSS, GSAP, Lenis, and a separately loaded Three.js hero.

## Development

```sh
npm ci
npm run dev
```

The default Vite preview is at `http://localhost:5173`. On hosts with limited file watchers, use `CHOKIDAR_USEPOLLING=true npm run dev -- --host 0.0.0.0`.

## Verification

```sh
npm run build
npm run lint
npx playwright install chromium
npm run test:e2e
```

`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` optionally selects an existing Chromium executable. Browser checks cover mobile navigation, keyboard chapters, modal focus restoration, video playback, media availability, responsive overflow, reduced motion, interactive filtering and calorie updates, keyboard curve controls, ambient-motion pause, sculpture selection, and serious/critical axe accessibility findings.

## Content

- `src/data/portfolio.ts`: project chapters, contributions, and résumé-backed experience.
- `src/components/CaseStudy.tsx`: Dreamaan case study and walkthrough.
- `src/components/InterfaceScene.tsx`: draggable Three.js sculpture with two forms, rotation buttons, offscreen pause, and a static reduced-motion fallback.
- `src/components/AmbientBackground.tsx`: page-wide pointer-reactive particle field with an explicit pause control.
- `src/components/ProjectPreviews.tsx`: working search/filter and calorie studies using labeled sample data.
- `src/components/InteractionLab.tsx`: draggable curve with a keyboard-accessible alternative.
- `src/components/MagneticLink.tsx`: restrained pointer feedback; disabled under reduced motion.
- `public/media/`: optimized screenshots, decorative artwork, and walkthrough.
- `public/Dorsa-Khalili-CV.pdf`: supplied résumé.

Dreamaan is the featured case study. Its unmerged Assets and Studio contributions are labeled in progress, link to their PRs, and distinguish Dorsa’s role from the team’s work. Media provenance is recorded alongside the exports. Game Hub and Calorie Tracker visuals are labeled interface studies; their descriptions are based on verified repository features.

The redesign retains the existing Dreamaan media. New login, dashboard, and generation recordings are deferred.

Scroll-linked image depth, divider reveals, text emphasis, and contact transitions use GSAP. Reduced-motion preferences disable decorative movement and keep all content accessible.

The portfolio has no Dreamaan API connection or credentials at runtime. All product media is static. Font licenses are included in `public/fonts/`.

## Deployment

`npm run build` produces `dist/`, ready for a static host at a domain root. The page uses anchor navigation and needs no application backend. The workspace preview runs on port 5173. No public deployment is configured by this change.

The technology strip uses the [beUI Marquee](https://beui.dev/components/motion/marquee), adapted for full-width tracks, keyboard pause, an explicit pause control, and reduced motion. Its MIT license is retained in `THIRD_PARTY_LICENSES/beui-LICENSE.txt`.
