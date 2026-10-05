---
title: "0012: Card UI painted onto the sphere (experiment, switchable)"
type: decision
decision_status: accepted
status: draft
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brief/brief-navigation-and-player-style-2026-10-05.md, raw/brief/brief-dome-grid-2026-10-05.md]
tags: [dome, overlay, warp, experiment]
---

# 0012: Card UI painted onto the sphere (experiment, switchable)

## Context

Earlier the owner asked for card text that is **not** distorted ([brief](../../raw/brief/brief-dome-grid-2026-10-05.md)), so card
UI became flat planes turned along the poster edges ([0006](0006-webgl-dome.md)). Now the owner wants to try the opposite:
the card UI distorted with the sphere. The nav pill, feed tabs and joystick stay flat (owner, same day).

## Decision

- Token `--dome-card-ui-warp`: `1` = warp (current), `0` = flat planes (previous behaviour). Both paths stay in the code.
- Warp keeps the UI as real DOM (accessible, selectable) and stretches each element with a projective transform:
  its four corners are placed in the poster's own px space and projected through the same sphere mapping as the
  image (`posterMap` in DomeGallery → `warpOntoPoster` / `quadToMatrix3d` in `src/lib/homography.js`).
  - Video cards: feature marks (top-left), engagement counts (bottom-left), duration (bottom-right), play (center),
    and the byline strip, which continues the poster downward as if printed on the sphere below it.
  - Banner: prev / next (side middles) and the dots (bottom center).
- Element sizes are measured once per content / poster width (no per-frame reflow); hit areas stay axis-aligned
  invisible buttons; warped buttons (banner arrows, dots) hit-test in their warped shape.

## Consequences

- Small elements follow the dome closely; text on peripheral cards is visibly stretched and slightly softer (it is
  rasterized under a 3D transform). Flat mode remains one token away.

## Related

- [0006-webgl-dome](0006-webgl-dome.md) · [0007-featured-banner](0007-featured-banner.md)
