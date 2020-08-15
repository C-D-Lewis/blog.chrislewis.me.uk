/** Min narrow width. */
const MIN_WIDTH = 1000;

/**
 * Create an element of given type, and apply style and optional properties.
 *
 * @param {string} tag - The tag name, such as 'input'.
 * @param {Object} style - Object of CSS styles.
 * @param {Object} [props] - Object of optional object properties.
 * @param {Object[]} [children] - Array of children.
 * @returns {HTMLElement} The element with styles and props applied.
 */
const create = (tag, style = {}, props = {}, children = []) => {
  const el = document.createElement(tag);
  Object.keys(style).forEach(key => Object.assign(el.style, { [key]: style[key] }));
  Object.keys(props).forEach(key => Object.assign(el, { [key]: props[key] }));
  children.forEach(child => {
    if (typeof child === 'object') {
      el.appendChild(child);
      return;
    }

    const span = create('span');
    span.innerHTML = children;
    el.appendChild(span);
  });
  return el;
};

/**
 * Set the innerHTML of an element.
 *
 * @param {HTMLElement} el - The element.
 * @param {string} html - The new HTML.
 */
const setHtml = (el, html) => {
  el.innerHTML = html;
};

/**
 * Get the innerHTML from an element.
 *
 * @param {HTMLElement} el - The element.
 * @returns {string} The inner HTML.
 */
const getHtml = el => el.innerHTML;

/**
 * Add an element as a child of another element.
 *
 * @param {HTMLElement} parent - The parent element.
 * @param {HTMLElement} child - The child element.
 */
const addChild = (parent, child) => parent.appendChild(child);

/**
 * Add multiple elements as children of another element.
 *
 * @param {HTMLElement} parent - The parent element.
 * @param {HTMLElement[]} children - The child elements.
 */
const addChildren = (parent, children) => children.forEach(p => parent.appendChild(p));

/**
 * Decide if the screen is narrow.
 *
 * @returns {boolean} true if narrow.
 */
const isNarrowScreen = () => window.innerWidth < MIN_WIDTH;

window.DOM = {
  create,
  setHtml,
  getHtml,
  addChild,
  addChildren,
  isNarrowScreen,
};
