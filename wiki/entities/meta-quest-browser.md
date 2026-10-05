---
title: Meta Quest Browser
type: entity
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md]
tags: [vr, browser, quest]
---

# Meta Quest Browser

Chromium-based browser on Meta Quest headsets (Horizon OS). **Primary headset target** for the prototype.

## Facts

- UA example: `… (X11; Linux x86_64; Quest 3) … OculusBrowser/39.2… Chrome/136… VR Safari/537.36`
  ([browser specs](https://developers.meta.com/horizon/documentation/web/browser-specs/)).
- Default panel 1280×670 px (min 500×495, max 2000×1070); desktop mode by default ignores `<meta viewport>` (same source).
- Inputs: controllers, hands (pinch), BT mouse/keyboard ([web.dev](https://web.dev/articles/pwas-on-oculus-2)).
- Supports WebXR including hands and Layers ([Meta WebXR](https://developers.meta.com/horizon/documentation/web/webxr-layers/)).
- Supports PWAs ([Meta PWA](https://developers.meta.com/horizon/design/pwa/)).
- Debug: remote DevTools from a desktop Chrome via `chrome://inspect` (ADB).

## Related

- [vr-input-models](../concepts/vr-input-models.md) · [viewport-and-field-of-view](../concepts/viewport-and-field-of-view.md) · [headset-detection](../concepts/headset-detection.md)
