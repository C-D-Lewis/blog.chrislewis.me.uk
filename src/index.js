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
const setupUI = () => {
  const rootContainer = UIComponents.RootContainer();
  DOM.addChild(document.getElementById('app'), rootContainer);

  // Header
  const siteHeader = UIComponents.SiteHeader();
  DOM.addChild(rootContainer, siteHeader);
  const siteTitle = UIComponents.SiteTitle();
  DOM.addChild(siteHeader, siteTitle);
  const siteSocials = UIComponents.SiteSocials();
  DOM.addChild(siteHeader, siteSocials);

  // Containers
  const contentContainer = UIComponents.ContentContainer();
  DOM.addChild(rootContainer, contentContainer);
  leftColumn = UIComponents.LeftColumn();
  DOM.addChild(contentContainer, leftColumn);
  const centralColumn = UIComponents.CentralColumn();
  DOM.addChild(contentContainer, centralColumn);

  // Blog sections
  const blogHeader = UIComponents.LeftColumnHeader('Blog', true);
  DOM.addChild(leftColumn, blogHeader);
  const blogHomeLabel = UIComponents.LeftColumnItem({
    label: 'Most Recent',
    onClick: () => (window.location.href = '/'),
  });
  DOM.addChild(leftColumn, blogHomeLabel);

  // Other stuff
  const otherStuffHeader = UIComponents.LeftColumnHeader('Other Stuff');
  DOM.addChild(leftColumn, otherStuffHeader);
  const pebbleAppsLabel = UIComponents.LeftColumnItem({
    label: 'Pebble Apps',
    onCick: () => (window.location.href = 'https://github.com/C-D-Lewis/pebble'),
  });
  DOM.addChild(leftColumn, pebbleAppsLabel);
  const wordPressLabel = UIComponents.LeftColumnItem({
    label: 'Old WordPress Blog',
    onCick: () => (window.location.href = 'https://ninedof.wordpress.com/'),
  });
  DOM.addChild(leftColumn, wordPressLabel);

  // Archive list - history fetched asynchronously (MUST BE LAST HEADER)
  const archiveHeader = UIComponents.LeftColumnHeader('Archive');
  DOM.addChild(leftColumn, archiveHeader);
  postList = UIComponents.PostList();
  DOM.addChild(centralColumn, postList);
};

/**
 * Update the posts for the archive location selected.
 *
 * @param {string} year - Year selected
 * @param {string} month - Month selected
 */
const showPostsFrom = (year, month) => {
  postList.innerHTML = '';
  history.replaceState(null, null, `?year=${year}&month=${month}`);

  const archiveHeader = UIComponents.LeftColumnHeader(`Archive: ${monthName(month)} ${year}`, true);
  DOM.addChild(postList, archiveHeader);

  // Fetch all posts and add to the postList component as Posts
  const posts = historyJson[year][month];
  const promises = posts.map(({ file }) => fetch(file).then(res => res.json()));
  Promise.all(promises)
    .then((models) => {
      models.forEach(model => DOM.addChild(postList, UIComponents.Post(model)));
    });
};

/**
 * Show the exist post linked.
 *
 * @param {string} fileName - Post fileName selected
 */
window.showPost = (fileName) => {
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

  fetch(post.file).then(res => res.json())
    .then(model => DOM.addChild(postList, UIComponents.Post(model)));
};

/**
 * Integer item sort in descending order.
 */
const integerItemSort = (a, b) => parseInt(a) > parseInt(b) ? -1 : 1;

/**
 * Fetch the post history file.
 */
const fetchPosts = () => {
  fetch('assets/history.json')
    .then(async (res) => {
      historyJson = await res.json();

      // Populate the Archive section
      // TODO - Highlight selected section
      Object.entries(historyJson)
        .sort(([year1], [year2]) => integerItemSort(year1, year2))
        .forEach(([year, yearData]) => {
          Object.entries(yearData)
            .sort(([month1, month2]) => integerItemSort(month1, month2))
            .forEach(([monthIndex]) => {
              // FIXME - Months end prematurely
              const monthLabel = UIComponents.LeftColumnItem({
                label: `${monthName(monthIndex)} ${year}`,
                onClick: () => showPostsFrom(year, monthIndex),
                fadeIn: true,
                isSelected: getQueryParam('year') === year && getQueryParam('month') === monthIndex
              });
              DOM.addChild(leftColumn, monthLabel);
            });
        });

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
    });
  };

/**
 * The main function.
 */
const main = () => {
  setupUI();
  fetchPosts();
};

main();
