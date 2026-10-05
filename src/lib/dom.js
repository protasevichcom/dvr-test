// @ts-check
/**
 * Minimal hyperscript helpers. Components are plain functions that build DOM with these and return
 * the root element plus a small imperative API. No framework, no build step.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * @typedef {Record<string, unknown>} Props
 * Supported keys:
 *  - `class`: string | (string | false | null | undefined)[]
 *  - `style`: Record<string, string | number> (CSS custom properties allowed, e.g. `--yaw`)
 *  - `dataset`: Record<string, string>
 *  - `on<Event>`: event listener, e.g. `onClick`
 *  - anything else: set as an attribute (`true` → empty attribute, `false`/null → omitted)
 */

/** @typedef {Node | string | number | false | null | undefined} Child */

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag
 * @param {Props} [props]
 * @param {...(Child | Child[])} children
 * @returns {HTMLElementTagNameMap[K]}
 */
export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  applyProps(el, props);
  appendChildren(el, children);
  return el;
}

/**
 * Creates an SVG element.
 * @param {string} tag
 * @param {Props} [props]
 * @param {...(Child | Child[])} children
 * @returns {SVGElement}
 */
export function s(tag, props = {}, ...children) {
  const el = /** @type {SVGElement} */ (document.createElementNS(SVG_NS, tag));
  applyProps(el, props);
  appendChildren(el, children);
  return el;
}

/**
 * Joins class names, skipping falsy entries.
 * @param {...(string | false | null | undefined)} names
 */
export function cx(...names) {
  return names.filter(Boolean).join(' ');
}

/**
 * @param {Element} el
 * @param {Props} props
 */
function applyProps(el, props) {
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;

    if (key === 'class') {
      const names = Array.isArray(value) ? cx(...value) : String(value);
      if (names) el.setAttribute('class', names);
    } else if (key === 'style') {
      const style = /** @type {Record<string, string | number>} */ (value);
      for (const [prop, v] of Object.entries(style)) {
        /** @type {HTMLElement} */ (el).style.setProperty(prop, String(v));
      }
    } else if (key === 'dataset') {
      Object.assign(/** @type {HTMLElement} */ (el).dataset, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), /** @type {EventListener} */ (value));
    } else {
      el.setAttribute(key, value === true ? '' : String(value));
    }
  }
}

/**
 * @param {Element} el
 * @param {(Child | Child[])[]} children
 */
function appendChildren(el, children) {
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    el.append(typeof child === 'number' ? String(child) : child);
  }
}
