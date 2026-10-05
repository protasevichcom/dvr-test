// @ts-check
/**
 * Runtime environment: display mode (desktop vs headset comfort mode) and motion preferences.
 * See wiki/concepts/headset-detection.md — UA sniffing is only a hint; the user can always override.
 */

import { readDurationToken } from './tokens.js';

/** @typedef {'desktop' | 'vr'} DisplayMode */

const STORAGE_KEY = 'deovr:display-mode';
const HEADSET_UA = /OculusBrowser|Quest|\sVR\s|Mobile VR|Pico/i;

/** @returns {DisplayMode} */
export function resolveDisplayMode() {
  const fromUrl = new URLSearchParams(location.search).get('mode');
  if (fromUrl === 'vr' || fromUrl === 'desktop') return fromUrl;

  const stored = safeStorageGet(STORAGE_KEY);
  if (stored === 'vr' || stored === 'desktop') return stored;

  return HEADSET_UA.test(navigator.userAgent) ? 'vr' : 'desktop';
}

/** @typedef {{ mode: DisplayMode, duration: number }} DisplayModeChange  duration: ms the tokens glide (0 = instant) */

/**
 * How long past the token transitions a mode switch is still treated as running (ms): CSS transitions
 * start at the next style update, so followers keep reading tokens a little longer to land on the
 * final values, and the transitions are switched off only after they finish.
 */
export const MODE_SWITCH_SLACK_MS = 100;

let switchTimer = 0;

/**
 * Sets the display mode. With `animate`, the mode tokens glide to their new values (see
 * src/tokens/mode-transition.css), so every element resizes in place instead of jumping; listeners
 * of `displaymodechange` get the duration to follow along (the dome does).
 * @param {DisplayMode} mode
 * @param {{ persist?: boolean, animate?: boolean }} [options]  persist only an explicit user choice, not a URL or UA guess
 */
export function applyDisplayMode(mode, { persist = false, animate = false } = {}) {
  const root = document.documentElement;
  const duration = animate && !reducedMotionQuery.matches ? readDurationToken('--motion-mode-switch') : 0;
  window.clearTimeout(switchTimer);
  if (duration > 0) {
    root.dataset.modeSwitching = 'true';
    getComputedStyle(root).getPropertyValue('--root-font-size'); // the transition must apply before the values change
    switchTimer = window.setTimeout(() => delete root.dataset.modeSwitching, duration + MODE_SWITCH_SLACK_MS);
  } else {
    delete root.dataset.modeSwitching;
  }
  root.dataset.mode = mode;
  if (persist) safeStorageSet(STORAGE_KEY, mode);
  window.dispatchEvent(new CustomEvent('displaymodechange', { detail: /** @type {DisplayModeChange} */ ({ mode, duration }) }));
}

/** @returns {DisplayMode} */
export function currentDisplayMode() {
  return document.documentElement.dataset.mode === 'vr' ? 'vr' : 'desktop';
}

export const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

/** @returns {Promise<boolean>} */
export async function isImmersiveVrSupported() {
  const xr = /** @type {any} */ (navigator).xr;
  if (!xr?.isSessionSupported) return false;
  try {
    return await xr.isSessionSupported('immersive-vr');
  } catch {
    return false;
  }
}

/** @param {string} key */
function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** @param {string} key @param {string} value */
function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Storage can be unavailable (private mode); the mode still applies for this session. */
  }
}
