---
title: Viewport and field of view
type: concept
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md]
tags: [vr, layout, viewport]
---

# Viewport and field of view

A headset browser window is a resizable panel floating ~1 m away. The edges of a wide panel are far
from the centre of vision, which costs neck rotation.

## Facts

- Quest Browser default panel **1280×670 px**, min 500×495, max 2000×1070; desktop mode by default,
  ignores `<meta viewport>`; mobile mode adds "Mobile VR" to the UA
  ([Meta browser specs](https://developers.meta.com/horizon/documentation/web/browser-specs/)).
  Older docs say 1000×625 default (contradiction — the browser-specs page is newer and preferred).
- Quest 2 devicePixelRatio 1.5 ([web.dev](https://web.dev/articles/pwas-on-oculus-2)); Quest 3 and Vision Pro unknown.
- Comfortable distance ~1 m (Meta, [display](https://developers.meta.com/horizon/design/display/)); ≥1 m (Apple HIG).
- Android XR keeps primary content within ~41° FOV
  ([Android XR](https://developer.android.com/design/ui/xr/guides/visual-design)).
- Avoid >45° neck rotation; resting gaze 10–20° below horizon
  ([Microsoft](https://learn.microsoft.com/windows/mixed-reality/comfort)).

## Implications for the prototype

- Fluid layout from **500 to 2000 px**; test at **1280×670** (the default Quest panel — note the short height).
- **Short viewport**: the hero must not eat the first screen; at 670 px height, the first row of videos
  should be visible without scrolling.
- Keep primary actions and the main content column **centred**, with a max content width (~1440 px);
  don't park key controls at far left/right edges.
- Sticky header stays compact (≤64 px tall in VR mode) to preserve vertical space.

## Related

- [hit-targets-and-spacing](hit-targets-and-spacing.md)
- [meta-quest-browser](../entities/meta-quest-browser.md)
