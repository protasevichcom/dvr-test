---
title: Overview
type: overview
status: draft
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brief/task-brief-2026-10-05.md, raw/brief/brief-addendum-code-quality-2026-10-05.md]
tags: [overview]
---

# Overview — DeoVR homepage concept

A dark-theme, interactive prototype of the [DeoVR](entities/deovr.md) homepage focused on video discovery,
designed for both desktop and VR headset browsers, deployed on Vercel.

## Status (2026-10-05)

- ✅ Documentation foundation (LLM Wiki) and VR research ingested.
- ✅ Principles checklist: [vr-design-principles](synthesis/vr-design-principles.md).
- ✅ Accepted: [components and design tokens](decisions/0003-components-and-design-tokens.md),
  [no-build ES modules](decisions/0004-no-build-es-modules.md), [spatial homepage layout](decisions/0005-spatial-homepage-layout.md),
  [WebGL dome](decisions/0006-webgl-dome.md), [featured banner](decisions/0007-featured-banner.md),
  [infinite feed + joystick](decisions/0008-infinite-feed-and-joystick.md), [player-style theme](decisions/0009-player-style-theme.md),
  [feed tabs + Get Premium](decisions/0010-feed-tabs-and-premium.md), [aligned 5×5 / VR 3×3 grid](decisions/0013-aligned-grid.md),
  [gliding display-mode switch](decisions/0014-gliding-display-mode-switch.md).
- ✅ Prototype v5 runs locally: room + shade + vignette + nav pill + WebGL dome 1.5 m around the head with an
  endless aligned-lattice feed (5×5 cluster, 3×3 in VR, banner every half turn), joystick and drag in any direction,
  player-style graphite + flame theme.
- ✅ Deployed to Vercel: <https://deovr-homepage-concept.vercel.app> (project `deovr-homepage-concept`,
  team `andreis-projects`, static, no build). Deploy steps: [README](../README.md#deploy).
- ⏭ Next: test on a Quest ([device-test-plan](synthesis/device-test-plan.md)).
- ⚠️ Local environment: Node and ffmpeg are x86_64 builds on arm64 without Rosetta — see [0004](decisions/0004-no-build-es-modules.md).

## Where to read

1. [Task brief](sources/task-brief-2026-10-05.md) — requirements and where each is addressed.
2. [VR design principles](synthesis/vr-design-principles.md) — the 10 rules.
3. [Brand identity in a dark theme](concepts/brand-identity.md) — how the brand stays recognizable.
4. [Spatial homepage layout](decisions/0005-spatial-homepage-layout.md) — what the prototype is.
5. [Homepage UX brief](synthesis/homepage-ux-brief.md) — bets and card anatomy.
6. [Index](index.md) — every page.

## Related

- [AGENTS.md](../AGENTS.md) — how this wiki is maintained.
