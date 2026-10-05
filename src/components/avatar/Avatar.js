// @ts-check
import { h } from '../../lib/dom.js';

/**
 * Initials avatar tinted per channel. Decorative: the channel name is always rendered next to it.
 * @param {object} props
 * @param {string} props.name
 * @param {number} props.hue
 */
export function Avatar({ name, hue }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
  return h('span', { class: 'avatar', style: { '--avatar-hue': hue }, 'aria-hidden': 'true' }, initials);
}
