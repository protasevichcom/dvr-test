---
title: "0008: Infinite feed on a hex lattice, joystick navigation"
type: decision
decision_status: accepted
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brief/brief-navigation-and-player-style-2026-10-05.md]
tags: [navigation, dome, joystick, feed]
---

# 0008: Infinite feed on a hex lattice, joystick navigation

## Context

Options were collected in [omnidirectional-navigation](../synthesis/omnidirectional-navigation.md). The owner
decided ([brief](../../raw/brief/brief-navigation-and-player-style-2026-10-05.md)): no "where am I" indicator
because the feed is endless (a full turn reaches new videos), a banner every 180°, a joystick instead of the
arrows, click any card to center it, drag in any direction.

## Decision

- **The sphere is a window onto an infinite hexagonal lattice** (`geometry.js`): cells have virtual
  coordinates (row, column) with no wrap-around; `videoForCell(row, column)` (data) is deterministic per cell.
  Cards are created as they enter the view and released 3 s after leaving it.
- **Horizontal = turning** (yaw = column · step). **Vertical = rows flow to the viewer**: pitch is relative to
  the camera row, so the gaze stays near eye level (comfort; see [motion-and-comfort](../concepts/motion-and-comfort.md)).
- Any cell can be the center; the 2/3/2 cluster is the cell plus its six neighbours (`clusterAround`).
- **Banners** repeat every half turn of the gallery in both directions: every `columns / 2` columns along a
  banner row (the column count is rounded to an even number, 14 at R = 1.5 m, so 180° lands on a whole column),
  and every half turn of rows vertically, starting at row -1 (`bannerRowPeriod`, ≈ π / rowStep rounded to an
  even count so banners stay on offset rows; 10 rows at 16:9). Each occurrence keeps its own banner index; one DOM overlay binds to the
  banner that is open.
- **Input:** drag in any direction with momentum (fling); joystick (`components/joystick`, 108 px, 144 px in VR:
  drag the knob to steer at `--dome-joystick-speed`; tap the rim for one step in one of eight directions — four
  main ticks (→ one column, ↑/↓ two rows) and four smaller diagonal ticks (the hex neighbour one row up/down and
  half a column sideways)); wheel and trackpad on
  both axes; ←/→ one column, ↑/↓ two rows; click any card to bring it to the center.
- **Update 2026-10-05 (owner):** the joystick is shown in VR comfort mode only (`--joystick-opacity` /
  `--joystick-visibility`, glides on a mode switch). A **trackpad** now pans continuously on both axes like a drag
  (`panByTrackpad`; small pixel deltas or any horizontal delta = trackpad) and snaps once the gesture and its OS
  momentum end (`TRACKPAD_IDLE_MS`), so a diagonal swipe no longer moves in a staircase; a **mouse wheel** (line
  deltas, or whole ~100 px notches) still steps one card at a time.
- **Motion (revised after owner feedback "jerky horizontally, zig-zag vertically"):** the camera follows a resting
  cell on a critically damped spring (settles in `--motion-page`, no overshoot). Velocity carries over when the
  goal changes, so repeated steps, wheel ticks and flings blend into one continuous movement instead of
  stop-start tweens. Vertical steps move **two rows** (the next row with the same column), so vertical movement
  is straight and the cluster stays centered. Snapping keeps the row parity of the current center
  (`nearestCell(column, row, parityRow)`), so the cluster never jumps half a column sideways.
- The cluster follows the nearest resting cell live while dragging or steering.
- **Joystick placement** (owner, 2026-10-05): bottom-right, a little in from the corner toward the center
  (`--joystick-inset-x` 4.5rem, `--joystick-inset-y` 2.5rem), floating over the dimmed
  periphery; the dome no longer reserves room for it and stretches down to `--dome-safe-bottom` (16 px).
  At 800×450 the center card grew ≈ 100 → 128 px; at 1920×1080 the cluster now reaches y ≈ 1028 and is limited
  by the 100° field of view rather than by height. In a headset the corner is far from the gaze — acceptable
  because dragging and clicking cards remain the primary input.

## Consequences

- Removed: paging arrows, the "Drag, scroll…" hint (the joystick shows it as a tooltip), fixed catalog.
- Continuous joystick movement is user-driven but still moves the whole view; validate comfort on a headset
  ([device-test-plan](../synthesis/device-test-plan.md)).

## Related

- [0006-webgl-dome](0006-webgl-dome.md) · [0007-featured-banner](0007-featured-banner.md)
