// @ts-check
import { h } from '../../lib/dom.js';

/**
 * @typedef {object} TabItem
 * @property {string} id
 * @property {string} label
 */

/**
 * Row of pill tabs (e.g. For You / New / Trending). The selected pill is filled; the others are
 * outlined. Arrow keys move between tabs (roving tab index), per the ARIA tabs pattern.
 *
 * @param {object} props
 * @param {TabItem[]} props.items
 * @param {string} props.selectedId
 * @param {string} props.label
 * @param {(item: TabItem) => void} props.onChange
 */
export function SegmentedTabs({ items, selectedId, label, onChange }) {
  let selected = selectedId;

  const tabs = items.map((item) =>
    h(
      'button',
      {
        type: 'button',
        role: 'tab',
        class: 'segmented-tabs__tab',
        onClick: () => select(item),
      },
      item.label,
    ),
  );
  const el = h('div', { class: 'segmented-tabs', role: 'tablist', 'aria-label': label }, tabs);

  el.addEventListener('keydown', (event) => {
    const offset = { ArrowLeft: -1, ArrowRight: 1 }[/** @type {'ArrowLeft' | 'ArrowRight'} */ (event.key)];
    if (!offset) return;
    // Keep arrows for the tabs while they have focus (the dome also listens to arrows).
    event.preventDefault();
    event.stopPropagation();
    const index = (items.findIndex((item) => item.id === selected) + offset + items.length) % items.length;
    select(items[index]);
    tabs[index].focus();
  });

  /** @param {TabItem} item */
  function select(item) {
    if (item.id === selected) return;
    selected = item.id;
    render();
    onChange(item);
  }

  function render() {
    items.forEach((item, index) => {
      const isSelected = item.id === selected;
      tabs[index].setAttribute('aria-selected', String(isSelected));
      tabs[index].tabIndex = isSelected ? 0 : -1;
    });
  }
  render();

  return { el };
}
