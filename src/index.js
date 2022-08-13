let leftColumn;
let postList;

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
const integerItemSort = (a, b) => parseInt(a, 10) > parseInt(b, 10) ? -1 : 1;

/**
 * Setup the UI.
 */
const buildPageLayout = () => {
  const siteHeader = Components.SiteHeader()
    .addChildren([
      Components.SiteTitle(),
      fabricate.isMobile() ? Components.Nothing() : Components.SiteSocials(),
    ]);
  
  const contentContainer = Components.ContentContainer();
  const centralColumn = Components.CentralColumn();
  leftColumn = Components.LeftColumn();

  // Left, then right for mobile to flex flow, else other way
  contentContainer.addChildren(fabricate.isMobile()
    ? [centralColumn, leftColumn]
    : [leftColumn, centralColumn]
  );

  // On mobile the socials go before the post
  if (fabricate.isMobile()) {
    centralColumn.addChildren([Components.SiteSocials()]);
  }

  // Blog main sections
  const blogHeader = Components.LeftColumnHeader({ isTopSection: true }).setText('Blog');
  const recentItem = Components.LeftColumnItem()
    .setText('Most Recent')
    .onClick(() => (window.location.href = '/'));
  const repoItem = Components.LeftColumnItem()
    .setText('Source Repository')
    .onClick(() => window.open('https://github.com/C-D-Lewis/blog', '_blank'));

  // Other stuff
  const otherHeader = Components.LeftColumnHeader().setText('Other Stuff');
  const fitbitItem = Components.LeftColumnItem()
    .setText('FitBit Apps')
    .onClick(() => window.open('https://gallery.fitbit.com/search?terms=chris%20lewis', '_blank'));
  const pebbleItem = Components.LeftColumnItem()
    .setText('Pebble Apps')
    .onClick(() => window.open('https://github.com/C-D-Lewis/pebble', '_blank'));
  const pixelsItem = Components.LeftColumnItem()
    .setText('Pixels With Friends')
    .onClick(() => window.open('https://github.com/c-d-lewis/pixels-with-friends', '_blank'));
  const oldItem = Components.LeftColumnItem()
    .setText('Old WordPress Blog')
    .onClick(() => window.open('https://ninedof.wordpress.com/', '_blank'));

  // Tags list as pills
  const tagsHeader = Components.LeftColumnHeader().setText('Posts by tag');
  const tagCloud = Components.TagCloud({ tags: Object.keys(window.tagIndex) });

  // Archive list - history fetched asynchronously (MUST BE LAST HEADER)
  const archiveHeader = Components.LeftColumnHeader().setText('Posts by year');

  leftColumn.addChildren([
    blogHeader,
    recentItem,
    repoItem,

    otherHeader,
    fitbitItem,
    pebbleItem,
    pixelsItem,
    oldItem,

    tagsHeader,
    tagCloud,

    archiveHeader,
  ]);

  // Post list in the middle
  postList = Components.PostList();
  centralColumn.addChildren([postList]);

  const rootContainer = Components.RootContainer()
    .addChildren([
      siteHeader,
      contentContainer,
      leftColumn,
    ]);

  fabricate.app(rootContainer);
};

/**
 * Update the posts for the archive location selected.
 *
 * @param {string} year - Year selected
 */
const showPostsFrom = async (year) => {
  postList.clear();
  history.replaceState(null, null, `?year=${year}`);

  postList.addChildren([
    Components.LeftColumnHeader({
      isTopSection: true,
      isCenterSection: true,
    })
    .setText(`${year}`),
  ]);

  // Fetch all posts and add to the postList component as Posts
  const yearPosts = Object.entries(window.postHistory[year])
    .reduce((acc, [, posts]) => [...acc, ...posts], []);
  const promises = yearPosts
    .sort(descendingPostSort)
    .map(({ file }) => fetch(file).then(res => res.json()));
  const models = await Promise.all(promises);
  postList.addChildren(models.map((model) => Components.Post({ model, startExpanded: models.length === 1 })));

  // Notify expanders
  Events.post('selectionUpdated');
};

/**
 * Show the exist post linked.
 *
 * @param {string} fileName - Post fileName selected
 */
window.showSinglePost = async (fileName) => {
  history.replaceState(null, null, `?post=${fileName}`);

  // Find the post with this fileName - TODO: use reduce()?
  let post;
  Object.entries(window.postHistory).forEach(([, yearData]) => {
    Object.entries(yearData).forEach(([, posts]) => {
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
  postList.clear();
  postList.addChildren([Components.Post({ model })]);

  // Notify expanders
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

  history.replaceState(null, null, `?tag=${tag}`);

  postList.clear();
  postList.addChildren([
    Components.LeftColumnHeader({
      isTopSection: true,
      isCenterSection: true,
    })
    .setText(`Tag: ${tag} (${window.tagIndex[tag].length} posts)`),
  ]);

  const promises = window.tagIndex[tag]
    .sort(descendingDateSort)
    .map(fileName => fetch(`assets/rendered/${fileName}`).then(res => res.json()));
  const models = await Promise.all(promises);
  postList.addChildren(models.map((model) => Components.Post({ model, startExpanded: models.length === 1 })));

  // Notify expanders
  Events.post('selectionUpdated');
};

/**
 * Fetch the post history file, then populate the last leftColumn section - the archive.
 */
const initPostHistory = () => {
  // Populate the Archive section
  Object.entries(window.postHistory)
    .sort(([year1], [year2]) => integerItemSort(year1, year2))
    .forEach(([year, yearData]) => {
      const yearPosts = Object.entries(yearData).reduce((acc, [, posts]) => [...acc, ...posts], []);

      const yearSelected = getQueryParam('year') === year;
      const yearLabel = Components.LeftColumnItem({ getIsSelected: () => yearSelected })
        .setText(`${year} (${yearPosts.length})`)
        .onClick(() => showPostsFrom(year));

      leftColumn.addChildren([yearLabel]);
    });
};

/**
 * Load the posts to display, if the query specifies a year or post slug.
 */
const loadSelectionFromQuery = () => {
  // Does the URL contain a selection?
  let post = getQueryParam('post');
  if (post) {
    showSinglePost(post);
    return;
  }

  // Or else a year page?
  let year = getQueryParam('year');
  if (year) {
    showPostsFrom(year);
    return;
  }

  // Or a tag?
  const tag = getQueryParam('tag');
  if (tag) {
    showTagPosts(tag);
    return;
  }

  // Auto load most recent post
  [year] = Object.keys(window.postHistory).sort(integerItemSort);
  let [month] = Object.keys(window.postHistory[year]).sort(integerItemSort);
  const [latest] = window.postHistory[year][month].sort((a, b) => a.fileName > b.fileName ? -1 : 1);
  showSinglePost(latest.fileName);
};

/**
 * The main function.
 */
const main = () => {
  buildPageLayout();
  initPostHistory();
  loadSelectionFromQuery();
};

main();
