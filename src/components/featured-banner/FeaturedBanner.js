// @ts-check
import { h } from '../../lib/dom.js';
import { warpOntoPoster } from '../../lib/homography.js';
import { measure, moveTo } from '../../lib/overlay.js';
import { IconButton } from '../icon-button/IconButton.js';
import { Pagination } from '../pagination/Pagination.js';
import { PosterHit } from '../poster-hit/PosterHit.js';
import { PosterOverlay } from '../poster-overlay/PosterOverlay.js';
import { PosterStrip } from '../poster-strip/PosterStrip.js';

/** @typedef {import('../../data/banners.js').Banner} Banner */
/** @typedef {{ x: number, y: number }} Point */

/**
 * @typedef {object} BannerGeometry  Screen positions (CSS px) derived from the banner on the sphere.
 * @property {{ point: Point, angle: number }} prev   anchor at the middle of the left edge
 * @property {{ point: Point, angle: number }} next   anchor at the middle of the right edge
 *   Each angle (rad) is the local direction of the sphere's horizontal line through the anchor.
 * @property {{ origin: Point, width: number, angle: number }} info  strip under the image: its top-left,
 *   the bottom edge's chord length and direction (as the byline strip of video cards)
 * @property {{ left: number, top: number, width: number, height: number }} hitArea  image only
 * @property {number} openness        0…1
 * @property {number} dissolve        0…1; feed switch fade + blur
 */

/**
 * @typedef {object} WarpedBannerGeometry  Warp mode: controls are painted onto the banner image.
 * @property {import('../../lib/homography.js').PosterMap} poster
 * @property {number} scale   element px → poster px
 * @property {number} inset   px; distance of the controls from the image edges (element px)
 * @property {{ left: number, top: number, width: number, height: number }} hitArea
 * @property {number} openness
 * @property {number} dissolve
 */

/**
 * Flat DOM layer of the featured banner gallery on the dome: prev/next buttons at the left and right
 * edges of the image, and dot pagination under it, in the strip where video cards show their byline
 * (same inset, row and slide-out motion), so the banner reads as part of the same grid.
 * In flat mode each control is one undistorted plane turned to follow the curved image where it sits
 * (the local direction of the horizontal line through its anchor); in warp mode the controls are
 * stretched onto the sphere with the image.
 * The image itself is a poster on the sphere, owned by DomeGallery.
 *
 * @param {object} props
 * @param {Banner[]} props.items
 * @param {(intent: import('../../lib/overlay.js').Intent) => void} props.onIntent
 * @param {(index: number) => void} props.onSelect
 */
export function FeaturedBanner({ items, onIntent, onSelect }) {
  let index = 0;
  const select = (/** @type {number} */ next) => onSelect((next + items.length) % items.length);

  const hit = PosterHit({ onIntent });
  const pagination = Pagination({ count: items.length, label: 'Featured banners', onSelect: select, variant: 'bare' });
  const prev = IconButton({ icon: 'chevronLeft', label: 'Previous banner', variant: 'glass', tooltipPlacement: 'above', onClick: () => select(index - 1) });
  const next = IconButton({ icon: 'chevronRight', label: 'Next banner', variant: 'glass', tooltipPlacement: 'above', onClick: () => select(index + 1) });
  const prevAnchor = h('div', { class: 'featured-banner__control featured-banner__control--prev' }, prev.el);
  const nextAnchor = h('div', { class: 'featured-banner__control featured-banner__control--next' }, next.el);
  const strip = PosterStrip({ align: 'center' }, pagination.el);

  const overlay = PosterOverlay(
    { className: 'featured-banner', as: 'section', attributes: { 'aria-roledescription': 'carousel', 'aria-label': 'Featured' } },
    hit.el,
    prevAnchor,
    nextAnchor,
    strip.el,
  );
  const { el } = overlay;

  /**
   * Warp mode caches the controls' sizes per poster width; `prepareWarp` / `measureWarp` split the
   * write and read phases (see VideoCardOverlay).
   */
  /** @type {{ posterWidth: number, sizes: ReturnType<typeof measure> } | null} */
  let measured = null;
  let stale = true;

  /** @param {number} value */
  function setIndex(value) {
    index = value;
    hit.setLabel(`Play in VR: ${items[index].title}`);
    pagination.setIndex(index);
  }
  setIndex(0);

  return {
    el,
    setIndex,
    /** @param {boolean} visible */
    setVisible(visible) {
      el.hidden = !visible;
    },
    /** @param {boolean} value */
    setHighlighted(value) {
      el.dataset.highlighted = String(value);
    },
    /** @param {BannerGeometry} geometry */
    place({ prev: prevPlace, next: nextPlace, info, hitArea, openness, dissolve }) {
      el.dataset.warp = 'false';
      stale = true;
      overlay.setMotion(openness, dissolve);
      // Controls are only interactive while the banner is open.
      el.dataset.open = String(openness > 0.5);
      hit.place(hitArea);
      moveTo(prevAnchor, prevPlace.point.x, prevPlace.point.y, prevPlace.angle);
      moveTo(nextAnchor, nextPlace.point.x, nextPlace.point.y, nextPlace.angle);
      strip.placeFlat(info.origin, info.width, info.angle);
    },
    /**
     * Warp mode, write phase: marks cached sizes stale for a new poster width or gliding tokens.
     * @param {number} posterWidth  poster px
     * @param {number} scale        element px → poster px
     * @param {boolean} remeasure
     */
    prepareWarp(posterWidth, scale, remeasure) {
      el.dataset.warp = 'true';
      if (remeasure || !measured || Math.abs(measured.posterWidth - posterWidth) > 0.5) stale = true;
      if (stale) strip.prepareWarp(posterWidth, scale);
      measured = { posterWidth, sizes: measured?.sizes ?? [] };
    },
    /** Warp mode, read phase. */
    measureWarp() {
      if (!stale || !measured) return;
      measured.sizes = measure([prevAnchor, nextAnchor, strip.el]);
      stale = false;
    },
    /** @param {WarpedBannerGeometry} geometry */
    placeWarped({ poster, scale, inset, hitArea, openness, dissolve }) {
      overlay.setMotion(openness, dissolve);
      el.dataset.open = String(openness > 0.5);
      hit.place(hitArea);

      const { width: W, height: H } = poster;
      if (stale || !measured) {
        this.prepareWarp(W, scale, true);
        this.measureWarp();
      }
      const [prevSize, nextSize, stripSize] = /** @type {NonNullable<typeof measured>} */ (measured).sizes;
      const pad = inset * scale;
      /** @param {{ width: number, height: number }} size @param {number} x @param {number} y */
      const box = (size, x, y) => ({ x, y, width: size.width * scale, height: size.height * scale });

      warpOntoPoster(prevAnchor, prevSize, box(prevSize, pad, H / 2 - (prevSize.height * scale) / 2), poster);
      warpOntoPoster(
        nextAnchor,
        nextSize,
        box(nextSize, W - pad - nextSize.width * scale, H / 2 - (nextSize.height * scale) / 2),
        poster,
      );
      // The pagination strip continues the image downward, like the byline strip of video cards.
      strip.placeWarped(poster, stripSize, scale);
    },
  };
}
