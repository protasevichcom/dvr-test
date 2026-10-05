---
title: Headset detection and adaptive UI
type: concept
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md]
tags: [vr, detection, webxr, adaptive]
---

# Headset detection and adaptive UI

How the page knows it runs in a headset, and what it changes.

## Signals

1. **WebXR feature detection** — `navigator.xr?.isSessionSupported('immersive-vr')`. Safe on page load: the spec
   forbids intrusive UI for this call ([WebXR](https://www.w3.org/TR/webxr/)). Meta recommends feature detection
   ([browser specs](https://developers.meta.com/horizon/documentation/web/browser-specs/)).
   Caveat: desktop Chrome with a connected PC VR headset also returns `true`.
2. **User-agent hint** (comfort mode only):
   - Quest: `OculusBrowser/…`, device token `Quest`, `Quest 2`, `Quest Pro`, `Quest 3` (also 3S), and ` VR ` /
     ` Mobile VR ` ([Meta](https://developers.meta.com/horizon/documentation/web/browser-specs/)).
   - Pico: ` VR ` token, `PicoWebApp/x` (third-party doc, [webspatial](https://webspatial.dev/docs/api/react-sdk/dom-api/userAgent)).
   - Vision Pro: **indistinguishable from Mac Safari** by UA (secondary sources).
3. **Manual toggle** — the user can always switch "VR comfort mode" on/off (persisted in `localStorage`), and
   a `?mode=vr` query flag for demos and desktop testing.

## Adaptive strategy

```
mode = urlParam ?? storedPreference ?? (uaLooksLikeHeadset ? "vr" : "desktop")
showEnterVR = await navigator.xr?.isSessionSupported("immersive-vr")
<html data-mode="vr|desktop" data-xr="supported|unsupported">
```

## Implications for the prototype

- All VR differences are token overrides under `[data-mode="vr"]` — no separate components.
- "Play in VR" behaviour: if XR is supported → enter immersive player; otherwise → "Send to headset" /
  "Open in DeoVR app" flow (desktop users curate, headset users play).
- A visible mode switch in the header — also the demo hook for reviewers on desktop.
- Switching modes is animated (owner, 2026-10-05): the VR-overridden tokens glide to their new values, so the
  nav pill, tabs, joystick, card text and the dome itself resize in place — nothing is swapped
  ([0014](../decisions/0014-gliding-display-mode-switch.md)). With reduced motion the switch is instant.

## Related

- [vr-input-models](vr-input-models.md)
- [immersive-video-entry](immersive-video-entry.md)
- [webxr](../entities/webxr.md)
