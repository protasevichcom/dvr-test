// @ts-check
import { h } from '../../lib/dom.js';
import { Icon } from '../icon/Icon.js';

/**
 * Feature marks in a dark pill, as on deovr.com cards: Premium (crown) and Top Picks (flame),
 * each in one solid colour, separated by a hairline.
 *
 * @typedef {'premium' | 'topPicks'} Feature
 */

const LABEL = { premium: 'Premium', topPicks: 'Top Picks' };
const GLYPH = /** @type {const} */ ({ premium: 'featurePremium', topPicks: 'featureTopPicks' });

/**
 * @param {object} props
 * @param {Feature[]} props.features
 */
export function FeaturePill({ features }) {
  return h(
    'ul',
    { class: 'feature-pill', 'aria-label': 'Features', hidden: features.length === 0 },
    features.map((feature) =>
      h(
        'li',
        { class: ['feature-pill__item', `feature-pill__item--${feature}`], title: LABEL[feature] },
        Icon({ name: GLYPH[feature], size: 'small' }),
        h('span', { class: 'visually-hidden' }, LABEL[feature]),
      ),
    ),
  );
}
