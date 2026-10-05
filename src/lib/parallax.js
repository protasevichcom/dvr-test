// @ts-check
import { reducedMotionQuery } from './environment.js';

const SMOOTHING = 0.08;
const SETTLE_EPSILON = 0.001;

/** @typedef {{ x: number, y: number }} ParallaxPoint */

/**
 * Tracks the pointer and publishes a smoothed, normalized position (-1…1):
 *  - as CSS custom properties `--parallax-x` / `--parallax-y` on `root` (the DOM layer that uses
 *    them; pass the narrowest element, as every change restyles its subtree),
 *  - to subscribers (for the WebGL dome).
 * Each layer decides how far it moves via the `--scene-parallax-*` tokens.
 */
export function startParallax(root = document.documentElement) {
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  /** @type {Set<(point: ParallaxPoint) => void>} */
  const listeners = new Set();
  let frame = 0;

  const tick = () => {
    current.x += (target.x - current.x) * SMOOTHING;
    current.y += (target.y - current.y) * SMOOTHING;
    root.style.setProperty('--parallax-x', current.x.toFixed(4));
    root.style.setProperty('--parallax-y', current.y.toFixed(4));
    listeners.forEach((listener) => listener(current));

    const settled = Math.abs(target.x - current.x) < SETTLE_EPSILON && Math.abs(target.y - current.y) < SETTLE_EPSILON;
    frame = settled ? 0 : requestAnimationFrame(tick);
  };

  const wake = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  /** @param {PointerEvent} event */
  const onPointerMove = (event) => {
    if (reducedMotionQuery.matches) return;
    target.x = (event.clientX / window.innerWidth) * 2 - 1;
    target.y = (event.clientY / window.innerHeight) * 2 - 1;
    wake();
  };

  const recenter = () => {
    target.x = 0;
    target.y = 0;
    wake();
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', recenter);
  window.addEventListener('blur', recenter);

  return {
    /** @param {(point: ParallaxPoint) => void} listener */
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
