---
title: "0015: Video player that grows out of its poster"
type: decision
decision_status: accepted
status: draft
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brief/brief-navigation-and-player-style-2026-10-05.md]
tags: [player, motion, dome, vr]
---

# 0015: Video player that grows out of its poster

Owner (2026-10-05): opening a video — the preview image grows into the video over the whole viewport; icons and
labels fade out; the menu slides up and disappears, the joystick slides down and disappears; a close button slides
in at the bottom center.

## Decision

- `components/video-player/VideoPlayer` is a modal dialog with one frame element (`<video>` + the poster `<img>`).
  Opening warps the frame (`matrix3d`, `quadToMatrix3d`) from the poster's projected corners on the dome to the
  viewport's while its corner radius goes to 0; the element is laid out at the quad's own size every frame, so the
  picture (`object-fit: cover`) is never squashed while the aspect changes. Closing runs the same morph back into the
  poster's current corners. `--motion-player` (700 ms) with `--motion-ease-player` (soft ease-in-out).
- The poster image covers the video until it plays and fades back in when closing, so the frame lands on the same
  picture the dome shows. While the player stands in for a card, the dome does not draw that poster
  (`Card.playing`, via the `PlayerSource` handle from `DomeGallery`: `quad()`, `radius()`, `setPlaying()`).
- The page reacts to `data-player` on the root (set by `main.js`): the nav pill and feed tabs slide up and fade, the
  joystick slides down and fades, card overlays fade — all on the same timeline; the nav and the dome are `inert`
  and the gallery's keyboard browsing is paused (`setPaused`). The close button (round, glass, `close` glyph) slides
  up from the bottom center; Escape closes; focus moves to the close button and back to the opener.
- Playback starts inside the click (sound allowed; falls back to muted if the browser refuses). The prototype plays
  the CC0 sample clips (`Video.videoSrc`). Banners still show the "Play in VR" toast.

## Consequences

- Measured at 1100×620: the frame shrinks 1100 → 146 px (the poster is 140 px) over ≈ 700 ms with the nav fading in
  step; open state: video playing with sound, nav / joystick / overlays at opacity 0, focus on "Close video".
- The morph is projective, so the frame's edges are straight while the poster on the dome is slightly curved; on the
  3 m desktop sphere the difference is a pixel or two.
- In a headset an immersive player would replace the flat one (see [immersive-video-entry](../concepts/immersive-video-entry.md)).

## Related

- [0006-webgl-dome](0006-webgl-dome.md) · [0012-warped-card-ui](0012-warped-card-ui.md) · [0014-gliding-display-mode-switch](0014-gliding-display-mode-switch.md)
