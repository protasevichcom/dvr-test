---
title: "0014: Display-mode switch by gliding tokens"
type: decision
decision_status: accepted
status: draft
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brief/brief-navigation-and-player-style-2026-10-05.md, https://developer.mozilla.org/en-US/docs/Web/CSS/@property]
tags: [vr, motion, tokens, dome]
---

# 0014: Display-mode switch by gliding tokens

Owner (2026-10-05): make the desktop → VR switch smooth; then "don't hide and show the cards, change the
diameter of the distortion"; "the UI elements (menu, joystick) must only change, not be replaced"; and the card UI
must not jump. The cluster is now **3/3/3 in both modes** ("3/3/3 in both, without switching"), so the switch
changes geometry and sizes only. (Later the same day desktop became 5×5 again: the switch then also dims or
lights up the outer ring around the same center — see [0013](0013-aligned-grid.md).)

## Options considered

1. **View transition + rebuilt dome** (first attempt): `document.startViewTransition` crossfaded the page,
   morphed snapshots of the nav pill / tabs / joystick, and the rebuilt dome's cards flew in. Rejected: cards
   disappeared and reappeared, and the chrome was replaced by scaled snapshots.
2. **View transition + blended dome layout** (second attempt): the dome kept its cards and blended two
   precomputed layouts. Rejected: the chrome was still snapshots, and card text jumped because the type tokens
   switched instantly.
3. **Gliding tokens** (chosen): every token the VR override changes is registered with `@property`
   ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)), so the browser can interpolate it, and
   transitions on `:root[data-mode-switching]` for `--motion-mode-switch` (900 ms) with `--motion-ease-mode`
  (`cubic-bezier(0.45, 0, 0.55, 1)`: gentle, no overshoot; owner: "a bit smoother, without the spring").

## Decision

- `src/tokens/mode-transition.css` registers the VR-overridden tokens (root size, colors, type, icon, target,
  pagination, joystick, scene and dome tokens incl. `--dome-fov`, `--dome-radius-m` and `--dome-card-width-m`) and transitions them while
  `data-mode-switching` is set. rem sizes follow the gliding `--root-font-size`. The list must stay in sync with
  `:root[data-mode='vr']`; an unregistered override switches instantly.
- `applyDisplayMode(mode, { animate: true })` sets `data-mode-switching`, flushes styles, flips `data-mode`, and
  reports the duration in `displaymodechange` (0 with reduced motion).
- The dome re-reads its tokens and recomputes the layout **every frame** for that duration (`relayout({ follow:
  true })`): same cards, same camera; card width, curvature, scale and overlay type change continuously ("the
  diameter of the distortion"). Warped overlays re-measure every frame while the tokens glide.
- To make that continuous, the column pitch now follows the card size directly (`columnStep = (card + gap) / R`)
  instead of `2π / columns`; the lattice never wrapped, and the even column count only spaces the banners about
  every half turn. When the count changes (14 ↔ 12) only cards the new lattice lacks (moved banners, far away)
  fade out; new ones fade in.
- Ring changes caused by the switch (5×5 ↔ 3×3: dimming, poster lift, info strip) run as timed glides with the
  same duration and easing (`readEasingToken` + `src/lib/easing.js` evaluate the CSS `cubic-bezier` in JS), with no
  info delay — before, they used the exponential approach plus a 160 ms delay, which read as a spring against the
  eased geometry.
- The view is fitted to a cluster size that glides too (`clusterFit`, fractional 3×3 ↔ 5×5 over the same
  timeline): fitting to the new cluster at once made VR → desktop shrink the cards to 131 px in the first frame and
  grow them back (owner: "VR → desktop must repeat desktop → VR in reverse"). Cells that come into view as the dome
  shrinks slide in solid, like cells sliding out as it grows; only cards replacing removed ones fade in.
- Banner spacing is fixed in lattice cells (`--dome-banner-columns` 14, `--dome-banner-rows` 20, same in every
  mode) instead of "every half turn" derived from the gliding geometry; otherwise intermediate column/row counts
  briefly turned video cards into banners during the switch (owner report).
- The mode toast is a single line: "VR mode on" / "VR mode off".

## Consequences

- Measured at 1100×620: root size 12 → 14 px, nav pill 624 → 884 px, joystick 81 → 126 px, card caption 9 → 11.4 px,
  all monotonic; 6 open cards throughout; no per-frame jumps on the card pills.
- Banners sit every 14 columns / 20 rows: exactly half a turn on desktop at 3 m (28 columns), about 210° in VR.
- With 3/3/3 in both modes the desktop fit is height-bound, so desktop cards are now as large as or larger than
  in VR; VR differs in type and target sizes and in a stronger curvature per card.

## Related

- [0013-aligned-grid](0013-aligned-grid.md) · [0006-webgl-dome](0006-webgl-dome.md) · [headset-detection](../concepts/headset-detection.md) · [0003-components-and-design-tokens](0003-components-and-design-tokens.md)
