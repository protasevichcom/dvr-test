---
title: "0007: Featured banner gallery on the dome"
type: decision
decision_status: accepted
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brief/brief-banner-and-physics-2026-10-05.md]
tags: [banner, hero, dome, pagination]
---

# 0007: Featured banner gallery on the dome

## Context

The owner asked to merge the two top cards of the cluster at the home position into one banner gallery,
two cards plus the gap wide, with prev/next controls and dot pagination below the image
([brief](../../raw/brief/brief-banner-and-physics-2026-10-05.md)).

## Decision

- The banner is one poster on the sphere grid: row -1, centered on column 0, covering cells ±0.5 and the gap
  (`createBannerSlot`, `isBannerCell` in `geometry.js`). It bends with the dome like any card.
- It opens like a card when it is in the cluster: the image rises; prev/next buttons sit on the image at its
  left/right edges. The dot pagination sits **under the image, centered, in the strip where video cards show
  their byline** — same row height and slide-out motion, no pill (first left-aligned, then centered on request) (`Pagination` `variant: 'bare'`; owner,
  2026-10-05: "so it matches the author line of the video cards"). Earlier it sat on the image at the bottom
  center. Turning the dome closes it.
- 7 banners (`src/data/banners.js`, photos pinned by id so they match their titles); switching crossfades the image in the shader (`uMapPrevious`, `uBlend`);
  all banner images are preloaded. No autoplay (motion only on intent, [principle 6](../synthesis/vr-design-principles.md)).
- The image carries no text or badge (owner, 2026-10-05: removed after a first version with a title and a
  "Staff Picks" label). The banner title is kept only for the accessible name and the play action.
  Each control is one flat plane (never warped) turned to the local direction of the sphere's horizontal line
  through its anchor (`anchorOnSphere`): the arrows tilt with the curved left/right ends of the wide image, the
  pagination strip hangs under the bottom edge like the byline strip of the cards (flat mode), or continues the
  image downward on the sphere (warp mode). In warp mode the strip is mapped only under the dots: a projective map
  keeps a strip's top edge straight between its corners, and the 3-cell banner's bottom edge sags toward the middle,
  so a full-width strip put the centered dots ≈ 3 px from the image instead of the byline's ≈ 6 px (owner:
  "same distance from the image as the author line").
- Arrows are solid graphite circles; on hover they turn solid white with a black arrow (`.icon-button--glass:hover`).
- Banners repeat every half turn horizontally and vertically ([0008](0008-infinite-feed-and-joystick.md)).
- Components: `featured-banner/FeaturedBanner`, `pagination/Pagination`. Pagination is compact and quiet
  (6 px translucent dots, 18 px dash for the current slot, equal 5 px gaps; the faint dark pill is the default
  `surface` variant, the banner uses `bare`). Switching animates
  the old dash into a dot and the new dot into a dash with the same timing, so the total length stays constant;
  invisible hit areas (24 px tall, splitting the gaps) keep the tiny marks clickable.

## Consequences

- At home the cluster shows banner + 5 video cards; after a turn it is 6 or 7 video cards.
- Clicking the banner when it is away turns the dome back home.

## Related

- [0005-spatial-homepage-layout](0005-spatial-homepage-layout.md) · [0006-webgl-dome](0006-webgl-dome.md)
