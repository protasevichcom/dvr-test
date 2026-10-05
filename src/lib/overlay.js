// @ts-check
/**
 * Helpers for DOM overlays laid over posters on the dome (VideoCardOverlay, FeaturedBanner).
 * Two placement modes (token `--dome-card-ui-warp`):
 *  - flat: each element is one undistorted plane placed at a projected point and turned to follow
 *    the sphere (`moveTo`);
 *  - warp: each element is stretched onto the sphere like the poster image (`warpOntoPoster` in
 *    homography.js).
 */

/** @typedef {'enter' | 'leave' | 'activate'} Intent */

/**
 * Places a flat element at a screen point, turned by `angle` around that point.
 * @param {HTMLElement} element
 * @param {number} x
 * @param {number} y
 * @param {number} [angle]  rad
 */
export function moveTo(element, x, y, angle = 0) {
  element.style.translate = `${x}px ${y}px`;
  element.style.rotate = `${angle}rad`;
  element.style.transform = ''; // drop a warp from the other mode; the stylesheet transform applies
}

/**
 * Layout size of elements, read once and reused (reading sizes every frame would force reflows).
 * @param {HTMLElement[]} elements
 */
export function measure(elements) {
  return elements.map((element) => ({ width: element.offsetWidth, height: element.offsetHeight }));
}

/**
 * Sizes and places an invisible hit area.
 * @param {HTMLElement} element
 * @param {{ left: number, top: number, width: number, height: number }} area  CSS px
 */
export function placeHitArea(element, area) {
  moveTo(element, area.left, area.top);
  element.style.width = `${area.width}px`;
  element.style.height = `${area.height}px`;
}

/**
 * Feed switch: the overlay fades and blurs together with its poster.
 * @param {HTMLElement} element
 * @param {number} dissolve  0…1
 */
export function setDissolve(element, dissolve) {
  element.style.setProperty('--dissolve', dissolve.toFixed(3));
  element.dataset.dissolving = String(dissolve > 0.001);
}

/**
 * Reports hover / focus (`enter`, `leave`) and clicks (`activate`) of a hit button.
 * @param {HTMLElement} hit
 * @param {(intent: Intent) => void} onIntent
 */
export function bindIntent(hit, onIntent) {
  hit.addEventListener('pointerenter', () => onIntent('enter'));
  hit.addEventListener('pointerleave', () => onIntent('leave'));
  hit.addEventListener('focus', () => onIntent('enter'));
  hit.addEventListener('blur', () => onIntent('leave'));
  hit.addEventListener('click', () => onIntent('activate'));
}
