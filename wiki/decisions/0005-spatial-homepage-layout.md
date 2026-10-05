---
title: "0005: Spatial homepage — room, shade, nav pill, dome gallery"
type: decision
decision_status: accepted
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brief/brief-spatial-layout-2026-10-05.md, raw/room, raw/research/vr-ux-research-2026-10-05.md]
tags: [layout, homepage, dome, parallax, vr]
---

# 0005: Spatial homepage — room, shade, nav pill, dome gallery

The owner's layout for the homepage ([brief](../../raw/brief/brief-spatial-layout-2026-10-05.md)) and how it
is implemented. Replaces the scrolling page outline in [homepage-ux-brief](../synthesis/homepage-ux-brief.md).

## Layers

| # | Layer | Component | Key tokens |
|---|---|---|---|
| 1 | Room backdrop: `raw/room`, CSS `filter: blur()`, pointer parallax. Shown in VR comfort mode only; hidden on desktop (owner, 2026-10-05) | `RoomBackdrop` | `--scene-backdrop-opacity` (desktop 0, VR 1), `--scene-backdrop-blur`, `--scene-backdrop-overscan`, `--scene-parallax-backdrop` |
| 2 | Shade: even translucent black over the room (VR 0.35: the room shows through a little more) | `SceneShade` | `--scene-shade-opacity` |
| 2b | Screen vignette above the dome: circular, almost black at the edges | `ScreenVignette` | `--scene-vignette-*` |
| 3a | Nav pill above the gaze center: logo + icon items with tooltips (hover / gaze / focus), display-mode switch (monitor / VR headset, `IconToggleGroup`), profile, then a round Get Premium button at the far right; feed tabs under it. Flat: no tilt, no parallax (owner, 2026-10-05) | `NavPill`, `IconButton`, `Logo`, `SegmentedTabs` | `--nav-offset-top`, `--target-min` |
| 3b | Dome gallery: 16:9 cards on the inside of a sphere, 2/3/2 central cluster with details (WebGL, see [0006](0006-webgl-dome.md)) | `DomeGallery`, `VideoCardOverlay` | `--dome-*`, `--card-veil-ring-*`, `--motion-info*` |

## Dome geometry

> Rendering moved to WebGL with a fisheye projection — see [0006](0006-webgl-dome.md). The CSS-specific
> notes below (perspective, base-width scaling) are kept for history.

- Eye at the sphere center; CSS `perspective` = radius, so the card straight ahead is 1:1.
- Rows alternate a half-column offset (checkerboard) → the central cluster is 2/3/2 = 7 cards.
- 5 rows; 16 columns on desktop, 14 in VR comfort mode (bigger cards). The ring wraps, so paging is endless.
- Cards are authored at `--dome-card-base-width` and scaled as a whole object, so text and poster
  keep proportions at any viewport (like a panel at a distance in VR).
- The radius shrinks until the cluster (posters + info) fits between the nav pill and the hint.
- Catalog order = distance from the initial gaze: best matches start in the cluster.
- Cards are culled by the actual screen: its border is mapped back onto the sphere, plus `--dome-cull-margin` cells kept loaded ahead (replaced the fixed `--dome-cull-angle` / `--dome-cull-pitch`, which drew ~4× more posters than visible; see [performance](../concepts/performance-in-headsets.md)).

## Interaction

- Paging one column at a time: glass chevron buttons beside the cluster, ← → / PageUp / PageDown,
  wheel or trackpad, drag (mouse, controller ray, pinch) with snapping.
- Click a peripheral card → the dome turns to bring it into the cluster; click a cluster card → Play in VR.
- Activation (entering the cluster): the poster moves up and the info block slides out from under it,
  downward, while fading in; leaving reverses it. Peripheral cards are veiled (`--card-veil-ring-1/2`).
- Card content (owner, 2026-10-05): poster with Premium (crown) / Top Picks (flame) marks top-left, and a
  bottom row on the poster: engagement pill (views, likes, comments, filled icons; duration typography) on the left
  and the duration pill on the right. Under the poster only the byline as plain text, without a pill (avatar,
  channel, verified, short upload age "3w ago"; aligned with the engagement pill). The two rows were swapped on
  2026-10-05 (brief item 31); moving one row onto the poster
  freed height: cards grew ≈ 14% (center 344 → 393 px at 1920×1080). No title, no projection / resolution / FPS.
- Keyboard: only the cluster cards are in the tab order (roving focus); a live region announces the centered title.
- Hover/focus dwell on a cluster card plays a muted flat preview where available (desktop only).

## Deviation from the principles (conscious)

[Principle 6](../synthesis/vr-design-principles.md) says no parallax. The owner asked for pointer parallax
on the room. Mitigations: it is coupled to the user's own pointer (not autonomous motion), small
(1.375rem desktop, 0.625rem in VR mode), smoothed, and off under `prefers-reduced-motion`. The flat UI
(nav pill, feed tabs, joystick) never moves or tilts; only the room and, slightly, the dome follow the pointer. To validate on a headset ([device-test-plan](../synthesis/device-test-plan.md)).

## Open questions

- Should vertical paging (pitch) exist, or is the 5-row band enough?
- Hover preview clips are generic CC0 placeholders; real previews need per-video trailers.

## Related

- [0004-no-build-es-modules](0004-no-build-es-modules.md) · [motion-and-comfort](../concepts/motion-and-comfort.md) · [vr-input-models](../concepts/vr-input-models.md)
