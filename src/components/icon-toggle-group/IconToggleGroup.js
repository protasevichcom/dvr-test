// @ts-check
import { h } from '../../lib/dom.js';
import { IconButton } from '../icon-button/IconButton.js';

/**
 * @typedef {object} ToggleItem
 * @property {string} id
 * @property {import('../icon/Icon.js').IconName} icon
 * @property {string} label   accessible name and tooltip
 */

/**
 * Segmented choice of icon buttons in one pill (e.g. monitor / VR headset). The selected option is a
 * filled chip; every option is a toggle button (`aria-pressed`) with a tooltip.
 *
 * @param {object} props
 * @param {ToggleItem[]} props.items
 * @param {string} props.selectedId
 * @param {string} props.label   group label
 * @param {(item: ToggleItem) => void} props.onChange
 */
export function IconToggleGroup({ items, selectedId, label, onChange }) {
  let selected = selectedId;
  const buttons = items.map((item) =>
    IconButton({
      icon: item.icon,
      label: item.label,
      pressed: item.id === selected,
      onClick: () => {
        if (item.id === selected) return;
        selected = item.id;
        items.forEach((other, index) => buttons[index].setPressed(other.id === selected));
        onChange(item);
      },
    }),
  );
  const el = h('div', { class: 'icon-toggle-group', role: 'group', 'aria-label': label }, buttons.map((button) => button.el));

  return { el };
}
