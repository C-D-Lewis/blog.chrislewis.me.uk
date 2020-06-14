const setupUI = () => {
  const rootContainer = UIComponents.RootContainer();
  DOM.addChild(document.getElementById('app'), rootContainer);

  const siteHeader = UIComponents.SiteHeader();
  DOM.addChild(rootContainer, siteHeader);
  const siteTitle = UIComponents.SiteTitle();
  DOM.addChild(siteHeader, siteTitle);

  const contentContainer = UIComponents.ContentContainer();
  DOM.addChild(rootContainer, contentContainer);

  const leftColumn = UIComponents.LeftColumn();
  DOM.addChild(contentContainer, leftColumn);

  const centralColumn = UIComponents.CentralColumn();
  DOM.addChild(contentContainer, centralColumn);
};

const main = () => {
  setupUI();
};

main();
