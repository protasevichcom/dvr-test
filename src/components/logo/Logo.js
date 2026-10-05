// @ts-check
import { h, s } from '../../lib/dom.js';
import { WORDMARK_PATH, WORDMARK_VIEWBOX } from './wordmark-path.js';

/**
 * DeoVR logo (raw/brand/deovr-logo-wh-color-2026-10-05.svg): the gradient mark as an image
 * (unchanged, per brand rules) + the wordmark outline colored through `currentColor`, laid out in
 * the artwork's proportions (`--logo-wordmark-ratio`, `--logo-gap-ratio`).
 * @param {object} props
 * @param {string} [props.href]
 */
export function Logo({ href = '/' } = {}) {
  return h(
    'a',
    { class: 'logo', href, 'aria-label': 'DeoVR home' },
    h('img', { class: 'logo__mark', src: '/assets/brand/deovr-mark.png', alt: '', width: 169, height: 192 }),
    s('svg', { class: 'logo__wordmark', viewBox: WORDMARK_VIEWBOX, 'aria-hidden': 'true' }, s('path', { d: WORDMARK_PATH })),
  );
}
