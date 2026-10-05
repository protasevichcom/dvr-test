---
title: "0010: Feed tabs with fly-out / fly-in, Get Premium in the menu"
type: decision
decision_status: accepted
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brief/brief-navigation-and-player-style-2026-10-05.md]
tags: [feed, tabs, transition, premium, nav]
---

# 0010: Feed tabs with fly-out / fly-in, Get Premium in the menu

## Decision

- **Get Premium**: a round accent icon button (`IconButton` variant `accent`, diamond icon, "Get Premium" tooltip
  and accessible name) at the far right of the nav pill, after the profile (owner, 2026-10-05). It started as a
  labelled accent pill (`Button` variant `accent`) before the utilities, as in the DeoVR player reference; the
  label-collapsing container queries went with it.
- **Feed tabs** For You / New / Trending (`components/segmented-tabs/SegmentedTabs`, ARIA tabs with roving
  focus) sit centered under the nav pill (NavPill `accessory`). Selected = light filled pill with dark text;
  others = graphite pill with a light outline (dark-theme reading of the owner's reference).
- Each feed has its own deterministic content (`videoForCell(row, column, feed)`).
- **Switch animation** (`DomeGallery.switchFeed`), per card `dissolve` 0…1:
  - out: a ripple from the gaze to the periphery (`--motion-feed-stagger` 380 ms, per card `--motion-slow`);
    each poster recedes behind the sphere (angular size ÷ (1 + 1.5·d)), scatters away from the gaze (× 1 + 0.35·d),
    fades and blurs (mip-level bias in the shader); flat overlays fade and blur with it;
  - the new feed's cards start flying in one ripple-step (`--motion-feed-stagger`, 300 ms) after the switch,
    **overlapping** the leaving ones (which keep rendering until gone), so there is no empty pause
    (revised 2026-10-05; measured: lowest visibility ≈ 570 ms, then immediately rising);
  - in: the reverse order (periphery first, center last);
  - the poster **edges blur too**: the quad grows by the blur width (`uBleed`) and the rounded-rect mask softens
    (`uEdgeBlur`, up to 18% of the poster height), so the blur bleeds outside the poster instead of a crisp edge.
- Input that activates cards is ignored during the switch; reduced motion makes it instant.

## Related

- [0008-infinite-feed-and-joystick](0008-infinite-feed-and-joystick.md) · [0009-player-style-theme](0009-player-style-theme.md)
