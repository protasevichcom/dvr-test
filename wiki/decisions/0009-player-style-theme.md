---
title: "0009: Player-style UI theme (graphite + flame)"
type: decision
decision_status: accepted
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brief/brief-navigation-and-player-style-2026-10-05.md]
tags: [theme, tokens, color, shape]
---

# 0009: Player-style UI theme (graphite + flame)

Supersedes the colour part of [0002](0002-dark-theme-brand-tokens.md) (slate + pink); contrast rules still apply.

## Decision

Follow the DeoVR player reference ([brief](../../raw/brief/brief-navigation-and-player-style-2026-10-05.md)):

| Role | Token | Value |
|---|---|---|
| Canvas | `--bg-canvas` | `#141414` (VR `#232323`) |
| Panels (nav pill, joystick, pagination, toast) | `--surface-glass` | graphite `#2a2a2a` at 94%, no border, no blur |
| Round buttons | `--surface-control` | `#1f1f1f` |
| Selected item / inner chips | `--surface-selected`, `--surface-chip` | `#3a3a3a`, `#333333` |
| Text | `--text-primary/secondary/tertiary` | `#f2f2f2` / `#bdbdbd` / `#8a8a8a` (VR primary `#dadada`) |
| Accent (hover ring, play, current dot, premium crown) | `--accent-brand(-strong)` | flame `#ff4f17` / `#e2461a` |
| Tooltip | `--surface-tooltip`, `--text-on-tooltip` | white pill, near-black text |
| Quality badge | `--accent-quality` | red `#e0263c` |

Shapes: everything fully rounded (pills and circles), panel radius `--radius-panel` 36 px, card radius 16 px,
duration badge as a pill. Stat icons (views, likes, comments) are filled. Focus ring white.

## Consequences

- The DeoVR logo mark keeps its own gradient; the brand pink now appears only in the logo.
- White on `#e2461a` is ≈ 3.9:1 — fine for icons and large/bold labels, not for small body text.

## Related

- [brand-identity](../concepts/brand-identity.md) · [dark-theme-in-vr](../concepts/dark-theme-in-vr.md)
