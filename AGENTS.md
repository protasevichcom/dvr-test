# AGENTS.md — project schema

This file is the **schema layer** of the project knowledge base. It tells any LLM agent (Claude Code,
Codex, Cursor, etc.) how this repository is organized and how to maintain its documentation.
`CLAUDE.md` imports this file; keep the rules here.

The documentation follows the **LLM Wiki** pattern
([source notes](raw/articles/karpathy-llm-wiki.md)): humans curate sources and ask questions, the agent
compiles them into an interlinked markdown wiki and keeps it consistent.

## Project in one paragraph

A concept redesign of the [DeoVR](https://deovr.com/) homepage: an interactive, dark-theme prototype of the
VR video catalog that keeps the brand recognizable, feels modern / premium / immersive, and works for both
desktop browsers and VR headset browsers (Meta Quest Browser first). The prototype is deployed on Vercel.
Start reading at [wiki/overview.md](wiki/overview.md).

## Hard rules

1. **English only** — code, code comments, commit messages, docs, wiki pages. Chat with the owner may be
   in any language; anything written to the repo is English.
2. **`raw/` is immutable.** Never edit or delete files in `raw/`. To correct a source, add a new dated file.
3. **`wiki/` is owned by the agent.** The agent writes and maintains it; humans may edit too, and the agent
   must respect human edits (see "Write gates").
4. **Every non-trivial claim in the wiki cites a source** — a `raw/` file or an external URL.
   Unverified claims are marked `status: unverified` in frontmatter or `(unverified)` inline.
5. **Every wiki change is logged** in [wiki/log.md](wiki/log.md) and reflected in [wiki/index.md](wiki/index.md).
6. **Code is built from components and design tokens, and kept clean.** No hard-coded colors, sizes or
   durations in components; components use semantic tokens only; VR mode is a token override, not a fork.
   Full rules: [wiki/decisions/0003-components-and-design-tokens.md](wiki/decisions/0003-components-and-design-tokens.md).

## Directory layout

```
.
├── AGENTS.md            # this schema (canonical)
├── CLAUDE.md            # imports AGENTS.md for Claude Code
├── README.md            # human-facing quick start
├── raw/                 # immutable sources (human-curated)
│   ├── brief/           # task briefs and requirement changes, dated
│   ├── brand/           # logos, extracted CSS tokens, brand images
│   ├── sites/           # dated snapshots of deovr.com and competitor pages (structure notes)
│   ├── articles/        # pointers + capture notes for external articles / guidelines
│   ├── research/        # research reports (agent- or human-produced), dated
│   └── assets/          # screenshots and other binary evidence
├── wiki/                # compiled knowledge (agent-maintained)
│   ├── index.md         # catalog of every page, one line each
│   ├── log.md           # append-only activity log
│   ├── overview.md      # entry point: project, status, where to go next
│   ├── sources/         # one summary page per raw source
│   ├── entities/        # things with identity: products, platforms, browsers, devices
│   ├── concepts/        # ideas and principles: input models, comfort, target sizing
│   ├── decisions/       # ADR-style records of decisions taken (numbered)
│   └── synthesis/       # cross-cutting outputs: checklists, briefs, comparisons
├── index.html           # prototype entry (static, no build) — wiki/decisions/0004
├── src/
│   ├── tokens/          # primitives.css → semantic.css (+ VR / reduced-motion overrides) → mode-transition.css
│   ├── styles/          # global base styles
│   ├── lib/             # framework-free helpers (dom, tokens, environment, parallax, format)
│   ├── data/            # typed mock catalog
│   ├── components/      # one folder per component: Name.js + name.css
│   └── main.js          # composes the page
└── assets/              # images and brand files served by the app (copies of raw/ files)
```

Run locally: `/usr/bin/python3 scripts/serve.py` from the project root, open http://127.0.0.1:5173.
Add `?mode=vr` to force VR comfort mode.

## Page conventions

**File names:** lowercase kebab-case, `.md`. Decisions are numbered: `decisions/0001-short-title.md`.
Source summaries mirror the raw file name: `raw/sites/foo-2026-10-05.md` → `wiki/sources/foo-2026-10-05.md`.

**Frontmatter** (required on every wiki page except `index.md` and `log.md`):

```yaml
---
title: Human-readable title
type: source | entity | concept | decision | synthesis | overview
status: draft | stable | unverified | superseded
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [raw/path/to/file.md, https://example.com/page]   # what this page is built from
tags: [vr, input, typography]
---
```

Decision pages additionally carry `decision_status: proposed | accepted | rejected | superseded` and,
when superseded, `superseded_by: decisions/000N-...md`.

**Links:** use relative markdown links (`[Hit targets](../concepts/hit-targets.md)`) so they work on GitHub,
in editors and in Obsidian. Link the first mention of any entity or concept that has its own page.

**Page body shape:**

1. One-paragraph summary (what and why it matters for this project).
2. Content: facts, numbers, rules. Put a citation after each claim: `([source](url))` or
   `([raw](../../raw/...))`.
3. `## Implications for the prototype` — concrete, actionable consequences (concept/entity pages).
4. `## Open questions` — if any.
5. `## Related` — links to neighbor pages.

Keep pages focused (one idea per page). Split a page when it grows past ~300 lines.

## Operations

### Ingest (a new source arrives)

1. Save the source into the right `raw/` subfolder with a date suffix (`name-YYYY-MM-DD.ext`).
   For copyrighted articles store a pointer + paraphrased capture notes, not the full text.
2. Read it and summarize key takeaways to the owner (in chat).
3. Create `wiki/sources/<same-name>.md` with the summary and key claims.
4. Update or create every affected entity / concept / synthesis page. Note contradictions explicitly.
5. Update `wiki/index.md`.
6. Append to `wiki/log.md`: `## [YYYY-MM-DD] ingest | <source title>` + a short list of touched pages.

### Query (the owner asks a question)

1. Read `wiki/index.md`, open the relevant pages, answer with links to wiki pages / sources.
2. If the answer is reusable (a comparison, a checklist, an analysis), file it as a new page in
   `wiki/synthesis/`, update the index, log it as `query`.

### Decide (a design or technical decision is taken)

1. Create `wiki/decisions/000N-title.md`: context, options considered, decision, consequences.
2. Link it from affected concept pages and from `overview.md`. Log it as `decision`.

### Lint (periodic health check, or when asked)

Check and fix, then log as `lint`:
- contradictions between pages, or between a page and a newer source;
- stale claims (older source superseded by a newer one) → mark `status: superseded`, link the replacement;
- orphan pages (no inbound links) and pages missing from `index.md`;
- broken relative links;
- concepts mentioned in several pages that deserve their own page;
- `## Open questions` that can now be answered.

### Build (implementing the prototype)

Before implementing UI, read [wiki/synthesis/vr-design-principles.md](wiki/synthesis/vr-design-principles.md)
and the relevant concept pages. When an implementation reveals new knowledge (a Quest Browser quirk, a perf
number), file it back into the wiki the same day.

## Write gates

- Changing a page with `status: stable` or a decision with `decision_status: accepted` requires either
  a new source that justifies the change or explicit approval from the owner. Record the reason in the log.
- When sources contradict each other: keep both claims, cite both, prefer the more recent / more
  authoritative (platform vendor docs > blog posts > forum threads), and add an `## Open questions` entry.
- Never silently delete a page; mark it `superseded` and link the replacement.

## Log format

`wiki/log.md` is append-only, newest entry at the bottom. Heading format (grep-friendly):

```
## [YYYY-MM-DD] <ingest|query|decision|lint|build> | <title>
- touched: wiki/path-a.md, wiki/path-b.md
- note: one line of context (optional)
```

Recent activity: `grep "^## \[" wiki/log.md | tail -10`.
