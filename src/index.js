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
 *
 * @returns {Array<HTMLElement>} List of history item.
 */
const buildPostHistoryList = () => Object.entries(window.postHistory)
  .sort(([year1], [year2]) => Utils.integerItemSort(year1, year2))
  .map(([year, yearData]) => {
    const yearPosts = Object.entries(yearData).reduce((acc, [, posts]) => [...acc, ...posts], []);

    return fabricate('LeftColumnItem', { year })
      .setText(`${year} (${yearPosts.length})`)
      .onClick(() => {
        fabricate.update({ selectedYear: year });
        showPostsFromYear(year);
      });
  });

/**
 * Load the posts to display, if the query specifies a year or post slug.
 */
const loadSelectionFromQuery = () => {
  // Does the URL contain a selection?
  const post = Utils.getQueryParam('post');
  if (post) {
    Utils.showSinglePost(post);
    return;
  }

  // Or else a year page?
  let year = Utils.getQueryParam('year');
  if (year) {
    fabricate.update({ selectedYear: year });
    showPostsFromYear(year);
    return;
  }

  // Or a tag?
  const tag = Utils.getQueryParam('tag');
  if (tag) {
    Utils.showPostsForTag(tag);
    return;
  }

  // Auto load most recent post
  [year] = Object.keys(window.postHistory).sort(Utils.integerItemSort);
  const [month] = Object.keys(window.postHistory[year]).sort(Utils.integerItemSort);
  const [latest] = window.postHistory[year][month]
    .sort((a, b) => (a.fileName > b.fileName ? -1 : 1));
  Utils.showSinglePost(latest.fileName);
};

/**
 * Navigate to a random post.
 */
const goToRandomPost = () => {
  const allPosts = Object.entries(window.postHistory).reduce((acc, [, year]) => ([
    ...acc,
    ...Object.entries(year).reduce((acc2, [, posts]) => [...acc2, ...posts], []),
  ]), []);

  const index = Math.round(Math.random() * allPosts.length) - 1;
  Utils.showSinglePost(allPosts[index].fileName);
};

/**
 * Main App component.
 *
 * @returns {HTMLElement} The App component.
 */
const App = () => {
  const leftColumn = fabricate('LeftColumn')
    .setChildren([
      // Blog
      fabricate('LeftColumnHeader', { isTopSection: true }).setText('Blog'),
      fabricate('LeftColumnItem')
        .setText('Most Recent')
        .onClick(() => {
          window.location.href = '/';
        }),
      fabricate('LeftColumnItem')
        .setText('Random Post')
        .onClick(goToRandomPost),

      // Posts by tag
      fabricate('LeftColumnHeader').setText('Tags'),
      fabricate('TagCloud', { tags: Object.keys(window.tagIndex) }),

      // Archive posts by year
      fabricate('LeftColumnHeader').setText('Archive'),
      ...buildPostHistoryList(),

      // Other stuff
      fabricate('LeftColumnHeader').setText('Other Stuff'),
      fabricate('LeftColumnItem')
        .setText('FitBit Apps')
        .onClick(() => window.open('https://gallery.fitbit.com/search?terms=chris%20lewis', '_blank')),
      fabricate('LeftColumnItem')
        .setText('Pebble Apps')
        .onClick(() => window.open('https://github.com/C-D-Lewis/pebble', '_blank')),
      fabricate('LeftColumnItem')
        .setText('Pixels With Friends')
        .onClick(() => window.open('https://github.com/c-d-lewis/pixels-with-friends', '_blank')),
      fabricate('LeftColumnItem')
        .setText('Old WordPress Blog')
        .onClick(() => window.open('https://ninedof.wordpress.com/', '_blank')),
      fabricate('LeftColumnItem')
        .setText('Who\'s at Paddy\'s?')
        .onClick(() => window.open('https://whosatpaddys.pub/', '_blank')),
    ]);

  // Post list in the middle, socials first on mobile
  const centralColumn = fabricate('CentralColumn')
    .setChildren(fabricate.isNarrow()
      ? [fabricate('SiteSocials'), fabricate('PostList')]
      : [fabricate('PostList')]);

  return fabricate('RootContainer')
    .addChildren([
      fabricate('SiteHeader')
        .setChildren([
          fabricate('SiteTitle'),
          fabricate.isNarrow() ? fabricate('div') : fabricate('SiteSocials'),
        ]),
      fabricate('ContentContainer')
        // Left, then right for mobile to flex flow, else other way
        .setChildren(fabricate.isNarrow()
          ? [centralColumn, leftColumn]
          : [leftColumn, centralColumn]),
      fabricate('Footer'),
    ])
    .onUpdate(loadSelectionFromQuery, ['fabricate:created']);
};

const initialState = {
  selectedYear: null,
  postListItems: [],
};
const options = {
  theme: Theme,
};
fabricate.app(App, initialState, options);
