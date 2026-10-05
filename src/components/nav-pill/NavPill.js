// @ts-check
import { h } from '../../lib/dom.js';
import { IconButton } from '../icon-button/IconButton.js';
import { IconToggleGroup } from '../icon-toggle-group/IconToggleGroup.js';
import { Logo } from '../logo/Logo.js';

/**
 * @typedef {object} NavItem
 * @property {string} id
 * @property {import('../icon/Icon.js').IconName} icon
 * @property {string} label
 */

/**
 * Floating navigation pill placed above the center of gaze: logo, icon-only sections with tooltips,
 * the display mode switch (monitor / VR headset), the profile and the round "Get Premium" call to
 * action at the far right.
 * An optional accessory (e.g. feed tabs) sits centered right under the pill.
 *
 * @param {object} props
 * @param {NavItem[]} props.items
 * @param {string} props.currentId
 * @param {import('../../lib/environment.js').DisplayMode} props.displayMode
 * @param {(item: NavItem) => void} props.onNavigate
 * @param {(mode: import('../../lib/environment.js').DisplayMode) => void} props.onModeChange
 * @param {() => void} props.onProfile
 * @param {() => void} props.onPremium
 * @param {Node} [props.accessory]
 */
export function NavPill({ items, currentId, displayMode, onNavigate, onModeChange, onProfile, onPremium, accessory }) {
  // The current item is set by the page; a click only reports the intent (the target may not exist).
  const buttons = items.map((item) =>
    IconButton({ icon: item.icon, label: item.label, current: item.id === currentId, onClick: () => onNavigate(item) }),
  );

  const modeSwitch = IconToggleGroup({
    label: 'Display mode',
    selectedId: displayMode,
    items: [
      { id: 'desktop', icon: 'monitor', label: 'Desktop mode' },
      { id: 'vr', icon: 'headset', label: 'VR comfort mode' },
    ],
    onChange: (item) => onModeChange(item.id === 'vr' ? 'vr' : 'desktop'),
  });
  const profile = IconButton({ icon: 'user', label: 'Profile', onClick: onProfile });
  const premium = IconButton({ icon: 'diamond', label: 'Get Premium', variant: 'accent', onClick: onPremium });

  const el = h(
    'header',
    { class: 'nav-pill-anchor' },
    h(
      'nav',
      { class: 'nav-pill', 'aria-label': 'Main' },
      Logo(),
      h('span', { class: 'nav-pill__divider', 'aria-hidden': 'true' }),
      h(
        'ul',
        { class: 'nav-pill__list' },
        buttons.map((button) => h('li', {}, button.el)),
      ),
      h('span', { class: 'nav-pill__divider', 'aria-hidden': 'true' }),
      modeSwitch.el,
      h('div', { class: 'nav-pill__utilities' }, profile.el, premium.el),
    ),
    accessory && h('div', { class: 'nav-pill__accessory' }, accessory),
  );

  return { el };
}
