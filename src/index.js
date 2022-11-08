let leftColumn;

/**
 * Update the posts for the archive location selected.
 *
 * @param {string} year - Year selected
 */
const showPostsFromYear = async (year) => {
  window.history.replaceState(null, null, `?year=${year}`);

  // Fetch all posts and add to the postList component as Posts
  const yearPosts = Object.entries(window.postHistory[year])
    .reduce((acc, [, posts]) => [...acc, ...posts], []);
  const promises = yearPosts
    .sort(Utils.descendingPostSort)
    .map(({ file }) => fetch(file).then((res) => res.json()));
  const models = await Promise.all(promises);
  fabricate.update({ postListItems: models });
};

/**
 * Fetch the post history file, then populate the last leftColumn section - the archive.
 */
const initPostHistory = () => {
  // Populate the Archive section
  Object.entries(window.postHistory)
    .sort(([year1], [year2]) => Utils.integerItemSort(year1, year2))
    .forEach(([year, yearData]) => {
      const yearPosts = Object.entries(yearData).reduce((acc, [, posts]) => [...acc, ...posts], []);

      const yearLabel = fabricate('LeftColumnItem', { year })
        .setText(`${year} (${yearPosts.length})`)
        .onClick(() => {
          fabricate.update({ selectedYear: year });
          showPostsFromYear(year);
        });

      leftColumn.addChildren([yearLabel]);
    });
};

/**
 * Translate query selection to path selection.
 */
const redirectQuerySelection = () => {
  const post = Utils.getQueryParam('post');
  if (post) {
    window.location.pathname = `/post/${post}`;
  }
};

/**
 * Load the posts to display, if the path specifies a year, post, or tag.
 */
const loadSelectionFromPath = () => {
  // All path segments after domain
  const segments = window.location.href.split('/').slice(3);
  const [key, value] = segments;

  if (key === 'post') {
    Utils.showSinglePost(value);
    return;
  }

  if (key === 'year') {
    fabricate.update({ selectedYear: value });
    showPostsFromYear(value);
    return;
  }

  if (key === 'tag') {
    Utils.showPostsForTag(value);
    return;
  }

  // Auto load most recent post
  const [year] = Object.keys(window.postHistory).sort(Utils.integerItemSort);
  const [month] = Object.keys(window.postHistory[year]).sort(Utils.integerItemSort);
  const [latest] = window.postHistory[year][month]
    .sort((a, b) => (a.fileName > b.fileName ? -1 : 1));
  Utils.showSinglePost(latest.fileName);
};

/**
 * Main App component.
 *
 * @returns {HTMLElement} The App component.
 */
const App = () => {
  const siteHeader = fabricate('SiteHeader')
    .setChildren([
      fabricate('SiteTitle'),
      fabricate.isNarrow() ? fabricate('div') : fabricate('SiteSocials'),
    ]);

  const contentContainer = fabricate('ContentContainer');
  const centralColumn = fabricate('CentralColumn');
  leftColumn = fabricate('LeftColumn');

  // Left, then right for mobile to flex flow, else other way
  contentContainer.addChildren(fabricate.isNarrow()
    ? [centralColumn, leftColumn]
    : [leftColumn, centralColumn]);

  // On mobile the socials go before the post
  if (fabricate.isNarrow()) centralColumn.addChildren([fabricate('SiteSocials')]);

  // Blog main sections
  const blogHeader = fabricate('LeftColumnHeader', { isTopSection: true }).setText('Blog');
  const recentItem = fabricate('LeftColumnItem')
    .setText('Most Recent')
    .onClick(() => {
      window.location.href = '/';
    });
  const repoItem = fabricate('LeftColumnItem')
    .setText('Source Repository')
    .onClick(() => window.open('https://github.com/C-D-Lewis/blog', '_blank'));

  // Other stuff
  const otherHeader = fabricate('LeftColumnHeader').setText('Other Stuff');
  const fitbitItem = fabricate('LeftColumnItem')
    .setText('FitBit Apps')
    .onClick(() => window.open('https://gallery.fitbit.com/search?terms=chris%20lewis', '_blank'));
  const pebbleItem = fabricate('LeftColumnItem')
    .setText('Pebble Apps')
    .onClick(() => window.open('https://github.com/C-D-Lewis/pebble', '_blank'));
  const pixelsItem = fabricate('LeftColumnItem')
    .setText('Pixels With Friends')
    .onClick(() => window.open('https://github.com/c-d-lewis/pixels-with-friends', '_blank'));
  const oldItem = fabricate('LeftColumnItem')
    .setText('Old WordPress Blog')
    .onClick(() => window.open('https://ninedof.wordpress.com/', '_blank'));

  leftColumn.addChildren([
    blogHeader,
    recentItem,
    repoItem,
    // TODO: About page

    otherHeader,
    fitbitItem,
    pebbleItem,
    pixelsItem,
    oldItem,

    fabricate('LeftColumnHeader').setText('Posts by tag'),
    fabricate('TagCloud', { tags: Object.keys(window.tagIndex) }),

    // Archive list - history fetched asynchronously (MUST BE LAST HEADER)
    fabricate('LeftColumnHeader').setText('Posts by year'),
  ]);

  // Post list in the middle
  centralColumn.addChildren([fabricate('PostList')]);

  return fabricate('RootContainer')
    .addChildren([
      siteHeader,
      contentContainer,
      leftColumn,
    ])
    .onCreate(() => {
      initPostHistory();

      // Handle legacy links
      if (Utils.isUsingQuerySelection()) {
        redirectQuerySelection();
        return;
      }

      loadSelectionFromPath();
    });
};

const initialState = {
  selectedYear: undefined,
  postListItems: [],
};
fabricate.app(App(), initialState);
