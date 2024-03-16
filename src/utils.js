const Utils = {};

/**
 * Get a query param value.
 *
 * @param {string} name - Param name.
 * @returns {string|undefined} Param value, if specified.
 */
Utils.getQueryParam = (name) => new URLSearchParams(window.location.search).get(name);

/**
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

/**
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
 *
 * @param {number} a - First integer.
 * @param {number} b - Second integer.
 * @returns {number} Sort order.
 */
Utils.integerItemSort = (a, b) => (parseInt(a, 10) > parseInt(b, 10) ? -1 : 1);

/**
 * Show the exist post linked.
 *
 * @param {string} fileName - Post fileName selected
 */
Utils.showSinglePost = async (fileName) => {
  // Find the post with this fileName - TODO: use reduce()?
  let post;
  Object.entries(window.postHistory).forEach(([, yearData]) => {
    Object.entries(yearData).forEach(([, posts]) => {
      const found = posts.find((p) => p.fileName === fileName);
      if (found) {
        post = found;
      }
    });
  });

  if (!post) {
    alert(`Linked post ${fileName} not found`);
    return;
  }

  window.history.replaceState(null, null, `?post=${fileName}`);

  const model = await fetch(post.file).then((res) => res.json());
  fabricate.update({ postListItems: [model] });
};

/**
 * Show posts from a chosen tag.
 *
 * @param {string} tag - Tag selected.
 */
Utils.showPostsForTag = async (tag) => {
  // Find the post with this tag
  if (!window.tagIndex[tag]) {
    alert(`Linked tag ${tag} not found`);
    return;
  }

  window.history.replaceState(null, null, `?tag=${tag}`);

  const promises = window.tagIndex[tag]
    .sort(Utils.descendingDateSort)
    .map((fileName) => fetch(`assets/rendered/${fileName}`).then((res) => res.json()));
  const models = await Promise.all(promises);
  fabricate.update({ postListItems: models });
};

/**
 * Key for fileName expanded states.
 *
 * @param {string} fileName - File name of the post.
 * @returns {string} State key.
 */
Utils.postExpandedKey = (fileName) => `expanded:${fileName}`;
