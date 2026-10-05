---
title: "Source: spatial layout brief + room image (2026-10-05)"
type: source
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brief/brief-spatial-layout-2026-10-05.md, raw/room, raw/brief/brief-dome-refinements-2026-10-05.md, raw/brief/brief-dome-grid-2026-10-05.md, raw/brief/brief-banner-and-physics-2026-10-05.md, raw/brief/brief-navigation-and-player-style-2026-10-05.md, raw/brand/deovr-feature-icons-2026-10-05.svg]
tags: [brief, layout]
---

# Source: spatial layout brief + room image (2026-10-05)

Raw: [brief](../../raw/brief/brief-spatial-layout-2026-10-05.md), [room image](../../raw/room) (WebP 1376×768,
warm living room at night: fireplace, TV, shelves, sofa).

## Key points

- Three layers: blurred room with pointer parallax → black translucent shade with vignette → UI.
- Nav: pill with logo + icon items, tooltips on hover/gaze, positioned above the gaze center.
- Gallery: hemisphere of 16:9 previews viewed from inside; 7 central cards (2/3/2) show author, upload date,
  views, likes, comments; info animates out toward the poster / back in when paging.
- Blur via plain CSS (owner follow-up).

Follow-up the same day ([raw](../../raw/brief/brief-dome-refinements-2026-10-05.md)): circular screen
vignette, cards curved onto the sphere, larger cards (tested at 16:9), darker inactive cards, poster-up /
info-down activation; card text without title, short dates, Premium / Top Picks marks instead of format
badges. Led to [0006-webgl-dome](../decisions/0006-webgl-dome.md).

Second follow-up ([raw](../../raw/brief/brief-dome-grid-2026-10-05.md)): flat (undistorted) text, poster shape
derived from the sphere as it moves, posters on a sphere grid with no overlap → revised [0006](../decisions/0006-webgl-dome.md).

Third follow-up ([raw](../../raw/brief/brief-banner-and-physics-2026-10-05.md)): featured banner gallery in the
two top cluster cells → [0007](../decisions/0007-featured-banner.md); sphere scaled as if cards were 1.5 m away and
text as flat planes parallel to poster edges → [0006](../decisions/0006-webgl-dome.md).

Fourth follow-up ([raw](../../raw/brief/brief-navigation-and-player-style-2026-10-05.md)): endless feed, banner every
180°, joystick, click-to-center, drag anywhere → [0008](../decisions/0008-infinite-feed-and-joystick.md); player-style colours and
shapes → [0009](../decisions/0009-player-style-theme.md).

Implemented as [0005-spatial-homepage-layout](../decisions/0005-spatial-homepage-layout.md).
The room image lives in the app as `assets/images/room.webp` (copy).

## Related

- [homepage-ux-brief](../synthesis/homepage-ux-brief.md)
