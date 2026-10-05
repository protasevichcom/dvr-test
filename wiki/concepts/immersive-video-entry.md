---
title: Entering immersive video
type: concept
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md]
tags: [vr, webxr, playback, comfort]
---

# Entering immersive video

The moment the user goes from the 2D catalog into a 180°/360° stereo video. The highest-value action
of the whole homepage.

## Facts

- WebXR `requestSession('immersive-vr')` requires HTTPS and **transient user activation** (inside a click handler);
  one immersive session at a time; handle `NotSupportedError`, `SecurityError`, `InvalidStateError`
  ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession), [WebXR](https://www.w3.org/TR/webxr/)).
- Best quality/perf: **WebXR Layers** media layers (`XRMediaBinding.createEquirectLayer`, stereo left-right or
  top-bottom); Meta's example cut GPU cost from 3.15 ms to 0.72 ms
  ([Meta layers](https://developers.meta.com/horizon/documentation/web/webxr-layers/)); experimental API.
- Vision Pro (visionOS 26): plain `<video>` in fullscreen plays 180/360/spatial video incl. HLS; files need
  APMP metadata ([WWDC25](https://developer.apple.com/videos/play/wwdc2025/237/)). WebXR immersive-vr exists since
  visionOS 2 ([WebKit](https://webkit.org/blog/15443/news-from-wwdc24-webkit-in-safari-18-beta/)).
- Comfort: explicit click only, fade in, level horizon, no app-driven camera motion, obvious exit
  ([Meta comfort](https://developers.meta.com/horizon/design/comfort/)). Left palm pinch exits WebXR on Quest.

## Implications for the prototype

- **Prototype scope:** the homepage demonstrates the *entry* (button states, pre-roll sheet, fade); a real
  immersive player is out of scope unless time allows (a WebXR equirect demo with a sample clip).
- "Play in VR" button states: `ready` (XR supported) → `entering` (spinner, fade) → `in-vr`;
  `unsupported` → secondary flow "Watch on headset" (QR / send-to-device / open app).
- Pre-roll sheet (optional, one click away): format badges, file size / resolution choice, comfort note.
- Never auto-enter VR from hover, scroll or page load.

## Related

- [vr-video-formats](vr-video-formats.md)
- [headset-detection](headset-detection.md)
- [webxr](../entities/webxr.md)
