---
title: Device test plan
type: synthesis
status: draft
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md]
tags: [vr, testing]
---

# Device test plan

Things the research could not settle; check them in a headset and file results back into the wiki
(log them as `build`).

| # | Question | Device | How | Updates page |
|---|---|---|---|---|
| T1 | What do `(hover)`, `(pointer)`, `(any-pointer)` return? | Quest 3, Vision Pro, Pico | Debug panel in the prototype prints `matchMedia` results | [vr-input-models](../concepts/vr-input-models.md) |
| T2 | Does the controller / hand ray trigger `:hover`? | Quest 3 | Visual check on cards | [vr-input-models](../concepts/vr-input-models.md) |
| T3 | `devicePixelRatio` and default `innerWidth/innerHeight` | Quest 3, Vision Pro | Debug panel | [viewport-and-field-of-view](../concepts/viewport-and-field-of-view.md) |
| T4 | Do near-black gradients and glows band? Saturation of pink/blue? | Quest 3 (LCD) | Token swatch page | [0002-dark-theme-brand-tokens](../decisions/0002-dark-theme-brand-tokens.md) |
| T5 | Are 60 px targets comfortable with hands at default panel distance? | Quest 3 | Tap-accuracy run on card actions | [hit-targets-and-spacing](../concepts/hit-targets-and-spacing.md) |
| T6 | Scroll behaviour of horizontal rails (thumbstick, pinch-drag) | Quest 3 | Manual | [vr-input-models](../concepts/vr-input-models.md) |
| T7 | `isSessionSupported('immersive-vr')` results | All + desktop Chrome | Debug panel | [headset-detection](../concepts/headset-detection.md) |
| T8 | Frame smoothness while turning the dome | Quest 3 | Remote DevTools performance trace | [performance-in-headsets](../concepts/performance-in-headsets.md) |
| T9 | WebGL dome: texture memory, legibility of rasterized card text, fisheye comfort | Quest 3, Vision Pro | Visual check + `chrome://inspect` memory | [0006-webgl-dome](../decisions/0006-webgl-dome.md) |

## Related

- [vr-design-principles](vr-design-principles.md)
