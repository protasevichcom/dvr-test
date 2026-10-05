// @ts-check
import { cx, h } from '../../lib/dom.js';
import { warpOntoPoster } from '../../lib/homography.js';
import { moveTo } from '../../lib/overlay.js';

/** @typedef {{ x: number, y: number }} Point */

/**
 * Strip hanging under a poster on the dome: the byline of a video card, the pagination of the banner.
 * It is clipped at the poster's bottom edge, so its content slides out from under the image as the
 * poster opens (`--openness` of the enclosing PosterOverlay), in one byline-high row.
 *
 * Flat mode: one plane hung under the bottom edge (`placeFlat`). Warp mode: printed onto the sphere
 * below the poster (`prepareWarp`, then `placeWarped` with the measured size). A centered strip hugs
 * its content and is warped only under it: a projective map keeps the strip's top edge straight while
 * a wide poster's bottom edge sags toward its middle.
 *
 * @param {object} props
 * @param {'start' | 'center'} [props.align]  start: inset like the pills on the poster
 * @param {...Node} children
 */
export function PosterStrip({ align = 'start' }, ...children) {
  const content = h('div', { class: 'poster-strip__content' }, ...children);
  const el = h('div', { class: cx('poster-strip', `poster-strip--${align}`) }, content);
  const hugs = align === 'center';

  return {
    el,
    content,
    /**
     * @param {Point} origin  top-left of the plane, just under the curved bottom edge
     * @param {number} width  the bottom edge's chord length, CSS px
     * @param {number} angle  the bottom edge's direction, rad
     */
    placeFlat(origin, width, angle) {
      el.dataset.warp = 'false';
      moveTo(el, origin.x, origin.y, angle);
      el.style.width = `${width}px`;
    },
    /**
     * Warp mode, write phase: sizes the strip for the poster (call before measuring it).
     * @param {number} posterWidth  poster px
     * @param {number} scale        element px → poster px
     */
    prepareWarp(posterWidth, scale) {
      el.dataset.warp = 'true';
      el.style.width = hugs ? '' : `${posterWidth / scale}px`;
    },
    /**
     * @param {import('../../lib/homography.js').PosterMap} poster
     * @param {{ width: number, height: number }} size  the strip's measured layout size
     * @param {number} scale                           element px → poster px
     */
    placeWarped(poster, size, scale) {
      const width = hugs ? size.width * scale : poster.width;
      warpOntoPoster(el, size, { x: poster.width / 2 - width / 2, y: poster.height, width, height: size.height * scale }, poster);
    },
  };
}
