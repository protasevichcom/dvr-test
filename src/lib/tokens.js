// @ts-check
import { parseEasing } from './easing.js';

/**
 * Reads design tokens (CSS custom properties) from JS, so geometry and canvas drawing stay driven
 * by the token files rather than hard-coded constants.
 */

/**
 * @param {string} name
 * @param {Element} scope
 */
function rawToken(name, scope) {
  return getComputedStyle(scope).getPropertyValue(name).trim();
}

/**
 * Unitless number, e.g. `--dome-columns: 12`.
 * @param {string} name
 * @param {Element} [scope]
 * @returns {number}
 */
export function readNumberToken(name, scope = document.documentElement) {
  const raw = rawToken(name, scope);
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) {
    throw new Error(`Design token ${name} is missing or not numeric (got "${raw}")`);
  }
  return value;
}

/**
 * Length in CSS pixels; supports `px` and `rem`.
 * @param {string} name
 * @param {Element} [scope]
 */
export function readLengthToken(name, scope = document.documentElement) {
  const raw = rawToken(name, scope);
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) {
    throw new Error(`Design token ${name} is missing or not a length (got "${raw}")`);
  }
  if (raw.endsWith('rem')) {
    return value * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
  return value;
}

/**
 * Duration in milliseconds; supports `ms` and `s`.
 * @param {string} name
 * @param {Element} [scope]
 */
export function readDurationToken(name, scope = document.documentElement) {
  const raw = rawToken(name, scope);
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) return 0;
  return raw.endsWith('ms') ? value : value * 1000;
}

/**
 * Easing (e.g. `cubic-bezier(…)`) as a function of progress 0…1, matching the CSS timing function.
 * @param {string} name
 * @param {Element} [scope]
 * @returns {import('./easing.js').Easing}
 */
export function readEasingToken(name, scope = document.documentElement) {
  return parseEasing(rawToken(name, scope));
}

/**
 * Any CSS color token resolved by the browser (nested var() references included).
 * @param {string} name
 * @returns {string} e.g. "rgb(255, 94, 153)"
 */
export function readColorToken(name) {
  probe.style.color = `var(${name})`;
  return getComputedStyle(probe).color;
}

/**
 * Color token as normalized RGB channels (0–1), for shaders.
 * @param {string} name
 * @returns {[number, number, number]}
 */
export function readColorTokenRgb(name) {
  const [r = 0, g = 0, b = 0] = (readColorToken(name).match(/[\d.]+/g) ?? []).map(Number);
  return [r / 255, g / 255, b / 255];
}

/** Hidden element used to resolve color tokens to computed rgb() strings. */
const probe = document.createElement('span');
probe.hidden = true;
document.documentElement.append(probe);
