---
title: "0004: No-build ES modules instead of Next.js"
type: decision
decision_status: accepted
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/brief/brief-spatial-layout-2026-10-05.md, raw/brief/brief-addendum-code-quality-2026-10-05.md]
tags: [stack, vercel, architecture]
---

# 0004: No-build ES modules instead of Next.js

Supersedes the proposed stack in [0001](0001-tech-stack.md).

## Context

- Local Node (and ffmpeg) are x86_64 binaries on an arm64 Mac without Rosetta; nothing npm-based runs.
- The prototype is one interactive page with mock data; headset browsers reward small, fast pages
  ([performance-in-headsets](../concepts/performance-in-headsets.md)).
- Code must be component- and token-based ([0003](0003-components-and-design-tokens.md)).

## Decision

- Plain HTML + native ES modules + CSS, no bundler. Vercel serves the folder as a static site.
- Components are functions in `src/components/<name>/Name.js` that build DOM with a tiny `h()` helper
  (`src/lib/dom.js`) and return `{ el, ...api }`; each has a sibling `<name>.css` linked from `index.html`.
- Types via JSDoc and `// @ts-check` (`jsconfig.json`, strict) — editor type checking without a build.
- Design tokens: `src/tokens/primitives.css` → `src/tokens/semantic.css` (+ `[data-mode='vr']` and
  reduced-motion overrides). Geometry constants are tokens too, read in JS via `src/lib/tokens.js`.
- Local preview: `/usr/bin/python3 scripts/serve.py` from the project root.

## Consequences

- Zero dependencies, instant deploy, ~60 KB of source. No JSX, no hot reload.
- If the prototype grows into several pages, revisit Next.js/Vite once an arm64 Node is installed;
  components port 1:1 because they are already isolated and token-driven.

## Related

- [0001-tech-stack](0001-tech-stack.md) · [0003-components-and-design-tokens](0003-components-and-design-tokens.md)
