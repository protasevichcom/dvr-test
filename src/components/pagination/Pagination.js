// @ts-check
import { cx, h } from '../../lib/dom.js';

/**
 * Dot pagination: one dot per page, the current one stretched into a dash. Every dot is a button
 * with a generous hit area (dots are small, ray and hand input are not).
 *
 * @param {object} props
 * @param {number} props.count
 * @param {string} props.label                 e.g. "Featured banners"
 * @param {(index: number) => void} props.onSelect
 * @param {'surface' | 'bare'} [props.variant]  bare: no pill behind the marks (on plain dark ground)
 */
export function Pagination({ count, label, onSelect, variant = 'surface' }) {
  const dots = Array.from({ length: count }, (_, index) =>
    h(
      'button',
      {
        type: 'button',
        class: 'pagination__dot',
        'aria-label': `Show ${index + 1} of ${count}`,
        onClick: () => onSelect(index),
      },
      h('span', { class: 'pagination__mark', 'aria-hidden': 'true' }),
    ),
  );
  const el = h('div', { class: cx('pagination', variant === 'bare' && 'pagination--bare'), role: 'group', 'aria-label': label }, dots);

  return {
    el,
    /** @param {number} index */
    setIndex(index) {
      dots.forEach((dot, i) => {
        if (i === index) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    },
  };
}
