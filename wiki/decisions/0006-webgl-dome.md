---
title: "0006: WebGL dome with a fisheye projection"
type: decision
decision_status: accepted
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brief/brief-dome-refinements-2026-10-05.md, raw/brief/brief-dome-grid-2026-10-05.md, raw/brief/brief-banner-and-physics-2026-10-05.md]
tags: [dome, webgl, three.js, rendering]
---

# 0006: WebGL dome with a fisheye projection

## Context

The owner wants cards that distort "as if painted onto the hemisphere"
([brief](../../raw/brief/brief-dome-refinements-2026-10-05.md)). CSS 3D can only place flat planes, and a flat
(rectilinear) camera makes peripheral cards look *bigger* than central ones — the opposite of a dome.

## Decision

- Render the dome with WebGL via **three.js 0.170** (ES module from jsDelivr through an import map; no build).
- **Posters are cells of a yaw × pitch grid on the sphere** (revised after the owner's grid brief,
  [raw](../../raw/brief/brief-dome-grid-2026-10-05.md)). Each poster is a 32×18-segment quad whose vertices are
  placed by yaw/pitch in the **vertex shader**, so its edges run along meridians and parallels, its shape is
  re-derived wherever it moves (e.g. when it rises on opening), and neighbouring cells cannot overlap.
  The first version used tangent planes, which baked each card's shape and let cards collide.
- **Physical scale** (owner: "as if the cards were 1.5 m from the head"; later "double the sphere diameter on
  desktop"): sphere radius `--dome-radius-m` **3 m on desktop, 1.5 m in VR mode** (the desktop wall is flatter and
  the 5×5 cluster fits the view without zooming out; 28 columns). The desktop view is `--dome-fov` 74° (VR 100°; 88°, then 80° before):
  a narrower view zooms in — cards ≈ 15% bigger with the same curvature (owner: "slightly bigger cards without
  changing the distortion diameter"),
  posters `--dome-card-width-m` 0.64 m with tight 0.03 m horizontal gaps (0.75 m / 12 columns in VR mode) and a
  0.02 m vertical gap between open rows (`--dome-row-gap-m`). The card width is the largest that keeps an even
  column count (14) with that gap, so banners still land every half turn (owner: bigger cards at the expense of
  gaps and margins).
  Angular sizes are arc lengths (angle = length / radius); the column pitch is (card + gap) / R and the ring fits
  2·⌊πR / (card + gap)⌋ = 14 columns (even: banners about every 180°; the pitch no longer snaps to 2π / columns, so the
  display-mode switch can glide the card size, see [0014](0014-gliding-display-mode-switch.md)). The viewport shows a
  virtual headset view of `--dome-fov` 100° horizontally; it zooms out only if the open cluster would not
  fit between the nav pill and the hint. (Replaces the earlier "fit the cluster" sizing.)
- Projection: r = tan(θ·s)/s, θ = angle from the gaze, s = `--dome-projection-strength` (0.5 ≈ stereographic).
  Grid lines bend with the dome; the periphery compresses instead of stretching.
- `projection.js` mirrors the shader in JS (hit-testing against grid cells, overlay placement, layout fit).
- **Only images go through WebGL.** The poster texture is the image itself (or the preview video), with
  rounded corners and the hover ring computed in the fragment shader.
- *(Since 2026-10-05 card UI can also be painted onto the sphere — see [0012](0012-warped-card-ui.md); flat mode below is
  `--dome-card-ui-warp: 0`.)*
- **Text and badges are flat DOM** (`VideoCardOverlay`: feature marks, duration, play affordance, info block),
  positioned each frame from the poster's projected corners — never warped. Each element is one flat plane
  turned parallel to the nearest edge chord of the curved poster (info and controls: bottom edge, offset by
  the edge's bulge; marks and banner title: top edge). On small posters the overlay
  shrinks uniformly (`--dome-reference-card-width`), so the image keeps priority.
- The overlay's button is also the card's accessible control (keyboard, screen readers, Vision Pro gaze);
  the focus ring is drawn on the curved poster.
- Rendering runs only while something moves (turn, activation, hover, parallax, preview).
- Layout fits the active 2/3/2 cluster between the measured bottom of the nav pill and the top of the hint.

## Consequences

- Cards are much larger at 16:9 (≈440 px wide at 1920×1080 vs ≈225 px in the CSS version); the open cluster
  fills the height from the feed tabs to the bottom edge (4 px margins, `--dome-safe-gap`, `--dome-safe-bottom`).
- Adds ~170 KB gzip of three.js from a CDN; poster images and preview clips must be CORS-enabled
  (picsum and MDN CC0 clips are; the Big Buck Bunny clip was dropped).
- Row pitch reserves room for an open card (raised poster + info), so open cards never cover neighbours.
- Supersedes the CSS-3D dome described in [0005](0005-spatial-homepage-layout.md) (layers and interaction unchanged).

## Related

- [0005-spatial-homepage-layout](0005-spatial-homepage-layout.md) · [performance-in-headsets](../concepts/performance-in-headsets.md) · [device-test-plan](../synthesis/device-test-plan.md)
