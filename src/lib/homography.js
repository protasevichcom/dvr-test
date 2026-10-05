// @ts-check
/**
 * Projective mapping of a DOM element onto an arbitrary screen quadrilateral (CSS `matrix3d`).
 * Used to "paint" flat card UI onto the curved dome: each element's four corners are projected
 * onto the sphere and the element is stretched to match.
 */

/** @typedef {{ x: number, y: number }} Point */

/**
 * CSS `matrix3d(...)` that maps an element box (0,0)–(width,height) onto the quad
 * topLeft → topRight → bottomRight → bottomLeft. Apply with `transform-origin: 0 0` to an element
 * positioned at the containing block's origin.
 * @param {number} width
 * @param {number} height
 * @param {[Point, Point, Point, Point]} quad
 */
export function quadToMatrix3d(width, height, [p0, p1, p2, p3]) {
  // Unit square → quad (Heckbert, "Fundamentals of Texture Mapping and Image Warping").
  const dx1 = p1.x - p2.x;
  const dx2 = p3.x - p2.x;
  const dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy1 = p1.y - p2.y;
  const dy2 = p3.y - p2.y;
  const dy3 = p0.y - p1.y + p2.y - p3.y;
  const denominator = dx1 * dy2 - dx2 * dy1 || 1e-9;
  const g = (dx3 * dy2 - dx2 * dy3) / denominator;
  const h = (dx1 * dy3 - dx3 * dy1) / denominator;
  const a = p1.x - p0.x + g * p1.x;
  const b = p3.x - p0.x + h * p3.x;
  const d = p1.y - p0.y + g * p1.y;
  const e = p3.y - p0.y + h * p3.y;

  // Element px → unit square, folded into the matrix (column-major for matrix3d).
  const w = Math.max(width, 1e-6);
  const hgt = Math.max(height, 1e-6);
  const m = [a / w, d / w, 0, g / w, b / hgt, e / hgt, 0, h / hgt, 0, 0, 1, 0, p0.x, p0.y, 0, 1];
  return `matrix3d(${m.map((value) => +value.toFixed(6)).join(',')})`;
}

/**
 * @typedef {object} PosterMap  A poster's own px space and how it lands on screen.
 * @property {number} width   poster width in its own px space
 * @property {number} height  poster height in its own px space
 * @property {(x: number, y: number) => Point} toScreen  poster px (may extend past the edges) → screen px
 */

/**
 * Warps an element so that its box covers `rect` of a poster, wherever the poster lands on screen.
 * The element keeps its own CSS size (`size`) — that is what gets stretched.
 * @param {HTMLElement} element  absolutely positioned at its containing block's origin
 * @param {{ width: number, height: number }} size  the element's layout size (untransformed)
 * @param {{ x: number, y: number, width: number, height: number }} rect  target box in poster px
 * @param {PosterMap} poster
 */
export function warpOntoPoster(element, size, rect, poster) {
  const { x, y, width, height } = rect;
  const quad = /** @type {[Point, Point, Point, Point]} */ ([
    poster.toScreen(x, y),
    poster.toScreen(x + width, y),
    poster.toScreen(x + width, y + height),
    poster.toScreen(x, y + height),
  ]);
  element.style.translate = 'none';
  element.style.rotate = 'none';
  element.style.transform = quadToMatrix3d(size.width, size.height, quad);
}
