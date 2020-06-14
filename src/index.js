const setupUI = () => {
  const rootContainer = UIComponents.RootContainer();
  DOM.addChild(document.getElementById('app'), rootContainer);

  const leftColumn = UIComponents.LeftColumn();
  DOM.addChild(rootContainer, leftColumn);

  const centralColumn = UIComponents.CentralColumn();
  DOM.addChild(rootContainer, centralColumn);
};

const main = () => {
  setupUI();
};

main();
