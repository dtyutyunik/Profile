# Dmitriy Tyutyunik — Portfolio World

A mobile-first interactive portfolio built as a miniature 3D world. The WebGL scene provides exploration and personality; all essential career, project, travel, publishing, navigation, and external-link content is also available in accessible DOM UI.

## Stack

React 18, Three.js, React Three Fiber, Drei, and Create React App 5.

## Local development

```bash
npm install
npm start
```

Run the automated checks with:

```bash
npm run test:ci
npm run build
```

The `portfolio-world-v1` branch is the redesign branch. Production remains on `master` until the redesign is intentionally merged/deployed.

## Experience architecture

- **Overview** — identity, career metrics, and quick navigation.
- **Career Cinema** — a skippable four-act career story.
- **Tinkerer Workshop** — interactive project exhibits plus a keyboard/touch accessible project dock.
- **Traveler Overlook** — travel experience as context for product and agent work.
- **Publisher House** — published catalog and author destinations.
- **3D world** — miniature island, landmarks, ambient agents, aircraft, and a journey vehicle.

The camera is destination-based rather than game-controlled. Mobile receives wider framing and reduced rendering density. `prefers-reduced-motion` disables ambient travel animation and shortens camera transitions.

## Content model

Career acts, world destinations, workshop projects, travel highlights, and published books are stored as structured data under `src/data`, keeping portfolio copy independent from the 3D implementation.

## Accessibility and resilience

Quick navigation and project selection do not depend on WebGL. Touch targets, focus-visible states, semantic regions, reduced-motion behavior, responsive overlays, metadata, canonical URL, and a WebGL fallback are included.
