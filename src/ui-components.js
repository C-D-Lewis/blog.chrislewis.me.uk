/** Colors used in components. */
const Colors = {
  lightGrey: '#0004',
  veryLightGrey: '#0002',
};

/**
 * RootContainer component.
 *
 * @returns {HTMLElement}
 */
const RootContainer = () => DOM.create('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  margin: 0,
  padding: 0,
});

/**
 * ContentContainer component.
 *
 * @returns {HTMLElement}
 */
const ContentContainer = () => DOM.create('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100%',
  margin: 0,
  padding: 0,
});

/**
 * SiteHeader component.
 *
 * @returns {HTMLElement}
 */
const SiteHeader = () => DOM.create('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100px',
  padding: 15,
  cursor: 'default',
  borderBottom: '1px solid #111',
});

/**
 * SiteTitleWord component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const SiteTitleWord = (str, color, marginLeft = '16px') => {
  const el = DOM.create('h2', {
    display: 'block',
    color,
    fontFamily: 'monospace',
    fontSize: '2rem',
    marginLeft,
  });
  el.innerHTML = str;
  return el;
};

/**
 * SiteTitle component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const SiteTitle = () => {
  const container = DOM.create('div', {
    display: 'flex',
    marginLeft: '20px',
  });
  const awaitWord = SiteTitleWord('await', 'rgb(236 64 135)');
  const successWord = SiteTitleWord('success', 'rgb(100, 204, 118)');
  const rest = SiteTitleWord('();  // A blog by Chris Lewis', 'rgb(120 117 125)', '0px');
  DOM.addChild(container, awaitWord);
  DOM.addChild(container, successWord);
  DOM.addChild(container, rest);
  return container;
};

/**
 * SocialIcon component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const SocialIcon = (icon, href) => {
  const img = DOM.create('img', {
    display: 'block',
    width: '38px',
    height: '38px',
    marginLeft: '15px',
  }, { src: `./assets/icons/${icon}` });
  const a = DOM.create('a', {}, { href, target: '_blank' });
  DOM.addChild(a, img);
  return a;
};

/**
 * SiteSocials component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const SiteSocials = () => {
  const container = DOM.create('div', {
    display: 'flex',
    marginRight: '20px',
    justifyContent: 'flex-end',
    flex: '1',
    alignItems: 'center',
  });
  const gitHubIcon = SocialIcon('github.png', 'https://github.com/C-D-Lewis');
  DOM.addChild(container, gitHubIcon);
  const twitterIcon = SocialIcon('twitter.png', 'https://twitter.com/Chris_DL');
  DOM.addChild(container, twitterIcon);

  return container;
};

/**
 * LeftColumn component.
 *
 * @returns {HTMLElement}
 */
const LeftColumn = () => DOM.create('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#1a1a1a',
  flex: '0 0 230px',
  justifyContent: 'start',
  padding: '20px 10px',
  borderRight: '1px solid #111',
});

/**
 * CentralColumn component.
 *
 * @returns {HTMLElement}
 */
const CentralColumn = () => DOM.create('div', {
  flex: '1 1 600px',
  height: '100%',
  borderLeft: `1px solid ${Colors.lightGrey}`,
  paddingLeft: '30px',
});

/**
 * PostTitle component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const PostTitle = () => DOM.create('h1', {
  display: 'block',
  color: '#ddd',
  fontFamily: 'sans-serif',
  fontSize: '2rem',
  fontWeight: 'bold',
  marginTop: '30px',
  border: 'none',
  minWidth: '500px',
  outline: 'none',
});

/**
 * PostDate component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const PostDate = () => DOM.create('div', {
  minWidth: '180px',
  display: 'block',
  color: '#aaa',
  fontFamily: 'sans-serif',
  fontSize: '1.2rem',
  marginTop: '10px',
  border: 'none',
  outline: 'none',
});

/**
 * PostBody component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const PostBody = () => DOM.create('textarea', {
  display: 'block',
  width: '90%',
  minHeight: '700px',
  color: 'black',
  fontFamily: 'sans-serif',
  fontSize: '1rem',
  marginTop: '20px',
  padding: '5px',
  border: 'none',
  outline: 'none',
}, {
  disabled: 'true',
});

/**
 * SimpleRow component.
 *
 * @returns {HTMLElement}
 */
const SimpleRow = () => DOM.create('div', {
  display: 'flex',
  flexDirection: 'row',
});

window.UIComponents = {
  RootContainer,
  ContentContainer,
  SiteHeader,
  SiteTitle,
  SiteSocials,
  LeftColumn,
  CentralColumn,
  PostTitle,
  PostDate,
  PostBody,
  SimpleRow,
};
