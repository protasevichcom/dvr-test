# DeoVR Homepage Concept

An interactive, dark-theme prototype of the [DeoVR](https://deovr.com/) VR video catalog homepage —
modern, premium and immersive, designed for desktop browsers and VR headset browsers. Deployed on Vercel.

> Concept work. Not affiliated with or endorsed by DeoVR.

## Documentation

Project knowledge lives in an LLM-maintained wiki (Karpathy's "LLM Wiki" pattern):

- [`wiki/overview.md`](wiki/overview.md) — start here.
- [`wiki/synthesis/vr-design-principles.md`](wiki/synthesis/vr-design-principles.md) — the 10 VR rules.
- [`wiki/index.md`](wiki/index.md) — catalog of all pages; [`wiki/log.md`](wiki/log.md) — history.
- [`raw/`](raw/) — immutable sources (brief, brand assets, research). The verbatim task briefs (`raw/brief/`)
  and the extracted deovr.com CSS dump are kept out of the public repository; wiki links to them resolve
  only in the local copy. Their content is summarized in [`wiki/sources/`](wiki/sources/).
- [`AGENTS.md`](AGENTS.md) — rules for agents and humans maintaining the wiki and the code.

The folder also opens as an Obsidian vault.

## Prototype

A spatial homepage: a softly blurred room with pointer parallax, a shade, a circular screen vignette,
a floating nav pill, and a WebGL dome of 16:9 posters laid on a grid on the sphere, seen from the inside —
posters bend with the sphere, and so does their UI (or flat planes, `--dome-card-ui-warp: 0`). The 5×4 cluster around
the gaze (3×3 in VR mode) opens up (poster up, details below); a central card plays in a player that grows out of
its poster ([0015](wiki/decisions/0015-video-player-from-poster.md)); paging turns the dome
([decisions 0005](wiki/decisions/0005-spatial-homepage-layout.md), [0006](wiki/decisions/0006-webgl-dome.md)).

Static site, no build step: HTML + native ES modules + CSS (+ three.js from a CDN), built from components and design tokens
([0003](wiki/decisions/0003-components-and-design-tokens.md), [0004](wiki/decisions/0004-no-build-es-modules.md)).

### Run locally

```bash
/usr/bin/python3 scripts/serve.py
```

Open http://127.0.0.1:5173. Add `?mode=vr` (or use the headset icon in the menu) for VR comfort mode.

### Controls

Drag in any direction; a trackpad pans continuously on both axes, a mouse wheel steps a card at a time;
←/→ move along a row, ↑/↓ between rows. In VR mode a joystick appears too (drag the knob to glide, tap its rim
to step). Click any card to bring it to the center; click an open card to play it (Escape or the close
button shrinks the player back into the poster). For You / New / Trending under the menu switch the feed with
a fly-out / fly-in animation. The feed is endless; featured banners repeat on a fixed lattice.

### Deploy

Live: https://deovr-homepage-concept.vercel.app (Vercel project `deovr-homepage-concept`, linked via `.vercel/`).
Static: no `package.json`, no build command, output = project root. `.vercelignore` keeps `raw/`, `wiki/`
and agent files out of the deployment.

The system Node is an x86_64 build that does not run on this arm64 Mac, so run the Vercel CLI with an
arm64 Node from nodejs.org (unpacked anywhere, nothing installed globally):

```bash
PATH="/path/to/node-v24-darwin-arm64/bin:$PATH" vercel deploy --prod
```

### Code map

| Path | What |
|---|---|
| `src/tokens/` | Primitive and semantic design tokens, VR and reduced-motion overrides |
| `src/components/` | DOM: `room-backdrop`, `scene-shade`, `screen-vignette`, `nav-pill`, `icon-button`, `logo`, `icon`, `toast`, `badge` (duration, feature pill), `avatar`, `pagination`, `joystick`, `icon-toggle-group`, `segmented-tabs`, `video-card` (UI of an open card, warped or flat), `featured-banner` (arrows and pagination), `video-player` (grows out of its poster), `tooltip`. Dome: `dome-gallery` (three.js scene, shaders, sphere-grid geometry, projection) |
| `src/data/videos.js` | Endless deterministic feed: `videoForCell(row, column)` |
| `src/data/banners.js` | Featured banner gallery items |
| `scripts/serve.py` | Local static server with caching disabled |
| `src/lib/` | DOM helper, token reader, environment (display mode, WebXR), parallax, formatting, overlay placement |

### Credits

Room image: provided by the project owner. Posters: Unsplash photos via picsum.photos.
Preview clips: MDN CC0 sample videos. Premium / Top Picks marks: DeoVR's own icons (raw/brand).
