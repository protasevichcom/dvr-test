---
title: Motion and comfort
type: concept
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md]
tags: [vr, motion, comfort, accessibility]
---

# Motion and comfort

Large moving surfaces inside a headset fill much of the field of view; unexpected motion is a discomfort
and sickness trigger.

## Facts

- Avoid sudden acceleration, rapid direction changes and motion the user didn't trigger; avoid depth
  effects on text ([Meta comfort](https://developers.meta.com/horizon/design/comfort/)).
- Keep motion user-initiated ([Microsoft comfort](https://learn.microsoft.com/windows/mixed-reality/comfort)).
- No flashing more than 3 times per second; offer alternatives to motion ([W3C XAUR §4.16](https://www.w3.org/TR/xaur/)).
- Feedback timing: immediate subtle response; short delay before expansion; longer before tooltips
  ([HIG Eyes](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/eyes.json)).

## Implications for the prototype

- **No auto-advancing hero carousel.** Hero changes only on user action.
- No scroll-jacking, no parallax, no 3D tilt on cards in VR mode (a subtle tilt is acceptable on desktop
  with a fine pointer and without reduced motion).
- Hover previews: start after ~400–600 ms dwell, muted, flat (one eye), never autoplay stereo.
- Transitions: opacity and small scale (≤1.03) with 150–250 ms ease-out; no large translations.
- `prefers-reduced-motion: reduce` → disable previews autoplay, glows animation and transforms.
- Entering VR: fade through dark, never cut from a bright frame ([immersive-video-entry](immersive-video-entry.md)).

## Related

- [dark-theme-in-vr](dark-theme-in-vr.md)
- [xr-accessibility](xr-accessibility.md)
