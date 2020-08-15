let leftColumn;
let postList;

/**
 * Convert month index to name.
 *
 * @param {string} index - Two character index string.
 * @returns {string} Month name.
 */
const monthName = index => {
  const map = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
  };
  return map[index] || "???";
};

/**
 * Get a query param value.
 */
const getQueryParam = name => new URLSearchParams(window.location.search).get(name);

/*
 * Sort by date in descending order.
 *
 * @param {string} a - fileName A.
 * @param {string} b - fileName B.
 * @returns {number} 1 if date A is earlier, -1 otherwise.
 */
const descendingDateSort = (a, b) => {
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
const descendingPostSort = (a, b) => {
  const dateA = a.fileName.split('-').slice(0, 3).join('-');
  const dateB = b.fileName.split('-').slice(0, 3).join('-');
  return dateA < dateB ? 1 : -1;
};

/**
 * Integer item sort in descending order.
 */
const integerItemSort = (a, b) => parseInt(a) > parseInt(b) ? -1 : 1;

/**
 * Setup the UI.
 */
const buildPageLayout = () => {
  const rootContainer = Components.RootContainer();
  DOM.addChild(document.getElementById('app'), rootContainer);

  // Header
  const siteHeader = Components.SiteHeader();
  DOM.addChild(rootContainer, siteHeader);
  DOM.addChild(siteHeader, Components.SiteTitle());
  if (!DOM.isNarrowScreen()) {
    DOM.addChild(siteHeader, Components.SiteSocials());
  }

  // Containers
  const contentContainer = Components.ContentContainer();
  DOM.addChild(rootContainer, contentContainer);
  leftColumn = Components.LeftColumn();
  const centralColumn = Components.CentralColumn();
  if (DOM.isNarrowScreen()) {
    DOM.addChild(contentContainer, centralColumn);
    DOM.addChild(contentContainer, leftColumn);
  } else {
    DOM.addChild(contentContainer, leftColumn);
    DOM.addChild(contentContainer, centralColumn);
  }
  if (DOM.isNarrowScreen()) {
    DOM.addChild(centralColumn, Components.SiteSocials());
  }

  // Blog sections
  DOM.addChild(leftColumn, Components.LeftColumnHeader({ text: 'Blog', isTopSection: true }));
  DOM.addChild(leftColumn, Components.LeftColumnItem({
    text: 'Most Recent',
    onClick: () => (window.location.href = '/'),
  }));
  DOM.addChild(leftColumn, Components.LeftColumnItem({
    text: 'Source Repository',
    onClick: () => (window.open('https://github.com/C-D-Lewis/blog', '_blank')),
  }));

  // Other stuff
  DOM.addChild(leftColumn, Components.LeftColumnHeader({ text: 'Other Stuff' }));
  DOM.addChild(leftColumn, Components.LeftColumnItem({
    text: 'Pixels With Friends',
    onClick: () => (window.open('http://pixels.chrislewis.me.uk', '_blank')),
  }));
  DOM.addChild(leftColumn, Components.LeftColumnItem({
    text: 'FitBit Apps',
    onClick: () => (window.open('https://gallery.fitbit.com/search?terms=chris%20lewis', '_blank')),
  }));
  DOM.addChild(leftColumn, Components.LeftColumnItem({
    text: 'Pebble Apps',
    onClick: () => (window.open('https://github.com/C-D-Lewis/pebble', '_blank')),
  }));
  DOM.addChild(leftColumn, Components.LeftColumnItem({
    text: 'Old WordPress Blog',
    onClick: () => (window.open('https://ninedof.wordpress.com/', '_blank')),
  }));

  // Tags list as pills
  DOM.addChild(leftColumn, Components.LeftColumnHeader({ text: 'Tags' }));
  DOM.addChild(leftColumn, Components.TagCloud({ tags: Object.keys(window.tagIndex) }));

  // Archive list - history fetched asynchronously (MUST BE LAST HEADER)
  const archiveHeader = Components.LeftColumnHeader({ text: 'Archive' });
  DOM.addChild(leftColumn, archiveHeader);
  postList = Components.PostList();
  DOM.addChild(centralColumn, postList);
};

/**
 * Update the posts for the archive location selected.
 *
 * @param {string} year - Year selected
 * @param {string} month - Month selected
 */
const showPostsFrom = async (year, month) => {
  postList.innerHTML = '';
  history.replaceState(null, null, `?year=${year}&month=${month}`);

  DOM.addChild(postList, Components.LeftColumnHeader({
    text: `Archive: ${monthName(month)} ${year}`,
    isTopSection: true,
  }));

  // Fetch all posts and add to the postList component as Posts
  const posts = window.postHistory[year][month];
  const promises = posts
    .sort(descendingPostSort)
    .map(({ file }) => fetch(file).then(res => res.json()));
  const models = await Promise.all(promises);
  models.forEach(model => DOM.addChild(postList, Components.Post({ model })));

  Events.post('selectionUpdated');
};

/**
 * Show the exist post linked.
 *
 * @param {string} fileName - Post fileName selected
 */
window.showSinglePost = async (fileName) => {
  postList.innerHTML = '';
  history.replaceState(null, null, `?post=${fileName}`);

  DOM.addChild(
    postList,
    Components.LeftColumnHeader({ text: 'Selected post', isTopSection: true }),
  );

  // Find the post with this fileName
  let post;
  Object.entries(window.postHistory).forEach(([year, yearData]) => {
    Object.entries(yearData).forEach(([monthIndex, posts]) => {
      const found = posts.find(p => p.fileName === fileName);
      if (found) {
        post = found;
      }
    });
  });

  if (!post) {
    alert(`Linked post ${fileName} not found`);
    return;
  }

  const model = await fetch(post.file).then(res => res.json());
  DOM.addChild(postList, Components.Post({ model }));

  Events.post('selectionUpdated');
};

/**
 * Show posts from a chosen tag.
 *
 * @param {string} tag - Tag selected.
 */
window.showTagPosts = async (tag) => {
  // Find the post with this tag
  if (!window.tagIndex[tag]) {
    alert(`Linked tag ${tag} not found`);
    return;
  }

  postList.innerHTML = '';
  history.replaceState(null, null, `?tag=${tag}`);

  DOM.addChild(
    postList,
    Components.LeftColumnHeader({
      text: `Tag: ${tag} (${window.tagIndex[tag].length} posts)`,
      isTopSection: true,
    }),
  );

  const promises = window.tagIndex[tag]
    .sort(descendingDateSort)
    .map(fileName => fetch(`assets/rendered/${fileName}`).then(res => res.json()));
  const models = await Promise.all(promises);
  models.forEach(model => DOM.addChild(postList, Components.Post({ model })));

  Events.post('selectionUpdated');
};

/**
 * Fetch the post history file.
 */
const initPostHistory = () => {
  // Populate the Archive section
  Object.entries(window.postHistory)
    .sort(([year1], [year2]) => integerItemSort(year1, year2))
    .forEach(([year, yearData]) => {
      Object.entries(yearData)
        .sort(([month1, month2]) => integerItemSort(month1, month2))
        .forEach(([monthIndex]) => {
          const monthLabel = Components.LeftColumnItem({
            text: `${monthName(monthIndex)} ${year}`,
            onClick: () => showPostsFrom(year, monthIndex),
            getIsSelected: () => getQueryParam('year') === year && getQueryParam('month') === monthIndex,
          });
          DOM.addChild(leftColumn, monthLabel);
        });
    });
};

/**
 * Load the posts to display, if the query specifies a month/year or post slug.
 */
const loadSelection = () => {
  // Does the URL contain a selection?
  const post = getQueryParam('post');
  if (post) {
    showSinglePost(post);
    return;
  }

  // Or else a month page?
  let year = getQueryParam('year');
  let month = getQueryParam('month');
  if (year && month) {
    showPostsFrom(year, month);
    return;
  }

  // Or a tag?
  const tag = getQueryParam('tag');
  if (tag) {
    showTagPosts(tag);
    return;
  }

  // Auto load most recent month
  year = Object.keys(window.postHistory).sort(integerItemSort)[0];
  month = Object.keys(window.postHistory[year]).sort(integerItemSort)[0];
  showPostsFrom(year, month);
};

/**
 * The main function.
 */
const main = () => {
  buildPageLayout();
  initPostHistory();
  loadSelection();
};

main();
