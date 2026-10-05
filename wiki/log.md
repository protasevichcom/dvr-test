# Wiki log

Append-only. Newest entry at the bottom. Format: `## [YYYY-MM-DD] <ingest|query|decision|lint|build> | <title>`.

## [2026-10-05] build | Wiki scaffold created
- touched: AGENTS.md, CLAUDE.md, wiki/index.md, wiki/log.md, wiki/overview.md
- note: LLM Wiki structure (raw / wiki / schema) set up for the DeoVR homepage concept.

## [2026-10-05] ingest | Task brief
- touched: wiki/sources/task-brief-2026-10-05.md, wiki/overview.md

## [2026-10-05] ingest | LLM Wiki pattern (Karpathy)
- touched: wiki/sources/karpathy-llm-wiki.md, AGENTS.md

## [2026-10-05] ingest | deovr.com homepage snapshot
- touched: wiki/sources/deovr-homepage-2026-10-05.md, wiki/entities/deovr.md

## [2026-10-05] ingest | DeoVR CSS tokens and logo
- touched: wiki/sources/deovr-brand-tokens-2026-10-05.md, wiki/concepts/brand-identity.md

## [2026-10-05] decision | 0001 Tech stack (proposed)
- touched: wiki/decisions/0001-tech-stack.md

## [2026-10-05] ingest | VR UX research report
- touched: raw/research/vr-ux-research-2026-10-05.md, wiki/sources/vr-ux-research-2026-10-05.md, wiki/concepts/* (10 pages), wiki/entities/meta-quest-browser.md, wiki/entities/apple-vision-pro-safari.md, wiki/entities/pico-browser.md, wiki/entities/webxr.md
- note: Meta Horizon, Apple HIG, Android XR, WebXR, MDN, Microsoft MR, W3C XAUR.

## [2026-10-05] decision | 0002 Dark theme brand tokens (proposed)
- touched: wiki/decisions/0002-dark-theme-brand-tokens.md, wiki/concepts/dark-theme-in-vr.md
- note: contrast ratios computed for every text/background pair.

## [2026-10-05] ingest | Brief addendum: code quality
- touched: raw/brief/brief-addendum-code-quality-2026-10-05.md, AGENTS.md (hard rule 6), wiki/sources/task-brief-2026-10-05.md

## [2026-10-05] decision | 0003 Components and design tokens (accepted)
- touched: wiki/decisions/0003-components-and-design-tokens.md, wiki/decisions/0001-tech-stack.md
- note: owner requirement — components + tokens, clean code. 0001 now specifies CSS Modules.

## [2026-10-05] query | VR design principles and homepage brief
- touched: wiki/synthesis/vr-design-principles.md, wiki/synthesis/homepage-ux-brief.md, wiki/synthesis/device-test-plan.md, wiki/overview.md, wiki/index.md

## [2026-10-05] ingest | Spatial layout brief + room image
- touched: raw/brief/brief-spatial-layout-2026-10-05.md, wiki/sources/brief-spatial-layout-2026-10-05.md, wiki/synthesis/homepage-ux-brief.md

## [2026-10-05] decision | 0004 No-build ES modules (accepted, supersedes 0001)
- touched: wiki/decisions/0004-no-build-es-modules.md, wiki/decisions/0001-tech-stack.md, wiki/decisions/0003-components-and-design-tokens.md, AGENTS.md
- note: local Node/ffmpeg are x86_64 on arm64 without Rosetta.

## [2026-10-05] decision | 0005 Spatial homepage layout (accepted)
- touched: wiki/decisions/0005-spatial-homepage-layout.md, wiki/overview.md, wiki/index.md
- note: pointer parallax on the room is a conscious, mitigated exception to principle 6.

## [2026-10-05] build | Prototype v1
- touched: index.html, src/**, assets/**, jsconfig.json, .vercelignore
- note: verified in the browser pane — 2/3/2 cluster, paging (button, drag), info transitions, VR mode toggle, tooltips, hover preview; no console errors. Found and fixed: slot pitch not recomputed on resize; text overflow at small sizes (cards now scale as whole objects).

## [2026-10-05] ingest | Dome refinements brief + deovr.com feature icons
- touched: raw/brief/brief-dome-refinements-2026-10-05.md, raw/brand/deovr-feature-icons-2026-10-05.svg, wiki/sources/brief-spatial-layout-2026-10-05.md

## [2026-10-05] decision | 0006 WebGL dome with fisheye projection (accepted)
- touched: wiki/decisions/0006-webgl-dome.md, wiki/decisions/0005-spatial-homepage-layout.md, wiki/synthesis/homepage-ux-brief.md, wiki/concepts/vr-video-formats.md, wiki/synthesis/device-test-plan.md, wiki/overview.md, wiki/index.md, README.md
- note: owner removed title and format badges from cards; Premium / Top Picks marks as on deovr.com; short dates.

## [2026-10-05] build | Prototype v2 (WebGL dome)
- touched: src/components/dome-gallery/*, src/components/video-card/drawVideoCard.js, src/components/{badge,avatar,icon}/draw*.js, src/components/screen-vignette/*, src/components/scene-shade/*, src/tokens/*, src/lib/{tokens,parallax,format}.js, src/data/videos.js, src/main.js, index.html
- note: verified at 800×450 and 1920×1080 (16:9): curved cards, vignette, activation motion, paging (button, keys), hover ring + play + preview, VR mode; no errors on the current load.

## [2026-10-05] ingest | Sphere grid + flat text brief
- touched: raw/brief/brief-dome-grid-2026-10-05.md, wiki/sources/brief-spatial-layout-2026-10-05.md

## [2026-10-05] decision | 0006 revised: posters on a yaw × pitch sphere grid, text as flat DOM
- touched: wiki/decisions/0006-webgl-dome.md, wiki/decisions/0005-spatial-homepage-layout.md, wiki/index.md, README.md
- note: tangent-plane cards baked their shape and could overlap; grid cells re-derive shape from the sphere and cannot overlap.

## [2026-10-05] build | Prototype v3 (sphere grid, DOM overlays)
- touched: src/components/dome-gallery/{projection,geometry,shaders,DomeScene,DomeGallery}.js, src/components/video-card/VideoCardOverlay.js + css, src/components/badge/{Badge,FeaturePill}.js + css, src/components/avatar/*, src/tokens/semantic.css, index.html, src/main.js; removed canvas draw* modules
- note: verified at 800×450: no overlaps, posters reshape while turning, flat text follows posters, hover ring + play; no errors on current load. 1920×1080 visual check pending (pane was hidden; rAF paused).

## [2026-10-05] ingest | Banner, physical sphere, edge-aligned text brief
- touched: raw/brief/brief-banner-and-physics-2026-10-05.md, wiki/sources/brief-spatial-layout-2026-10-05.md

## [2026-10-05] decision | 0007 Featured banner gallery (accepted); 0006 revised (1.5 m sphere, edge-aligned text)
- touched: wiki/decisions/0007-featured-banner.md, wiki/decisions/0006-webgl-dome.md, wiki/index.md, wiki/overview.md, README.md

## [2026-10-05] build | Prototype v4
- touched: src/components/{featured-banner,pagination}/*, src/components/dome-gallery/{geometry,DomeScene,DomeGallery,shaders}.js, src/components/video-card/*, src/data/banners.js, src/tokens/semantic.css, src/main.js, index.html, scripts/serve.py
- note: verified at 800×450 and 1920×1080 (cards ≈345 px, banner 722×211 px at 1080p); banner crossfade + pagination; edge-aligned info planes; 17 columns at R = 1.5 m. Console 404s were the browser's automatic /favicon.ico request. Dev server now sends Cache-Control: no-store (stale modules risk).

## [2026-10-05] build | Bigger cards via tighter row gaps
- touched: src/tokens/semantic.css (--dome-card-width-m 0.58, new --dome-row-gap-m 0.02), src/components/dome-gallery/{geometry,DomeGallery}.js, wiki/decisions/0006-webgl-dome.md
- note: 1920×1080 → cards ≈400 px, cluster spans y 100–1021 between nav (90) and hint (1031); 15 columns.

## [2026-10-05] build | Banner without text and badge
- touched: src/components/featured-banner/*, src/components/dome-gallery/DomeGallery.js, src/data/banners.js, src/tokens/semantic.css, wiki/decisions/0007-featured-banner.md
- note: removed title/label overlay, the `label` data field and now-unused tokens (banner title size, text-on-media, editorial gradient).

## [2026-10-05] query | Omnidirectional navigation patterns
- touched: wiki/synthesis/omnidirectional-navigation.md, wiki/index.md
- note: hex-lattice insight; recommended 2D drag + neighbour targets + 6-way puck; vertical = rows flow (comfort).

## [2026-10-05] ingest | Navigation decisions + player-style reference
- touched: raw/brief/brief-navigation-and-player-style-2026-10-05.md, wiki/sources/brief-spatial-layout-2026-10-05.md

## [2026-10-05] decision | 0008 Infinite feed + joystick; 0009 Player-style theme (0002 colours superseded)
- touched: wiki/decisions/0008-infinite-feed-and-joystick.md, wiki/decisions/0009-player-style-theme.md, wiki/decisions/0002-dark-theme-brand-tokens.md, wiki/synthesis/omnidirectional-navigation.md, wiki/concepts/brand-identity.md, wiki/index.md, wiki/overview.md, README.md

## [2026-10-05] build | Prototype v5
- touched: src/components/{joystick}/*, src/components/dome-gallery/{geometry,DomeGallery}.js + css, src/data/videos.js, src/tokens/*, src/components/{icon-button,nav-pill,pagination,toast,badge,icon}/*, src/main.js, index.html
- note: verified at 800×450: diagonal drag, joystick tap step, ↑ zig-zag, banner at home, graphite theme, white tooltips, flame hover ring; no console errors.

## [2026-10-05] build | Smooth navigation (spring, straight vertical)
- touched: src/components/dome-gallery/{DomeGallery,geometry}.js, wiki/decisions/0008-infinite-feed-and-joystick.md
- note: owner: horizontal paging jerky card-to-card, vertical zig-zag. Now a critically damped spring with carried velocity, fling on release, ↑/↓ = two rows straight, parity-preserving snapping, 4-direction joystick taps. Measured: two → presses 150 ms apart give one continuous move (525→285 px, no stall); ↓ keeps x constant (400 px) while y glides 88→−67.

## [2026-10-05] decision | 0010 Feed tabs + Get Premium (accepted)
- touched: wiki/decisions/0010-feed-tabs-and-premium.md, wiki/index.md, wiki/overview.md, README.md, raw/brief/brief-navigation-and-player-style-2026-10-05.md

## [2026-10-05] build | Feed switch animation, Get Premium, cover-fit in shader
- touched: src/components/{button,segmented-tabs}/*, src/components/nav-pill/*, src/components/dome-gallery/{DomeGallery,DomeScene,shaders}.js, src/components/{video-card,featured-banner}/*, src/data/videos.js, src/tokens/semantic.css, src/main.js, index.html
- note: measured: out ripple center→periphery ≈0–900 ms, banner empty ≈490 ms, in ripple periphery→center. Fixed: banner image squashed after the switch (cover-fit was computed before the poster had a size) — cropping now happens in the fragment shader from the poster's current shape.

## [2026-10-05] build | Byline on the poster, banner controls on the image
- touched: src/components/video-card/*, src/components/featured-banner/*, src/components/dome-gallery/DomeGallery.js, src/tokens/semantic.css (--dome-info-height 30, --byline-*), wiki/decisions/0005-spatial-homepage-layout.md, wiki/decisions/0007-featured-banner.md
- note: owner asked to move avatar/channel/date onto the poster next to the duration to grow cards. Measured at 1920×1080 with the feed tabs present: center card 344 → 393 px. Banner arrows and dots moved onto the image (the shorter info area no longer fits them).

## [2026-10-05] build | Banner controls follow the curved image
- touched: src/components/featured-banner/FeaturedBanner.js, src/components/dome-gallery/DomeGallery.js, wiki/decisions/0007-featured-banner.md
- note: per-control local tangent instead of one bottom-chord angle; measured at home: prev +3.6°, next −3.6°, dots 0°.

## [2026-10-05] build | Compact pagination with constant length
- touched: src/components/pagination/pagination.css, src/tokens/semantic.css (--pagination-*), wiki/decisions/0007-featured-banner.md
- note: measured during a switch: total span 64.78–64.79 px (constant), gaps 3.86 px all equal.

## [2026-10-05] build | Fixes: flame colour, banner repeat, switch pause, edge blur, alignment, hover
- touched: src/components/badge/FeaturePill.js, src/components/dome-gallery/{geometry,DomeGallery,DomeScene,shaders}.js, src/components/video-card/video-card-overlay.css, src/components/icon-button/icon-button.css, src/tokens/semantic.css, wiki/decisions/{0005,0007,0008,0010}
- note: flame gradient stops were black — the `s()` helper takes `style` as an object, a string was passed. Banners now repeat every half turn vertically too (10 rows at 16:9). Feed switch overlaps fly-out and fly-in (no empty pause) and blurs poster edges by growing the quad. Stats indented to the avatar; glass buttons invert to white/black on hover.

## [2026-10-05] build | Joystick bottom-right, dome stretched down
- touched: src/components/dome-gallery/{DomeGallery.js,dome-gallery.css}, src/tokens/semantic.css (--dome-safe-bottom, --joystick-inset), wiki/decisions/0008-infinite-feed-and-joystick.md

## [2026-10-05] build | Bigger cards: tighter gaps and margins
- touched: src/tokens/semantic.css (--dome-card-width-m 0.64 / VR 0.75, --dome-card-gap-m 0.03, --dome-safe-gap 4, --dome-safe-bottom 4), wiki/decisions/0006-webgl-dome.md
- note: 1920×1080 center card 398 → 440 px; the cluster now fills y 158–1070 (height-limited). Column count stays 14 (12 in VR) so banners remain every half turn.

## [2026-10-05] build | Bigger joystick with diagonal steps
- touched: src/components/joystick/*, src/components/dome-gallery/DomeGallery.js, src/tokens/semantic.css (--joystick-*), wiki/decisions/0008-infinite-feed-and-joystick.md
- note: joystick 72 → 108 px (VR 96 → 144 px); 8 rim ticks (4 minor diagonals); diagonal taps step to the hex neighbour. Also fixed: the screen-reader "Centered" status was stale on load because cards are created lazily.

## [2026-10-05] build | Fluid rem sizing, joystick closer to center
- touched: src/tokens/{primitives,semantic}.css (--root-font-size, rem conversions), src/styles/base.css, src/components/{video-card,featured-banner,dome-gallery}/*, wiki/decisions/0003-components-and-design-tokens.md, wiki/decisions/0008-infinite-feed-and-joystick.md
- note: measured — 800×450: root 12 px, nav 587×47, joystick 81 px, center card 152 px; 1920×1080: root 19.2 px, nav 939×76, joystick 130 px, center card 422 px.

## [2026-10-05] build | Code review fixes
- touched: src/components/dome-gallery/{DomeGallery,DomeScene,geometry}.js, dome-gallery.css, src/components/{video-card,featured-banner,nav-pill,icon-button,icon,badge,toast,tooltip}/*, src/lib/{overlay,environment,tokens}.js, src/data/videos.js, src/main.js, src/tokens/semantic.css, index.html, README.md
- note: fixed — doubled frame loop (two renders per vsync after an in-frame invalidate), ~45 cards created and dropped per frame at the cull edge, focus not following the center on ↑/↓, stale click suppression after pointercancel, banner images re-requested, nav marking unreachable sections current, IconName typed as string, wheel line mode, Alt/Cmd+arrows hijacked, preview kept running after switching to VR, display mode persisted from URL / UA guess. Also: shared overlay helpers (lib/overlay.js), tooltip as its own component, --toast-duration and --dissolve-blur tokens, unused semantic tokens and --dome-rows removed (--accent-quality and --radius-panel kept: decision 0009), anisotropy capped at 4, three.js modulepreload, Inter 500–700 only, videoForCell cache removed (unbounded on the endless feed). Verified in the browser pane (rAF stubbed with message tasks while the pane was hidden).

## [2026-10-05] decision | 0011 Open cluster 3/4/3 (configurable)
- touched: src/components/dome-gallery/{geometry,DomeGallery}.js, src/tokens/semantic.css (--dome-cluster-middle, --dome-cluster-width-share), wiki/decisions/0011-cluster-3-4-3.md, wiki/index.md, wiki/overview.md
- note: kept the externally improved announceCenter / focusCenterPending logic and pointed it at the new center cell (left of the two middle cards).

## [2026-10-05] decision | 0011 revised: open cluster 4/5/4
- touched: src/tokens/semantic.css (--dome-cluster-middle 5), src/components/dome-gallery/{DomeGallery,geometry}.js (overlay pool 40), wiki/decisions/0011-cluster-3-4-3.md, wiki/index.md, wiki/overview.md
- note: banner back in the top row, centered (4 top cells). 1920×1080: 13 cards, 303–385 px, no joystick overlap.

## [2026-10-05] build | Flat, undistorted menu, tabs and joystick
- touched: src/components/nav-pill/nav-pill.css, src/tokens/semantic.css (removed --nav-tilt, --nav-perspective), wiki/decisions/0005-spatial-homepage-layout.md
- note: the nav pill had a 6° rotateX tilt with perspective, and the header followed the parallax with a fractional translate3d (softens text). Both removed; verified no transform/perspective/filter on the nav, tabs or joystick chains.

## [2026-10-05] decision | 0012 Card UI painted onto the sphere (experiment)
- touched: src/lib/homography.js (new), src/lib/overlay.js, src/components/{video-card,featured-banner}/*, src/components/dome-gallery/DomeGallery.js, src/tokens/semantic.css (--dome-card-ui-warp), wiki/decisions/0012-warped-card-ui.md, wiki/decisions/0006-webgl-dome.md, wiki/index.md
- note: built on the externally refactored lib/overlay.js helpers. Verified: matrix3d on overlay anchors, warped banner arrow is clickable (page 0 → 1), switching the token back to 0 restores flat planes, feed switch works in warp mode.

## [2026-10-05] build | Solid Top Picks flame
- touched: src/components/badge/{FeaturePill.js,feature-pill.css}, src/tokens/{primitives,semantic}.css (--feature-top-picks, removed gradient stops)
- note: the flame used an SVG gradient paint server referenced by `fill: url(#…)`, fragile under the warped (matrix3d) card UI; now one solid colour (#ff7b00).

## [2026-10-05] build | Display-mode switch, 2/3/2 in VR
- touched: src/components/icon-toggle-group/* (new), src/components/icon/glyphs.js (monitor), src/components/nav-pill/*, src/main.js, src/tokens/semantic.css (VR --dome-cluster-middle 3), index.html, wiki/decisions/0005, 0011
- note: switch [monitor | headset] sits left of Get Premium; verified desktop 4/5/4 (11 cards + banner) ↔ VR 2/3/2 (5 cards + banner). VR nav fits the Quest default panel (1280×670: 884 px); below ~66rem the Get Premium label collapses to the diamond icon (800 px VR: 779 px).

## [2026-10-05] decision | 0013 Aligned grid (3/5/3, VR 3/3/3)
- touched: src/components/dome-gallery/{geometry.js,DomeGallery.js}, src/tokens/semantic.css (--dome-grid-offset, --dome-cluster-outer, --dome-banner-span), wiki/decisions/0013-aligned-grid.md, 0011 (superseded), raw/brief (items 29–30), wiki/index.md
- note: geometry generalized for both grids (rowStride, bannerCells, generic cluster/ring/snap). Verified: desktop home 8 cards + 3-cell banner as the top row, ↓ → 3/5/3 (11 cards); VR home 6 + banner, ↓ → 3/3/3; feed switch keeps the layout; no console errors.

## [2026-10-05] build | Card rows swapped: counts on the poster, byline below
- touched: src/components/badge/Badge.js (content + `as`), src/components/video-card/{VideoCardOverlay.js,video-card-overlay.css}, src/tokens/semantic.css (--byline-reserve → --poster-meta-reserve), wiki/decisions/0005, 0012, raw/brief (item 31)
- note: the engagement list is a Badge rendered as `ul` (same typography and pill as the duration); the byline under the poster has no pill. Verified desktop and VR: the byline fits --dome-info-height, the counts pill never reaches the duration pill.

## [2026-10-05] build | Counts and duration pills aligned
- touched: src/components/video-card/video-card-overlay.css
- note: the pills are inline-flex inside block anchors, so each sat on a line box; the counts pill's baseline is an icon, the duration's is text, giving anchors of 17 vs 15 px. Anchors are now flex containers (14 = 14 px); the warp then places both pills on the same bottom inset.

## [2026-10-05] build | Smooth desktop ↔ VR mode switch
- touched: src/lib/view-transition.js (new), src/styles/view-transitions.css (new), index.html, src/main.js, src/components/dome-gallery/{DomeGallery.js,dome-gallery.css}, src/components/nav-pill/nav-pill.css, src/tokens/semantic.css (--motion-mode-switch), wiki/concepts/headset-detection.md, raw/brief (item 32)
- note: the mode change runs inside document.startViewTransition; the gallery relayouts and draws synchronously on `displaymodechange` so the new state is captured with the new dome, then its cards fly in (arrivalStart). Verified both directions in Chromium: 520 ms root crossfade + morphing nav-pill / nav-accessory / joystick groups, no errors. The toast now names the current clusters (3/5/3, 3/3/3).

## [2026-10-05] decision | 0014 Display-mode switch by gliding tokens; 3/3/3 in both modes
- touched: src/tokens/mode-transition.css (new), src/tokens/semantic.css (cluster 3/3/3 everywhere, --motion-mode-switch 700 ms), src/lib/environment.js (animate + duration), src/main.js, src/components/dome-gallery/{DomeGallery.js,geometry.js,dome-gallery.css}, src/components/{video-card,featured-banner}/* (remeasure), src/components/{nav-pill,toast,screen-vignette}/*.css, index.html; removed src/lib/view-transition.js and src/styles/view-transitions.css; wiki/decisions/0014 (new), 0013, 0006, wiki/concepts/headset-detection.md, wiki/overview.md, wiki/index.md, README.md, raw/brief (items 33–37)
- note: replaces the view-transition switch of the previous entry. Verified at 1100×620 both directions: nav, joystick, root and card type sizes glide monotonically, 6 open cards throughout, no console errors; toast reads "VR mode on/off".

## [2026-10-05] build | Desktop 5×5 cluster, VR 3×3; root size review
- touched: src/components/dome-gallery/{geometry.js,DomeGallery.js} (clusterRows, halfRows, generic clusterAround/ringOf/homeRest, banner click centers like home), src/tokens/semantic.css (--dome-cluster-rows; desktop 5/5/5, VR 3/3/3), wiki/decisions/0013, 0014, wiki/overview.md, wiki/index.md, README.md, raw/brief (items 38–39)
- note: mode switch keeps the center; the outer ring dims 5×5 → 3×3 (22 → 9 open overlays + banner) and back. Measured text: desktop root 12.8 / 16 / 19.2 px at 1280×720 / 1440×900 / 1920×1080 but card captions 5.4 / 6.7 / 8.1 px (overlay scale 0.56); VR on the Quest panel 1280×670: root 14 px (the floor), card caption 9.5 px. Card text follows poster width × caption / --dome-reference-card-width, not the root size.

## [2026-10-05] build | Desktop sphere radius 3 m (VR 1.5 m)
- touched: src/tokens/semantic.css (--dome-radius-m 3, VR override 1.5), src/tokens/mode-transition.css (registered --dome-radius-m), wiki/decisions/0006, 0014, raw/brief (item 40)
- note: at 1440×900 the 5×5 cards are 163–177 px wide (nearly flat; was 120–156 px with strong corner bending); the cluster is now bound by the 100° view (x 282–1158, y 212–835), not by the screen height; card captions ≈ 7.1 px. Mode switch glides radius 3 → 1.5 m: the tracked center card grows 165 → 276 px with no frame jumps.

## [2026-10-05] build | Softer mode switch, ring changes in step, fixed banner lattice
- touched: src/lib/easing.js (new), src/lib/tokens.js (readEasingToken), src/tokens/{primitives,semantic,mode-transition}.css (--duration-900, --ease-in-out-soft, --motion-ease-mode, --dome-banner-columns, --dome-banner-rows), src/components/dome-gallery/{DomeGallery.js,geometry.js} (Tween glides, layout.bannerColumns/bannerRows from tokens, `columns` removed), wiki/decisions/0014, raw/brief (items 41–43)
- note: at 1440×900 desktop → VR the center card (170 → 276 px) and the closing outer ring (openness 0.57 at mid-way) finish together at ≈ 900 ms, no frame jumps. Round trip after moving 3 rows / 5 columns: same 25 cards and center, no banner shown. Gaps measured (1440×900): desktop 6.8 px horizontal / 5 px vertical (0.03 / 0.02 m at 3 m), VR 10.1 / 5.9 px (at 1.5 m).

## [2026-10-05] build | Mirror-symmetric mode switch
- touched: src/components/dome-gallery/{geometry.js (ClusterSize, fractional clusterBounds, tokens.clusterFit),DomeGallery.js (clusterGlide, switchStart, reconcile fades only replacements)}, wiki/decisions/0014, raw/brief (item 44)
- note: cause — the fit used the new cluster at once (5×5 at 1.5 m) and new cells flew in with a dissolve. Measured at 1440×900, desktop → VR at t vs VR → desktop at 900 − t: center card width 165/170, 174/186, 229/222, 267/257, 275/271 px; outer-ring openness within 0.08; widths monotonic in both directions. Also: the dev server had hit its background time limit (page loaded half its modules); restarted.

## [2026-10-05] build | Desktop view zoomed in (FOV 88°)
- touched: src/tokens/semantic.css (--dome-fov 88 desktop, VR override 100), src/tokens/mode-transition.css (registered --dome-fov), wiki/decisions/0006, 0014, raw/brief (item 45)
- note: 1440×900: 5×5 cards 163–177 → 188–204 px; the cluster now spans y 164–883 (nav bottom 147) and ends left of the joystick (x 1226 vs 1260). Mode switch stays monotonic both ways (center 190 ↔ 276 px).

## [2026-10-05] build | Desktop cluster 3·5·5·5·3
- touched: src/components/dome-gallery/{geometry.js,DomeGallery.js} (clusterMiddle/Outer → clusterColumns/Edge: inner rows vs first and last rows; ClusterSize {columns, edge, rows}), src/tokens/semantic.css (--dome-cluster-columns, --dome-cluster-edge replace --dome-cluster-middle/-outer), wiki/decisions/0013, wiki/index.md, raw/brief (item 46)
- note: 1440×900: home 18 cards + the banner as the whole top row; one row down 21 cards; VR 9; back 21; no console errors. 3-row shapes keep their meaning (3/5/3 = rows 3, columns 5, edge 3).

## [2026-10-05] ingest | DeoVR logo, white wordmark + color mark
- touched: raw/brand/deovr-logo-wh-color-2026-10-05.svg (new), wiki/sources/deovr-logo-wh-color-2026-10-05.md (new), wiki/concepts/brand-identity.md (open question answered), wiki/index.md; build: assets/brand/deovr-mark.png (new mark, 169×192), src/components/logo/{Logo.js,logo.css,wordmark-path.js}, src/tokens/semantic.css (--logo-height 2.25/2.5rem, --logo-wordmark-ratio, --logo-gap-ratio)
- note: verified in the nav at 1440×900 (mark 32×36 px, wordmark 66×16 px). Also added the missing `MODE_SWITCH_SLACK_MS` export to src/lib/environment.js: DomeGallery.js had been edited outside this session to import it, which stopped the page from loading.

## [2026-10-05] build | Second code review fixes
- touched: src/components/dome-gallery/{DomeGallery,geometry}.js, src/components/video-card/{VideoCardOverlay.js,video-card-overlay.css}, src/components/featured-banner/FeaturedBanner.js, src/components/{nav-pill/NavPill.js,icon-toggle-group/*}, src/lib/{homography,overlay}.js, src/main.js, src/tokens/semantic.css, wiki/decisions/0013-aligned-grid.md (helper list: `clusterAround` removed; owner asked to fix all review items)
- note: warp mode — the play button no longer has a transform transition (it restarted every frame and trailed the poster) and grows with the highlight tween; overlay sizes are written for all overlays before any is measured (mode switch: ≈1 forced layout per frame instead of one per overlay, measured 65 / 66 frames). The dome follows a mode switch for MODE_SWITCH_SLACK_MS longer so the last relayout reads final token values. Overlay pool grows on demand (was a fixed 40; a fast joystick sweep used 35). clusterFit is pure. Removed dead `clusterAround`, `clearWarp`, `bannerRowPeriod`, `NavPill.setDisplayMode`, duplicate pressed style; reduced motion now also overrides the VR parallax depths; stale comments (hex / 1.5 m / 2/3/2, VR banner spacing) fixed. Verified with an emulated 1440×900 viewport: warp + flat modes, mode switch both ways, feed switch, banner arrow; no console errors.

## [2026-10-05] build | Room backdrop: hidden on desktop, clearer in VR
- touched: src/tokens/semantic.css (--scene-backdrop-opacity desktop 0 / VR 1, VR --scene-shade-opacity 0.52 → 0.35), src/tokens/mode-transition.css (registered), src/components/room-backdrop/room-backdrop.css, wiki/decisions/0005, raw/brief (item 47)
- note: the room image fades in and out with the mode switch (sampled 1 → 0.85 → 0.52 → 0.10 → 0 over ≈ 900 ms).

## [2026-10-05] build | Banner pagination under the image, in the byline strip
- touched: src/components/featured-banner/{FeaturedBanner.js,featured-banner.css} (info strip replaces the dots anchor; place() takes `info`, prepareWarp takes `scale`), src/components/pagination/{Pagination.js,pagination.css} (`variant: 'bare'`), src/components/dome-gallery/DomeGallery.js, wiki/decisions/0007, raw/brief (item 48)
- note: 1100×620: first dot 3 px in from the banner's left edge (card avatars: 4 px), centered in the byline row; clicking "Show 3 of 7" switches the banner; no console errors.

## [2026-10-05] build | Banner pagination centered
- touched: src/components/featured-banner/featured-banner.css, wiki/decisions/0007, raw/brief (item 49)
- note: centered under the banner in the byline strip (1100×620: banner and pagination centers both at x 550).

## [2026-10-05] build | Banner pagination: same distance from the image as bylines
- touched: src/components/featured-banner/{FeaturedBanner.js,featured-banner.css} (warp: strip hugs the pagination, mapped under the middle of the image), wiki/decisions/0007, raw/brief (item 50)
- note: slot heights already matched (strip 23 px, row 20 px at 1100×620); the dots sat on the straight chord above the sagging bottom edge. 800×450: dot center now 5.8 px below the image's middle (byline equivalent 5.7 px; before ≈ 3 px).

## [2026-10-05] build | Gallery performance: culling, off-thread decode, upload budget
- touched: src/components/dome-gallery/{geometry.js (screenCull, rowsInView, cullPitchUp/Down),DomeGallery.js (upload queue, aborts, onSettle, prefetch, AA bleed),DomeScene.js (ImageBitmap sources, antialias off)}, src/lib/images.js (new), src/lib/parallax.js, src/main.js, src/components/room-backdrop/*, src/tokens/semantic.css (--dome-cull-margin replaces --dome-cull-angle / --dome-cull-pitch), wiki/decisions/0005-spatial-homepage-layout.md, wiki/concepts/performance-in-headsets.md (owner asked for the optimization; measured section added)
- note: measured at 1440×900 with rAF on message tasks (hidden pane; CSS/GPU not measured). Before: feed switch 285 texture uploads (1.5 s, up to 168 in one frame, 897 ms frame); ~300 posters drawn per frame. After: 110 uploads in 34 ms, ≤ 3 per frame while scrolling, longest frame 36 ms; 110 posters drawn on desktop, 70 in VR (?mode=vr). Edges without MSAA: 609 / 609 sampled crossings have partial-alpha pixels. Parallax custom properties now live on the backdrop (not :root); the backdrop blur sits inside the moving layer. Other feeds' posters are prefetched into the HTTP cache when the dome settles; the benefit could not be measured here (all images already cached), it targets slow networks.

## [2026-10-05] build | Deployed to Vercel
- touched: wiki/overview.md, README.md, .vercelignore (adds `__ui-test.html`)
- note: Vercel CLI 54.7.1 run with an arm64 Node v24.21.0 from nodejs.org (system x86_64 Node fails with "Bad CPU type"); CLI was already logged in. New project `deovr-homepage-concept`, production at https://deovr-homepage-concept.vercel.app — page renders, all module/CSS/image requests 200, no console errors; `/wiki/*` and `/__ui-test.html` return 404 as intended.

## [2026-10-05] build | Round Get Premium button after the profile
- touched: src/components/icon-button/{IconButton.js,icon-button.css} (`accent` variant), src/components/nav-pill/{NavPill.js,nav-pill.css} (premium after the profile; removed the label-collapse container queries and container-type), wiki/decisions/0010, 0005, raw/brief (item 51)
- note: 1100×620: the nav pill is 546 px on desktop (794 px in VR) and fits both modes; the button keeps the "Get Premium" tooltip and accessible name and opens the toast. `components/button/Button` is now unused by the page but kept in the component library.

## [2026-10-05] build | Card UI in WebGL: tried and reverted
- touched: none (net); src/components/video-card/cardUi.js was added and removed; DomeGallery.js, DomeScene.js, shaders.js, VideoCardOverlay.js, video-card-overlay.css, FeaturedBanner.js, featured-banner.css, dome-gallery.css, semantic.css, lib/{tokens,overlay}.js restored to their previous state
- note: experiment for performance. Card UI was drawn into a per-card canvas atlas and composited in the poster shader, the vignette was computed in the shader, and flat mode was dropped. This cut the DOM over the dome from 1365 to 83 nodes. Reverted at the owner's request before visual review; decisions 0012 (warp / flat) and the DOM card UI stand.

## [2026-10-05] decision | 0015 Video player that grows out of its poster
- touched: src/components/video-player/{VideoPlayer.js,video-player.css} (new), src/components/icon/glyphs.js (close), src/components/dome-gallery/{DomeGallery.js (PlayerSource, Card.playing, setPaused),dome-gallery.css}, src/components/nav-pill/nav-pill.css, src/main.js, src/data/videos.js (videoSrc), src/tokens/semantic.css (--motion-player, --motion-ease-player, --surface-player, --player-close-offset), index.html, wiki/decisions/0015 (new), wiki/index.md, raw/brief (item 52)
- note: verified at 1100×620 with a real click: opens to the full viewport, plays with sound, chrome hidden, focus on the close button; Escape shrinks it back into the poster (1100 → 146 px, poster 140 px) with the nav fading back in step; no console errors.

## [2026-10-05] build | Desktop cluster 5×4 (rows above the gaze as a token)
- touched: src/components/dome-gallery/{geometry.js (rowsAbove/rowsBelow replace halfRows; ClusterSize.above),DomeGallery.js}, src/tokens/semantic.css (--dome-cluster-rows 4, --dome-cluster-rows-above 1, --dome-cluster-edge 5; VR above 1), wiki/decisions/0013, wiki/index.md, raw/brief (item 53)
- note: 1100×620: home 17 cards + the banner (top row: banner with a card on each side); one row down 20; VR 9; back 20; no console errors. The dev server had hit its background limit again and was restarted for this check.

## [2026-10-05] build | Desktop view zoomed in further (FOV 80°)
- touched: src/tokens/semantic.css (--dome-fov 88 → 80), wiki/decisions/0006, raw/brief (item 54)
- note: 1440×900, 5×4: cards 188–204 → 208–226 px (+10%), cluster x 158–1282, y 205–842 (nav bottom 147). Tried: 74° → 227–246 px, 70° → 241–261 px (cluster reaches the bottom edge). From 80° the bottom-right card's corner passes under the joystick (x 1260).

## [2026-10-05] build | Desktop FOV 74°
- touched: src/tokens/semantic.css (--dome-fov 80 → 74), wiki/decisions/0006, raw/brief (item 55)
- note: owner's pick from the measured options; 1440×900: cards ≈ 227–246 px, cluster x ≈ 109–1331, y ≈ 177–870.

## [2026-10-05] build | Joystick VR-only; continuous trackpad panning
- touched: src/tokens/{semantic,mode-transition}.css (--joystick-opacity, --joystick-visibility), src/components/dome-gallery/{dome-gallery.css,DomeGallery.js} (isTrackpad, panByTrackpad, TRACKPAD_IDLE_MS; the spring waits while the trackpad pans), wiki/decisions/0008, raw/brief (item 56)
- note: 1100×620: desktop joystick opacity 0 / hidden, VR 1 / visible, fading out mid-switch (0.79, still visible). A synthetic diagonal trackpad swipe (Δx 6, Δy 4 px × 20) moves a card diagonally every frame (no single-axis steps) and snaps after the gesture; wheel notches (100 px) and line deltas still step.

## [2026-10-05] build | Redeployed to Vercel
- touched: (deployment only)
- note: production https://deovr-homepage-concept.vercel.app updated to the current local state (deployment 1x88yi6s2); index.html matches local, posters load, no console errors.

## [2026-10-05] build | Third code review fixes
- touched: src/components/video-player/{VideoPlayer.js,video-player.css}, src/components/dome-gallery/DomeGallery.js, src/components/icon/glyphs.js (soundOff), src/main.js, index.html, README.md, .vercelignore; removed src/components/button/ (unused since Get Premium became an IconButton)
- note: player — Escape closes from anywhere (document listener); closing during opening shrinks from the frame's current corners (was a jump to full screen); keyboard focus returns to the played card once its overlay is back (was lost to body); a "Turn sound on" button appears when playback had to start muted; the dome stays inert until the player has landed. Wheel — ctrl + wheel (trackpad pinch) is ignored; mouse-wheel notches are recognised from the legacy wheelDeltaY (±120), so Safari's few-px notches step a card (Safari itself not tested); parallax does not redraw the dome under the player. Verified in the browser pane with an emulated 1440×900 viewport; no console errors.

## [2026-10-05] lint | Tokens and components audit
- touched: src/tokens/semantic.css (spacing scale, radius / border / line-height roles, layers, press / play / toast / nav-divider / avatar tokens; literals → primitives), all component CSS and src/styles/base.css (primitives → semantic, raw values → tokens), src/components/{poster-overlay,poster-hit,poster-strip}/* (new), src/components/tooltip/Tooltip.js (new), src/components/{video-card,featured-banner,icon-button,joystick,avatar}/*, src/components/dome-gallery/DomeGallery.js (semantic token reads, playRestScale), index.html, wiki/decisions/0003, raw/brief (item 57)
- note: verified at 1100×620: page renders, 17 cards + banner, banner dots centered 10.2 px below the image (as computed for bylines), byline avatar 14 px with 0.45 initials, layers 10 / 16 / 20 / 40 / 50, VR switch, player open / Escape close with focus back on the card; no console errors.

## [2026-10-05] lint | English-only check
- touched: none (raw/brief item 58 recorded)
- note: scanned all 139 text files (code, comments, CSS, HTML, wiki, raw sources, SVG text) for non-Latin letters: no Cyrillic or other non-English text. The only non-Latin characters are the math symbols π, θ and Δ in projection formulas and measurements, kept as standard notation.
