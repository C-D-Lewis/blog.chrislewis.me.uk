const setupUI = () => {
  const rootContainer = UIComponents.RootContainer();
  const leftColumn = UIComponents.LeftColumn();
  const centralColumn = UIComponents.CentralColumn();

  const app = document.getElementById('app');
  DOM.addChild(app, rootContainer);

  DOM.addChild(rootContainer, leftColumn);
  DOM.addChild(rootContainer, centralColumn);
};

const main = () => {
  setupUI();
};

main();
