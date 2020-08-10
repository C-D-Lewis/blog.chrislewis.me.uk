/** Colors used in components. */
const Colors = {
  lightGrey: '#0004',
  veryLightGrey: '#0002',
  leftColumnBackground: 'rgb(66, 66, 66)',
  centralColumnBackground: '#ccc',
  syntax: {
    background: 'rgb(26, 26, 26)',
    keyword: 'rgb(236 64 135)',
    function: 'rgb(100, 204, 118)',
    comment: 'rgb(120 117 125)',
  }
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
 * SiteHeader component.
 *
 * @returns {HTMLElement}
 */
const SiteHeader = () => DOM.create('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '80px',
  padding: 15,
  cursor: 'default',
  borderBottom: '1px solid #111',
  backgroundColor: Colors.syntax.background,
});

/**
 * SiteTitleWord component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const SiteTitleWord = (str, color, marginLeft = '10px') => {
  const el = DOM.create('h2', {
    display: 'block',
    color,
    fontFamily: 'monospace',
    fontSize: '1.4rem',
    marginLeft,
    marginTop: '0px',
    marginBottom: '0px',
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
  const rowsContainer = DOM.create('div', {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  });
  const wordsContainer = DOM.create('div', {
    display: 'flex',
    marginLeft: '8px',
  });
  const comment = SiteTitleWord('// A blog by Chris Lewis', Colors.syntax.comment, '18px');
  const words = [
    SiteTitleWord('try', Colors.syntax.keyword),
    SiteTitleWord('{', Colors.syntax.comment),
    SiteTitleWord('work', Colors.syntax.function),
    SiteTitleWord('();', Colors.syntax.comment, '0px'),
    SiteTitleWord('}', Colors.syntax.comment),
    SiteTitleWord('finally', Colors.syntax.keyword),
    SiteTitleWord('{', Colors.syntax.comment),
    SiteTitleWord('code', Colors.syntax.function),
    SiteTitleWord('();', Colors.syntax.comment, '0px'),
    SiteTitleWord('}', Colors.syntax.comment),
  ]
  words.forEach(word => DOM.addChild(wordsContainer, word));

  DOM.addChild(rowsContainer, comment);
  DOM.addChild(rowsContainer, wordsContainer);
  return rowsContainer;
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
    width: '32px',
    height: '32px',
    marginLeft: '25px',
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
 * LeftColumn component.
 *
 * @returns {HTMLElement}
 */
const LeftColumn = () => DOM.create('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: Colors.leftColumnBackground,
  flex: '0 0 200px',
  justifyContent: 'start',
  padding: '0px 15px',
  borderRight: '1px solid #111',
});

/**
 * LeftColumnHeader component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const LeftColumnHeader = (label) => {
  const span = DOM.create('span', {
    display: 'block',
    color: 'white',
    fontFamily: 'monospace',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginTop: '25px',
    cursor: 'default',
  });
  span.innerHTML = label;
  return span;
};

/**
 * LeftColumnItem component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const LeftColumnItem = (label, onClick) => {
  const a = DOM.create('a', {
    color: '#ccc',
    fontFamily: 'monospace',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginTop: '10px',
    cursor: 'pointer',
  });
  a.innerHTML = label;
  a.addEventListener('click', () => onClick());
  return a;
};

/**
 * CentralColumn component.
 *
 * @returns {HTMLElement}
 */
const CentralColumn = () => DOM.create('div', {
  flex: '1',
  display: 'flex',
  width: '100vw',
  height: '100%',
  borderLeft: `1px solid ${Colors.lightGrey}`,
  paddingLeft: '30px',
  backgroundColor: Colors.centralColumnBackground,
});

/**
 * PostList component.
 *
 * @returns {HTMLElement}
 */
const PostList = () => DOM.create('div', {
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  backgroundColor: 'white',
});

/**
 * PostTitle component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const PostTitle = (text) => {
  const h1 = DOM.create('h1', {
    display: 'block',
    color: '#ddd',
    fontFamily: 'sans-serif',
    fontSize: '2rem',
    fontWeight: 'bold',
    marginTop: '30px',
    border: 'none',
    minWidth: '500px',
  });
  h1.innerHTML = text;
  return h1;
};

/**
 * PostDate component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const PostDate = (text) => {
  const div = DOM.create('div', {
    minWidth: '180px',
    display: 'block',
    color: '#aaa',
    fontFamily: 'sans-serif',
    fontSize: '1.2rem',
    marginTop: '10px',
    border: 'none',
  });
  div.innerHTML = text;
  return div;
};

/**
 * PostBody component.
 *
 * @returns {HTMLElement}
 */
const PostBody = (text) => {
  const ta = DOM.create('textarea', {
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
  ta.value = text;
  return ta;
};

/**
 * Post component.
 *
 * @returns {HTMLElement}
 */
const Post = (model = {}) => {
  const container = DOM.create('div', {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: '10px',
  });
  const title = PostTitle(model.title || 'test title');
  DOM.addChild(container, title);
  const date = PostDate(model.dateTime || '2020-20-20 20:20');
  DOM.addChild(container, date);
  const body = PostBody(model.components || 'blah blah blah');
  DOM.addChild(container, body);
  return body;
};

window.UIComponents = {
  RootContainer,
  SiteHeader,
  SiteTitle,
  SiteSocials,
  ContentContainer,
  LeftColumn,
  LeftColumnHeader,
  LeftColumnItem,
  CentralColumn,
  PostList,
  PostTitle,
  PostDate,
  PostBody,
  Post,
};
