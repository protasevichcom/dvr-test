---
title: Typography and legibility
type: concept
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md, raw/brand/deovr-css-tokens-2026-10-05.txt]
tags: [vr, typography, contrast]
---

# Typography and legibility

Text in a headset is rendered onto a virtual panel at ~1 m and resampled, so it needs to be bigger and
heavier than on a monitor.

## Guidance

- Minimum **14 px**, **≥18 px** for comfortable reading; high x-height sans-serif (Meta uses **Inter**);
  avoid Light/Thin weights; avoid italics in immersive contexts
  ([Meta typography](https://developers.meta.com/horizon/design/styles_typography/)).
- Android XR: 14 dp minimum, normal weight or heavier
  ([Android XR](https://developer.android.com/design/ui/xr/guides/visual-design)).
- Contrast: WCAG AA — 4.5:1 body, 3:1 large text and non-text UI
  ([Meta color](https://developers.meta.com/horizon/design/styles_color/)).
- No official XR guidance on line length (gap).
- **Inter is already DeoVR's UI font** ([tokens](../../raw/brand/deovr-css-tokens-2026-10-05.txt)) —
  brand and VR legibility align.

## Implications for the prototype

| Role | Desktop | VR comfort mode | Weight |
|---|---|---|---|
| Caption / meta (duration, views) | 13 px | 15 px | 500 |
| Body / card title | 15–16 px | 18 px | 500–600 |
| Section title | 22 px | 26 px | 700 |
| Hero title | 40–56 px | 44–56 px | 800 |

- Use `rem` everywhere; VR mode raises the root font size instead of overriding each rule.
- Minimum weight 400; titles 600+. No italics. Avoid text over busy thumbnails without a scrim.
- Truncate card titles to 2 lines; never shrink text to fit.

## Related

- [dark-theme-in-vr](dark-theme-in-vr.md)
- [0002-dark-theme-brand-tokens](../decisions/0002-dark-theme-brand-tokens.md)
