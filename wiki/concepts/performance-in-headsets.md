---
title: Performance in headset browsers
type: concept
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md]
tags: [vr, performance]
---

# Performance in headset browsers

Standalone headsets are mobile-class Android devices that also render the browser panel in 3D.

## Facts

- XR frame budgets: ~13.9 ms @72 Hz, 11.1 ms @90 Hz, 8.3 ms @120 Hz; app logic >2 ms is a red flag
  ([Meta perf](https://developers.meta.com/horizon/documentation/web/webxr-perf-workflow/)).
- Fixed foveation gains up to ~25% but degrades high-contrast text
  ([Meta FFR](https://developers.meta.com/horizon/documentation/web/webxr-ffr/)).
- For the 2D page (inference, general mobile-web practice): lazy-load thumbnails, responsive `srcset`,
  at most one concurrent video preview, avoid large `backdrop-filter` blurs and heavy shadow stacks.

## Implications for the prototype

- Budget: initial JS < 150 KB gzip; LCP image is the hero poster, preloaded; thumbnails `loading="lazy"` + AVIF/WebP.
- Glass effects (`backdrop-filter`) only on small elements (header, chips); replaced with solid fills in VR mode.
- Ambient glows as a pre-rendered image or a single CSS radial gradient, not stacked blurred layers.
- One hover preview video at a time, low bitrate, flat, muted; none in VR mode by default.
- Measure in the headset: Quest Browser remote debugging via `chrome://inspect`.

## Measured in the prototype (2026-10-05)

Main-thread profile of the dome at 1440×900 in Chromium. The pane was hidden, so CSS rendering and GPU
time were not measured. Numbers come from the build log ([log](../log.md), "Gallery performance").

- Frame logic and the three.js draw are cheap: about 1 ms each per frame while moving.
- The cost was image work. Every `<img>` was decoded synchronously inside the texture upload (≈5 ms
  each). A feed switch uploaded 285 posters, up to 168 in one frame, and one frame took 897 ms.
- Fixed culling (115° × 70°) drew about 300 posters per frame, about 4× more than the screen shows.
- After the changes (screen-based culling, `createImageBitmap` decoding off the main thread, at most
  3 texture uploads per frame), a feed switch uploads 110 posters in 34 ms total and the longest frame
  is 36 ms. About 110 posters are drawn on desktop and about 70 in VR, including one card of margin.
- MSAA is off: the shader already anti-aliases the edges. Readback found partial-alpha pixels at
  609 of 609 sampled edge crossings.

## Related

- [dark-theme-in-vr](dark-theme-in-vr.md)
- [0001-tech-stack](../decisions/0001-tech-stack.md)
