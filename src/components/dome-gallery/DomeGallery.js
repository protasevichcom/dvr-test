// @ts-check
import { h } from '../../lib/dom.js';
import { loadPicture, prefetchPicture, releasePicture } from '../../lib/images.js';
import { MODE_SWITCH_SLACK_MS, currentDisplayMode, reducedMotionQuery } from '../../lib/environment.js';
import { readColorTokenRgb, readDurationToken, readEasingToken, readLengthToken, readNumberToken } from '../../lib/tokens.js';
import { FeaturedBanner } from '../featured-banner/FeaturedBanner.js';
import { Joystick } from '../joystick/Joystick.js';
import { VideoCardOverlay } from '../video-card/VideoCardOverlay.js';
import { createDomeScene } from './DomeScene.js';
import {
  bannerAt,
  bannerCells,
  bannerColumnsBetween,
  cellsInView,
  computeLayout,
  rowsAbove,
  homeRest,
  isBannerRow,
  isInView,
  rowsInView,
  nearestCell,
  openOutline,
  ringOf,
  rowStride,
} from './geometry.js';
import { angleDelta, screenToSphere, sphereToScreen } from './projection.js';

const DRAG_THRESHOLD_PX = 6;
const WHEEL_STEP_PX = 60;
const WHEEL_COOLDOWN_MS = 160;
/** A mouse-wheel notch is at least this many px (Chromium, Safari: ~100–120); trackpads send less. */
const WHEEL_NOTCH_MIN_PX = 50;
/** A trackpad pan (OS momentum included) is over once no wheel event came for this long; then it snaps. */
const TRACKPAD_IDLE_MS = 140;
/** Wheel deltas in lines (deltaMode 1, e.g. Firefox) → px; one notch (3 lines) then makes one step. */
const WHEEL_LINE_PX = 40;
/** How far a fling carries after release (seconds of the release velocity). */
const FLING_SECONDS = 0.35;
const SPRING_STEP_SECONDS = 1 / 240;
/** Feed switch: how far a leaving card recedes (extra distance, ×) and scatters from the gaze. */
const DISSOLVE_RECEDE = 1.5;
const DISSOLVE_SCATTER = 0.35;
/** Angle (rad) over which the feed-switch ripple spreads from the gaze to the periphery. */
const DISSOLVE_RIPPLE = 1.2;
/** Edge blur of a dissolving poster, as a share of its height (the quad grows to let it bleed out). */
const DISSOLVE_EDGE_BLUR = 0.18;
/**
 * px the poster quad always extends past the poster, so the shader's anti-aliased edge fades out
 * inside the quad (there is no MSAA; see DomeScene).
 */
const EDGE_AA_BLEED_PX = 2;
/**
 * Decoded pictures turned into textures per frame (nearest to the gaze first): each one is uploaded
 * to the GPU in the next render, so a burst (feed switch) spreads over a few frames instead of one.
 */
const UPLOADS_PER_FRAME = 3;
/**
 * Joystick tap directions (rad, 0 = right, CCW) as unit offsets: x in columns, y in rows (down).
 * `stepFor` scales them to the grid: vertical steps go to the next resting row straight above or
 * below (two rows on the hex grid), diagonal steps to the diagonal neighbour (half a column sideways
 * on the hex grid, a full column on the aligned one).
 */
const STEP_DIRECTIONS = [
  { angle: 0, x: 1, y: 0, minor: false },
  { angle: Math.PI / 4, x: 1, y: -1, minor: true },
  { angle: Math.PI / 2, x: 0, y: -1, minor: false },
  { angle: (3 * Math.PI) / 4, x: -1, y: -1, minor: true },
  { angle: Math.PI, x: -1, y: 0, minor: false },
  { angle: (-3 * Math.PI) / 4, x: -1, y: 1, minor: true },
  { angle: -Math.PI / 2, x: 0, y: 1, minor: false },
  { angle: -Math.PI / 4, x: 1, y: 1, minor: true },
];
/** Cards out of view for this long release their textures. */
const DISPOSE_AFTER_MS = 3000;

/** @typedef {import('../../data/videos.js').Video} Video */
/** @typedef {import('../../data/banners.js').Banner} Banner */
/** @typedef {import('./geometry.js').Cell} Cell */
/** @typedef {import('./DomeScene.js').PosterMesh} PosterMesh */
/**
 * A timed, eased run of a tween toward `to` (used to keep ring changes in step with the
 * display-mode switch instead of the usual exponential approach).
 * @typedef {{ from: number, to: number, start: number, duration: number, ease: import('../../lib/easing.js').Easing }} Glide
 */
/** @typedef {{ value: number, target: number, glide?: Glide | null }} Tween */
/** @typedef {{ column: number, row: number }} Camera */

/**
 * @typedef {object} Card
 * @property {string} key
 * @property {'video' | 'banner'} kind
 * @property {Cell} cell             video: its cell; banner: its row and center column (it spans `bannerSpan` cells)
 * @property {Video | null} video    null for banners
 * @property {number} bannerIndex    banners only: the item shown
 * @property {0 | 1 | 2} ring
 * @property {number} enterAt        timestamp before which a newly centered card waits to open
 * @property {Tween} activation      0 = closed; 1 = poster raised, info slid out below it
 * @property {Tween} highlight       hover / gaze / keyboard focus
 * @property {Tween} veil            dimming by distance from the cluster
 * @property {PosterMesh | null} poster
 * @property {import('../../lib/images.js').Picture | null} image  decoded poster (owned by the card)
 * @property {AbortController | null} loading  poster download; aborted when the card is disposed or leaves
 * @property {HTMLVideoElement | null} preview
 * @property {number} lastSeen
 * @property {number} dissolve       0…1 during a feed switch (fly out / fly in)
 * @property {{ direction: 'out' | 'in', start: number } | null} fly  feed-switch animation, if any
 * @property {boolean} playing       the video player stands in for this poster (it is not drawn)
 */

/**
 * The dome: an infinite feed of 16:9 posters on a lattice (aligned or hex, `--dome-grid-offset`),
 * seen from inside a sphere around the head (3 m on desktop, 1.5 m in VR; WebGL, see geometry.js and
 * projection.js). Turning reaches new content; rows flow vertically to the viewer. Featured banners
 * repeat on a fixed lattice of their own.
 *
 * The open cluster around the gaze (`--dome-cluster-*`: 5 rows of 3·5·5·5·3 on desktop, 3×3 in VR)
 * opens: posters move up along the sphere and their UI appears (VideoCardOverlay, FeaturedBanner).
 *
 * Switching the feed (`switchFeed`) sends the cards out through the sphere — receding, scattering,
 * fading and blurring in a ripple from the gaze — then brings the new feed in, in reverse order.
 *
 * Input (all directions): drag anywhere (with momentum), the joystick (drag to steer, tap to step),
 * wheel / trackpad on both axes, arrow keys, and clicking any card to bring it to the center.
 * Movement is a critically damped spring toward a resting cell, so it is continuous and never zig-zags:
 * vertical steps go straight up or down (one row on the aligned grid, two on the hex grid).
 *
 * @param {object} props
 * @param {(row: number, column: number) => Video} props.videoForCell  infinite feed
 * @param {Banner[]} props.banners
 * @param {(item: Video | Banner, source: import('../video-player/VideoPlayer.js').PlayerSource | null) => void} props.onPlay
 *   an open card was activated; video cards come with the poster the player can grow out of
 * @param {{ subscribe(listener: (point: { x: number, y: number }) => void): void }} props.parallax
 * @param {() => number} props.getTopInset  px from the top taken by UI above the dome (nav pill)
 * @param {() => void} [props.onSettle]  the dome came to rest on a new cell (a good time to prefetch)
 */
export function DomeGallery({ videoForCell, banners, onPlay, parallax, getTopInset, onSettle }) {
  let feed = videoForCell;
  /** Cards of the previous feed flying out after a switch (rendered until they are gone). */
  /** @type {Card[]} */
  let leaving = [];
  /** When the new feed's cards start flying in (they overlap the leaving ones, so there is no pause). */
  let arrivalStart = -Infinity;
  const canvas = h('canvas', { class: 'dome-gallery__canvas', 'aria-hidden': 'true' });
  const overlayLayer = h('div', { class: 'dome-gallery__overlays' });
  const status = h('p', { class: 'visually-hidden', 'aria-live': 'polite' });
  const joystick = Joystick({
    label: 'Browse videos',
    onMove: (x, y) => {
      stick = { x, y };
      invalidate();
    },
    onRelease: () => {
      stick = null;
      release();
    },
    onStep: (angle) => step(angle),
  });
  joystick.setDirections(STEP_DIRECTIONS);
  const joystickDock = h('div', { class: 'dome-gallery__joystick' }, joystick.el);

  const el = h(
    'section',
    {
      class: 'dome-gallery',
      id: 'gallery',
      tabindex: '-1', // target of the skip link
      'aria-roledescription': 'carousel',
      'aria-label': 'Recommended VR videos. Use arrow keys to browse.',
    },
    canvas,
    overlayLayer,
    joystickDock,
    status,
  );

  const scene = createDomeScene(canvas);
  /** Overlay pool; grows on demand (open + closing cards, and leaving ones on a feed switch). */
  /** @type {ReturnType<typeof createOverlay>[]} */
  const overlays = [];

  /** @type {(HTMLImageElement | null)[]} */
  const bannerImages = banners.map(() => null);
  let bannerImagesRequested = false;
  /** @type {Card | null} */
  let bannerViewCard = null;
  const bannerView = FeaturedBanner({
    items: banners,
    onSelect: selectBanner,
    onIntent: (intent) => {
      const banner = bannerViewCard;
      if (!banner) return;
      if (intent === 'enter') setHovered(banner);
      if (intent === 'leave' && hovered === banner) setHovered(null);
      if (intent === 'activate') activate(banner);
    },
  });
  overlayLayer.append(bannerView.el);

  /** @type {import('./geometry.js').DomeLayout} */
  let layout;
  /** @type {ReturnType<typeof readTokens>} */
  let tokens;
  /** @type {Map<string, Card>} */
  const cards = new Map();
  let structureKey = '';
  /** While the display-mode tokens glide (until this time, ms), the layout is re-read every frame. */
  let followUntil = 0;
  /** When the current display-mode switch started (ms); the cluster-size glide is timed from it. */
  let switchStart = 0;
  /**
   * The cluster size the view is fitted to glides between the old and the new cluster during a
   * display-mode switch, so the scale changes as smoothly as the tokens (the rings switch at once
   * and fade by their own glides).
   * @type {{ from: import('./geometry.js').ClusterSize, to: import('./geometry.js').ClusterSize } | null}
   */
  let clusterGlide = null;

  /**
   * Camera on the lattice (fractional). It follows `goal` on a critically damped spring, so steps,
   * wheel ticks and flings blend into one continuous, natural movement.
   */
  const camera = { column: 0, row: 0 };
  const cameraVelocity = { column: 0, row: 0 }; // lattice units per second
  /** Resting position the camera springs to (always a lattice cell). */
  /** @type {Cell} */
  let goal = { row: 0, column: 0 };
  /** Resting position of the open cluster (follows the camera live while dragging or steering). */
  /** @type {Cell} */
  let target = { row: 0, column: 0 };
  /** Joystick deflection while held (x right, y up, length ≤ 1). */
  /** @type {{ x: number, y: number } | null} */
  let stick = null;

  const screen = { width: 0, height: 0, centerX: 0, centerY: 0 };
  const parallaxOffset = { x: 0, y: 0 };
  /** @type {Card | null} */
  let hovered = null;

  // ---- Tokens & layout ----------------------------------------------------------------------

  function readTokens() {
    return {
      radius: readNumberToken('--dome-radius-m'),
      cardWidth: readNumberToken('--dome-card-width-m'),
      cardGap: readNumberToken('--dome-card-gap-m'),
      rowGap: readNumberToken('--dome-row-gap-m'),
      gridOffset: readNumberToken('--dome-grid-offset') > 0,
      clusterColumns: readNumberToken('--dome-cluster-columns'),
      clusterEdge: readNumberToken('--dome-cluster-edge'),
      clusterRows: readNumberToken('--dome-cluster-rows'),
      clusterRowsAbove: readNumberToken('--dome-cluster-rows-above'),
      bannerSpan: readNumberToken('--dome-banner-span'),
      bannerColumns: readNumberToken('--dome-banner-columns'),
      bannerRows: readNumberToken('--dome-banner-rows'),
      clusterWidthShare: readNumberToken('--dome-cluster-width-share'),
      cardUiWarp: readNumberToken('--dome-card-ui-warp') > 0,
      cardInset: readLengthToken('--spacing-sm'),
      bannerInset: readLengthToken('--spacing-md'),
      fov: readNumberToken('--dome-fov'),
      infoHeight: readLengthToken('--dome-info-height'),
      referenceCardWidth: readLengthToken('--dome-reference-card-width'),
      projectionStrength: readNumberToken('--dome-projection-strength'),
      safeGap: readLengthToken('--dome-safe-gap'),
      safeBottom: readLengthToken('--dome-safe-bottom'),
      cullMargin: readNumberToken('--dome-cull-margin'),
      joystickSpeed: readNumberToken('--dome-joystick-speed'),
      veil: [0, 1, 2].map((ring) => readNumberToken(`--card-veil-ring-${ring}`)),
      hoverScale: readNumberToken('--card-hover-scale'),
      parallaxDepth: readLengthToken('--scene-parallax-ui'),
      motionInfo: readDurationToken('--motion-info'),
      motionInfoDelay: readDurationToken('--motion-info-delay'),
      motionBase: readDurationToken('--motion-base'),
      motionSlow: readDurationToken('--motion-slow'),
      motionPage: readDurationToken('--motion-page'),
      motionFeedStagger: readDurationToken('--motion-feed-stagger'),
      motionModeSwitch: readDurationToken('--motion-mode-switch'),
      playRestScale: readNumberToken('--play-rest-scale'),
      easeModeSwitch: readEasingToken('--motion-ease-mode'),
      previewDwell: readDurationToken('--preview-dwell'),
    };
  }

  /**
   * Re-reads tokens and recomputes the layout.
   * With `follow` (display-mode switch, run every frame while the mode tokens glide) the same cards
   * stay and the camera keeps its place: cards change size and curvature as the card width, the
   * root size and the type sizes interpolate. Otherwise (mount, resize) a new lattice starts from home.
   * @param {{ follow?: boolean }} [options]
   */
  function relayout({ follow = false } = {}) {
    tokens = readTokens();
    const resized = screen.width !== window.innerWidth || screen.height !== window.innerHeight;
    screen.width = window.innerWidth;
    screen.height = window.innerHeight;
    const size = { columns: tokens.clusterColumns, edge: tokens.clusterEdge, rows: tokens.clusterRows, above: tokens.clusterRowsAbove };
    const now = performance.now();
    if (!follow || (clusterGlide && now - switchStart >= tokens.motionModeSwitch)) clusterGlide = null;
    if (follow) {
      const fitted = clusterFit(now);
      if (fitted && !sameSize(size, clusterGlide?.to ?? fitted)) clusterGlide = { from: fitted, to: size };
    }
    const fit = (follow && clusterFit(now)) || size;
    // The open cluster uses the height from the nav pill down to the bottom edge (the joystick
    // floats in the bottom-right corner over the dimmed periphery).
    const next = computeLayout({ ...tokens, clusterFit: fit, safeTop: getTopInset() + tokens.safeGap }, screen);
    if (resized) scene.resize(screen.width, screen.height); // resizing clears the canvas

    const { shared } = scene;
    shared.uPlaceholder.value.setRGB(...readColorTokenRgb('--surface-media'));
    shared.uDimColor.value.setRGB(...readColorTokenRgb('--bg-canvas'));
    shared.uHighlightColor.value.setRGB(...readColorTokenRgb('--accent-brand'));
    shared.uRingWidth.value = readLengthToken('--card-ring-width');
    setLayout(next);

    const key = [next.bannerColumns, next.bannerRows, next.gridOffset, next.clusterColumns, next.clusterEdge, next.clusterRows, next.clusterRowsAbove, next.bannerSpan].join(':');
    const restructured = key !== structureKey;
    structureKey = key;
    if (!restructured) {
      if (!follow) updateRings({ immediate: true });
      return;
    }

    if (follow) {
      reconcileCards();
      // The gaze keeps its place, so a cluster change (5×5 ↔ 3×3) dims or lights up its outer ring
      // around the same center; a resting cell now under a banner moves down a row.
      let rest = nearestCell(goal.column, goal.row, goal.row, layout);
      if (bannerAt(rest, layout) !== null) rest = { row: rest.row + 1, column: rest.column };
      goal = rest;
      target = rest;
      updateRings({ glide: true });
      return;
    }

    // A different lattice moves every cell and banner: start again from home.
    cards.forEach(disposeCard);
    cards.clear();
    leaving.forEach(disposeCard);
    leaving = [];
    const home = homeRest(layout);
    Object.assign(camera, home);
    Object.assign(cameraVelocity, { column: 0, row: 0 });
    goal = { ...home };
    target = { ...home };
    updateRings({ immediate: true });
  }

  /**
   * The cluster size the view is currently fitted to: gliding during a display-mode switch,
   * otherwise the current layout's cluster (null before the first layout). No side effects.
   * @param {number} now
   * @returns {import('./geometry.js').ClusterSize | null}
   */
  function clusterFit(now) {
    if (clusterGlide) {
      const t = Math.min(1, Math.max(0, (now - switchStart) / Math.max(1, tokens.motionModeSwitch)));
      const e = tokens.easeModeSwitch(t);
      const { from, to } = clusterGlide;
      return {
        columns: from.columns + (to.columns - from.columns) * e,
        edge: from.edge + (to.edge - from.edge) * e,
        rows: from.rows + (to.rows - from.rows) * e,
        above: from.above + (to.above - from.above) * e,
      };
    }
    return layout
      ? { columns: layout.clusterColumns, edge: layout.clusterEdge, rows: layout.clusterRows, above: layout.clusterRowsAbove }
      : null;
  }

  /**
   * Makes a layout current and pushes its size-dependent values to the shader and the overlays.
   * @param {import('./geometry.js').DomeLayout} next
   */
  function setLayout(next) {
    layout = next;
    scene.shared.uStrength.value = layout.strength;
    scene.shared.uRadius.value = readLengthToken('--radius-card') * layout.overlayScale;
    el.style.setProperty('--dome-overlay-scale', layout.overlayScale.toFixed(4));
  }

  /**
   * The lattice changed under existing cards (display-mode switch): cards it no longer has — a video
   * now under a banner, a banner that moved — fade out, and the cards replacing them fade in. Cells
   * that merely come into view as the dome shrinks slide in solid, mirroring cells that slide out of
   * view as it grows, so both switch directions look the same in reverse.
   */
  function reconcileCards() {
    const now = performance.now();
    let replaced = false;
    for (const card of [...cards.values()]) {
      const banner = bannerAt(card.cell, layout);
      const kept =
        card.kind === 'banner'
          ? banner === card.cell.column && bannerIndexOf(card.cell) === card.bannerIndex
          : banner === null;
      if (kept) continue;
      replaced = true;
      cards.delete(card.key);
      if (card.poster?.mesh.visible) {
        card.fly = { direction: 'out', start: now };
        card.loading?.abort();
        leaving.push(card);
      } else {
        disposeCard(card);
      }
    }
    if (replaced) arrivalStart = now;
  }

  /**
   * Which banner a banner cell shows: they take turns along rows and between banner rows.
   * @param {Cell} cell
   */
  function bannerIndexOf(cell) {
    return mod(Math.round(cell.column / layout.bannerColumns) + Math.round(cell.row / layout.bannerRows), banners.length);
  }

  // ---- Cards --------------------------------------------------------------------------------

  /**
   * @param {Card['kind']} kind
   * @param {Cell} cell
   * @param {Video | null} video
   * @returns {Card}
   */
  function createCard(kind, cell, video) {
    /** @type {Card} */
    const card = {
      key: kind === 'banner' ? `banner:${cell.row}:${cell.column}` : `${cell.row}:${cell.column}`,
      kind,
      cell,
      video,
      bannerIndex: kind === 'banner' ? bannerIndexOf(cell) : 0,
      ring: 2,
      enterAt: 0,
      activation: { value: 0, target: 0 },
      highlight: { value: 0, target: 0 },
      veil: { value: 0, target: 0 },
      poster: null,
      image: null,
      loading: null,
      preview: null,
      lastSeen: 0,
      dissolve: 0,
      fly: performance.now() < arrivalStart + flyLength() ? { direction: 'in', start: arrivalStart } : null,
      playing: false,
    };
    // Cards enter from off-screen, so they start in their final state.
    card.ring = ringFor(card);
    card.activation.value = card.activation.target = card.ring === 0 ? 1 : 0;
    card.veil.value = card.veil.target = tokens.veil[card.ring];
    cards.set(card.key, card);
    // Cards are created lazily, so the center may appear after the rings were last updated.
    if (video && isCenter(cell)) announceCenter();
    return card;
  }

  /** @param {Card} card */
  function disposeCard(card) {
    stopPreview(card);
    card.loading?.abort();
    card.poster?.dispose();
    releasePicture(card.image);
    card.image = null;
    if (hovered === card) hovered = null;
  }

  /** @param {Card} card  a banner spans several cells; it belongs to the cluster if any of them does */
  function ringFor(card) {
    if (card.kind === 'video') return ringOf(card.cell, target, layout);
    const { row, column } = card.cell;
    return /** @type {0 | 1 | 2} */ (
      Math.min(...bannerCells(row, column, layout).map((cell) => ringOf(cell, target, layout)))
    );
  }

  /** @param {Card} card */
  function halfYawOf(card) {
    return card.kind === 'banner' ? layout.halfYaw + ((layout.bannerSpan - 1) / 2) * layout.columnStep : layout.halfYaw;
  }

  /** Cards in the visible window around the camera (created on demand). */
  function visibleCards() {
    /** @type {Card[]} */
    const visible = [];
    for (const cell of cellsInView(camera, layout)) {
      if (!isInView(cell.column, cell.row, camera, layout) || bannerAt(cell, layout) !== null) continue;
      visible.push(cards.get(`${cell.row}:${cell.column}`) ?? createCard('video', cell, feed(cell.row, cell.column)));
    }
    // A banner is wider than a card: its center may lie past the cull edge while its side is in view.
    const span = layout.cullAngle / layout.columnStep + (layout.bannerSpan - 1) / 2;
    const { first, last } = rowsInView(camera, layout);
    for (let row = first; row <= last; row += 1) {
      if (!isBannerRow(row, layout) || !isInView(camera.column, row, camera, layout)) continue;
      for (const column of bannerColumnsBetween(camera.column - span, camera.column + span, layout)) {
        visible.push(cards.get(`banner:${row}:${column}`) ?? createCard('banner', { row, column }, null));
      }
    }
    return visible;
  }

  /** @param {Card} card */
  function ensurePoster(card) {
    if (card.poster) return card.poster;
    const poster = scene.createPosterMesh();
    card.poster = poster;
    if (card.kind === 'banner') {
      showBannerImage(card);
      return poster;
    }
    const loading = new AbortController();
    card.loading = loading;
    loadPicture(/** @type {Video} */ (card.video).poster, loading.signal)
      .then((picture) => {
        if (loading.signal.aborted) return releasePicture(picture);
        card.loading = null;
        uploads.push({ card, picture });
        invalidate();
      })
      .catch(() => {
        /* Aborted, or the image failed: the card keeps its placeholder. */
      });
    return poster;
  }

  /** Decoded posters waiting to become textures (see UPLOADS_PER_FRAME). */
  /** @type {{ card: Card, picture: import('../../lib/images.js').Picture }[]} */
  let uploads = [];

  /**
   * Turns up to UPLOADS_PER_FRAME decoded posters into textures, nearest to the gaze first. Pictures
   * of cards that were disposed or are flying out meanwhile are released instead.
   * @returns {boolean} true while more are waiting
   */
  function flushUploads() {
    if (!uploads.length) return false;
    const gazeDistance = (/** @type {Card} */ card) =>
      Math.hypot((card.cell.column - camera.column) * layout.columnStep, (card.cell.row - camera.row) * layout.rowStep);
    const live = [];
    for (const upload of uploads) {
      if (upload.card.poster && upload.card.fly?.direction !== 'out' && (cards.get(upload.card.key) === upload.card)) live.push(upload);
      else releasePicture(upload.picture);
    }
    live.sort((a, b) => gazeDistance(a.card) - gazeDistance(b.card));
    for (const { card, picture } of live.splice(0, UPLOADS_PER_FRAME)) {
      releasePicture(card.image);
      card.image = picture;
      if (!card.preview) card.poster?.setSource(picture, { fade: true });
    }
    uploads = live;
    return uploads.length > 0;
  }

  /** Banner images are shared by every banner occurrence and preloaded once. */
  /** @param {Card} card */
  function showBannerImage(card) {
    const image = bannerImages[card.bannerIndex];
    if (image) {
      card.poster?.setSource(image, { fade: true });
      return;
    }
    if (bannerImagesRequested) return;
    bannerImagesRequested = true;
    banners.forEach((banner, index) =>
      loadPicture(banner.image)
        .then((loaded) => {
          bannerImages[index] = loaded;
          for (const other of cards.values()) {
            if (other.kind === 'banner' && other.bannerIndex === index) other.poster?.setSource(loaded, { fade: true });
          }
          invalidate();
        })
        .catch(() => {
          /* The banner keeps its placeholder. */
        }),
    );
  }

  /** @param {number} index */
  function selectBanner(index) {
    if (!bannerViewCard) return;
    bannerViewCard.bannerIndex = index;
    bannerView.setIndex(index);
    showBannerImage(bannerViewCard);
    invalidate();
  }

  // ---- Rings --------------------------------------------------------------------------------

  /**
   * @param {{ immediate?: boolean, glide?: boolean }} [options]
   *   immediate: settle at once; glide: run ring changes (veil, opening) in step with the display-mode
   *   switch — same duration and easing as the gliding tokens, no delay
   */
  function updateRings({ immediate = false, glide = false } = {}) {
    const now = performance.now();
    for (const card of cards.values()) {
      const ring = ringFor(card);
      if (ring === 0 && card.ring !== 0) card.enterAt = immediate || glide ? 0 : now + tokens.motionInfoDelay;
      if (ring !== 0 && card.ring === 0) stopPreview(card);
      if (glide && ring !== card.ring) {
        startGlide(card.activation, ring === 0 ? 1 : 0, now);
        startGlide(card.veil, tokens.veil[ring], now);
      }
      card.ring = ring;
      card.veil.target = tokens.veil[ring];
      if (immediate) {
        card.activation.value = card.activation.target = ring === 0 ? 1 : 0;
        card.veil.value = card.veil.target;
      }
    }
    announceCenter();
    invalidate();
  }

  /**
   * @param {Tween} tween
   * @param {number} to
   * @param {number} now
   */
  function startGlide(tween, to, now) {
    tween.target = to;
    tween.glide = { from: tween.value, to, start: now, duration: tokens.motionModeSwitch, ease: tokens.easeModeSwitch };
  }

  /** The cell at the gaze: the resting cell (odd middle row), or the left of the two middle cells (even). */
  function centerCell() {
    return { row: target.row, column: target.column - layout.restShift };
  }

  /** @param {Cell} cell */
  function isCenter(cell) {
    const center = centerCell();
    return cell.row === center.row && cell.column === center.column;
  }

  /** Screen-reader announcement of the centered card. */
  function announceCenter() {
    const cell = centerCell();
    if (bannerAt(cell, layout) !== null) {
      status.textContent = 'Centered: featured';
      return;
    }
    // A video card not created yet announces itself from createCard.
    const center = cards.get(`${cell.row}:${cell.column}`);
    if (center?.video) status.textContent = `Centered: ${center.video.title}`;
  }

  /** @param {Cell} cell */
  function setTarget(cell) {
    if (cell.row === target.row && cell.column === target.column) return;
    target = cell;
    updateRings();
  }

  // ---- Navigation ---------------------------------------------------------------------------

  /**
   * Sets where the camera comes to rest; the spring takes it there.
   * @param {Cell} cell
   */
  function moveTo(cell) {
    goal = cell;
    setTarget(cell);
    setHovered(null);
    invalidate();
  }

  /** @param {number} delta  columns; positive moves right */
  function stepColumns(delta) {
    moveTo({ row: goal.row, column: goal.column + delta });
  }

  /**
   * Straight up (-1) or down (+1): to the next resting row with the same column (`rowStride`: one row
   * on the aligned grid, two on the hex grid, whose rows alternate a half-column offset).
   * @param {number} direction
   */
  function stepRows(direction) {
    moveTo({ row: goal.row + rowStride(layout) * direction, column: goal.column });
  }

  /**
   * One joystick tap: the nearest of eight directions.
   * @param {number} angle  rad, 0 = right, counter-clockwise
   */
  function step(angle) {
    const best = STEP_DIRECTIONS.reduce((a, b) =>
      Math.abs(angleDelta(angle, a.angle)) <= Math.abs(angleDelta(angle, b.angle)) ? a : b,
    );
    if (!best.y) return stepColumns(best.x);
    if (!best.x) return stepRows(best.y);
    // Diagonal neighbour: one row up/down, half a column (hex grid) or a full column (aligned grid).
    moveTo({ row: goal.row + best.y, column: goal.column + best.x * (layout.gridOffset ? 0.5 : 1) });
  }

  /**
   * End of a drag or joystick hold: keep the momentum and settle on the cell it carries to.
   */
  function release() {
    const projected = {
      column: camera.column + cameraVelocity.column * FLING_SECONDS,
      row: camera.row + cameraVelocity.row * FLING_SECONDS,
    };
    moveTo(nearestCell(projected.column, projected.row, target.row, layout));
  }

  /**
   * Cluster cards play; any other card comes to the center. A banner comes to the top of the cluster.
   * @param {Card} card
   */
  function activate(card) {
    if (isSwitching()) return;
    if (card.ring === 0) {
      if (card.video) onPlay(card.video, playerSourceOf(card));
      else onPlay(banners[card.bannerIndex], null);
      return;
    }
    moveTo(restFor(card));
  }

  /**
   * Resting position that brings a card to the center: onto it (2/3/2) or next to it so it becomes
   * one of the two middle cards, on the side nearer the current view (3/4/3). The banner sits in the
   * middle row for 3/4/3 (its two cells are the middle ones) and at the top of the cluster for 2/3/2.
   * @param {Card} card
   * @returns {Cell}
   */
  function restFor(card) {
    const { row, column } = card.cell;
    // A banner becomes the top row of the open cluster, as at home.
    if (!layout.restShift) return card.kind === 'banner' ? { row: row + rowsAbove(layout), column } : card.cell;
    if (card.kind === 'banner') return { row, column };
    const left = column - 0.5;
    const right = column + 0.5;
    return { row, column: Math.abs(left - camera.column) <= Math.abs(right - camera.column) ? left : right };
  }

  // ---- Overlays -----------------------------------------------------------------------------

  function createOverlay() {
    /** @type {Card | null} */
    let card = null;
    const view = VideoCardOverlay({
      onIntent: (intent) => {
        if (!card) return;
        if (intent === 'enter') setHovered(card);
        if (intent === 'leave' && hovered === card) setHovered(null);
        if (intent === 'activate') activate(card);
      },
    });
    overlayLayer.append(view.el);

    const overlay = {
      view,
      get card() {
        return card;
      },
      /** @param {Card | null} next  overlays only ever hold video cards */
      assign(next) {
        if (card === next) return;
        if (!next && card && hovered === card) setHovered(null);
        card = next;
        view.setVideo(next?.video ?? null);
        view.setHighlighted(!!next && hovered === next);
      },
    };
    overlays.push(overlay);
    return overlay;
  }

  /**
   * Screen point of a sphere position for the current camera.
   * @param {number} yaw
   * @param {number} pitch
   */
  function toScreen(yaw, pitch) {
    const [u, v] = sphereToScreen(yaw, pitch, camera.column * layout.columnStep, layout.strength);
    return { x: screen.centerX + u * layout.scale, y: screen.centerY + v * layout.scale };
  }

  /**
   * A screen anchor on the sphere with the local direction of the horizontal line through it, so a
   * flat control can be turned to follow the curved surface without being warped.
   * @param {number} yaw
   * @param {number} pitch
   */
  function anchorOnSphere(yaw, pitch) {
    const step = 0.01;
    const before = toScreen(yaw - step, pitch);
    const after = toScreen(yaw + step, pitch);
    return { point: toScreen(yaw, pitch), angle: Math.atan2(after.y - before.y, after.x - before.x) };
  }

  /** @param {Card} card */
  const isOpenOrClosing = (card) => !!card.poster?.mesh.visible && (card.ring === 0 || card.activation.value > 0.001);

  /**
   * Binds overlays to open or closing cards and lays them out from the posters on the sphere.
   * @param {Card[]} visible
   * @param {Card[]} leavingVisible  previous feed's cards still flying out
   */
  function placeOverlays(visible, leavingVisible) {
    const wanted = [...visible, ...leavingVisible].filter((card) => card.kind === 'video' && isOpenOrClosing(card));
    for (const overlay of overlays) {
      if (overlay.card && !wanted.includes(overlay.card)) overlay.assign(null);
    }
    for (const card of wanted) {
      if (overlays.some((overlay) => overlay.card === card)) continue;
      (overlays.find((overlay) => !overlay.card) ?? createOverlay()).assign(card);
    }
    if (focusCenterPending) focusCenterCard();
    if (focusCardPending) focusPendingCard();

    // One banner overlay, bound to the banner that is open (or closing) closest to the gaze.
    const banner = visible
      .filter((card) => card.kind === 'banner' && isOpenOrClosing(card))
      .sort((a, b) => b.activation.value - a.activation.value)[0];
    if (banner !== bannerViewCard) {
      bannerViewCard = banner ?? null;
      if (banner) bannerView.setIndex(banner.bannerIndex);
    }
    bannerView.setVisible(!!banner);

    const bound = overlays.filter((overlay) => overlay.card);
    if (tokens.cardUiWarp) {
      // Warp mode measures element sizes: write every size first, then read them all, so the frame
      // forces one layout instead of one per overlay (sizes change every frame of a mode switch).
      const remeasure = followUntil > 0;
      const posters = new Map(bound.map((overlay) => [overlay, posterMap(/** @type {Card} */ (overlay.card))]));
      const bannerPoster = banner ? posterMap(banner) : null;
      posters.forEach((poster, overlay) => overlay.view.prepareWarp(poster.width, layout.overlayScale, remeasure));
      if (bannerPoster) bannerView.prepareWarp(bannerPoster.width, layout.overlayScale, remeasure);
      bound.forEach((overlay) => overlay.view.measureWarp());
      if (bannerPoster) bannerView.measureWarp();
      for (const [overlay, poster] of posters) {
        const card = /** @type {Card} */ (overlay.card);
        overlay.view.placeWarped({
          poster,
          scale: layout.overlayScale,
          inset: tokens.cardInset,
          hitArea: hitAreaOf(card),
          openness: card.activation.value,
          highlight: card.highlight.value,
          playRestScale: tokens.playRestScale,
          dissolve: card.dissolve,
        });
      }
      if (!banner || !bannerPoster) return;
      bannerView.placeWarped({
        poster: bannerPoster,
        scale: layout.overlayScale,
        inset: tokens.bannerInset,
        hitArea: bannerHitAreaOf(banner),
        openness: banner.activation.value,
        dissolve: banner.dissolve,
      });
      return;
    }

    for (const overlay of bound) {
      const card = /** @type {Card} */ (overlay.card);
      const frame = posterFrame(card);
      overlay.view.place({
        posterTopLeft: frame.top.start,
        posterBottomLeft: frame.bottom.start,
        posterBottomRight: frame.bottom.end,
        posterCenter: frame.center,
        topAngle: frame.top.angle,
        bottomAngle: frame.bottom.angle,
        infoOrigin: frame.bottom.below,
        infoWidth: frame.bottom.length,
        hitArea: hitAreaOf(card),
        openness: card.activation.value,
        dissolve: card.dissolve,
      });
    }

    if (!banner) return;
    const { yaw, restPitch, halfYaw, shift } = placement(banner, { hover: false });
    const pitch = restPitch + shift;
    const { bottom } = posterFrame(banner);
    bannerView.place({
      prev: anchorOnSphere(yaw - halfYaw, pitch),
      next: anchorOnSphere(yaw + halfYaw, pitch),
      info: { origin: bottom.below, width: bottom.length, angle: bottom.angle },
      hitArea: bannerHitAreaOf(banner),
      openness: banner.activation.value,
      dissolve: banner.dissolve,
    });
  }

  /**
   * Screen bounds of an open card: the raised poster and the info block under it.
   * @param {Card} card
   */
  function hitAreaOf(card) {
    const { yaw, restPitch, halfYaw } = placement(card, { hover: false });
    return boundsOf(openOutline(layout, yaw, restPitch, halfYaw).map(([y, p]) => toScreen(y, p)));
  }

  /**
   * Screen bounds of a banner image (its curved edges sampled at the corners and the middle).
   * @param {Card} banner
   */
  function bannerHitAreaOf(banner) {
    const { top, bottom } = posterFrame(banner);
    return boundsOf([top.start, top.end, top.middle, bottom.start, bottom.end, bottom.middle]);
  }

  /**
   * The poster as the video player sees it: its screen corners and corner radius, and a switch that
   * hides it while the player stands in for it.
   * @param {Card} card
   * @returns {import('../video-player/VideoPlayer.js').PlayerSource}
   */
  function playerSourceOf(card) {
    return {
      quad() {
        const { width, height, toScreen: at } = posterMap(card);
        return [at(0, 0), at(width, 0), at(width, height), at(0, height)];
      },
      radius: () => scene.shared.uRadius.value,
      setPlaying(value) {
        card.playing = value;
        if (value) setHovered(null);
        invalidate();
      },
      restoreFocus() {
        // Its overlay is bound again once the poster is drawn (next frame); focus it then.
        focusCardPending = card;
        invalidate();
      },
    };
  }

  /**
   * Warp mode: a poster's own px space (its size at the gaze, before hover / dissolve) and how a
   * point of it lands on screen now, through the same sphere mapping as the image.
   * @param {Card} card
   * @returns {import('../../lib/homography.js').PosterMap}
   */
  function posterMap(card) {
    const { yaw, restPitch, halfYaw, halfPitch, shift } = placement(card);
    const width = 2 * halfYawOf(card) * layout.scale;
    const height = 2 * layout.halfPitch * layout.scale;
    const pitch = restPitch + shift;
    return {
      width,
      height,
      toScreen: (x, y) => toScreen(yaw + (x / width - 0.5) * 2 * halfYaw, pitch + (y / height - 0.5) * 2 * halfPitch),
    };
  }

  /**
   * Where a poster is drawn now: its cell, opened by `activation`, grown by hover, and — during a
   * feed switch — receded behind the sphere and scattered away from the gaze by `dissolve`.
   * @param {Card} card
   * @param {{ hover?: boolean }} [options]
   */
  function placement(card, { hover = true } = {}) {
    const cameraYaw = camera.column * layout.columnStep;
    const restYaw = card.cell.column * layout.columnStep;
    const restPitch = (card.cell.row - camera.row) * layout.rowStep;
    const scatter = 1 + DISSOLVE_SCATTER * card.dissolve;
    const shrink = (hover ? 1 + (tokens.hoverScale - 1) * card.highlight.value : 1) / (1 + DISSOLVE_RECEDE * card.dissolve);
    return {
      yaw: cameraYaw + (restYaw - cameraYaw) * scatter,
      restPitch: restPitch * scatter,
      halfYaw: halfYawOf(card) * shrink,
      halfPitch: layout.halfPitch * shrink,
      shift: -layout.activeShift * card.activation.value * shrink,
    };
  }

  /**
   * Current on-screen frame of a poster: edges (as flat chords) and center.
   * @param {Card} card
   */
  function posterFrame(card) {
    const { yaw, restPitch, halfYaw, halfPitch, shift } = placement(card, { hover: false });
    const pitch = restPitch + shift;
    const edge = (/** @type {number} */ p) => edgeFrame(toScreen(yaw - halfYaw, p), toScreen(yaw + halfYaw, p), toScreen(yaw, p));
    return {
      yaw,
      restPitch,
      halfYaw,
      top: edge(pitch - halfPitch),
      bottom: edge(pitch + halfPitch),
      center: toScreen(yaw, pitch),
    };
  }

  // ---- Hover & preview ----------------------------------------------------------------------

  /** @param {Card | null} card */
  function setHovered(card) {
    if (hovered === card) return;
    const previous = hovered;
    hovered = card;
    if (previous) {
      previous.highlight.target = 0;
      stopPreview(previous);
    }
    if (card) {
      card.highlight.target = 1;
      schedulePreview(card);
    }
    overlays.forEach((overlay) => overlay.view.setHighlighted(!!card && overlay.card === card));
    bannerView.setHighlighted(!!card && card === bannerViewCard);
    canvas.style.cursor = card ? 'pointer' : '';
    invalidate();
  }

  /** @type {{ card: Card, video: HTMLVideoElement, timer: number } | null} */
  let pendingPreview = null;

  /**
   * Muted flat preview after a dwell; off in VR comfort mode and for reduced motion
   * (wiki/concepts/motion-and-comfort.md).
   * @param {Card} card
   */
  function schedulePreview(card) {
    const src = card.video?.previewSrc;
    if (!src || card.ring !== 0 || currentDisplayMode() === 'vr' || reducedMotionQuery.matches) return;
    const video = document.createElement('video');
    const timer = window.setTimeout(() => {
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.src = src;
      video.addEventListener('playing', () => {
        if (pendingPreview?.video !== video) return;
        card.preview = video;
        card.poster?.setSource(video);
        invalidate();
      });
      video.play().catch(() => stopPreview(card));
    }, tokens.previewDwell);
    pendingPreview = { card, video, timer };
  }

  /** @param {Card} card */
  function stopPreview(card) {
    if (pendingPreview?.card !== card) return;
    window.clearTimeout(pendingPreview.timer);
    pendingPreview.video.pause();
    pendingPreview.video.removeAttribute('src');
    pendingPreview.video.load(); // releases the network connection and buffers
    pendingPreview = null;
    if (card.preview) {
      card.preview = null;
      card.poster?.setSource(card.image);
      invalidate();
    }
  }

  // ---- Frame loop (runs only while something moves) -----------------------------------------

  let frameId = 0;
  let lastFrame = 0;

  function invalidate() {
    if (frameId || !layout) return;
    lastFrame = performance.now();
    frameId = requestAnimationFrame(frame);
  }

  /** @param {number} now */
  function frame(now) {
    frameId = 0;
    const dt = Math.min(64, Math.max(0, now - lastFrame));
    lastFrame = now;
    let busy = false;
    if (followUntil) {
      relayout({ follow: true });
      busy = true;
    }

    if (stick) {
      // Joystick: direct steering in columns per second; y is up, rows grow downward.
      cameraVelocity.column = stick.x * tokens.joystickSpeed;
      cameraVelocity.row = -stick.y * tokens.joystickSpeed * (layout.columnStep / layout.rowStep);
      camera.column += cameraVelocity.column * (dt / 1000);
      camera.row += cameraVelocity.row * (dt / 1000);
      setTarget(nearestCell(camera.column, camera.row, target.row, layout));
      busy = true;
    } else if (!drag?.dragging && !trackpadPanning) {
      busy = springToGoal(dt) || busy;
    }

    screen.centerX = layout.center.x + parallaxOffset.x;
    screen.centerY = layout.center.y + parallaxOffset.y;
    const { shared } = scene;
    shared.uCameraYaw.value = camera.column * layout.columnStep;
    shared.uScreen.value.set(
      layout.scale / (screen.width / 2),
      layout.scale / (screen.height / 2),
      (screen.centerX - screen.width / 2) / (screen.width / 2),
      -(screen.centerY - screen.height / 2) / (screen.height / 2),
    );

    // Feed switch: the previous feed's cards fly out while the new ones fly in.
    const leavingVisible = [];
    for (const card of leaving) {
      card.dissolve = dissolveOf(card, now);
      const gone = !card.fly && card.dissolve >= 1;
      if (gone || !isInView(card.cell.column, card.cell.row, camera, layout)) {
        disposeCard(card);
        card.lastSeen = -1; // marks it for removal below
        continue;
      }
      applyCard(card);
      leavingVisible.push(card);
    }
    leaving = leaving.filter((card) => card.lastSeen !== -1);
    busy = busy || isSwitching();

    const visible = visibleCards();
    const visibleSet = new Set(visible);
    for (const card of cards.values()) {
      if (visibleSet.has(card)) continue;
      hideCard(card);
      if (now - card.lastSeen > DISPOSE_AFTER_MS) {
        disposeCard(card);
        cards.delete(card.key);
      }
    }

    busy = flushUploads() || busy;

    for (const card of visible) {
      card.lastSeen = now;
      card.dissolve = dissolveOf(card, now);
      const waiting = card.ring === 0 && now < card.enterAt;
      card.activation.target = card.ring === 0 && !waiting ? 1 : 0;
      busy = advanceTween(card.activation, dt, tokens.motionInfo, now) || waiting || busy;
      busy = approach(card.highlight, dt, tokens.motionBase) || busy;
      busy = advanceTween(card.veil, dt, tokens.motionSlow, now) || busy;
      busy = busy || !!card.preview; // video frames keep the loop alive
      applyCard(card);
      busy = /** @type {PosterMesh} */ (card.poster).advanceFade(dt, tokens.motionSlow) || busy;
    }

    placeOverlays(visible, leavingVisible);
    scene.render();
    if (followUntil && now >= followUntil) followUntil = 0; // the last frame of a mode switch is drawn
    // invalidate() inside this frame may already have scheduled the next one.
    if (busy && !frameId) frameId = requestAnimationFrame(frame);
    if (!busy) settled();
  }

  /** Last resting cell reported to `onSettle` (pointer parallax alone does not count as a move). */
  let settledKey = '';

  function settled() {
    const key = `${goal.row}:${goal.column}`;
    if (key === settledKey) return;
    settledKey = key;
    onSettle?.();
  }

  /** @param {Card} card */
  function applyCard(card) {
    const poster = ensurePoster(card);
    const { yaw, restPitch, halfYaw, halfPitch, shift } = placement(card);
    poster.mesh.visible = !card.playing && card.dissolve < 0.999;
    poster.mesh.renderOrder = (2 - card.ring) * 10 + (card.highlight.value > 0.01 ? 40 : 0);
    // Rows flow: pitch is relative to the camera row, so the gaze stays near eye level.
    poster.uniforms.uCard.value.set(yaw, restPitch, halfYaw, halfPitch);
    const box = { width: 2 * halfYaw * layout.scale, height: 2 * halfPitch * layout.scale };
    poster.uniforms.uBox.value.set(box.width, box.height);
    // Dissolving posters blur at their edges too: the quad grows so the soft edge can bleed out.
    const edgeBlur = card.dissolve * DISSOLVE_EDGE_BLUR * box.height;
    poster.uniforms.uEdgeBlur.value = edgeBlur;
    const bleed = edgeBlur + EDGE_AA_BLEED_PX;
    poster.uniforms.uBleed.value.set(bleed / (box.width / 2), bleed / (box.height / 2));
    // Opening moves the poster up along the sphere; its shape is re-derived at the new latitude.
    poster.uniforms.uShift.value = shift;
    poster.uniforms.uDissolve.value = card.dissolve;
    poster.uniforms.uDim.value = card.veil.value * (1 - card.highlight.value);
    poster.uniforms.uHighlight.value = card.highlight.value;
  }

  /** @param {Card} card */
  function hideCard(card) {
    if (card.poster) card.poster.mesh.visible = false;
    // Off-screen cards settle instantly so they re-enter the view in their final state.
    card.activation.value = card.activation.target = card.ring === 0 ? 1 : 0;
    card.highlight.value = card.highlight.target;
    card.veil.value = card.veil.target;
    card.activation.glide = card.veil.glide = null;
  }

  /**
   * Feed-switch progress for a card (0 = solid, 1 = gone). Out: a ripple from the gaze to the
   * periphery. In: the reverse — periphery first, the center last.
   * @param {Card} card
   * @param {number} now
   */
  function dissolveOf(card, now) {
    if (!card.fly) return 0;
    const distance = Math.hypot(
      (card.cell.column - camera.column) * layout.columnStep,
      (card.cell.row - camera.row) * layout.rowStep,
    );
    const order = Math.min(1, distance / DISSOLVE_RIPPLE);
    const leavingCard = card.fly.direction === 'out';
    const delay = (leavingCard ? order : 1 - order) * tokens.motionFeedStagger;
    const t = Math.min(1, Math.max(0, (now - card.fly.start - delay) / Math.max(1, tokens.motionSlow)));
    const eased = t * t * (3 - 2 * t);
    if (t >= 1) card.fly = null; // done (a leaving card is then removed)
    return leavingCard ? eased : 1 - eased;
  }

  /** Full length of a fly-out / fly-in ripple, ms (both directions run the same ripple). */
  function flyLength() {
    return tokens ? tokens.motionFeedStagger + tokens.motionSlow : 0;
  }

  function isSwitching() {
    return leaving.length > 0 || performance.now() < arrivalStart + flyLength();
  }

  /**
   * Critically damped spring from the camera to the goal: no overshoot, velocity carries over when
   * the goal changes mid-way. Returns true while moving.
   * @param {number} dt  ms
   */
  function springToGoal(dt) {
    const settleSeconds = tokens.motionPage / 1000;
    if (settleSeconds <= 0.001) {
      Object.assign(camera, { column: goal.column, row: goal.row });
      Object.assign(cameraVelocity, { column: 0, row: 0 });
      return false;
    }
    const omega = 4.6 / settleSeconds; // ≈ 1% residual after `settleSeconds`
    // Fixed sub-steps keep the integration stable on slow frames.
    for (let remaining = dt / 1000; remaining > 0; remaining -= SPRING_STEP_SECONDS) {
      const h = Math.min(SPRING_STEP_SECONDS, remaining);
      for (const axis of /** @type {const} */ (['column', 'row'])) {
        const acceleration = omega * omega * (goal[axis] - camera[axis]) - 2 * omega * cameraVelocity[axis];
        cameraVelocity[axis] += acceleration * h;
        camera[axis] += cameraVelocity[axis] * h;
      }
    }
    const settled =
      Math.abs(goal.column - camera.column) < 1e-4 &&
      Math.abs(goal.row - camera.row) < 1e-4 &&
      Math.abs(cameraVelocity.column) < 1e-3 &&
      Math.abs(cameraVelocity.row) < 1e-3;
    if (settled) {
      Object.assign(camera, { column: goal.column, row: goal.row });
      Object.assign(cameraVelocity, { column: 0, row: 0 });
    }
    return !settled;
  }

  /**
   * Topmost poster under a screen point: the point is mapped back onto the sphere and tested
   * against the posters' cells.
   * @param {number} clientX
   * @param {number} clientY
   */
  function cardAt(clientX, clientY) {
    const point = screenToSphere(
      (clientX - screen.centerX) / layout.scale,
      (clientY - screen.centerY) / layout.scale,
      camera.column * layout.columnStep,
      layout.strength,
    );
    /** @type {Card | null} */
    let best = null;
    for (const card of cards.values()) {
      const poster = card.poster;
      if (!poster?.mesh.visible) continue;
      const { x: yaw, y: pitch, z: halfYaw, w: halfPitch } = poster.uniforms.uCard.value;
      const inside =
        Math.abs(angleDelta(point.yaw, yaw)) <= halfYaw && Math.abs(point.pitch - pitch - poster.uniforms.uShift.value) <= halfPitch;
      if (inside && (!best || poster.mesh.renderOrder > /** @type {PosterMesh} */ (best.poster).mesh.renderOrder)) best = card;
    }
    return best;
  }

  /** Keyboard focus follows the center; its overlay may only be bound in the next frame. */
  let focusCenterPending = false;
  /** A card to focus once its overlay is bound (after the video player closes back into it). */
  /** @type {Card | null} */
  let focusCardPending = null;

  function focusPendingCard() {
    const card = /** @type {Card} */ (focusCardPending);
    const overlay = overlays.find((candidate) => candidate.card === card);
    if (overlay) overlay.view.hit.focus({ preventScroll: true });
    // Done once focused, or if the card is gone; otherwise wait for its overlay.
    if (overlay || cards.get(card.key) !== card) focusCardPending = null;
  }

  function focusCenterCard() {
    const active = document.activeElement;
    if (active && active !== document.body && !el.contains(active)) {
      focusCenterPending = false; // focus moved elsewhere (e.g. the nav): do not steal it
      return;
    }
    const center = overlays.find((overlay) => overlay.card && isCenter(overlay.card.cell));
    focusCenterPending = !center && bannerAt(centerCell(), layout) === null;
    center?.view.hit.focus({ preventScroll: true });
  }

  // ---- Input --------------------------------------------------------------------------------

  /**
   * @type {{ x: number, y: number, from: Camera, pointerId: number, dragging: boolean,
   *   lastTime: number, lastColumn: number, lastRow: number } | null}
   */
  let drag = null;
  let suppressClick = false;

  el.addEventListener('pointerdown', (event) => {
    const origin = /** @type {HTMLElement} */ (event.target);
    if (event.button !== 0 || origin.closest('.dome-gallery__joystick, .featured-banner__control')) return;
    // A cancelled drag gets no click, so a stale suppression must not eat this one.
    suppressClick = false;
    drag = {
      x: event.clientX,
      y: event.clientY,
      from: { ...camera },
      pointerId: event.pointerId,
      dragging: false,
      lastTime: performance.now(),
      lastColumn: camera.column,
      lastRow: camera.row,
    };
  });

  el.addEventListener('pointermove', (event) => {
    if (drag && event.pointerId === drag.pointerId) {
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.dragging && Math.hypot(dx, dy) >= DRAG_THRESHOLD_PX) {
        drag.dragging = true;
        el.setPointerCapture(event.pointerId);
        el.dataset.dragging = 'true';
        setHovered(null);
      }
      if (drag.dragging) {
        // The content follows the pointer in every direction.
        camera.column = drag.from.column - dx / layout.scale / layout.columnStep;
        camera.row = drag.from.row - dy / layout.scale / layout.rowStep;
        // Smoothed pointer velocity, carried into the fling on release.
        const now = performance.now();
        const seconds = Math.max(0.001, (now - drag.lastTime) / 1000);
        const blend = Math.min(1, seconds / 0.08);
        cameraVelocity.column += ((camera.column - drag.lastColumn) / seconds - cameraVelocity.column) * blend;
        cameraVelocity.row += ((camera.row - drag.lastRow) / seconds - cameraVelocity.row) * blend;
        Object.assign(drag, { lastTime: now, lastColumn: camera.column, lastRow: camera.row });
        setTarget(nearestCell(camera.column, camera.row, target.row, layout));
        invalidate();
        return;
      }
    }
    if (event.target === canvas) setHovered(isSwitching() ? null : cardAt(event.clientX, event.clientY));
  });

  /** @param {PointerEvent} event */
  const endDrag = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (drag.dragging) {
      suppressClick = true;
      el.dataset.dragging = 'false';
      // A pointer that stopped before lifting carries no fling.
      if (performance.now() - drag.lastTime > 100) Object.assign(cameraVelocity, { column: 0, row: 0 });
      drag = null;
      release();
      return;
    }
    drag = null;
  };
  // The skip link focuses the section; hand focus on to the centered card.
  el.addEventListener('focus', focusCenterCard);
  el.addEventListener('pointerup', endDrag);
  el.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', () => {
    if (hovered && !overlays.some((overlay) => overlay.card === hovered) && hovered !== bannerViewCard) setHovered(null);
  });

  el.addEventListener(
    'click',
    (event) => {
      if (suppressClick) {
        // A drag must not also activate the card it started on.
        suppressClick = false;
        event.stopPropagation();
        event.preventDefault();
        return;
      }
      if (event.target !== canvas) return;
      const card = cardAt(event.clientX, event.clientY);
      if (card) activate(card);
    },
    true,
  );

  /** Browsing input is ignored while paused (see `setPaused`). */
  let paused = false;

  const wheel = { x: 0, y: 0, lockedUntil: 0 };
  /**
   * Trackpad: two-finger scrolling pans the dome continuously on both axes at once, like a drag, so a
   * diagonal swipe moves diagonally instead of in steps; it snaps to the nearest cell once the gesture
   * (with the OS momentum) has ended. A mouse wheel still steps a card at a time.
   */
  let trackpadPanning = false;
  let trackpadTimer = 0;
  /** @param {WheelEvent} event */
  function panByTrackpad(event) {
    trackpadPanning = true;
    camera.column += event.deltaX / layout.scale / layout.columnStep;
    camera.row += event.deltaY / layout.scale / layout.rowStep;
    Object.assign(cameraVelocity, { column: 0, row: 0 }); // the OS momentum already carries the motion
    setTarget(nearestCell(camera.column, camera.row, target.row, layout));
    setHovered(null);
    invalidate();
    window.clearTimeout(trackpadTimer);
    trackpadTimer = window.setTimeout(() => {
      trackpadPanning = false;
      release();
    }, TRACKPAD_IDLE_MS);
  }

  el.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      // A trackpad pinch arrives as ctrl + wheel: it neither zooms the page nor moves the dome.
      if (event.ctrlKey) return;
      if (isTrackpad(event)) {
        panByTrackpad(event);
        return;
      }
      const now = performance.now();
      if (now < wheel.lockedUntil) return;
      // A notch counts as a full step even where its pixel delta is tiny (Safari).
      const notches = wheelNotches(event);
      const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? WHEEL_LINE_PX : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? screen.height : 1;
      wheel.x += event.deltaX * unit;
      wheel.y += notches ? notches * WHEEL_STEP_PX : event.deltaY * unit;
      if (Math.abs(wheel.x) < WHEEL_STEP_PX && Math.abs(wheel.y) < WHEEL_STEP_PX) return;
      if (Math.abs(wheel.x) >= Math.abs(wheel.y)) stepColumns(Math.sign(wheel.x));
      else stepRows(Math.sign(wheel.y));
      wheel.x = wheel.y = 0;
      wheel.lockedUntil = now + WHEEL_COOLDOWN_MS;
    },
    { passive: false },
  );

  document.addEventListener('keydown', (event) => {
    if (paused || event.altKey || event.ctrlKey || event.metaKey) return; // paused, or a browser shortcut (e.g. Alt+← back)
    const origin = event.target;
    if (origin instanceof Element && origin.closest('input, textarea, select, [contenteditable]')) return;
    const actions = {
      ArrowLeft: () => stepColumns(-1),
      ArrowRight: () => stepColumns(1),
      ArrowUp: () => stepRows(-1),
      ArrowDown: () => stepRows(1),
    };
    const action = actions[/** @type {keyof typeof actions} */ (event.key)];
    if (!action) return;
    event.preventDefault();
    const hadFocus = el.contains(document.activeElement);
    action();
    if (hadFocus) focusCenterCard();
  });

  parallax.subscribe((point) => {
    // Not mounted yet, or covered by the video player: nothing to redraw for.
    if (!tokens || paused) return;
    const x = point.x * tokens.parallaxDepth;
    const y = point.y * tokens.parallaxDepth;
    if (x === parallaxOffset.x && y === parallaxOffset.y) return; // e.g. depth 0 in VR mode
    parallaxOffset.x = x;
    parallaxOffset.y = y;
    invalidate();
  });

  let resizeFrame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => relayout());
  });
  // The mode tokens glide (src/tokens/mode-transition.css); the dome follows them frame by frame.
  window.addEventListener('displaymodechange', (event) => {
    if (!layout) return; // not mounted yet
    if (hovered) stopPreview(hovered); // previews are off in VR comfort mode
    const { duration } = /** @type {CustomEvent<import('../../lib/environment.js').DisplayModeChange>} */ (event).detail;
    switchStart = performance.now();
    // CSS transitions start at the next style update, a frame or so after this event: follow a little
    // longer so the last relayout reads the final token values.
    followUntil = switchStart + duration + MODE_SWITCH_SLACK_MS;
    invalidate();
  });

  return {
    el,
    /** Call once the element is in the document so tokens and the nav pill resolve. */
    mount: () => relayout(),
    /**
     * Stops (or resumes) browsing input — e.g. while the video player covers the dome. Pointer input
     * is cut off by whatever covers the dome; this guards the document-level keys.
     * @param {boolean} value
     */
    setPaused(value) {
      paused = value;
      if (value) setHovered(null);
    },
    /**
     * Replaces the feed with an animated fly-out / fly-in.
     * @param {typeof videoForCell} next
     */
    /**
     * Warms the HTTP cache with the posters another feed would show in the current view, so switching
     * to it only has to decode them (prefetchPicture: low priority, nothing kept in memory).
     * @param {typeof videoForCell} other
     */
    prefetch(other) {
      if (!layout) return;
      for (const cell of cellsInView(camera, layout)) {
        if (!isInView(cell.column, cell.row, camera, layout) || bannerAt(cell, layout) !== null) continue;
        prefetchPicture(other(cell.row, cell.column).poster);
      }
    },
    switchFeed(next) {
      const now = performance.now();
      setHovered(null);
      for (const card of cards.values()) {
        if (card.poster?.mesh.visible) {
          card.fly = { direction: 'out', start: now };
          card.loading?.abort(); // a poster still downloading would only arrive on its way out
          leaving.push(card);
        } else {
          disposeCard(card);
        }
      }
      cards.clear();
      feed = next;
      // New cards start arriving one ripple-step later, overlapping the leaving ones.
      arrivalStart = now + tokens.motionFeedStagger;
      updateRings({ immediate: true });
      invalidate();
    },
  };
}

/** @typedef {{ x: number, y: number }} Point */

/**
 * Flat frame along a curved poster edge: the chord from `start` to `end`, its angle, and the point
 * where a flat plane hung under the edge must start so the curved edge never cuts into it.
 * @param {Point} start   left corner
 * @param {Point} end     right corner
 * @param {Point} middle  the edge's midpoint (may bulge away from the chord)
 */
function edgeFrame(start, end, middle) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy) || 1;
  const normal = { x: -dy / length, y: dx / length }; // points "down" relative to the edge
  const sag = Math.max(0, (middle.x - start.x) * normal.x + (middle.y - start.y) * normal.y);
  return {
    start,
    end,
    middle,
    length,
    angle: Math.atan2(dy, dx),
    below: { x: start.x + normal.x * sag, y: start.y + normal.y * sag },
  };
}

/**
 * Axis-aligned bounds of screen points.
 * @param {Point[]} points
 */
function boundsOf(points) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  return { left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top };
}

/**
 * Trackpads send small pixel deltas, often on both axes; mouse wheels send line deltas (Firefox) or
 * whole notches of ~100 px on one axis.
 * @param {WheelEvent} event
 */
function isTrackpad(event) {
  if (event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL || wheelNotches(event)) return false;
  return event.deltaX !== 0 || Math.abs(event.deltaY) < WHEEL_NOTCH_MIN_PX || !Number.isInteger(event.deltaY);
}

/**
 * Vertical mouse-wheel notches (positive = down) from the legacy `wheelDeltaY` that Chromium and Safari
 * still report: whole multiples of 120 for a wheel, whatever its pixel delta (Safari's is a few px), and
 * −3 × deltaY for a trackpad. 0 when the event is not a recognisable wheel notch.
 * @param {WheelEvent} event
 */
function wheelNotches(event) {
  const legacy = /** @type {{ wheelDeltaY?: number }} */ (/** @type {unknown} */ (event)).wheelDeltaY;
  if (!legacy || event.deltaX !== 0 || legacy % 120 !== 0 || legacy === -3 * event.deltaY) return 0;
  return -legacy / 120;
}

/**
 * @param {import('./geometry.js').ClusterSize} a
 * @param {import('./geometry.js').ClusterSize} b
 */
function sameSize(a, b) {
  return a.columns === b.columns && a.edge === b.edge && a.rows === b.rows && a.above === b.above;
}

/**
 * Moves a tween toward its target: along its glide when it has one for that target, otherwise by
 * exponential approach (a newer target cancels the glide). Returns true while still moving.
 * @param {Tween} tween
 * @param {number} dt        ms since the last frame
 * @param {number} duration  ms to (visually) settle by approach
 * @param {number} now
 */
function advanceTween(tween, dt, duration, now) {
  const { glide } = tween;
  if (glide && glide.to === tween.target) {
    const t = Math.min(1, Math.max(0, (now - glide.start) / Math.max(1, glide.duration)));
    tween.value = glide.from + (glide.to - glide.from) * glide.ease(t);
    if (t >= 1) tween.glide = null;
    return t < 1;
  }
  tween.glide = null;
  return approach(tween, dt, duration);
}

/**
 * Frame-rate independent exponential approach. Returns true while still moving.
 * @param {Tween} tween
 * @param {number} dt        ms since the last frame
 * @param {number} duration  ms to (visually) settle
 */
function approach(tween, dt, duration) {
  if (tween.value === tween.target) return false;
  const k = duration <= 1 ? 1 : 1 - Math.exp((-dt * 4) / duration);
  tween.value += (tween.target - tween.value) * k;
  if (Math.abs(tween.target - tween.value) < 0.001) tween.value = tween.target;
  return tween.value !== tween.target;
}

/**
 * @param {number} value
 * @param {number} modulus
 */
function mod(value, modulus) {
  return ((value % modulus) + modulus) % modulus;
}
