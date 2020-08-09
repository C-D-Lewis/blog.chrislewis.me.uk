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
  const leftColumn = UIComponents.LeftColumn();
  DOM.addChild(contentContainer, leftColumn);
  const centralColumn = UIComponents.CentralColumn();
  DOM.addChild(contentContainer, centralColumn);

  // History fetch async
  fetch('assets/history.json')
    .then(async (res) => {
      const historyJson = await res.json();
      Object.entries(historyJson).forEach(([year, yearData]) => {
        const yearLabel = UIComponents.YearLabel(year);
        DOM.addChild(leftColumn, yearLabel);

        Object.entries(yearData).forEach(([monthIndex, posts]) => {
          const monthLabel = UIComponents.MonthLabel(monthName(monthIndex));
          DOM.addChild(leftColumn, monthLabel);
        });
      });
    });
};

const main = () => {
  setupUI();
};

main();
