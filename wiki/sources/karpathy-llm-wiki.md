---
title: "Source: LLM Wiki pattern (Karpathy)"
type: source
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/articles/karpathy-llm-wiki.md, https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f]
tags: [process, documentation]
---

# Source: LLM Wiki pattern (Karpathy)

The documentation method used in this repo. Raw notes: [karpathy-llm-wiki.md](../../raw/articles/karpathy-llm-wiki.md).

## Takeaways applied here

- Three layers → `raw/` (immutable sources), `wiki/` (compiled pages), [AGENTS.md](../../AGENTS.md) (schema).
- Operations ingest / query / lint are defined in AGENTS.md; we added two project-specific ones:
  **decide** (ADR pages in `wiki/decisions/`) and **build** (implementation feeds findings back into the wiki).
- `index.md` = catalog, `log.md` = append-only, grep-friendly chronology.
- Plain markdown with relative links, so the wiki renders on GitHub and opens as an Obsidian vault.

## Adaptations

- Links use relative markdown paths instead of `[[wikilinks]]` so they also work on GitHub / Vercel previews.
- Frontmatter includes `status` and `sources` to support lint (stale and unverified claims).

## Related

- [overview](../overview.md)
