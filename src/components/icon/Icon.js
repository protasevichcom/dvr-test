// @ts-check
import { s } from '../../lib/dom.js';
import { GLYPHS } from './glyphs.js';

/** @typedef {import('./glyphs.js').IconName} IconName */

/**
 * @param {object} props
 * @param {IconName} props.name
 * @param {'default' | 'small'} [props.size]
 */
export function Icon({ name, size = 'default' }) {
  return s(
    'svg',
    {
      class: ['icon', size === 'small' && 'icon--small'],
      viewBox: '0 0 24 24',
      'aria-hidden': 'true',
      focusable: 'false',
    },
    GLYPHS[name].map(([tag, attrs]) => s(tag, attrs)),
  );
}
