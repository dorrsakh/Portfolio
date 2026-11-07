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

`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` optionally selects an existing Chromium executable. Browser checks cover mobile navigation, keyboard chapters, modal focus restoration, video playback, media availability, responsive overflow, reduced motion, interactive filtering and calorie updates, ambient reduced-motion support, sculpture selection, and serious/critical axe accessibility findings.

## Content

- `src/data/portfolio.ts`: project chapters, contributions, and résumé-backed experience.
- `src/components/DreamaanTour.tsx`: selectable login still and short captioned product clips.
- `src/components/CaseStudy.tsx`: Dreamaan case study and walkthrough.
- `src/components/InterfaceScene.tsx`: draggable Three.js sculpture with two forms, rotation buttons, offscreen pause, and a static reduced-motion fallback.
- `src/components/AmbientBackground.tsx`: page-wide pointer-reactive particle field that respects reduced-motion preferences.
- `src/components/ProjectPreviews.tsx`: actual Game Hub footage and a working calorie study using labeled sample data.
- `src/components/BackToTop.tsx`: floating smooth return to the hero with reduced-motion and keyboard focus support.
- `src/components/CareerJourney.tsx`: visible career chapters, a sticky clickable timeline, scroll progress, and a Dreamaan case-study link.
- `src/components/SkillPlayground.tsx`: filterable visual toolkit with selectable symbols, an orbital detail view, and illustrative snippets.
- `src/components/MagneticLink.tsx`: restrained pointer feedback; disabled under reduced motion.
- `public/media/`: optimized screenshots, decorative artwork, and walkthrough.
- `public/Dorsa-Khalili-CV.pdf`: supplied résumé.

Dreamaan is the featured case study. Its unmerged Assets and Studio contributions are labeled in progress, link to their PRs, and distinguish Dorsa’s role from the team’s work. Media provenance is recorded alongside the exports. Game Hub uses actual browser footage of its source at commit `459731aa5de323b15b18f6298a3ee2bb6e402c3c`. RAWG returned HTTP 522 during capture, so the recording uses a clearly labeled offline catalog with real game metadata and artwork cached from Steam. Its UI and filtering, sorting, search, and theme controls run in the original app. See `public/media/gamehub-provenance.json`. Calorie Tracker remains a labeled interaction study.

The Dreamaan walkthrough now includes a login still and short actual Home, project, organization, and Studio clips from the current `fa24be25` development preview. Studio demonstrates one real Seedream 5 Pro generation (35 credits), with failed jobs filtered out and the 68-second generation wait shortened. No duplicate generation was submitted after a recording response timeout. New capture provenance is in `public/media/dreamaan-tour-provenance.json`. Earlier Assets/Elements stills remain documented in their original provenance file.

Scroll-linked image depth, divider reveals, text emphasis, and contact transitions use GSAP. Reduced-motion preferences disable decorative movement and keep all content accessible.

The portfolio has no Dreamaan API connection or credentials at runtime. All product media is static. Font licenses are included in `public/fonts/`.

## Deployment

`npm run build` produces `dist/`, ready for a static host at a domain root. The page uses anchor navigation and needs no application backend. The workspace preview runs on port 5173. No public deployment is configured by this change.

The technology strip uses the [beUI Marquee](https://beui.dev/components/motion/marquee), adapted for full-width tracks, keyboard pause, an explicit pause control, and reduced motion. Its MIT license is retained in `THIRD_PARTY_LICENSES/beui-LICENSE.txt`.

Toolkit brand SVGs are served locally from `public/logos/`. Pinned upstream sources are recorded in `public/logos/sources.json`; Devicon, TanStack Query, and Lobe Icons license notices are retained in `THIRD_PARTY_LICENSES/`. Logos identify their respective tools.

A floating back-to-top control appears after 400px of scrolling, uses smooth scrolling, and jumps instantly for reduced-motion preferences. Project cards share preview and copy rows to keep their headings, descriptions, and technology lists aligned.
