---
title: "Source: VR UX research report (2026-10-05)"
type: source
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md]
tags: [vr, research, input, typography, color, webxr, performance, accessibility]
---

# Source: VR UX research report (2026-10-05)

Research over Meta Horizon design docs, Apple visionOS HIG, Android XR design, the WebXR spec, MDN,
Microsoft Mixed Reality comfort guidance and W3C XAUR. Raw: [vr-ux-research-2026-10-05.md](../../raw/research/vr-ux-research-2026-10-05.md).

## Key takeaways

1. **Hover is never required.** Quest rays may emit hover; Vision Pro Safari hides gaze from the page.
2. **60 px primary targets**, 8–16 px gaps — the common floor across Meta (60 dp), Apple (60 pt), Android XR (56 dp).
3. **Type ≥14 px, body ≥18 px, Inter, no Light/Thin, no italics.**
4. **No pure white / pure black** in headsets; Meta suggests the range #1A1A1A–#DADADA.
5. **Near-black gradients collapse** below ~13/255 on LCD Quest panels.
6. **Fluid layout 500–2000 px**, typical Quest panel ~1280×670 (older docs say 1000×625).
7. **Motion only on user intent**: no auto-advancing carousels, no parallax, respect reduced motion.
8. **Feature-detect WebXR**; UA sniffing only as a comfort-mode hint; Vision Pro looks like Mac Safari.
9. **Immersive entry** needs a click, HTTPS, and clear projection / stereo metadata.
10. **Semantic HTML** is both an accessibility and a Vision Pro targeting requirement.

## Pages built from this source

[vr-input-models](../concepts/vr-input-models.md) ·
[hit-targets-and-spacing](../concepts/hit-targets-and-spacing.md) ·
[typography-and-legibility](../concepts/typography-and-legibility.md) ·
[viewport-and-field-of-view](../concepts/viewport-and-field-of-view.md) ·
[dark-theme-in-vr](../concepts/dark-theme-in-vr.md) ·
[motion-and-comfort](../concepts/motion-and-comfort.md) ·
[headset-detection](../concepts/headset-detection.md) ·
[immersive-video-entry](../concepts/immersive-video-entry.md) ·
[vr-video-formats](../concepts/vr-video-formats.md) ·
[performance-in-headsets](../concepts/performance-in-headsets.md) ·
[xr-accessibility](../concepts/xr-accessibility.md) ·
[vr-design-principles](../synthesis/vr-design-principles.md)

## Open gaps

See [device-test-plan](../synthesis/device-test-plan.md).
