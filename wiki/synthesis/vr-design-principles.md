---
title: VR design principles — checklist
type: synthesis
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md, raw/brief/task-brief-2026-10-05.md]
tags: [vr, checklist, principles]
---

# VR design principles — checklist

The ten rules every screen of the prototype must pass. Read this before building any UI.
Each rule links to the concept page with sources and numbers.

| # | Principle | Rule of thumb | Details |
|---|---|---|---|
| 1 | **Hover is a bonus** | Nothing is reachable *only* on hover. Visible focus/active states everywhere. | [vr-input-models](../concepts/vr-input-models.md) |
| 2 | **Big targets, big gaps** | Primary controls ≥60 px, gaps ≥16 px in VR mode; whole card is one target. | [hit-targets-and-spacing](../concepts/hit-targets-and-spacing.md) |
| 3 | **Readable at 1 m** | Inter, ≥14 px min, ≥18 px body in VR, weight ≥400, no italics, AA contrast. | [typography-and-legibility](../concepts/typography-and-legibility.md) |
| 4 | **Centre of gaze** | Fluid 500–2000 px; design for 1280×670; key actions centred; first video row above the fold. | [viewport-and-field-of-view](../concepts/viewport-and-field-of-view.md) |
| 5 | **Dark, not black** | No #000/#FFF; VR canvas ≥#1A1A1A, text ≤#DADADA; no fine patterns; 1.5–2 px strokes. | [dark-theme-in-vr](../concepts/dark-theme-in-vr.md) |
| 6 | **Motion only on intent** | No autoplay carousels, parallax or scroll-jacking; small fades; honour reduced motion. | [motion-and-comfort](../concepts/motion-and-comfort.md) |
| 7 | **Detect capabilities, not devices** | WebXR check decides "Enter VR"; UA only hints comfort mode; manual toggle always available. | [headset-detection](../concepts/headset-detection.md) |
| 8 | **One click to immersion** | "Play in VR" is the hero action in headsets; explicit click, fade-in, clear exit. | [immersive-video-entry](../concepts/immersive-video-entry.md) |
| 9 | **Show the VR facts** | Projection, resolution, FPS, stereo as badges; dewarped single-eye thumbnails. | [vr-video-formats](../concepts/vr-video-formats.md) |
| 10 | **Mobile-class performance, accessible by default** | Lazy images, one preview at a time, limited blur; semantic HTML, keyboard path, rem units. | [performance-in-headsets](../concepts/performance-in-headsets.md), [xr-accessibility](../concepts/xr-accessibility.md) |

## Desktop vs headset at a glance

| Aspect | Desktop | Headset (VR comfort mode) |
|---|---|---|
| Main job | Browse, curate, send to headset | Browse and play now |
| Primary card action | Open details / preview | **Play in VR** |
| Hover previews | Yes (dwell, muted) | Off by default |
| Target / gap | 44 / 8 px | 60 / 16 px |
| Root font size | 16 px | 18 px |
| Canvas / text | `#101419` / `#eef1f5` | `#1a1e25` / `#dadde2` |
| Glass blur | Header, chips | Solid fills |

## Related

- [homepage-ux-brief](homepage-ux-brief.md) · [device-test-plan](device-test-plan.md) · [0002-dark-theme-brand-tokens](../decisions/0002-dark-theme-brand-tokens.md)
