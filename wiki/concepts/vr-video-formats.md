---
title: VR video formats and metadata
type: concept
status: draft
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md, raw/sites/deovr-homepage-2026-10-05.md]
tags: [vr, video, metadata, catalog]
---

# VR video formats and metadata

What a VR video "is" technically, and which of it the catalog should surface to help people choose.

## Facts

- Projection: flat, 180°, 360°, fisheye (e.g. 190/200°). Stereo layout: mono, side-by-side (LR/SBS),
  top-bottom (TB/OverUnder). File-name tokens like `_LR`, `_TB`, `_180`, `_F180` are player conventions,
  not standards (unverified; [HereSphere](https://heresphere.itch.io/heresphere-vr-video-player-quest-2/devlog/397826/update-v07-released)).
- Quest decode limits: 180° realistic 4320×4320@60, max 5760×5760@60; 360° realistic 7680×3840,
  max 8192×4096@60; codecs AV1 (Quest 3+), HEVC, VP9, AVC
  ([Meta media](https://developers.meta.com/horizon/documentation/android-apps/media-requirements)).
- DeoVR markets up to **8K, 120 FPS**, 180/360/3D ([snapshot](../../raw/sites/deovr-homepage-2026-10-05.md)).

## Implications for the prototype

Card badge set (max 3 visible, the rest in details):

| Badge | Example | Why it matters |
|---|---|---|
| FOV / projection | `180°`, `360°`, `FISHEYE` | Biggest experience difference |
| Resolution | `8K`, `6K`, `4K` | Premium signal; device fit |
| Frame rate | `60`, `120 FPS` | Smoothness, premium |
| Stereo | `3D` / `2D` | Depth |
| Feature | Interactive, Passthrough, Script | Brand feature gradients |

- Thumbnails for 180/360 must be **single-eye, dewarped crops**, not raw SBS frames (inference).
- Mock data model fields: `projection`, `stereo`, `resolution`, `fps`, `durationSec`, `features[]`.

> **Owner decision 2026-10-05:** the homepage card shows no format badges; only Premium / Top Picks marks
> ([0005](../decisions/0005-spatial-homepage-layout.md)). The badge set above remains a candidate for a
> details view or filters.

## Open questions

- Does DeoVR's API expose these fields per video? Which badge is most predictive of clicks?

## Related

- [immersive-video-entry](immersive-video-entry.md)
- [homepage-ux-brief](../synthesis/homepage-ux-brief.md)
