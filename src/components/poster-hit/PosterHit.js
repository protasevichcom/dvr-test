// @ts-check
import { h } from '../../lib/dom.js';
import { bindIntent, placeHitArea } from '../../lib/overlay.js';

/**
 * Invisible button over a poster on the dome: the card's pointer target and accessible control.
 * Hover and focus are shown on the curved poster itself (the WebGL ring), so the button draws nothing.
 *
 * @param {object} props
 * @param {(intent: import('../../lib/overlay.js').Intent) => void} props.onIntent
 */
export function PosterHit({ onIntent }) {
  const el = h('button', { type: 'button', class: 'poster-hit' });
  bindIntent(el, onIntent);
  return {
    el,
    /** @param {string} label  accessible name, e.g. "Play in VR: <title>" */
    setLabel(label) {
      el.setAttribute('aria-label', label);
    },
    /** @param {{ left: number, top: number, width: number, height: number }} area  screen bounds, CSS px */
    place(area) {
      placeHitArea(el, area);
    },
  };
}
