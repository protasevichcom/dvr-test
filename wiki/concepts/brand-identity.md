---
title: Brand identity in a dark theme
type: concept
status: draft
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brand/deovr-css-tokens-2026-10-05.txt, raw/brand/deovr-og-dark.png, raw/brand/deovr-logo-mark.png, raw/brand/deovr-logo-wh-color-2026-10-05.svg]
tags: [brand, color, typography, dark-mode]
---

# Brand identity in a dark theme

What makes DeoVR recognizable and how to carry it into a dark, premium UI without losing it.

## Recognition anchors (keep)

1. **The gradient mark** — a soft, out-of-focus chevron/play shape, coral → pink → violet → blue
   ([mark](../../raw/brand/deovr-logo-mark.png)). It is the strongest asset and was designed on black
   (see [OG image](../../raw/brand/deovr-og-dark.png)), so dark mode is the brand's native habitat.
2. **Bold white "DeoVR" wordmark** in a heavy grotesque, consistent with **Inter** used across the UI
   ([tokens](../../raw/brand/deovr-css-tokens-2026-10-05.txt)).
3. **Pink primary** `#ff5e99 / #fd4488 / #f2025a` and **blue** `#4f95ff` — the two poles of the mark's gradient.
4. **Feature gradients** (Interactive, Passthrough, Script, VR Cams) — reuse as badge / chip identities.

## How to translate to dark

- Background: near-black with a cool slate tint from the existing neutral scale (`#080a0c`, `#101419`,
  `#1d242e`) rather than pure `#000` — see [dark-theme-in-vr](dark-theme-in-vr.md) for headset reasons.
- Ambient light: large, very blurred radial glows in the mark's colors (as in the OG image) for hero areas
  — the "immersive" cue. Keep them low-contrast and static in headsets.
- Accent use: pink for the primary action ("Play in VR", premium), blue for links / focus / selection.
  Never put long text in pink or blue on dark without a contrast check.
- Wordmark: use a white version of the wordmark on dark (the production SVG has a dark wordmark —
  [logo](../../raw/brand/deovr-logo-light.svg)); the gradient mark stays unchanged.
- **Update 2026-10-05:** the owner supplied the official dark-background logo — glossy color mark + white
  wordmark ([source](../sources/deovr-logo-wh-color-2026-10-05.md)); the prototype now uses it.

> **Update 2026-10-05:** the UI accent moved to the player's flame orange-red and graphite surfaces
> ([0009](../decisions/0009-player-style-theme.md)); the gradient logo mark remains the brand anchor.

## Implications for the prototype

- Token proposal and contrast checks live in [0002-dark-theme-brand-tokens](../decisions/0002-dark-theme-brand-tokens.md).
- The gradient mark can double as a loading / "entering VR" transition motif (static or slow fade in headsets).

## Open questions

- ~~Is there an official white-wordmark / dark-background logo file?~~ Answered: yes, supplied by the owner
  ([source](../sources/deovr-logo-wh-color-2026-10-05.md)).
- Are the feature gradients still active product lines, or legacy?

## Related

- [deovr](../entities/deovr.md)
- [dark-theme-in-vr](dark-theme-in-vr.md)
