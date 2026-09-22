# Dmitriy Tyutyunik — Portfolio World

A miniature coastal world with four destinations: Career Cinema, Tinkerer Workshop, Traveler Overlook, and Publisher House. React 18, React Three Fiber, and Three.js.

## Run locally

```sh
cd client
npm ci
npm start
```

## Verify the production bundle

```sh
cd client
npm run test:ci -- --runInBand
npm run build
npm run dev
```

The production preview serves `build` on port 4173. `npm start` remains the normal live development server. The preview's `/__qa__?width=390&height=844` route embeds the real app in a phone-sized viewport; it is a development-server feature, not part of the deployed bundle.

## Scene architecture

- `src/world/diorama/geometry.js`: mesh baking, vertex-color batches, architectural helpers.
- `architecture.js`: custom authored facades, tiled roofs, glazing, signs, shop fittings, popcorn, and observatory details.
- `landscape.js`: triangulated terrain, geological strata, paths, cambered bridges, planting, harbor, and atmospheric ridgelines.
- `LivingWorld.js`: miniature agents, pickup, rowboat, balloon, water shader, and waterfall.
- `CameraRig.js`: responsive destination shots, damped movement, and camera-relative fog.
- `StaticWorld.js`: same-scene rendered fallback with interactive destination pins when WebGL is unavailable.
- `Diorama.css`: editorial interface and compact-screen layouts.

The scene uses local geometry and CanvasTexture signage. It does not fetch a remote HDR environment, models, or fonts. Repeated details are merged into material batches. Animation runs on a demand-rendered 30 Hz schedule, stops in hidden tabs, and respects pause and reduced motion. DPR is capped at 1.5. Destination transitions continue to invalidate while settling even when ambient animation is paused.

## Visual QA, September 2026

- Production build passes; application JavaScript is approximately 273 kB gzipped.
- Eight application interaction tests pass, including all destinations, project selection, career progression, Escape, and pause/resume state.
- Authored scene export: 49 mesh batches, 98,064 triangles; finite coordinates, matching vertex colors, and valid indices checked. This includes the offline sea representation and is a structural budget, not a measured GPU draw count.
- Scene composition was inspected with CPU renders of the actual authored meshes. Fallback views were compressed to WebP and included under `public/world-stills`.
- Desktop and phone browser checks exercise the illustrated fallback, content navigation, and responsive layouts. The available cloud browser disables WebGL, so live shader rendering, animation smoothness, context restoration, Safari behavior, and physical-phone GPU performance still need validation on a WebGL-capable device.
- The supplied resume grounds career copy and metrics: seven years at Fubo since July 2019, 60% less troubleshooting, three junior engineers mentored. The unsupported 85% figure was removed. The resume PDF and phone number are not included in the public source.

## Deployment

The live site is hosted on Surge. After updating `master`, build and publish from the client directory:

```sh
cd client
npm ci
npm run build
npx surge@latest ./build https://dmitriy-tyutyunik.com
```

## Impact and motion refinement

Overview highlights now link directly to the relevant career act or project. The career reel separates founder partnerships, production OpenAI classification, and custom MCP / Claude / Cursor tooling. Acts III and IV have no project CTA because these are work-based systems without public links. Internal project actions open a topic-specific email draft; ReliveInColor links to the live product. Travel content is personal and concrete, with a route into the travel tools.

The classifier's processing volume is not quantified: a hypothetical 1M-user base with a 10–15% issue rate is not evidence of actual tool throughput. Early-career figures (20% onboarding, 27% engagement, 15% click-through) come from the supplied resume.

Ambient motion now includes balloon drift, boat bobbing and drift, three animated agents, directional river highlights, descending waterfall streaks, and expanding splash rings. Clicking the balloon opens Traveler; the walking agent opens Workshop. Pause, reduced motion, and hidden-tab scheduling remain in place. Live WebGL animation still requires device validation; the no-WebGL fallback remains a still render.
