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

  // Most Recent
  const sectionsHeader = UIComponents.LeftColumnHeader('Sections');
  DOM.addChild(leftColumn, sectionsHeader);
  const blogHomeLabel = UIComponents.LeftColumnItem('Home', () => (window.location.href = '/'));
  DOM.addChild(leftColumn, blogHomeLabel);

  // History fetched asynchronously
  const archiveHeader = UIComponents.LeftColumnHeader('Archive');
  DOM.addChild(leftColumn, archiveHeader);

  // Post list
  postList = UIComponents.PostList();
  DOM.addChild(centralColumn, postList);
};

const updateSelectedMonth = (year, month) => {
  postList.parentNode.removeChild(postList);
  selectedYear = year;
  selectedMonth = month;

  // Fetch all posts and add to the postList component as Posts
  const posts = historyJson[selectedYear][selectedMonth];
  posts.forEach(({ file }, index) => {
    fetch(file)
      .then(res => res.json())
      .then(console.log);
  });
};

/**
 * Fetch the post history file.
 */
const fetchPosts = () => {
  fetch('assets/history.json')
    .then(async (res) => {
      historyJson = await res.json();

      // Populate the Archive section
      Object.entries(historyJson).forEach(([year, yearData]) => {
        Object.entries(yearData).forEach(([monthIndex, posts]) => {
          const monthLabel = UIComponents.LeftColumnItem(
            `${monthName(monthIndex)} ${year}`,
            () => updateSelectedMonth(year, monthIndex),
          );
          DOM.addChild(leftColumn, monthLabel);
        });
      });
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
