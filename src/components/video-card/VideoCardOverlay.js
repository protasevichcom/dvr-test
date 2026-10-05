// @ts-check
import { h } from '../../lib/dom.js';
import { formatCount, formatDuration, formatFullDate, formatRelativeDate } from '../../lib/format.js';
import { warpOntoPoster } from '../../lib/homography.js';
import { measure, moveTo } from '../../lib/overlay.js';
import { Avatar } from '../avatar/Avatar.js';
import { Badge } from '../badge/Badge.js';
import { FeaturePill } from '../badge/FeaturePill.js';
import { Icon } from '../icon/Icon.js';
import { PosterHit } from '../poster-hit/PosterHit.js';
import { PosterOverlay } from '../poster-overlay/PosterOverlay.js';
import { PosterStrip } from '../poster-strip/PosterStrip.js';

/** @typedef {import('../../data/videos.js').Video} Video */
/** @typedef {{ x: number, y: number }} Point */

/**
 * @typedef {object} OverlayGeometry  Screen positions (CSS px) derived from the card on the sphere.
 * @property {Point} posterTopLeft
 * @property {Point} posterBottomLeft
 * @property {Point} posterBottomRight
 * @property {Point} posterCenter
 * @property {number} topAngle       rad; direction of the poster's top edge (chord)
 * @property {number} bottomAngle    rad; direction of the poster's bottom edge (chord)
 * @property {Point} infoOrigin      top-left of the info plane, just under the bottom edge
 * @property {number} infoWidth      length of the bottom edge chord
 * @property {{ left: number, top: number, width: number, height: number }} hitArea
 * @property {number} openness       0…1; drives the info slide and badge fade
 * @property {number} dissolve       0…1; feed switch fade + blur
 */

/**
 * @typedef {object} WarpedGeometry  Warp mode: the UI is painted onto the poster on the sphere.
 * @property {import('../../lib/homography.js').PosterMap} poster
 * @property {number} scale          element px → poster px (the overlay scale)
 * @property {number} inset          px; distance of badges from the poster edges (element px)
 * @property {{ left: number, top: number, width: number, height: number }} hitArea
 * @property {number} openness
 * @property {number} highlight      0…1; hover / focus (grows the play button with the poster's ring)
 * @property {number} playRestScale  play button size at rest, as a share of its highlighted size (`--play-rest-scale`)
 * @property {number} dissolve
 */

/**
 * DOM layer for a card of the central cluster: feature marks, the engagement counts (views, likes,
 * comments) and duration on the poster's bottom row, the play affordance, and the byline in the strip
 * under the poster (author, upload age). In flat mode each element is one undistorted plane placed at
 * the curved poster and turned parallel to its nearest edge; in warp mode it is stretched onto the
 * sphere like the image. Its hit area is the card's accessible button.
 *
 * @param {object} props
 * @param {(intent: import('../../lib/overlay.js').Intent) => void} props.onIntent
 */
export function VideoCardOverlay({ onIntent }) {
  const hit = PosterHit({ onIntent });
  const features = h('div', { class: 'video-card-overlay__features' });
  const duration = h('div', { class: 'video-card-overlay__duration' });
  const stats = h('div', { class: 'video-card-overlay__stats-anchor' });
  const play = h('span', { class: 'video-card-overlay__play', 'aria-hidden': 'true' }, Icon({ name: 'play' }));
  const strip = PosterStrip({ align: 'start' });
  const overlay = PosterOverlay({ className: 'video-card-overlay' }, hit.el, features, stats, duration, play, strip.el);
  const { el } = overlay;

  /**
   * Warp mode caches element sizes; they change with the content, the poster width and (during a
   * display-mode switch) the gliding type tokens. `prepareWarp` writes sizes, `measureWarp` reads
   * them: the gallery runs all writes before all reads, so a frame forces at most one layout.
   */
  /** @type {{ posterWidth: number, sizes: ReturnType<typeof measure> } | null} */
  let measured = null;
  let stale = true;

  return {
    el,
    hit: hit.el,
    /** @param {Video | null} video */
    setVideo(video) {
      el.hidden = !video;
      if (!video) return;
      hit.setLabel(`Play in VR: ${video.title}`);
      features.replaceChildren(FeaturePill({ features: featuresOf(video) }));
      duration.replaceChildren(Badge({ label: formatDuration(video.durationSec) }));
      stats.replaceChildren(Stats(video));
      strip.content.replaceChildren(Byline(video));
      stale = true;
    },
    /** @param {boolean} value */
    setHighlighted(value) {
      el.dataset.highlighted = String(value);
    },
    /** @param {OverlayGeometry} geometry */
    place(geometry) {
      const {
        posterTopLeft,
        posterBottomLeft,
        posterBottomRight,
        posterCenter,
        topAngle,
        bottomAngle,
        infoOrigin,
        infoWidth,
        hitArea,
        openness,
        dissolve,
      } = geometry;
      el.dataset.warp = 'false';
      stale = true;
      overlay.setMotion(openness, dissolve);
      hit.place(hitArea);
      moveTo(features, posterTopLeft.x, posterTopLeft.y, topAngle);
      moveTo(duration, posterBottomRight.x, posterBottomRight.y, bottomAngle);
      moveTo(stats, posterBottomLeft.x, posterBottomLeft.y, bottomAngle);
      el.style.setProperty('--poster-width', `${infoWidth}px`);
      moveTo(play, posterCenter.x, posterCenter.y, (topAngle + bottomAngle) / 2);
      strip.placeFlat(infoOrigin, infoWidth, bottomAngle);
    },
    /**
     * Warp mode, write phase: sizes the elements for the poster width if their cached sizes are stale.
     * @param {number} posterWidth  poster px
     * @param {number} scale        element px → poster px
     * @param {boolean} remeasure   sizes may have changed besides the poster width (type tokens gliding)
     */
    prepareWarp(posterWidth, scale, remeasure) {
      el.dataset.warp = 'true';
      if (!remeasure && !stale && measured && Math.abs(measured.posterWidth - posterWidth) <= 0.5) return;
      stale = true;
      el.style.setProperty('--poster-width', `${posterWidth}px`);
      strip.prepareWarp(posterWidth, scale);
      measured = { posterWidth, sizes: measured?.sizes ?? [] };
    },
    /** Warp mode, read phase: measures the elements if `prepareWarp` marked them stale. */
    measureWarp() {
      if (!stale || !measured) return;
      measured.sizes = measure([features, stats, duration, play, strip.el]);
      stale = false;
    },
    /** @param {WarpedGeometry} geometry */
    placeWarped({ poster, scale, inset, hitArea, openness, highlight, playRestScale, dissolve }) {
      overlay.setMotion(openness, dissolve);
      hit.place(hitArea);

      const { width: W, height: H } = poster;
      if (stale || !measured) {
        // Not prepared by the gallery's two-phase pass: measure now (forces a layout).
        this.prepareWarp(W, scale, true);
        this.measureWarp();
      }
      const [featureSize, statsSize, durationSize, playSize, stripSize] = /** @type {NonNullable<typeof measured>} */ (measured).sizes;
      const pad = inset * scale;
      /** @param {{ width: number, height: number }} size @param {number} x @param {number} y @param {number} [k] */
      const box = (size, x, y, k = 1) => ({ x, y, width: size.width * scale * k, height: size.height * scale * k });

      warpOntoPoster(features, featureSize, box(featureSize, pad, pad), poster);
      warpOntoPoster(stats, statsSize, box(statsSize, pad, H - pad - statsSize.height * scale), poster);
      warpOntoPoster(
        duration,
        durationSize,
        box(durationSize, W - pad - durationSize.width * scale, H - pad - durationSize.height * scale),
        poster,
      );
      // Follows the poster's highlight tween (no CSS transition: the transform is rewritten every frame).
      const playGrow = playRestScale + (1 - playRestScale) * highlight;
      const playWidth = playSize.width * scale * playGrow;
      const playHeight = playSize.height * scale * playGrow;
      warpOntoPoster(play, playSize, box(playSize, W / 2 - playWidth / 2, H / 2 - playHeight / 2, playGrow), poster);
      // The byline strip continues the poster downward, as if printed on the sphere below it.
      strip.placeWarped(poster, stripSize, scale);
    },
  };
}

/** @param {Video} video */
function featuresOf(video) {
  /** @type {import('../badge/FeaturePill.js').Feature[]} */
  const list = [];
  if (video.premium) list.push('premium');
  if (video.topPick) list.push('topPicks');
  return list;
}

/**
 * Author and upload age, shown as plain text under the poster.
 * @param {Video} video
 */
function Byline(video) {
  return h(
    'p',
    { class: 'video-card-overlay__byline' },
    Avatar({ name: video.channel.name, hue: video.channel.hue }),
    h('span', { class: 'video-card-overlay__channel' }, video.channel.name),
    video.channel.verified &&
      h('span', { class: 'video-card-overlay__verified', title: 'Verified creator' }, Icon({ name: 'verified', size: 'small' })),
    h(
      'time',
      { class: 'video-card-overlay__age', datetime: video.uploadedAt.toISOString(), title: formatFullDate(video.uploadedAt) },
      `· ${formatRelativeDate(video.uploadedAt)}`,
    ),
  );
}

/**
 * Views, likes and comments, shown on the poster in a pill styled like the duration.
 * @param {Video} video
 */
function Stats(video) {
  return Badge({
    as: 'ul',
    className: 'video-card-overlay__stats',
    ariaLabel: 'Engagement',
    label: [Stat('eye', video.views, 'views'), Stat('heart', video.likes, 'likes'), Stat('comment', video.comments, 'comments')],
  });
}

/**
 * @param {import('../icon/Icon.js').IconName} icon
 * @param {number} value
 * @param {string} label
 */
function Stat(icon, value, label) {
  return h(
    'li',
    { class: 'video-card-overlay__stat' },
    Icon({ name: icon, size: 'small' }),
    h('span', {}, formatCount(value)),
    h('span', { class: 'visually-hidden' }, ` ${label}`),
  );
}
