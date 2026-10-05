---
title: VR input models
type: concept
status: stable
created: 2026-10-05
updated: 2026-10-05
sources: [raw/research/vr-ux-research-2026-10-05.md]
tags: [vr, input, hover, pointer]
---

# VR input models

How people point and click on a 2D web page inside a headset, and why hover cannot carry any meaning.

## Inputs by platform

| Platform | Inputs | Hover visible to the page? |
|---|---|---|
| [Meta Quest Browser](../entities/meta-quest-browser.md) | Controller ray + trigger; hand ray + pinch; BT mouse/keyboard. Scroll: thumbstick or pinch-drag. | Probably yes — rays emit `pointermove`, reported as `pointerType: "touch"` (unverified) |
| [Apple Vision Pro Safari](../entities/apple-vision-pro-safari.md) | Look + pinch; BT mouse/trackpad | **No** — system draws gaze highlight; `:hover` only with a mouse/trackpad (secondary source) |
| [Pico Browser](../entities/pico-browser.md) | Controller ray, hands | Not researched yet |
| Desktop | Mouse / trackpad / keyboard | Yes |

Sources: [raw](../../raw/research/vr-ux-research-2026-10-05.md) §1.

- Meta: design hit targets for the **least precise** input you support — hands
  ([Meta](https://developers.meta.com/horizon/design/styles_inputs_hit_targets/)).
- Palm pinch is reserved by the system; left palm pinch exits WebXR
  ([Meta](https://developers.meta.com/horizon/documentation/web/webxr-hands/)).
- Vision Pro decides what is targetable from semantic elements, ARIA roles and `cursor: pointer`
  ([summary of WWDC23](https://blog.jim-nielsen.com/2023/thoughts-on-safari-spatial-computing/)).
- Rounded targets are easier to hold with eyes than square ones
  ([HIG Eyes](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/eyes.json)).

## Implications for the prototype

- **No hover-only UI.** Card actions (Play in VR, Save, Hide) are reachable without hover: visible on
  focus/selection and in a details view. Hover previews are progressive enhancement.
- **Don't branch on `pointerType === "touch"`** to switch into mobile tap-to-reveal patterns.
- Every interactive element is a real `<a>` or `<button>` (or has a role) and has `cursor: pointer`.
- Strong, persistent `:focus-visible` and `:active` states — they are the only feedback on Vision Pro.
- Rounded corners on all targets (cards, chips, buttons).
- Horizontal rails need explicit prev/next buttons; thumbstick scroll is vertical-first and drag-scroll
  with a pinch is imprecise.

## Open questions

- Actual values of `(hover)`, `(pointer)`, `(any-pointer)` in Quest / Vision Pro / Pico →
  [device-test-plan](../synthesis/device-test-plan.md).

## Related

- [hit-targets-and-spacing](hit-targets-and-spacing.md)
- [xr-accessibility](xr-accessibility.md)
