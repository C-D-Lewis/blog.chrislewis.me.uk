let historyJson;
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
  DOM.addChild(leftColumn, Components.LeftColumnHeader('Blog', true));
  DOM.addChild(leftColumn, Components.LeftColumnItem({
    label: 'Most Recent',
    onClick: () => (window.location.href = '/'),
  }));

  // Other stuff
  const otherStuffHeader = Components.LeftColumnHeader('Other Stuff');
  DOM.addChild(leftColumn, otherStuffHeader);
  DOM.addChild(leftColumn, Components.LeftColumnItem({
    label: 'Pixels With Friends',
    onClick: () => (window.open('http://pixels.chrislewis.me.uk', '_blank')),
  }));
  DOM.addChild(leftColumn, Components.LeftColumnItem({
    label: 'FitBit Apps',
    onClick: () => (window.open('https://gallery.fitbit.com/search?terms=chris%20lewis', '_blank')),
  }));
  DOM.addChild(leftColumn, Components.LeftColumnItem({
    label: 'Pebble Apps',
    onClick: () => (window.open('https://github.com/C-D-Lewis/pebble', '_blank')),
  }));
  DOM.addChild(leftColumn, Components.LeftColumnItem({
    label: 'Old WordPress Blog',
    onClick: () => (window.open('https://ninedof.wordpress.com/', '_blank')),
  }));

  // Archive list - history fetched asynchronously (MUST BE LAST HEADER)
  const archiveHeader = Components.LeftColumnHeader('Archive');
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

  const archiveHeader = Components.LeftColumnHeader(`Archive: ${monthName(month)} ${year}`, true);
  DOM.addChild(postList, archiveHeader);

  // Fetch all posts and add to the postList component as Posts
  const posts = historyJson[year][month];
  const promises = posts.map(({ file }) => fetch(file).then(res => res.json()));
  const models = await Promise.all(promises);
  models.forEach(model => DOM.addChild(postList, Components.Post(model)));

  Events.post('selectionUpdated');
};

/**
 * Show the exist post linked.
 *
 * @param {string} fileName - Post fileName selected
 */
window.showPost = async (fileName) => {
  postList.innerHTML = '';
  history.replaceState(null, null, `?post=${fileName}`);

  // Find the post with this fileName
  let post;
  Object.entries(historyJson).forEach(([year, yearData]) => {
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
  DOM.addChild(postList, Components.Post(model));

  Events.post('selectionUpdated');
};

/**
 * Integer item sort in descending order.
 */
const integerItemSort = (a, b) => parseInt(a) > parseInt(b) ? -1 : 1;

/**
 * Fetch the post history file.
 */
const initPostsAndHistory = async () => {
  historyJson = await fetch('assets/history.json').then(res => res.json());

  // Populate the Archive section
  Object.entries(historyJson)
    .sort(([year1], [year2]) => integerItemSort(year1, year2))
    .forEach(([year, yearData]) => {
      Object.entries(yearData)
        .sort(([month1, month2]) => integerItemSort(month1, month2))
        .forEach(([monthIndex]) => {
          const monthLabel = Components.LeftColumnItem({
            label: `${monthName(monthIndex)} ${year}`,
            onClick: () => showPostsFrom(year, monthIndex),
            fadeIn: true,
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
    showPost(post);
    return;
  }

  // Or else a month page?
  let year = getQueryParam('year');
  let month = getQueryParam('month');
  if (year && month) {
    showPostsFrom(year, month);
    return;
  }

  // Auto load most recent month
  year = Object.keys(historyJson).sort(integerItemSort)[0];
  month = Object.keys(historyJson[year]).sort(integerItemSort)[0];
  showPostsFrom(year, month);
};

/**
 * The main function.
 */
const main = async () => {
  buildPageLayout();
  await initPostsAndHistory();
  loadSelection();
};

main();
