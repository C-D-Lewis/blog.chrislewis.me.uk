const Utils = {};

/**
 * Get a query param value.
 */
Utils.getQueryParam = (name) => new URLSearchParams(window.location.search).get(name);

/*
 * Sort by date in descending order.
 *
 * @param {string} a - fileName A.
 * @param {string} b - fileName B.
 * @returns {number} 1 if date A is earlier, -1 otherwise.
 */
Utils.descendingDateSort = (a, b) => {
  const dateA = a.split('-').slice(0, 3).join('-');
  const dateB = b.split('-').slice(0, 3).join('-');
  return dateA < dateB ? 1 : -1;
};

/*
 * Sort by post date in fileName in descending order.
 *
 * @param {string} a - post A.
 * @param {string} b - post B.
 * @returns {number} 1 if date A is earlier, -1 otherwise.
 */
Utils.descendingPostSort = (a, b) => {
  const dateA = a.fileName.split('-').slice(0, 3).join('-');
  const dateB = b.fileName.split('-').slice(0, 3).join('-');
  return dateA < dateB ? 1 : -1;
};

/**
 * Integer item sort in descending order.
 */
Utils.integerItemSort = (a, b) => (parseInt(a, 10) > parseInt(b, 10) ? -1 : 1);
