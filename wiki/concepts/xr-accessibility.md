---
title: Accessibility in XR
type: concept
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md]
tags: [vr, accessibility]
---

# Accessibility in XR

W3C XR Accessibility User Requirements ([XAUR](https://www.w3.org/TR/xaur/)) applied to a 2D catalog that launches
immersive video.

## Requirements

- **Input independence** — every action works with any input: keyboard, switch, voice, controller (§3.3–3.4, §4.2).
- **Captions** customisable and repositionable in immersive playback (§4.19); **mono audio** option (§4.18).
- **High contrast and magnification with reflow** (§4.6, §4.7).
- **No flashing >3/s**, alternatives to motion (§4.16).
- Support breaks and resume ([Meta best practices](https://developers.meta.com/horizon/design/bp-overview/)).

## Implications for the prototype

- Semantic landmarks (`header`, `nav`, `main`, `section` with headings), real buttons and links — this is also
  what Vision Pro uses to find targets ([vr-input-models](vr-input-models.md)).
- Full keyboard path: skip link, roving focus in rails, visible focus ring (≥2 px, brand blue, offset).
- `rem`-based sizing so browser zoom reflows the layout.
- "Continue watching" row = resume support.
- Captions / audio badges on cards where available (CC, mono-friendly) — optional.

## Related

- [motion-and-comfort](motion-and-comfort.md)
- [typography-and-legibility](typography-and-legibility.md)
