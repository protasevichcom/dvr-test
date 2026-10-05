// @ts-check
/**
 * CSS easing curves in JS, so canvas animations can share a motion token with CSS transitions.
 */

/** @typedef {(t: number) => number} Easing */

const NEWTON_ITERATIONS = 6;
const BISECTION_ITERATIONS = 20;
const EPSILON = 1e-6;

/**
 * Parses a resolved easing token. Supports `cubic-bezier(x1, y1, x2, y2)` and `linear`.
 * @param {string} value
 * @returns {Easing}
 */
export function parseEasing(value) {
  const match = value.match(/cubic-bezier\(([^)]+)\)/);
  if (!match) return (t) => t;
  const [x1, y1, x2, y2] = match[1].split(',').map(Number);
  return cubicBezier(x1, y1, x2, y2);
}

/**
 * The CSS `cubic-bezier()` timing function: x is time, y is progress.
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {Easing}
 */
export function cubicBezier(x1, y1, x2, y2) {
  /** One coordinate of the curve (P0 = 0, P3 = 1) and its derivative at parameter s. */
  /** @param {number} a1 @param {number} a2 @param {number} s */
  const curve = (a1, a2, s) => ((1 - 3 * a2 + 3 * a1) * s + (3 * a2 - 6 * a1)) * s * s + 3 * a1 * s;
  /** @param {number} a1 @param {number} a2 @param {number} s */
  const slope = (a1, a2, s) => 3 * (1 - 3 * a2 + 3 * a1) * s * s + 2 * (3 * a2 - 6 * a1) * s + 3 * a1;

  /** @param {number} x  time 0…1 → curve parameter */
  const solve = (x) => {
    let s = x;
    for (let i = 0; i < NEWTON_ITERATIONS; i += 1) {
      const error = curve(x1, x2, s) - x;
      if (Math.abs(error) < EPSILON) return s;
      const d = slope(x1, x2, s);
      if (Math.abs(d) < EPSILON) break;
      s -= error / d;
    }
    let low = 0;
    let high = 1;
    s = x;
    for (let i = 0; i < BISECTION_ITERATIONS; i += 1) {
      const value = curve(x1, x2, s);
      if (Math.abs(value - x) < EPSILON) break;
      if (value < x) low = s;
      else high = s;
      s = (low + high) / 2;
    }
    return s;
  };

  return (t) => (t <= 0 ? 0 : t >= 1 ? 1 : curve(y1, y2, solve(t)));
}
