---
title: "0002: Dark theme brand tokens"
type: decision
decision_status: superseded
superseded_by: decisions/0009-player-style-theme.md
status: superseded
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brand/deovr-css-tokens-2026-10-05.txt, raw/research/vr-ux-research-2026-10-05.md]
tags: [brand, color, dark-mode, tokens]
---

# 0002: Dark theme brand tokens

> **Colours superseded** by [0009: player-style theme](0009-player-style-theme.md) (graphite + flame). The headset
> rules here (no pure black/white, VR overrides, contrast checks) still apply.

## Context

- The brand already lives on near-black in its OG image; its UI tokens are light-theme
  ([brand-identity](../concepts/brand-identity.md)).
- Headset guidance: no pure black/white, Meta range #1A1A1A–#DADADA, near-blacks <13/255 collapse
  ([dark-theme-in-vr](../concepts/dark-theme-in-vr.md)).
- Contrast target WCAG AA: 4.5:1 text, 3:1 large text / UI.

## Decision (proposed)

One token set with a `[data-mode="vr"]` override. Colours reuse the brand scales where possible.

| Token | Desktop | VR mode | Origin |
|---|---|---|---|
| `--bg-canvas` | `#101419` | `#1a1e25` | brand neutral-950 / lifted for VR |
| `--bg-surface-1` (cards, header) | `#1d242e` | `#1d242e` | brand neutral-900 |
| `--bg-surface-2` (hover, chips) | `#262f3b` | `#262f3b` | new, step above 900 |
| `--text-primary` | `#eef1f5` | `#dadde2` | ≈ neutral-100, capped in VR |
| `--text-secondary` | `#a2a9b4` | `#a2a9b4` | brand neutral-500 |
| `--text-tertiary` | `#8a9bb4` | `#8a9bb4` | lifted from brand `#7d92af` for contrast |
| `--accent-brand` (pink) | `#ff5e99` | `#ff5e99` | brand primary-400 |
| `--accent-brand-strong` (button fill) | `#d92d6a` | `#d92d6a` | darkened primary for white label |
| `--accent-info` (links, focus) | `#4f95ff` | `#7ab0ff` | brand blue-500 / lightened |
| `--positive` | `#4cb98a` | `#4cb98a` | brand green-600 |
| `--brand-gradient` | coral → `#ff5e99` → violet → `#4f95ff` | same, lower opacity | logo mark |

### Measured contrast (WCAG ratio, computed 2026-10-05)

| Foreground | on `#101419` | on `#1a1e25` | on `#1d242e` | on `#262f3b` |
|---|---|---|---|---|
| `#eef1f5` text-primary | 16.3 | 14.8 | 13.8 | 11.9 |
| `#dadde2` text-primary (VR) | 13.6 | 12.3 | 11.5 | 9.9 |
| `#a2a9b4` text-secondary | 7.8 | 7.1 | 6.6 | 5.7 |
| `#7d92af` brand tertiary | 5.8 | 5.3 | 4.9 | **4.25 ✗** |
| `#8a9bb4` text-tertiary | 6.5 | 5.9 | 5.5 | 4.8 |
| `#ff5e99` pink | 6.4 | 5.8 | 5.4 | 4.7 |
| `#4f95ff` blue | 6.2 | 5.6 | 5.3 | 4.6 |
| `#7ab0ff` light blue | 8.4 | 7.6 | 7.1 | 6.1 |

White label on pink fills: `#fd4488` 3.3 ✗, `#f2025a` 4.26 (large text only), **`#d92d6a` 4.63 ✓**.

## Consequences

- Primary CTA "Play in VR": `#d92d6a` fill (or brand gradient with a dark overlay ensuring ≥4.5:1), white label.
- Pink as text only for short labels/badges, never body copy.
- Feature gradients (Interactive, Passthrough, Script, VR Cams) used on badges with dark text on top.
- **Validate on a Quest** — saturation and banding look different in the headset ([device-test-plan](../synthesis/device-test-plan.md)).

## Related

- [brand-identity](../concepts/brand-identity.md) · [dark-theme-in-vr](../concepts/dark-theme-in-vr.md) · [typography-and-legibility](../concepts/typography-and-legibility.md)
