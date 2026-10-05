// @ts-check
import { h } from '../../lib/dom.js';

/**
 * Tooltip bubble for a control. Decorative (`aria-hidden`): the control carries the same text as its
 * accessible name. Hidden until the owning component reveals it on hover / focus (see tooltip.css).
 *
 * @param {object} props
 * @param {string} props.label
 * @param {'below' | 'above'} [props.placement]
 */
export function Tooltip({ label, placement = 'below' }) {
  return h('span', { class: ['tooltip', `tooltip--${placement}`], 'aria-hidden': 'true' }, label);
}
