---
title: DeoVR logo, white wordmark + color mark (owner file)
type: source
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brand/deovr-logo-wh-color-2026-10-05.svg]
tags: [brand, logo]
---

# DeoVR logo, white wordmark + color mark

The official dark-background logo, supplied by the owner ("replace the logo with this one")
([raw](../../raw/brand/deovr-logo-wh-color-2026-10-05.svg)). It replaces the earlier production logo with a dark
wordmark ([logo-light](../../raw/brand/deovr-logo-light.svg)) and the soft mark
([mark](../../raw/brand/deovr-logo-mark.png)) in the prototype.

## Key facts

- Artwork 944 × 326. The **mark** is an embedded PNG (989 × 1313, shown cropped to 989 × 1119, transparent): a
  glossy chevron/play shape, coral → pink → violet → blue with bright rim lines — crisper than the earlier soft,
  out-of-focus mark. The **wordmark** "DeoVR" is a single white vector path.
- Proportions: mark 287.5 × 325.2; wordmark 597.3 × 144.0 starting at x 346.7, vertically centered on the mark →
  wordmark height ≈ 0.443 × mark height, gap ≈ 0.182 × mark height.
- The file is 658 KB because of the full-resolution embedded PNG.

## How the prototype uses it

- `assets/brand/deovr-mark.png`: the mark cropped as in the artwork and downscaled to 169 × 192 (≈ 50 KB); also the
  favicon. `src/components/logo/wordmark-path.js`: the wordmark path, colored by `currentColor`.
- `--logo-height` (the mark: 2.25rem desktop, 2.5rem VR) with `--logo-wordmark-ratio` 0.443 and
  `--logo-gap-ratio` 0.182 reproduce the artwork's lockup.

## Related

- [brand-identity](../concepts/brand-identity.md) · [deovr-brand-tokens-2026-10-05](deovr-brand-tokens-2026-10-05.md)
