---
title: Dark theme in VR
type: concept
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md, raw/brand/deovr-css-tokens-2026-10-05.txt]
tags: [vr, color, dark-mode]
---

# Dark theme in VR

Dark UI is the right default for a VR catalog (less light in the eyes, less flicker, content pops), but
headset displays punish extremes.

## Facts

- Avoid pure **#FFFFFF** and **#000000** — eye strain. Meta suggests text no brighter than **#DADADA** and
  backgrounds no darker than **#1A1A1A** ([Meta color](https://developers.meta.com/horizon/design/styles_color/)).
- On LCD Quest panels values below **~13/255** are barely distinguishable — subtle near-black gradients
  band or collapse ([Meta display](https://developers.meta.com/horizon/design/display/)).
- Brighter images flicker more, especially in the periphery; prefer darker colours off-centre
  ([Meta rendering](https://developers.meta.com/horizon/resources/bp-rendering/)).
- Avoid high-spatial-frequency patterns (fine stripes) and high-contrast flashing (same source).
- Dark mode should use slightly **less saturated** colours; headset displays can look more saturated —
  test on device ([Meta color](https://developers.meta.com/horizon/design/styles_color/)).
- Thin lines shimmer (unverified); use ≥1.5–2 px strokes in VR (inference).

## Tension with the brand

DeoVR's darkest neutrals are `#101419` and `#080a0c` ([tokens](../../raw/brand/deovr-css-tokens-2026-10-05.txt)),
both darker than Meta's #1A1A1A floor. Resolution: desktop may use the deep brand black; **VR comfort mode
lifts the canvas** and caps text brightness. See [0002-dark-theme-brand-tokens](../decisions/0002-dark-theme-brand-tokens.md).

## Implications for the prototype

- Elevation by lighter surfaces, not by shadows (shadows are invisible on near-black).
- Gradient glows: large, soft, low-opacity, static; start from ≥ canvas level so they don't band.
- Borders: 1 px at desktop, 1.5–2 px in VR mode, low-contrast.
- No pure white anywhere; in VR mode text-primary ≈ `#dadde2`.
- Thumbnails are the brightest things on screen — keep chrome around them calm and dark.

## Related

- [brand-identity](brand-identity.md)
- [motion-and-comfort](motion-and-comfort.md)
