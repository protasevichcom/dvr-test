---
title: "0001: Tech stack for the prototype"
type: decision
decision_status: superseded
superseded_by: decisions/0004-no-build-es-modules.md
status: superseded
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brief/task-brief-2026-10-05.md]
tags: [stack, vercel]
---

# 0001: Tech stack for the prototype

> **Superseded** by [0004: No-build ES modules](0004-no-build-es-modules.md) on 2026-10-05.

## Context

- Interactive homepage prototype, deployed on Vercel ([brief](../../raw/brief/task-brief-2026-10-05.md)).
- Must run well in headset browsers (Meta Quest Browser is Chromium-based) — light JS, fast first paint,
  see [performance-in-headsets](../concepts/performance-in-headsets.md).
- Mock data only; no backend.

## Options

| Option | Pros | Cons |
|---|---|---|
| **Next.js (App Router) + TypeScript, static export** | First-class on Vercel, file routing, image optimization, easy to grow into more pages | Heavier toolchain than needed for one page |
| Vite + React + TypeScript | Minimal, fast dev loop, static output deploys on Vercel as-is | Routing / image handling are manual |
| Plain HTML/CSS/JS | Zero build, smallest payload | Harder to keep components consistent as the prototype grows |

## Decision (proposed)

Next.js + TypeScript, styled with CSS Modules on top of CSS custom properties (design tokens from
[0002](0002-dark-theme-brand-tokens.md); layering and component rules in
[0003](0003-components-and-design-tokens.md)). CSS Modules keep every style reading from semantic
tokens and make the "no raw values" rule enforceable with stylelint.
Mock catalog data in a local JSON/TS module. WebXR is used only behind feature detection
([headset-detection](../concepts/headset-detection.md)).

## Consequences

- One `tokens.css` is the single source of truth for color, type and spacing, including the
  `vr` comfort overrides ([vr-design-principles](../synthesis/vr-design-principles.md)).
- Local environment note (2026-10-05): the installed `/usr/local/bin/node` is an x86_64 build on an arm64 Mac
  without Rosetta, so it does not start. An arm64 Node LTS is required before scaffolding.

## Related

- [overview](../overview.md)
