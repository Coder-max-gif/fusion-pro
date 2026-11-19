# FUSION AI — Website

A cinematic, single-page marketing site for FUSION AI, built from `FUSION_AI_REA_Claude_Website_Build_Prompt.md`.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Three.js via React Three Fiber · postprocessing (bloom) · Lenis (smooth scroll).

## The 3D scroll story

One persistent WebGL world sits behind the whole page. Every section is a camera "shot", and scrolling flies the camera between them:

| Chapter | What the camera does |
|---|---|
| 01 Origin (hero) | Flies in from deep space to the three 3D bots around the fusion core |
| 02 Platform | Orbits to reveal the three risk orbits (further from the core = higher risk) |
| 03 The minds | Pinned chapters: the camera locks onto SAFE, then CORE, then NOVA while their story scrubs in |
| 04–06 Plans · Compare · Journey | Pulls away to calm starfield, then dives into the asteroid corridor |
| 07 Technology | Hyperspace: star streaks at warp speed |
| 08 Risk | Arrives at a red "gravity well" (a black hole with an accretion disk) |
| 09 FAQ | Holds the gravity well in the corner of the frame |

The shot list lives in `components/world/shots.ts`. Any element with `data-shot="name"` is an anchor.

**Performance and fallbacks**

- The 3D bundle is lazy-loaded after first paint.
- Pixel ratio is capped, and phones get fewer stars and asteroids.
- The asteroids are a single instanced mesh.
- With reduced motion on, rendering is on demand, the camera cuts instead of flying, and smooth scroll is disabled.
- If WebGL is unavailable or the GPU context is lost, the page falls back to the 2D canvas and SVG bots.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Structure

| Path | Purpose |
|---|---|
| `lib/bots.ts` | **Single source of truth** for the SAFE/CORE/NOVA copy, ranges, risk levels and accent colours |
| `components/BotFigures.tsx` | The three original bot characters (SVG), with CSS idle animations and hover reactions |
| `components/world/Scene.tsx` | The WebGL world: nebula, stars, warp streaks, instanced asteroids, fusion core, gravity well, scroll-driven camera rig, bloom |
| `components/world/Bots3D.tsx` | The three 3D bots, with idle animation and a reaction when the camera focuses on them |
| `components/world/World.tsx` | Lazy loader with a WebGL check and the 2D fallback |
| `components/Minds.tsx` | The pinned "Meet the minds" chapters |
| `components/ScrubText.tsx`, `ChapterHUD.tsx`, `SmoothScroll.tsx` | Word-by-word scroll text, the chapter tracker, inertial scrolling |
| `components/SpaceCanvas.tsx` | 2D fallback starfield (also used on the legal pages) |
| `components/Hero.tsx` | Hero with an intro reveal and scroll-linked separation of the three bots |
| `components/Story.tsx` | Platform story with an orbit diagram (distance from the core = risk) |
| `components/BotsSection.tsx` | The three plan cards, the accessible `<dialog>` detail view and the risk meter |
| `components/Compare.tsx` | Comparison table on desktop, stacked cards on mobile |
| `components/HowItWorks.tsx` | Four-step conceptual journey with a progress line that draws as you scroll |
| `components/Technology.tsx` | Abstract data visualisation, labelled "not market data" |
| `components/Risk.tsx` | Prominent risk disclosure |
| `components/FAQ.tsx` | Accessible accordion |
| `app/privacy`, `app/terms` | Clearly marked **placeholder** legal pages |

## Visual-only / not connected

There is no backend, login, account, deposit, payment, broker connection or live trading, and nothing on the site pretends otherwise. Every chart and network graphic is an abstract animation and is labelled as such.

## Still needed from the owner before launch

- Legal entity name, registered address and operating jurisdiction (the footer shows `[Year] [Legal entity name]`)
- Business model (software, signals, managed accounts, other)
- Whether the target ranges are aspirational, modelled or verified, with evidence
- Pricing, account requirements, broker and onboarding details (intentionally absent)
- Approved Privacy Policy, Terms and final risk-disclosure wording (legal/compliance review)
- Official contact details and brand assets (the logo is an original placeholder mark)
- Technical documentation, if the Technology section is to say anything concrete
