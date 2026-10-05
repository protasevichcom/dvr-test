---
title: WebXR Device API
type: entity
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md]
tags: [vr, webxr, api]
---

# WebXR Device API

W3C API for immersive VR/AR sessions in the browser ([spec](https://www.w3.org/TR/webxr/)).

## Facts relevant to us

- `navigator.xr.isSessionSupported('immersive-vr')` — non-intrusive capability check.
- `navigator.xr.requestSession('immersive-vr', …)` — needs HTTPS + user activation
  ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession)).
- WebXR Layers / `XRMediaBinding` — efficient stereo equirect video (experimental)
  ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/XRMediaBinding/createEquirectLayer)).
- Vercel deployments are HTTPS by default, so the secure-context requirement is met.

## Related

- [immersive-video-entry](../concepts/immersive-video-entry.md) · [headset-detection](../concepts/headset-detection.md)
