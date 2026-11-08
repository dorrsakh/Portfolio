# Dorsa Khalili — The Workbench

A compact, interactive portfolio built with React, TypeScript, Vite, GSAP, and Lenis. The stack is a persistent Three.js keyboard with a staggered letter layout, a wide spacebar, and locally served brand logos. The reference keycap model and sounds are reused under MIT. Native projected buttons keep pointer, touch, focus, and physical shortcuts connected to the rendered keys. Reduced motion or unavailable WebGL keeps a static CSS keyboard.

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

- A first-paint keycap strip becomes a short DORSA opening sequence. Its two preparation milestones track fonts and scene/fallback readiness. It supports Enter/Escape, an immediate entry button, reduced motion, and a six-second deadline; hero motion starts after the opening finishes.

- Hover or focus a key for a short description; select it to highlight related work without moving cards. Workflow tools have no fabricated project associations.
- Physical shortcuts are printed on the keys. They only operate while the keyboard is visible, and ignore interactive elements, editing targets, modifiers, and open dialogs.
- Drag the keyboard with the mouse in the stack section to rotate it; the reset control restores its orientation. The stack framing is enlarged for clearer key logos.
- Space / Work and Enter / Contact keys navigate to their sections. The keyboard moves from the hero to the stack, rotates aside for work, and returns with floating caps beside contact.
- Press/release recordings play after a user gesture. An animated cursor follows pointer movement and changes over project previews.
- The header remains sticky, with GitHub, LinkedIn, Gmail, and Telegram icons available in both the hero and contact section.
- A letter-style contact form validates name and message, offers project/opportunity topics, and opens Gmail in a new tab with the recipient, subject, and message prefilled. A copy-draft control provides an alternative. It does not claim automatic delivery or require an email service credential.
- Project cards show actual posters and preview muted footage on pointer intent. Offscreen previews pause. Touch and reduced-motion users keep the same controls without hover playback.
- Native project dialogs provide video controls, captions, Escape dismissal, focus containment, and focus restoration.
- The scroll-drawn career trail follows a winding route between staggered role cards, with selectable context and a sticky chapter counter. Full details remain in the supplied résumé.
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
- **NLP Tools:** actual React/TypeScript frontend from `NLP-Project`, showing the sentiment and question-answering routes. The inference service is not included and no model output is simulated.
- **RTL Portfolio Study:** actual responsive HTML/CSS course project from `Personal-Website`, shown with its original Persian template content. Its sample identity and experience are not Dorsa’s biography.

The two additional captures, source commits, and scope notes are recorded in `public/media/additional-work-provenance.json`. Their original license notices are retained in `THIRD_PARTY_LICENSES/`. Missing-image projects and isolated tutorial snippets were not added to the main gallery.

The keyboard and scroll design are adapted from [Naresh Khatri’s portfolio](https://github.com/Naresh-Khatri/3d-portfolio), cloned at commit `19a1f148`. The original keycap GLB, press/release MP3s, and adapted Web Audio hook retain the MIT notice in `THIRD_PARTY_LICENSES/naresh-portfolio-LICENSE.txt`. `public/assets/keyboard/provenance.json` records sources and checksums. The scene, staggered layout, content, native control projection, and contact form are customized for Dorsa. Brand SVG sources are pinned in `public/logos/sources.json`; their license notices remain in `THIRD_PARTY_LICENSES/`. The previously adapted beUI marquee component and its license remain available in source but are no longer part of the homepage.

## Deployment

`npm run build` generates `dist/`, configured for static hosting at the domain root. The existing Vercel production deployment is [dorsakhalili.vercel.app](https://dorsakhalili.vercel.app/). The redesign is developed on a separate branch for review before merging to `main`.
