---
title: Hit targets and spacing
type: concept
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md]
tags: [vr, input, layout, sizing]
---

# Hit targets and spacing

Ray and hand input are much less precise than a mouse, so targets and gaps must be large.

## Platform guidance

| Platform | Minimum target | Spacing | Source |
|---|---|---|---|
| Meta Horizon | 48×48 dp comfortable; **60×60 dp for all primary controls** (hands) | Hit slops must not overlap | [Meta](https://developers.meta.com/horizon/design/styles_inputs_hit_targets/) |
| Apple visionOS | **60×60 pt** hit region | Centres ≥60 pt apart, or ≥16 pt margin; 4 pt padding around buttons | [HIG Buttons](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/buttons.json) |
| Android XR | 56×56 dp, icons 48×48 dp | ≥8 dp between targets | [Android XR](https://developer.android.com/design/ui/xr/guides/visual-design) |

A visionOS point is angular (≈2.5° / 4.4 cm at 1 m for 60 pt — unverified) — sizes scale with distance.

## Implications for the prototype

Design tokens (CSS px):

| Token | Desktop | VR comfort mode |
|---|---|---|
| `--target-min` (icon buttons, chips) | 44 | **60** |
| `--target-primary` (Play in VR, main CTA) | 48 | **64** |
| `--target-gap` | 8 | **16** |

- Small visual icons get invisible hit slop (padding or `::before` overlay) up to `--target-min`, never overlapping.
- Whole video card is one link target; secondary actions sit in a separate row with their own 60 px targets.
- Navigation: fewer top-level items with bigger targets beats many small ones.

## Related

- [vr-input-models](vr-input-models.md)
- [viewport-and-field-of-view](viewport-and-field-of-view.md)
