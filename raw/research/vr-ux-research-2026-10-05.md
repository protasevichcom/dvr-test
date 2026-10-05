# Research report — UX/UI principles for a VR-ready 2D catalog homepage

- Produced: 2026-10-05 by a research agent (web search over vendor docs and specs).
- Scope: a 2D web page used in desktop browsers and in headset browsers (Meta Quest Browser first,
  Apple Vision Pro Safari, Pico), plus entry into immersive 180/360 stereo playback.
- Convention: each claim carries its source URL. **[uncertain]** = secondary source, outdated doc,
  community post, or could not be confirmed.

---

## 1. Input models

### Meta Quest Browser
- Inputs: controllers (laser ray + trigger), Bluetooth mouse/keyboard, hand tracking (point + pinch to click);
  scrolling by thumbstick or pinch-drag. https://web.dev/articles/pwas-on-oculus-2 (2022)
- Hand tracking works on 2D pages. Palm pinch on either hand is reserved for the system; a left palm pinch
  exits a WebXR session. https://developers.meta.com/horizon/documentation/web/webxr-hands/
- Meta: "Design your hit targets to work reliably with the least precise input method your app supports."
  Hands are less precise than controllers. https://developers.meta.com/horizon/design/styles_inputs_hit_targets/
- Hover does occur: a community bug report says controller rays send `pointermove` with `buttons: 0` while
  pointing, with `pointerType: "touch"`. **[uncertain: forum post]**
  https://forum.babylonjs.com/t/touch-slot-leak-on-meta-quest-browser-hovering-touch-pointers-permanently-break-all-pointer-input-previous-pen-only-fixes-dont-cover-this/63867
  - Do not let `pointerType "touch"` switch the UI to a mobile tap-to-reveal pattern.
  - Hover styles will show, but the page must never depend on them.
- What `(hover)` / `(pointer)` media queries return in Quest Browser is not documented. **[uncertain; test on device]**
  Do not use them as the only switch for VR UI. https://caniuse.com/css-media-interaction

### Apple Vision Pro Safari (look and pinch)
- Eyes pick the target, a pinch confirms. visionOS doesn't provide information about where people are looking
  before they tap. https://developer.apple.com/tutorials/data/design/human-interface-guidelines/eyes.json
- Safari draws its own gaze highlight, which the page cannot detect. CSS `:hover` does not fire unless a
  Bluetooth mouse/trackpad is used. **[secondary: summary of WWDC23 "Meet Safari for spatial computing"]**
  https://blog.jim-nielsen.com/2023/thoughts-on-safari-spatial-computing/
- Safari decides what is interactive from buttons/links/menus, ARIA roles, form fields and `cursor: pointer`,
  so semantic HTML is what makes items targetable. (same source)
- Prefer rounded shapes; eyes are drawn toward corners, which makes square targets harder to hold. (HIG Eyes)
- Inside WebXR on visionOS input is a `transient-pointer` (`targetRayMode`) that exists only for one pinch;
  its ray starts along the gaze and then follows the hand.
  https://webkit.org/blog/15162/introducing-natural-input-for-webxr-in-apple-vision-pro/

### Takeaway
Hover is a bonus, never a requirement: no hover-only menus; card actions and previews must work from a
click/tap; persistent `:focus-visible` / active states are mandatory.

---

## 2. Numeric guidance

### Hit targets
| Platform | Guidance | Source |
|---|---|---|
| Meta | ≥48×48 dp for comfort; ≥60×60 dp for all primary controls (needed for hands). Invisible hit slop for small icons; slops must not overlap. | https://developers.meta.com/horizon/design/styles_inputs_hit_targets/ |
| Meta PWA | Repeats 48 dp and 60×60 (written as "px") | https://developers.meta.com/horizon/design/pwa/ |
| Apple | Hit region ≥60×60 pt in visionOS (44×44 elsewhere). Button centres ≥60 pt apart; 4 pt padding around 60 pt+ buttons so hover effects don't overlap. | https://developer.apple.com/tutorials/data/design/human-interface-guidelines/buttons.json |
| Apple | ≥16 pt margin around each item, or centres ≥60 pt apart | HIG Eyes; https://developer.apple.com/tutorials/data/design/human-interface-guidelines/spatial-layout.json |
| Apple | A visionOS point is an angle, not a pixel count | spatial-layout (above) |
| Apple | 60 pt ≈ 2.5° ≈ 4.4 cm at 1 m **[WWDC25 snippet, not verified]** | https://developer.apple.com/videos/play/wwdc2025/303/ |
| Android XR | Targets ≥56×56 dp, icons 48×48 dp, 4 dp offset, ≥8 dp between targets | https://developer.android.com/design/ui/xr/guides/visual-design |

Practical web value: 60 CSS px minimum for primary controls; 8–16 px gaps between targets.

### Typography
- Meta: 14 px minimum, ≥18 px for comfortable reading; sans-serif with high x-height and large counters
  (Meta uses Inter); avoid Light/Thin weights; avoid italics in immersive contexts.
  https://developers.meta.com/horizon/design/styles_typography/
- Android XR: 14 dp minimum, normal weight or heavier. (Android XR URL above)
- Line length: no official XR guideline found.

### Contrast
- Meta follows WCAG AA: 4.5:1 body text; 3:1 large text and non-text elements.
  https://developers.meta.com/horizon/design/styles_color/

### Quest Browser viewport (sources disagree)
- Current browser-specs page: default panel 1280×670 px; min 500×495; max 2000×1070; desktop mode is the
  default and ignores `<meta viewport>`; mobile mode adds "Mobile VR" to the UA and applies the viewport tag.
  https://developers.meta.com/horizon/documentation/web/browser-specs/
- Older sources: 1000×625 default (Meta PWA design page, web.dev 2022); dp guidance 1024×640 default,
  384×500 min, 1440×1000 max.
- Design fluidly ~500–2000 px wide; treat ~1280 px as typical.

### Pixel density
- devicePixelRatio 1.5 on Quest 2 at 90 Hz. https://web.dev/articles/pwas-on-oculus-2
- Quest 3 DPR: not documented **[uncertain]**. Vision Pro Safari viewport and DPR: not found **[unknown]**.

### Viewing distance / field of view
- Meta: UI ≥0.5 m away; ~1 m comfortable for long-viewed menus. https://developers.meta.com/horizon/design/display/
- Apple: content ≥1 m away (HIG Eyes).
- Android XR: launch distance 1.75 m; primary content within ~41° FOV; 0.868 dp-to-dmm; 32 dp panel corners.
- Microsoft: avoid >45° neck rotation; resting gaze 10–20° below horizon.
  https://learn.microsoft.com/windows/mixed-reality/comfort
- Consequence: keep key actions centred; no critical controls at the far edges of a wide panel.

---

## 3. Visual design
- No pure white or pure black: Meta says #FFFFFF and #000000 cause eye strain; use nothing brighter than
  #DADADA and nothing darker than #1A1A1A. https://developers.meta.com/horizon/design/styles_color/
- Support both themes via `prefers-color-scheme`; dark mode should use slightly less saturated colours;
  test on headset — VR displays can look more saturated; Quest Pro supports Display P3. (styles_color, PWA)
- LCD Quest black levels: values below ~13/255 are barely distinguishable, so subtle near-black gradients
  collapse; reference brightness ~100 nits. https://developers.meta.com/horizon/design/display/
- Brighter images flicker more, flicker is more noticeable in the periphery; prefer darker colours,
  especially off-centre. https://developers.meta.com/horizon/resources/bp-rendering/
- Avoid high-spatial-frequency textures (fine black-and-white stripes) and high-contrast flashing;
  content should conform to ISO 9241-391:2016. (bp-rendering)
- Thin lines flicker more than thick ones — attributed to Meta in a search snippet, not found on the fetched
  page **[uncertain]**. Practical rule (inference): hairlines ≥1.5–2 px.
- Glow/bloom: no official numbers; large bright glows conflict with "darker is better" (inference).
- Motion: avoid sudden acceleration, rapid direction changes, camera motion the user didn't trigger, and
  depth effects on text. https://developers.meta.com/horizon/design/comfort/ ; keep motion user-initiated
  (Microsoft comfort). For a 2D page: no auto-scrolling carousels, no scroll-jacked parallax, honour
  `prefers-reduced-motion`.
- Feedback: immediate subtle feedback; short delay for expansions, longer for tooltips (HIG Eyes). Provide
  clear pressed/active states because Vision Pro hides gaze-hover from the page.

---

## 4. Detecting VR browsers
- Quest UA example: `Mozilla/5.0 (X11; Linux x86_64; Quest 3) AppleWebKit/537.36 (KHTML, like Gecko)
  OculusBrowser/39.2.0.0.56.754450099 Chrome/136.0.7103.177 VR Safari/537.36`. Device tokens "Quest",
  "Quest 2", "Quest Pro", "Quest 3" (also Quest 3S). Mobile mode changes `VR` to `Mobile VR`.
  Meta: use feature detection to control site behavior. https://developers.meta.com/horizon/documentation/web/browser-specs/
- Pico: `/\sVR\s/` in UA means WebXR support; `PicoWebApp/x` = PICO OS 6 web-app runtime. **[third-party doc]**
  https://webspatial.dev/docs/api/react-sdk/dom-api/userAgent
- Vision Pro Safari defaults to a desktop UA identical to Mac Safari, so the UA alone can't tell it apart.
  **[secondary sources]** https://developer.apple.com/forums/thread/731824
- Strategy: (1) UA regex `OculusBrowser|Quest|\sVR\s|PicoBrowser|Pico` as a hint for comfort mode;
  (2) `navigator.xr?.isSessionSupported('immersive-vr')` as the real signal for an "Enter VR" button — the spec
  says it must not show intrusive UI, so it is safe on load (https://www.w3.org/TR/webxr/);
  (3) fluid rem-based layout so window resizing just works.

---

## 5. Entering immersive video
- WebXR: secure context (HTTPS); `requestSession('immersive-vr')` needs transient user activation; one
  immersive session at a time; handle `NotSupportedError`, `SecurityError`, `InvalidStateError`;
  `local`/`local-floor` need the `xr-spatial-tracking` permissions policy (iframes).
  https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession ; https://www.w3.org/TR/webxr/
- Prefer WebXR Layers media layers (`XRMediaBinding.createEquirectLayer` / cylinder) with
  `layout: 'stereo-left-right'` (or top-bottom): video sampled once → sharper, much lower GPU cost (Meta's
  example 3.15 ms → 0.72 ms); cross-origin and streaming work.
  https://developers.meta.com/horizon/documentation/web/webxr-layers/ ;
  https://developer.mozilla.org/en-US/docs/Web/API/XRMediaBinding/createEquirectLayer (experimental)
- visionOS 26: plain `<video>` plays 180°, 360°, wide-FOV, spatial and Apple Immersive video incl. HLS;
  180/360 files need APMP metadata; fullscreen wraps the video around the viewer.
  https://developer.apple.com/videos/play/wwdc2025/237/
- visionOS WebXR immersive-vr arrived with Safari 18 / visionOS 2.
  https://webkit.org/blog/15443/news-from-wwdc24-webkit-in-safari-18-beta/
- File-name conventions (player conventions, not standards) **[uncertain]**: `_LR`/`_SBS`, `_TB`/`OverUnder`,
  `180`/`360`, fisheye `_F180`/`_180F`, also `_RL`, `_BT`, `_3DH`, `_3DV`.
  https://heresphere.itch.io/heresphere-vr-video-player-quest-2/devlog/397826/update-v07-released
  Catalog metadata should carry projection, stereo layout and FOV explicitly and show them as badges.
- Quest decode limits: 180° realistic 4320×4320@60, max 5760×5760@60; 360° realistic 7680×3840,
  max 8192×4096@60; codecs AV1 (Quest 3+), HEVC, VP9, AVC.
  https://developers.meta.com/horizon/documentation/android-apps/media-requirements
- Previews (inference): show 180/360 thumbnails as a single-eye dewarped flat crop, not the raw SBS frame;
  short flat, muted previews; no autoplay of large stereo files.
- Comfort on entry: explicit click only; fade in; keep horizon level, no own camera motion; obvious exit.

---

## 6. Performance in headset browsers
- Frame budgets: 13.7–13.9 ms @72 Hz, 11.1 ms @90 Hz, 8.3 ms @120 Hz; app logic >2 ms is a candidate for
  optimisation. https://developers.meta.com/horizon/documentation/web/webxr-perf-workflow/ ;
  https://developers.meta.com/horizon/documentation/native/android/os-missed-frames/
- Framebuffer scale 0.8–0.9 cuts fragment cost; fixed foveation (up to ~25% gain) degrades high-contrast text;
  measure with OVR Metrics Tool. https://developers.meta.com/horizon/documentation/web/webxr-ffr/
- Text in WebXR can look soft on Quest 3 at default scale; one developer needed scale ≥~1.35
  **[community, uncertain]**. https://discourse.threejs.org/t/vr-web-applications-font-rendering-issues-bitmap-vs-sdf/93545
- 2D page (inference, general mobile-web practice): treat Quest as a mobile-class Android device — lazy-load
  thumbnails, responsive `srcset`, at most one concurrent video preview; avoid large `backdrop-filter` blur
  and heavy box-shadow stacks.

---

## 7. Accessibility in VR (W3C XAUR, https://www.w3.org/TR/xaur/)
- Input independence: every action works without physical gestures and with any input (§4.2, §3.3–3.4) —
  real `<button>`/`<a>`, full keyboard path, visible focus (also what makes elements targetable on Vision Pro).
- Captions customisable and repositionable in immersive playback (§4.19).
- Mono audio option (§4.18).
- High-contrast skins, magnification with reflow (§4.6, §4.7) — respect browser zoom, use rem.
- No flashing >3 times per second; alternatives to motion (§4.16).
- Respect `prefers-reduced-motion` and `prefers-color-scheme`; support breaks and resume.
  https://developers.meta.com/horizon/design/bp-overview/

---

## Open gaps to test on device
- What `(hover)`, `(pointer)`, `any-pointer` return on Quest 3, Vision Pro, Pico.
- Quest 3 devicePixelRatio.
- Vision Pro Safari default viewport width.
- Whether the Quest ray reliably triggers `:hover` in the current browser version.
