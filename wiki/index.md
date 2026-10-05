# Wiki index

Catalog of every wiki page. Updated on every ingest / decision. Start at [overview](overview.md).

## Overview
- [overview](overview.md) — project summary, status, reading order.

## Synthesis
- [vr-design-principles](synthesis/vr-design-principles.md) — 10-rule checklist + desktop vs headset table.
- [homepage-ux-brief](synthesis/homepage-ux-brief.md) — high-impact bets, page outline, card anatomy.
- [device-test-plan](synthesis/device-test-plan.md) — open questions to verify in a headset.
- [omnidirectional-navigation](synthesis/omnidirectional-navigation.md) — patterns for browsing the dome in all directions (decided → 0008).

## Decisions
- [0001-tech-stack](decisions/0001-tech-stack.md) — Next.js + TS + CSS Modules (superseded by 0004).
- [0002-dark-theme-brand-tokens](decisions/0002-dark-theme-brand-tokens.md) — first dark palette and contrast table (colours superseded by 0009).
- [0003-components-and-design-tokens](decisions/0003-components-and-design-tokens.md) — token layers, component layers, code rules (accepted).
- [0004-no-build-es-modules](decisions/0004-no-build-es-modules.md) — static HTML + ES modules + CSS, JSDoc types (accepted).
- [0005-spatial-homepage-layout](decisions/0005-spatial-homepage-layout.md) — room, shade, vignette, nav pill, dome gallery with 2/3/2 cluster, card content (accepted).
- [0006-webgl-dome](decisions/0006-webgl-dome.md) — three.js dome: posters on a sphere grid 1.5 m from the head, fisheye projection, flat DOM text parallel to poster edges (accepted).
- [0007-featured-banner](decisions/0007-featured-banner.md) — banner gallery in two cluster cells, crossfade, dot pagination (accepted).
- [0008-infinite-feed-and-joystick](decisions/0008-infinite-feed-and-joystick.md) — endless hex-lattice feed, rows flow vertically, joystick, drag anywhere, banner every 180° (accepted).
- [0009-player-style-theme](decisions/0009-player-style-theme.md) — graphite surfaces, flame accent, white tooltips, pill/circle shapes (accepted).
- [0010-feed-tabs-and-premium](decisions/0010-feed-tabs-and-premium.md) — For You / New / Trending with fly-out/fly-in, Get Premium button (accepted).
- [0011-cluster-3-4-3](decisions/0011-cluster-3-4-3.md) — open cluster 4/5/4 (token-switchable: 2/3/2, 3/4/3), banner centered in the top row (superseded by 0013).
- [0012-warped-card-ui](decisions/0012-warped-card-ui.md) — card UI painted onto the sphere with matrix3d (token-switchable back to flat planes) (accepted, experiment).
- [0013-aligned-grid](decisions/0013-aligned-grid.md) — aligned rows with a card at the center, 5×4 on desktop / 3×3 in VR, three-cell banner (accepted, experiment; supersedes 0011).
- [0014-gliding-display-mode-switch](decisions/0014-gliding-display-mode-switch.md) — desktop ↔ VR switch by gliding registered tokens; the dome and the chrome resize in place (accepted).
- [0015-video-player-from-poster](decisions/0015-video-player-from-poster.md) — the video grows out of its poster to the full viewport; chrome slides away; close button at the bottom center (accepted).

## Concepts
- [brand-identity](concepts/brand-identity.md) — recognition anchors and how to carry them to dark.
- [vr-input-models](concepts/vr-input-models.md) — ray, hands, gaze+pinch; hover is never required.
- [hit-targets-and-spacing](concepts/hit-targets-and-spacing.md) — 60 px primary targets, 16 px gaps in VR.
- [typography-and-legibility](concepts/typography-and-legibility.md) — Inter, size/weight floors, type scale.
- [viewport-and-field-of-view](concepts/viewport-and-field-of-view.md) — 1280×670 Quest panel, centred actions.
- [dark-theme-in-vr](concepts/dark-theme-in-vr.md) — no pure black/white, banding, flicker, saturation.
- [motion-and-comfort](concepts/motion-and-comfort.md) — motion only on user intent, reduced motion.
- [headset-detection](concepts/headset-detection.md) — WebXR check, UA hints, manual VR comfort mode.
- [immersive-video-entry](concepts/immersive-video-entry.md) — WebXR session, Layers, Vision Pro video, comfort.
- [vr-video-formats](concepts/vr-video-formats.md) — projection, stereo, resolution, FPS; badge set.
- [performance-in-headsets](concepts/performance-in-headsets.md) — frame budgets, page weight, blur limits.
- [xr-accessibility](concepts/xr-accessibility.md) — W3C XAUR requirements applied.

## Entities
- [deovr](entities/deovr.md) — the company / product.
- [meta-quest-browser](entities/meta-quest-browser.md) — primary headset browser.
- [apple-vision-pro-safari](entities/apple-vision-pro-safari.md) — secondary headset browser.
- [pico-browser](entities/pico-browser.md) — tertiary; under-researched.
- [webxr](entities/webxr.md) — the immersive web API.

## Sources
- [task-brief-2026-10-05](sources/task-brief-2026-10-05.md) — original assignment (+ code-quality addendum).
- [karpathy-llm-wiki](sources/karpathy-llm-wiki.md) — the documentation pattern.
- [deovr-homepage-2026-10-05](sources/deovr-homepage-2026-10-05.md) — baseline homepage structure.
- [deovr-brand-tokens-2026-10-05](sources/deovr-brand-tokens-2026-10-05.md) — production colors, font, logo.
- [deovr-logo-wh-color-2026-10-05](sources/deovr-logo-wh-color-2026-10-05.md) — official dark-background logo (color mark + white wordmark), used in the prototype.
- [vr-ux-research-2026-10-05](sources/vr-ux-research-2026-10-05.md) — VR UX research report.
- [brief-spatial-layout-2026-10-05](sources/brief-spatial-layout-2026-10-05.md) — owner's spatial layout + room image (+ follow-up briefs: refinements, grid, banner & physics, navigation & player style).

## Log
- [log](log.md) — append-only activity record.
