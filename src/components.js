/** Colors used in components. */
const Colors = {
  lightGrey: '#0004',
  veryLightGrey: '#0002',
  leftColumnBackground: 'rgb(66, 66, 66)',
  centralColumnBackground: 'rgb(33, 33, 33)',
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
 * Fader component.
 *
 * @returns {HTMLElement}
 */
const Fader = () => {
  const div = DOM.create('div', {
    opacity: 0,
    transition: '0.3s',
  });
  setTimeout(() => (div.style.opacity = 1), 100);
  return div;
};

/**
 * SiteHeader component.
 *
 * @returns {HTMLElement}
 */
const SiteHeader = () => DOM.create('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  minHeight: '80px',
  padding: 15,
  cursor: 'default',
  borderBottom: '1px solid #111',
  backgroundColor: Colors.syntax.background,
  position: 'fixed',
});

/**
 * SiteTitleWord component.
 *
 * @returns {HTMLElement}
 */
const SiteTitleWord = (str, color, marginLeft = '10px') => {
  const el = DOM.create('h2', {
    display: 'block',
    color,
    fontFamily: 'monospace',
    fontSize: DOM.isNarrowScreen() ? '1rem' : '1.4rem',
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
 * @returns {HTMLElement}
 */
const SiteSocials = () => {
  const container = DOM.create('div', {
    display: 'flex',
    marginRight: '20px',
    justifyContent: 'flex-end',
    flex: DOM.isNarrowScreen() ? 'initial' : '1',
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
  flexWrap: 'wrap',
  width: '100%',
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
  flex: DOM.isNarrowScreen() ? '1' : '0 0 230px',
  justifyContent: 'start',
  padding: '0px 15px',
  borderRight: '1px solid #111',
});

/**
 * LeftColumnHeader component.
 *
 * @returns {HTMLElement}
 */
const LeftColumnHeader = (label, isTopSection = false) => {
  const span = DOM.create('span', {
    display: 'block',
    color: 'white',
    fontFamily: 'sans-serif',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginTop: '10px',
    paddingTop: isTopSection ? '10px' : '30px',
    cursor: 'default',
    borderTop: isTopSection ? 'none' : '1px solid #666',
  });
  span.innerHTML = label;
  return span;
};

/**
 * LeftColumnItem component.
 *
 * @returns {HTMLElement}
 */
const LeftColumnItem = ({ label, onClick = {}, fadeIn, getIsSelected = () => {} }) => {
  const a = DOM.create('a', {
    color: '#ccc',
    display: 'block',
    fontFamily: 'sans-serif',
    fontSize: '1.1rem',
    marginTop: '10px',
    cursor: 'pointer',
  }, {
    target: '_blank',
  });
  a.innerHTML = label;
  a.addEventListener('click', () => onClick());

  Events.subscribe('selectionUpdated', () => {
    const isSelected = getIsSelected();
    a.style.color = isSelected ? 'white' : '#ccc';
    a.style.fontWeight = isSelected ? 'bold' : 'initial';
  });

  const fader = Fader();
  DOM.addChild(fader, a);
  return fadeIn ? fader : a;
};

/**
 * CentralColumn component.
 *
 * @returns {HTMLElement}
 */
const CentralColumn = () => DOM.create('div', {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  minWidth: '700px',
  borderLeft: `1px solid ${Colors.lightGrey}`,
  paddingLeft: DOM.isNarrowScreen() ? '5px' : '20px',
  backgroundColor: Colors.centralColumnBackground,
  paddingTop: '80px',
});

/**
 * PostList component.
 *
 * @returns {HTMLElement}
 */
const PostList = () => DOM.create('div', {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: DOM.isNarrowScreen() ? '370px' : '800px',
  margin: DOM.isNarrowScreen() ? '0px 5px' : '0px 20px',
  padding: '10px',
  paddingBottom: '40px',
});

/**
 * PostTitle component.
 *
 * @returns {HTMLElement}
 */
const PostTitle = ({ title, fileName }) => {
  const container = DOM.create('div', {
    display: 'flex',
    alignItems: 'center',
  });
  const img = DOM.create('img', {
    width: '38px',
    height: '38px',
    marginRight: '5px',
    paddingTop: '3px',
  }, {
    src: 'assets/icons/bookmark-outline-grey.png',
  });
  DOM.addChild(container, img);
  const h1 = DOM.create('h1', {
    color: 'black',
    fontFamily: 'sans-serif',
    fontSize: DOM.isNarrowScreen() ? '1.2rem': '1.5rem',
    fontWeight: 'bold',
    marginTop: '10px',
    marginBottom: '5px',
    border: 'none',
    cursor: 'default',
  });
  h1.innerHTML = title;
  DOM.addChild(container, h1);

  const linkAnchor = DOM.create('span', {
    color: 'lightgrey',
    fontSize: '1.4rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginLeft: '10px',
    paddingTop: '6px',
  }, { className: 'link-anchor' });
  linkAnchor.addEventListener('click', () => {
    const slug = fileName.split('.')[0];
    window.showPost(slug);
    window.scrollTo(0, 0);
  });
  linkAnchor.innerHTML = '#';
  DOM.addChild(container, linkAnchor);

  return container;
};

/**
 * PostTag component.
 *
 * @returns {HTMLElement}
 */
const PostTag = (text) => {
  const container = DOM.create('div', {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#bbb',
    cursor: 'default',
    borderRadius: '20px',
    padding: '4px 8px',
    marginLeft: '5px',
  });
  const img = DOM.create('img', {
    width: '14px',
    height: '14px',
  }, { src: 'assets/icons/tag-outline.png' });
  DOM.addChild(container, img);
  const tagDiv = DOM.create('div', {
    color: 'white',
    fontFamily: 'sans-serif',
    fontSize: '0.8rem',
    marginLeft: '5px',
    paddingTop: '2px',
  });
  tagDiv.innerHTML = text;
  DOM.addChild(container, tagDiv);
  return container;;
};

/**
 * PostTagsList component.
 *
 * @returns {HTMLElement}
 */
const PostTagsList = (tags) => {
  const container = DOM.create('div', {
    display: 'flex',
    marginLeft: '10px',
  });
  tags.forEach(tag => DOM.addChild(container, PostTag(tag)));
  return container;
};

/**
 * PostDateAndTags component.
 *
 * @returns {HTMLElement}
 */
const PostDateAndTags = ({ dateTime, tags }) => {
  const container = DOM.create('div', {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  });
  const dateDiv = DOM.create('div', {
    color: '#999',
    fontFamily: 'sans-serif',
    fontSize: '1rem',
    marginLeft: '44px',
    cursor: 'default',
    paddingTop: '3px',
  });
  const [date] = dateTime.split(' ');
  dateDiv.innerHTML = `Posted ${date}`;
  DOM.addChild(container, dateDiv);

  const tagList = PostTagsList(tags);
  DOM.addChild(container, tagList);
  return container;
};

/**
 * PostBody component.
 *
 * @returns {HTMLElement}
 */
const PostBody = (children) => {
  const div = DOM.create('div', {
    display: 'block',
    color: 'black',
    fontFamily: 'sans-serif',
    fontSize: '1rem',
    marginTop: '10px',
    marginLeft: DOM.isNarrowScreen() ? '10px' : '39px',
    padding: DOM.isNarrowScreen() ? '0px' : '5px',
    paddingRight: DOM.isNarrowScreen() ? '5px' : '35px',
    border: 'none',
    outline: 'none',
    backgroundColor: '#0000',
  }, {
    disabled: 'true',
  });
  children.forEach(child => DOM.addChild(div, child));
  return div;
};

/**
 * PostImage component.
 *
 * @returns {HTMLElement}
 */
const PostImage = ({ src }) => {
  const container = DOM.create('div', {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: '30px 0px',
  });
  const img = DOM.create('img', {
    maxWidth: '90%',
    height: 'auto',
    maxHeight: '600px',
    borderRadius: '5px',
    overflow: 'hidden',
  }, { src });
  DOM.addChild(container, img);
  return container;
};

/**
 * PostHeader component.
 *
 * @returns {HTMLElement}
 */
const PostHeader = ({ level, text }) => {
  const h = DOM.create(`h${level}`, {
    color: 'black',
    fontSize: '1.4rem',
    marginTop: '25px',
    marginBottom: '5px',
  });
  h.innerHTML = text;
  return h;
};

/**
 * PostParagraph component.
 *
 * @returns {HTMLElement}
 */
const PostParagraph = ({ text }) => {
  const h = DOM.create('p', {
    color: '#222',
    fontSize: '1rem',
    marginTop: '8px',
    lineHeight: '1.2',
  });
  h.innerHTML = text;
  return h;
};

/**
 * Generate the list of post components based on the model generated from Markdown.
 *
 * @param {Object[]} components - List of models to convert.
 * @returns {Object[]} List of HTMLElements for display.
 */
const generatePostComponents = (components) => components.map((component) => {
  switch (component.type) {
    case 'image': return PostImage(component);
    case 'header': return PostHeader(component);
    case 'paragraph': return PostParagraph(component);
  }
});

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
    borderRadius: '5px',
    overflow: 'hidden',
    padding: DOM.isNarrowScreen () ? '5px' : '15px',
    marginTop: '15px',
  });
  const title = PostTitle(model);
  DOM.addChild(container, title);
  const date = PostDateAndTags(model);
  DOM.addChild(container, date);
  const body = PostBody(generatePostComponents(model.components));
  DOM.addChild(container, body);

  const fader = Fader();
  DOM.addChild(fader, container);
  return fader;
};

window.Components = {
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
  PostDateAndTags,
  PostBody,
  Post,
};
