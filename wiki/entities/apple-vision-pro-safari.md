---
title: Apple Vision Pro Safari
type: entity
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md]
tags: [vr, browser, visionos]
---

# Apple Vision Pro Safari

Safari on visionOS. Secondary target.

## Facts

- Look + pinch input; gaze is private, the page gets no hover from eyes (secondary source,
  [summary](https://blog.jim-nielsen.com/2023/thoughts-on-safari-spatial-computing/)).
- Targets ≥60×60 pt, rounded shapes preferred ([HIG](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/buttons.json)).
- UA is the same as Mac Safari by default — cannot be detected by UA (secondary sources).
- WebXR `immersive-vr` since visionOS 2 / Safari 18 ([WebKit](https://webkit.org/blog/15443/news-from-wwdc24-webkit-in-safari-18-beta/));
  WebXR input is `transient-pointer` ([WebKit](https://webkit.org/blog/15162/introducing-natural-input-for-webxr-in-apple-vision-pro/)).
- visionOS 26: `<video>` fullscreen plays 180/360 with APMP metadata ([WWDC25](https://developer.apple.com/videos/play/wwdc2025/237/)).

## Related

- [vr-input-models](../concepts/vr-input-models.md) · [immersive-video-entry](../concepts/immersive-video-entry.md)
