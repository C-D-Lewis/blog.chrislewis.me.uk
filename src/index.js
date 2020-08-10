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

let historyJson;
let leftColumn;
let postList;
let selectedYear;
let selectedMonth;

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
  const blogHomeLabel = UIComponents.LeftColumnItem('Most Recent', () => (window.location.href = '/'));
  DOM.addChild(leftColumn, blogHomeLabel);

  // Other stuff
  const otherStuffHeader = UIComponents.LeftColumnHeader('Other Stuff');
  DOM.addChild(leftColumn, otherStuffHeader);
  const pebbleAppsLabel = UIComponents.LeftColumnItem('Pebble Apps', () => {
    window.location.href = 'https://github.com/C-D-Lewis/pebble';
  });
  DOM.addChild(leftColumn, pebbleAppsLabel);
  const wordPressLabel = UIComponents.LeftColumnItem('Old WordPress Blog', () => {
    window.location.href = 'https://ninedof.wordpress.com/';
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
  selectedYear = year;
  selectedMonth = month;

  // Fetch all posts and add to the postList component as Posts
  const posts = historyJson[selectedYear][selectedMonth];
  const promises = posts.map(({ file }) => fetch(file).then(res => res.json()));
  Promise.all(promises)
    .then((models) => {
      models.forEach(model => DOM.addChild(postList, UIComponents.Post(model)));
    });
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
      Object.entries(historyJson)
        .sort(([year1], [year2]) => integerItemSort(year1, year2))
        .forEach(([year, yearData]) => {
          Object.entries(yearData)
            .sort(([month1, month2]) => integerItemSort(month1, month2))
            .forEach(([monthIndex, posts]) => {
              const monthLabel = UIComponents.LeftColumnItem(
                `${monthName(monthIndex)} ${year}`,
                () => showPostsFrom(year, monthIndex),
                true,
              );
              DOM.addChild(leftColumn, monthLabel);
            });
        });

      // Auto load most recent month
      const year = Object.keys(historyJson).sort((a, b) => a > b ? -1 : 1)[0];
      const month = Object.keys(historyJson[year])
        .sort(integerItemSort)[0];
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
