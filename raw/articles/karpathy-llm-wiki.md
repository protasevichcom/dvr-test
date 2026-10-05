# Source pointer — "LLM Wiki" by Andrej Karpathy

- URL: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- Retrieved: 2026-10-05
- Type: GitHub gist (idea file / pattern description)
- Note: full text is not mirrored here; read the original via the URL. Below are capture notes (paraphrased).

## Capture notes

- Three layers: raw sources (immutable, curated by a human), the wiki (markdown pages written and
  maintained by the LLM), and a schema file (CLAUDE.md / AGENTS.md) that tells the LLM how the wiki works.
- Knowledge is compiled once at ingest time and kept current, instead of being re-derived from raw
  documents on every question (contrast with plain RAG).
- Operations: ingest (read source, discuss takeaways, write a source summary, update index, touch the
  related entity/concept pages, append to log), query (search wiki, answer with citations, optionally file
  the answer back as a new page), lint (contradictions, stale claims, orphans, missing links, gaps).
- index.md: content-oriented catalog; every page with a link and a one-line summary, grouped by category.
- log.md: append-only chronology with a parseable heading prefix, e.g. `## [YYYY-MM-DD] ingest | Title`.
- Plain markdown in git; Obsidian works well as the viewer (graph view, Dataview over frontmatter).
- Human curates sources and asks questions; the LLM does the bookkeeping (cross-refs, summaries, consistency).
