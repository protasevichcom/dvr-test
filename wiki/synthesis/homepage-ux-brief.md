---
title: Homepage UX brief
type: synthesis
status: draft
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brief/task-brief-2026-10-05.md, raw/sites/deovr-homepage-2026-10-05.md, raw/research/vr-ux-research-2026-10-05.md]
tags: [homepage, discovery, ux]
---

# Homepage UX brief

Working brief for the prototype: what the new homepage contains and which improvements we expect to
have the biggest impact. Derived from the [task brief](../sources/task-brief-2026-10-05.md), the
[baseline snapshot](../sources/deovr-homepage-2026-10-05.md) and the [VR principles](vr-design-principles.md).

## High-impact bets (ranked)

1. **VR-first card** — a visible **Play in VR** action; in headsets it becomes the primary action.
   *Format badges (180°/8K/FPS) were removed by the owner on 2026-10-05 in favour of Premium / Top Picks
   marks — see [0005](../decisions/0005-spatial-homepage-layout.md).* → [vr-video-formats](../concepts/vr-video-formats.md)
2. **Format quick-filters** under the hero: 180°, 360°, 8K, 120 FPS, Passthrough, Interactive —
   discovery by *experience type*, which the current site does not offer on the homepage.
3. **Calm, immersive dark hero** — one featured experience, large dewarped poster, brand gradient glow,
   user-driven switching (no autoplay carousel). → [motion-and-comfort](../concepts/motion-and-comfort.md)
4. **Desktop → headset hand-off** — "Watch on headset" (send to device / QR / open in app) for desktop users
   who curate before putting the headset on.
5. **Adaptive VR comfort mode** — larger targets, type and gaps; calmer visuals; auto-hinted, manually
   switchable. → [headset-detection](../concepts/headset-detection.md)
6. **Simplified navigation** — fewer, larger top-level items plus prominent search.

> **Update 2026-10-05:** the owner chose a spatial layout (room + dome gallery) instead of the scrolling
> outline below — see [0005-spatial-homepage-layout](../decisions/0005-spatial-homepage-layout.md). The bets above
> still apply; sections 3–9 of the outline are candidates for future layers or panels of the dome.

## Page outline (draft, superseded by 0005)

| # | Section | Purpose | Notes |
|---|---|---|---|
| 1 | Header | Logo, search, 4–5 nav items, mode toggle, Get app, Sign in | Compact, sticky, ≤64 px in VR |
| 2 | Hero / Featured | One experience, Play in VR + Save, thumbnail switcher | ≤55% of 670 px height |
| 3 | Format chips | Filter the feed by experience type | Chips ≥60 px tall in VR |
| 4 | Continue watching | Resume (logged-in) | Rail with progress bars |
| 5 | Feed tabs: For You / New / Trending | Main discovery grid | Trending period as a select, not a second tab row |
| 6 | Top Picks | Curated, larger cards | Rail with explicit prev/next |
| 7 | Categories | Visual tiles | 8 existing categories |
| 8 | Channels / creators | Follow suggestions | Avatars + follower counts |
| 9 | Get DeoVR on your headset | Quest, Pico, Vision Pro, Steam | Hand-off and app promo |
| 10 | Footer | Existing links | Grouped, larger targets |

## Video card anatomy (draft)

- Poster 16:9 (dewarped single-eye crop), duration, up to 3 format badges, premium marker.
- Title (2 lines max), channel avatar + name, views · age.
- Actions: **Play in VR** (primary), Save to playlist, More (Hide, Share). All reachable without hover.
- Desktop hover after dwell: muted flat preview; VR mode: no preview, enlarged actions.

## Open questions

- Logged-out vs logged-in homepage — which one do we prototype first? (Assumption: logged-in with Continue watching, plus a logged-out toggle.)
- Is "Send to headset" a real DeoVR capability today? If not, present it as a concept.
- Content safety for the prototype: use neutral, SFW mock content (travel, nature, music, sports).

## Related

- [vr-design-principles](vr-design-principles.md) · [0003-components-and-design-tokens](../decisions/0003-components-and-design-tokens.md)
