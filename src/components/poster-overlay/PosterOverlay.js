// @ts-check
import { cx, h } from '../../lib/dom.js';
import { setDissolve } from '../../lib/overlay.js';

/**
 * Root of a DOM layer laid over a poster on the dome (a video card, the featured banner). Its children
 * are anchored at the layer's origin and placed every frame by lib/overlay.js (flat planes) or
 * homography.js (warped onto the sphere). `--openness` (0…1) drives the open / close motion; during a
 * feed switch the layer fades and blurs together with its poster.
 *
 * @param {object} props
 * @param {string} props.className                 the owning component's block class
 * @param {'div' | 'section'} [props.as]
 * @param {Record<string, string>} [props.attributes]  e.g. ARIA roles and labels
 * @param {...Node} children
 */
export function PosterOverlay({ className, as = 'div', attributes = {} }, ...children) {
  const el = h(as, { ...attributes, class: cx('poster-overlay', className), hidden: true }, ...children);
  return {
    el,
    /**
     * @param {number} openness  0…1
     * @param {number} dissolve  0…1; feed switch fade + blur
     */
    setMotion(openness, dissolve) {
      el.style.setProperty('--openness', openness.toFixed(3));
      setDissolve(el, dissolve);
    },
  };
}
