---
title: "0003: Component architecture and design tokens"
type: decision
decision_status: accepted
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brief/brief-addendum-code-quality-2026-10-05.md, raw/research/vr-ux-research-2026-10-05.md]
# 2026-10-05: code rules adapted to the no-build stack (0004); intent unchanged.
tags: [architecture, components, tokens, code-quality]
---

# 0003: Component architecture and design tokens

## Context

The owner requires that all code is built on components and design tokens and is clean and high-quality
([addendum](../../raw/brief/brief-addendum-code-quality-2026-10-05.md)). The desktop / VR split is a
token-level concern ([headset-detection](../concepts/headset-detection.md)).

## Decision

### Token layers

1. **Primitive tokens** — raw brand values (`--color-pink-400: #ff5e99`, `--space-4: 16px`). Never used in components.
2. **Semantic tokens** — roles (`--bg-canvas`, `--text-primary`, `--accent-brand`, `--target-min`, `--radius-card`).
   The only tokens components may use.
3. **Mode overrides** — `[data-mode="vr"]` (and `prefers-reduced-motion`) re-map semantic tokens only.

Categories: color, typography (family, size scale, weight, line-height), space, size (targets), radius,
border width, elevation, motion (duration, easing), z-index, breakpoints, content width.
Tokens are defined once in TypeScript-friendly form and emitted as CSS custom properties; no hard-coded
colors, sizes or durations in components (lint rule / review check).

### Component layers

- **Primitives** (design-system level, no domain knowledge): `Button`, `IconButton`, `Badge`, `Chip`, `Tabs`,
  `Avatar`, `Rail` (horizontal scroller with prev/next), `Skeleton`, `VisuallyHidden`, `Icon`.
- **Domain components** (catalog): `VideoCard`, `VideoBadges`, `CategoryTile`, `ChannelChip`, `HeroFeature`,
  `PlayInVrButton`, `ModeToggle`.
- **Sections** (homepage blocks): `SiteHeader`, `Hero`, `ContinueWatching`, `ForYouFeed`, `TopPicks`,
  `CategoriesGrid`, `SiteFooter`.
- **Page** composes sections only.

### Code rules

- Typed props: JSDoc + `// @ts-check` in strict mode (see [0004](0004-no-build-es-modules.md)); no implicit `any`.
- One component per folder: `Component.js` + `component.css` (BEM-style class names scoped by the component name).
- Styling only via semantic tokens; variants via props mapped to classes, not inline styles.
- **All UI sizes are rem** (sizes, radii, fonts, borders, shadows, blurs, offsets), and the root size is fluid:
  `--root-font-size: clamp(12px, min(1.1111vw, 1.7778vh), 24px)` (16 px at 1440×900; VR mode
  `clamp(14px, min(1.25vw, 2vh), 26px)`), so the whole interface scales with the viewport. Length tokens read by
  JS go through `readLengthToken` (rem → px). Only the root clamp and the `visually-hidden` pattern use px.
- Accessibility built into primitives (semantic element, focus ring, hit slop, `aria-*`).
- Mock data typed (`Video`, `Channel`, `Category`) and kept in `data/`, separate from components.
- Small, focused components; no dead code; English names and comments that explain *why*, not *what*.
- Formatting and linting (once Node is available): Prettier + ESLint; stylelint rule against raw hex/px in component CSS.

## Audit 2026-10-05 (owner: "make sure every standard color, size etc. is a reusable variable, and every
reusable element is a component")

- **Semantic layers added**, so components never touch primitives: spacing scale `--spacing-3xs … --spacing-4xl`
  (over `--space-*`), `--radius-circle`, `--radius-popover`, `--border-width-hairline` / `-control`,
  `--card-ring-width`, `--line-height-label` / `-body`, `--letter-spacing-label`, layers `--layer-*` (z-index,
  bottom to top), `--press-scale`, `--play-rest-scale` (read by CSS and JS), `--toast-max-width`,
  `--nav-divider-height`, avatar gradient / initials ratios. Semantic literals equal to a primitive now reference it.
- **Check:** no component or base stylesheet references a primitive token, and no raw colors, sizes, durations,
  z-indexes or design ratios remain; left as is by design: `0 / 1` opacity states, `-50%` centering, the
  `visually-hidden` px utility. JS reads only semantic tokens. Named JS constants that remain are engine and input
  tuning (mesh segments, solver iterations, drag / wheel thresholds, cache limits), not design values.
- **New shared components** for elements that were duplicated: `PosterOverlay` (root of a layer over a dome poster:
  anchoring + feed-switch dissolve), `PosterHit` (invisible accessible hit button over a poster), `PosterStrip`
  (strip under a poster: byline of cards, pagination of the banner; flat and warp placement), `Tooltip` (bubble
  markup shared by `IconButton` and `Joystick`). `VideoCardOverlay` and `FeaturedBanner` are built from them.

## Consequences

- Visual changes for VR mode or a theme tweak touch tokens only.
- New sections are assembled from existing primitives; a new primitive needs a reason recorded in the wiki.

## Related

- [0001-tech-stack](0001-tech-stack.md) · [0002-dark-theme-brand-tokens](0002-dark-theme-brand-tokens.md) · [vr-design-principles](../synthesis/vr-design-principles.md)
