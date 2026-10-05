// @ts-check
import { cx, h } from '../../lib/dom.js';

/**
 * Compact neutral label on media (duration, engagement counts).
 * @param {object} props
 * @param {import('../../lib/dom.js').Child | import('../../lib/dom.js').Child[]} props.label  text or inline content
 * @param {'span' | 'ul'} [props.as]  element; `ul` for a list of values
 * @param {string} [props.className]
 * @param {string} [props.ariaLabel]
 */
export function Badge({ label, as = 'span', className, ariaLabel }) {
  return h(as, { class: cx('badge', className), 'aria-label': ariaLabel }, label);
}
