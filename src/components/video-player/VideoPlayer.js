// @ts-check
import { h } from '../../lib/dom.js';
import { quadToMatrix3d } from '../../lib/homography.js';
import { readDurationToken, readEasingToken } from '../../lib/tokens.js';
import { IconButton } from '../icon-button/IconButton.js';

/** @typedef {{ x: number, y: number }} Point */
/** @typedef {[Point, Point, Point, Point]} Quad  top-left, top-right, bottom-right, bottom-left */

/**
 * @typedef {object} PlayerSource  The poster the player grows out of and shrinks back into.
 * @property {() => Quad} quad              the poster's corners on screen, CSS px
 * @property {() => number} radius          the poster's corner radius on screen, CSS px
 * @property {(playing: boolean) => void} setPlaying  hides the poster while the player stands in for it
 * @property {() => void} restoreFocus     gives keyboard focus back to the poster's card after closing
 */

/**
 * @typedef {object} PlayerItem
 * @property {string} title
 * @property {string} videoSrc
 * @property {string} poster
 */

/**
 * Full-viewport video player that grows out of a poster on the dome and shrinks back into it.
 * The frame is one element warped (matrix3d) from the poster's projected corners to the viewport's
 * while its corner radius goes to zero, so the picture never jumps; the poster image covers the video
 * until it plays, and comes back before the frame lands on the poster again. The close button slides
 * in at the bottom center (with a sound button if the browser only allowed muted playback); Escape
 * closes too, wherever focus is. The page hides its own chrome (see main.js).
 *
 * @param {object} props
 * @param {() => void} props.onClose  close requested (button or Escape)
 */
export function VideoPlayer({ onClose }) {
  const video = h('video', { class: 'video-player__video', playsinline: true, preload: 'auto' });
  const cover = h('img', { class: 'video-player__cover', alt: '', decoding: 'async' });
  const frame = h('div', { class: 'video-player__frame' }, video, cover);
  const close = IconButton({ icon: 'close', label: 'Close video', variant: 'glass', tooltipPlacement: 'above', onClick: () => onClose() });
  const unmute = IconButton({
    icon: 'soundOff',
    label: 'Turn sound on',
    variant: 'glass',
    tooltipPlacement: 'above',
    onClick: () => {
      video.muted = false;
      unmute.el.hidden = true;
    },
  });
  unmute.el.hidden = true;
  const dock = h('div', { class: 'video-player__close' }, unmute.el, close.el);
  const el = h('div', { class: 'video-player', role: 'dialog', 'aria-modal': 'true', hidden: true }, frame, dock);

  // On the document: clicking the video moves focus out of the dialog, and Escape must still close.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !source || el.dataset.state === 'closing') return;
    event.preventDefault();
    onClose();
  });
  video.addEventListener('playing', () => {
    if (el.dataset.state !== 'closing') el.dataset.playing = 'true';
  });

  /** @type {PlayerSource | null} */
  let source = null;
  /** Whether keyboard focus was on the page when the player opened (it goes back to the card). */
  let restoreFocus = false;
  let frameId = 0;
  /** Where the frame was last drawn while morphing, so a close during opening starts from there. */
  /** @type {{ quad: Quad, radius: number } | null} */
  let drawn = null;

  /** @returns {Quad} */
  function viewportQuad() {
    const { innerWidth: w, innerHeight: hgt } = window;
    return [
      { x: 0, y: 0 },
      { x: w, y: 0 },
      { x: w, y: hgt },
      { x: 0, y: hgt },
    ];
  }

  /**
   * Warps the frame from one quad to another over `--motion-player`.
   * @param {Quad} from
   * @param {Quad} to
   * @param {number} fromRadius  px
   * @param {number} toRadius    px
   * @param {() => void} done
   */
  function morph(from, to, fromRadius, toRadius, done) {
    cancelAnimationFrame(frameId);
    const duration = readDurationToken('--motion-player');
    const ease = readEasingToken('--motion-ease-player');
    const start = performance.now();
    /** @param {number} now */
    const step = (now) => {
      const t = duration <= 1 ? 1 : Math.min(1, (now - start) / duration);
      const e = ease(t);
      const quad = /** @type {Quad} */ (from.map((p, i) => ({ x: p.x + (to[i].x - p.x) * e, y: p.y + (to[i].y - p.y) * e })));
      // The element is laid out at the quad's own size, so the picture (object-fit: cover) is never
      // squashed while the frame changes aspect from the poster's to the viewport's.
      const width = (distance(quad[0], quad[1]) + distance(quad[3], quad[2])) / 2;
      const height = (distance(quad[0], quad[3]) + distance(quad[1], quad[2])) / 2;
      frame.style.width = `${width}px`;
      frame.style.height = `${height}px`;
      const radius = fromRadius + (toRadius - fromRadius) * e;
      frame.style.borderRadius = `${radius}px`;
      frame.style.transform = quadToMatrix3d(width, height, quad);
      drawn = { quad, radius };
      if (t < 1) frameId = requestAnimationFrame(step);
      else done();
    };
    step(start);
  }

  return {
    el,
    /**
     * @param {PlayerItem} item
     * @param {PlayerSource} from
     */
    open(item, from) {
      source = from;
      restoreFocus = document.activeElement instanceof HTMLElement && document.activeElement !== document.body;
      el.setAttribute('aria-label', item.title);
      cover.src = item.poster;
      video.src = item.videoSrc;
      video.muted = false;
      unmute.el.hidden = true;
      delete el.dataset.playing;
      el.hidden = false;
      el.dataset.state = 'opening';
      from.setPlaying(true);
      // Inside the click that opened the player, so playback with sound is allowed.
      video.play().catch(() => {
        // Sound was not allowed: play muted and offer the sound button.
        video.muted = true;
        unmute.el.hidden = false;
        video.play().catch(() => {});
      });
      morph(from.quad(), viewportQuad(), from.radius(), 0, () => {
        el.dataset.state = 'open';
        frame.removeAttribute('style'); // the open frame follows the viewport through CSS
      });
      close.el.focus({ preventScroll: true });
    },
    /**
     * Shrinks back into the poster. Resolves once the poster shows again.
     * @returns {Promise<void>}
     */
    close() {
      const target = source;
      if (!target || el.dataset.state === 'closing') return Promise.resolve();
      // Closing mid-opening shrinks from where the frame is now, not from the full viewport.
      const start = el.dataset.state === 'opening' && drawn ? drawn : { quad: viewportQuad(), radius: 0 };
      el.dataset.state = 'closing';
      delete el.dataset.playing; // the poster image fades back in before the frame lands
      video.pause();
      return new Promise((resolve) => {
        morph(start.quad, target.quad(), start.radius, target.radius(), () => {
          target.setPlaying(false);
          el.hidden = true;
          delete el.dataset.state;
          frame.removeAttribute('style');
          video.removeAttribute('src');
          video.load(); // releases the network connection and buffers
          source = null;
          drawn = null;
          // The card's own button was hidden while it played; the gallery focuses it once it is back.
          if (restoreFocus) target.restoreFocus();
          resolve();
        });
      });
    },
    get isOpen() {
      return source !== null;
    },
  };
}

/**
 * @param {Point} a
 * @param {Point} b
 */
function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
