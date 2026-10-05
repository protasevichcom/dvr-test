---
title: Omnidirectional navigation on the dome
type: synthesis
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md, raw/brief/brief-banner-and-physics-2026-10-05.md]
tags: [navigation, dome, interaction, vr]
---

# Omnidirectional navigation on the dome

Query from the owner (2026-10-05): how to replace the left/right arrows so the dome can be browsed in
every direction, and which established patterns exist.

> **Decided** in [0008](../decisions/0008-infinite-feed-and-joystick.md): joystick + drag in any direction + click to
> center; rows flow vertically (model B). Pattern 5 (orientation indicator) was rejected because the feed is
> endless — a full turn shows new content, so there is no fixed "where".

## Key insight: the grid is hexagonal

Rows offset by half a column form a hex lattice. The 2/3/2 cluster is exactly a cell plus its six hex
neighbours, so **any cell can be the center** and the cluster stays 2/3/2. Natural steps are six:
←, →, ↖, ↗, ↙, ↘. "Straight up" is two rows (↖ + ↗).

## Patterns

| # | Pattern | Where it is used | Fit for the dome |
|---|---|---|---|
| 1 | **Direct manipulation (grab and pan)** in 2D with inertia and snapping to the grid | Apple Watch honeycomb home screen (hex grid, fisheye edges, drag anywhere); visionOS pinch-and-drag; Google Maps | Best primary input; already works horizontally |
| 2 | **Content is the control**: tap/gaze-pinch a neighbouring card to bring it to the center | Apple Watch, visionOS galleries, Apple TV focus | Already works horizontally; extend to all six neighbours |
| 3 | **Directional pad / pan puck**: a 4- or 6-way control in one spot | YouTube 360 pan control, Street View, TV remotes | Direct replacement for the arrows; must keep 60 px targets in VR |
| 4 | **Spatial focus navigation** with arrows / thumbstick / D-pad: focus moves to the nearest card in that direction | Apple TV focus engine, W3C CSS Spatial Navigation, game consoles | Keyboard and controller path; also accessibility |
| 5 | **Orientation indicator / minimap** of the whole dome with the current view; click to jump | Street View compass, 360-video orientation discs, map overview | Shows "where am I" and fast long jumps |
| 6 | **Semantic zoom (overview)**: zoom out to see the whole sphere, pick a region, zoom back in | Apple Photos years → days, Apple Watch zoom | For long distances; heavier to build |
| 7 | Edge dwell / hot zones (scroll when the gaze or pointer rests at an edge) | Some early VR UIs | Not recommended: unintended motion ([motion-and-comfort](../concepts/motion-and-comfort.md)) |

## Comfort constraint for vertical movement

Looking up or down for long is tiring; keep the gaze within about ±20–30° vertically
([viewport-and-field-of-view](../concepts/viewport-and-field-of-view.md)). Two models:

- **A. Camera pitch:** the user looks up/down over a tall dome. Rows near the poles converge and need fewer
  columns, which breaks the hex lattice. Poor ergonomics.
- **B. Rows flow to the user (recommended):** horizontal = turning (yaw), vertical = rows scroll through the
  comfortable band like shelves, the dome keeps ~5 visible rows. Each row can be a shelf (For You, Trending,
  New, 180°, 360°, channels), which also answers the discovery brief.

## Recommendation (to discuss)

1. Primary: 2D drag with inertia, snapping to the hex grid; wheel/trackpad on both axes; thumbstick on both axes.
2. The six neighbours of the center act as navigation targets (hover/gaze shows a small direction chevron).
3. Replace the two arrows with one compact **6-way pan puck** below the cluster (≥ 60 px targets in VR),
   doubling as the orientation indicator.
4. Keyboard: arrows move focus spatially (←/→ within a row, ↑/↓ to the nearest card in the next row).
5. Vertical model B (rows flow), with a row label so the user knows which shelf is in the center.

## Related

- [0005-spatial-homepage-layout](../decisions/0005-spatial-homepage-layout.md) · [0006-webgl-dome](../decisions/0006-webgl-dome.md) · [vr-input-models](../concepts/vr-input-models.md) · [hit-targets-and-spacing](../concepts/hit-targets-and-spacing.md)
