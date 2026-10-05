---
title: "0013: Aligned grid, a card at the center (5×4, VR 3×3)"
type: decision
decision_status: accepted
status: draft
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brief/brief-navigation-and-player-style-2026-10-05.md]
tags: [dome, grid, cluster, layout, experiment]
---

# 0013: Aligned grid, a card at the center (5×4, VR 3×3)

Owner: "let's try a grid without the offset; a card must be at the center, not a gap", then the same for the
headset. An experiment; the hex grid of [0011](0011-cluster-3-4-3.md) stays one token away.

## Decision

- `--dome-grid-offset`: `0` = rows line up (current), `1` = hex grid (odd rows shifted half a column).
- `--dome-cluster-rows` / `--dome-cluster-rows-above` / `--dome-cluster-columns` / `--dome-cluster-edge`: rows of
  the open cluster, how many of them are above the gaze row, cards in the inner rows and in the first and last
  rows. Desktop **5×4** with the gaze on the second row (rows 4, above 1, columns 5, edge 5; owner, 2026-10-05:
  "5 across, 4 down"), VR comfort mode **3×3** (above 1). History: 3/5/3 + 3/3/3, 3/3/3 in both, full 5×5,
  5 rows of 3 · 5 · 5 · 5 · 3 (rows 5, above 2, edge 3). With an odd inner count the gaze rests on a card. At home
  the top row is the 3-cell banner (with a card on each side in 5×4); the screen centers the whole cluster, so an
  uneven split above / below the gaze does not shift it.
- A display-mode switch keeps the gaze on the same card: the outer ring of 5×5 dims down to 3×3 (and lights up
  again) around the same center, while the tokens glide ([0014](0014-gliding-display-mode-switch.md)).
- `--dome-banner-span`: cells a featured banner covers, centered on its column. `3` on the aligned grid, so the
  banner is exactly the top row of the cluster at home; `2` fits the hex grid.
- Home: the banner (row −1) is the top row of the cluster, so the camera rests `(rows − 1) / 2` rows below it
  (row 1 for 5×5, row 0 for 3×3). Clicking a banner centers the cluster the same way.
- Movement: ↑/↓ and vertical joystick steps move **one row** (two on the hex grid); diagonals move one row and
  one full column. Snapping, click-to-center (the banner centers the card below it) and the cluster rings use the
  same `geometry.js` helpers (`rowStride`, `nearestCell`, `ringOf`, `bannerCells`) for both grids.

## Consequences

- Desktop 5×4: 20 open cards, or 17 plus the banner at home; 3×3: 9, or 6 plus the banner.
- 5×5 cards are small (center ≈ 156 px wide at 1440×900, 187 px at 1920×1080) and the corners are strongly bent
  (the cluster is ≈ 128° wide, wider than the 100° view, so the view zooms out). Card text shrinks with the poster
  (overlay scale ≈ 0.56): captions render at ≈ 5–8 px on desktop — not legible (open question).
- Columns read as straight vertical lines, so the dome looks more like a shelf wall and less like a honeycomb.
  The diagonal neighbours sit further from the gaze than on the hex grid.

## Related

- [0011-cluster-3-4-3](0011-cluster-3-4-3.md) · [0007-featured-banner](0007-featured-banner.md) · [0008-infinite-feed-and-joystick](0008-infinite-feed-and-joystick.md) · [omnidirectional-navigation](../synthesis/omnidirectional-navigation.md)
