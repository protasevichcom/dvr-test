// @ts-check
import { h } from '../../lib/dom.js';

/**
 * Bottom layer of the scene: a softly blurred room that stands in for the user's VR home
 * environment. Moves opposite to the pointer for a subtle parallax (see lib/parallax.js).
 * The parallax moves a wrapper layer while the blur sits on the image inside it, so the blur is
 * rasterized once and the shift is a plain compositor move (no re-blur every frame).
 * @param {object} props
 * @param {string} props.src
 */
export function RoomBackdrop({ src }) {
  return h(
    'div',
    { class: 'room-backdrop', 'aria-hidden': 'true' },
    h(
      'div',
      { class: 'room-backdrop__layer' },
      h('img', { class: 'room-backdrop__image', src, alt: '', decoding: 'async', fetchpriority: 'high' }),
    ),
  );
}
