/** Colors used in components. */
const Colors = {
  lightGrey: '#0004',
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
const RootContainer = () =>
  DOM.create('div', {
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
const Fader = (children) => {
  const div = DOM.create('div', {
    opacity: 0,
    transition: '0.3s',
  }, {}, children);
  setTimeout(() => (div.style.opacity = 1), 100);
  return div;
};

/**
 * SiteHeader component.
 *
 * @returns {HTMLElement}
 */
const SiteHeader = () =>
  DOM.create('div', {
    display: 'flex',
    flexDirection: 'row',
    width: '100vw',
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
const SiteTitleWord = ({ text, color, marginLeft = '10px' }) =>
  DOM.create('h2', {
    display: 'block',
    color,
    fontFamily: 'monospace',
    fontSize: DOM.isNarrowScreen() ? '1.1rem' : '1.4rem',
    marginLeft,
    marginTop: '0px',
    marginBottom: '0px',
  }, {}, [text]);

/**
 * SiteTitle component.
 *
 * @returns {HTMLElement}
 */
const SiteTitle = () =>
  DOM.create('div', {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }, {}, [
    SiteTitleWord({
      text: '// A blog by Chris Lewis',
      color: Colors.syntax.comment,
      marginLeft: '18px',
    }),
    DOM.create('div', { display: 'flex', marginLeft: '8px'}, {}, [
      SiteTitleWord({ text: 'try', color: Colors.syntax.keyword }),
      SiteTitleWord({ text: '{', color: Colors.syntax.comment }),
      SiteTitleWord({ text: 'work', color: Colors.syntax.function }),
      SiteTitleWord({ text: '();', color: Colors.syntax.comment, marginLeft: '0px' }),
      SiteTitleWord({ text: '}', color: Colors.syntax.comment }),
      SiteTitleWord({ text: 'finally', color: Colors.syntax.keyword }),
      SiteTitleWord({ text: '{', color: Colors.syntax.comment }),
      SiteTitleWord({ text: 'code', color: Colors.syntax.function }),
      SiteTitleWord({ text: '();', color: Colors.syntax.comment, marginLeft: '0px' }),
      SiteTitleWord({ text: '}', color: Colors.syntax.comment }),
    ]),
  ]);

/**
 * ContentContainer component.
 *
 * @returns {HTMLElement}
 */
const ContentContainer = () =>
  DOM.create('div', {
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
const LeftColumn = () =>
  DOM.create('div', {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: Colors.leftColumnBackground,
    flex: DOM.isNarrowScreen() ? '1' : '0 0 240px',
    justifyContent: 'start',
    padding: '90px 15px 0px 15px',
    borderRight: '1px solid #111',
  });

/**
 * LeftColumnHeader component.
 *
 * @returns {HTMLElement}
 */
const LeftColumnHeader = ({ text, isTopSection = false }) =>
  DOM.create('span', {
    display: 'block',
    color: 'white',
    fontFamily: 'sans-serif',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginTop: '10px',
    paddingTop: isTopSection ? '10px' : '30px',
    cursor: 'default',
    borderTop: isTopSection ? 'none' : '1px solid #666',
  }, {}, [text]);

/**
 * LeftColumnItem component.
 *
 * @returns {HTMLElement}
 */
const LeftColumnItem = ({ text, onClick = {}, fadeIn, getIsSelected = () => {} }) => {
  const a = DOM.create('a', {
    color: '#ccc',
    display: 'block',
    fontFamily: 'sans-serif',
    fontSize: '1.1rem',
    marginTop: '10px',
    cursor: 'pointer',
  }, {
    target: '_blank',
  }, [text]);
  a.addEventListener('click', () => {
    onClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  Events.subscribe('selectionUpdated', () => {
    const isSelected = getIsSelected();
    a.style.color = isSelected ? 'white' : '#ccc';
    a.style.fontWeight = isSelected ? 'bold' : 'initial';
  });

  const fader = Fader([a]);
  return fadeIn ? fader : a;
};

/**
 * CentralColumn component.
 *
 * @returns {HTMLElement}
 */
const CentralColumn = () =>
  DOM.create('div', {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    minWidth: DOM.isNarrowScreen() ? '400px' : '700px',
    borderLeft: `1px solid ${Colors.lightGrey}`,
    paddingLeft: DOM.isNarrowScreen() ? '5px' : '20px',
    backgroundColor: Colors.centralColumnBackground,
    paddingTop: '90px',
  });

/**
 * SocialPill component.
 *
 * @returns {HTMLElement}
 */
const SocialPill = ({ icon, text, backgroundColor, href }) =>
  DOM.create('a', {
    display: 'flex',
    padding: '5px 10px',
    borderRadius: '55px',
    margin: '5px',
    backgroundColor,
    alignItems: 'center',
    textDecoration: 'none',
    height: '25px',
  }, {
    href,
    target: '_blank',
  }, [
    DOM.create('img', {
      display: 'block',
      width: '24px',
      height: '24px',
      marginRight: '5px',
    }, {
      src: `./assets/icons/${icon}`,
    }),
    DOM.create('span', {
      color: 'white',
      fontFamily: 'sans-serif',
      paddingTop: '2px',
      fontSize: '0.9rem',
    }, {}, [text]),
  ]);

/**
 * SiteSocials component.
 *
 * @returns {HTMLElement}
 */
const SiteSocials = () =>
  DOM.create('div', {
    display: 'flex',
    flex: DOM.isNarrowScreen() ? 'initial' : '1',
    marginRight: '20px',
    justifyContent: DOM.isNarrowScreen() ? 'center' : 'flex-end',
    alignItems: 'center',
  }, {}, [
    SocialPill({
      icon: 'rss.png',
      text: 'RSS',
      backgroundColor: 'rgb(247, 171, 24)',
      href: '/feed/rss.xml',
    }),
    SocialPill({
      icon: 'github.png',
      text: 'C-D-Lewis',
      backgroundColor: 'black',
      href: 'https://github.com/C-D-Lewis'
    }),
    SocialPill({
      icon: 'twitter.png',
      text: 'Chris_DL',
      backgroundColor: 'rgb(29, 142, 238)',
      href: 'https://twitter.com/Chris_DL'
    }),
  ]);

/**
 * PostList component.
 *
 * @returns {HTMLElement}
 */
const PostList = () =>
  DOM.create('div', {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: DOM.isNarrowScreen() ? '370px' : '800px',
    margin: DOM.isNarrowScreen() ? '0px 5px' : '0px 20px',
    padding: '0px 10px 40px 10px',
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
  }, {}, [
    DOM.create('img', {
      width: '38px',
      height: '38px',
      marginRight: '5px',
      paddingTop: '3px',
    }, {
      src: 'assets/icons/bookmark-outline-grey.png',
    }),
    DOM.create('h1', {
      color: 'black',
      fontFamily: 'sans-serif',
      fontSize: DOM.isNarrowScreen() ? '1.2rem': '1.5rem',
      fontWeight: 'bold',
      marginTop: '10px',
      marginBottom: '5px',
      border: 'none',
      cursor: 'default',
    }, {}, [title]),
  ]);
  const linkAnchor = DOM.create('span', {
    color: 'lightgrey',
    fontSize: '1.4rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginLeft: '10px',
    paddingTop: '6px',
  }, { className: 'link-anchor' }, ['#']);
  linkAnchor.addEventListener('click', () => {
    window.showSinglePost(fileName.split('.')[0]);
    window.scrollTo(0, 0);
  });
  DOM.addChild(container, linkAnchor);
  return container;
};

/**
 * PostTagPill component.
 *
 * @returns {HTMLElement}
 */
const PostTagPill = ({ text }) => {
  const div = DOM.create('div', {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Colors.syntax.function,
    cursor: 'pointer',
    borderRadius: '20px',
    padding: '4px 8px',
    margin: '2px',
  }, { className: 'post-tag' }, [
    DOM.create('img', {
      width: '14px',
      height: '14px',
    }, { src: 'assets/icons/tag-outline.png' }),
    DOM.create('div', {
      color: 'white',
      fontFamily: 'sans-serif',
      fontSize: '0.8rem',
      marginLeft: '2px',
      paddingTop: '2px',
    }, {}, [text]),
  ]);

  div.addEventListener('click', () => window.showTagPosts(text));
  return div;
};

/**
 * PostTagsList component.
 *
 * @returns {HTMLElement}
 */
const PostTagsList = ({ tags }) =>
  DOM.create('div', {
    display: 'flex',
    marginLeft: '10px'
  }, {}, [...tags.map(tag => PostTagPill({ text: tag }))]);

/**
 * PostDateAndTags component.
 *
 * @returns {HTMLElement}
 */
const PostDateAndTags = ({ dateTime, tags }) =>
  DOM.create('div', {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  }, {}, [
    DOM.create('div', {
      color: '#999',
      fontFamily: 'sans-serif',
      fontSize: '1rem',
      marginLeft: '44px',
      cursor: 'default',
      paddingTop: '3px',
    }, {}, [`Posted ${dateTime.split(' ')[0]}`]),
    PostTagsList({ tags }),
  ]);

/**
 * PostBody component.
 *
 * @returns {HTMLElement}
 */
const PostBody = (children) =>
  DOM.create('div', {
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
  }, children);

/**
 * PostImage component.
 *
 * @returns {HTMLElement}
 */
const PostImage = ({ src }) =>
  DOM.create('div', {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: '30px 0px',
  }, {}, [
    DOM.create('img', {
      maxWidth: '90%',
      height: 'auto',
      maxHeight: '600px',
      borderRadius: '5px',
      overflow: 'hidden',
    }, { src }),
  ]);

/**
 * PostHeader component.
 *
 * @returns {HTMLElement}
 */
const PostHeader = ({ level, text }) =>
  DOM.create(`h${level}`, {
    color: 'black',
    fontSize: '1.4rem',
    marginTop: '25px',
    marginBottom: '5px',
  }, {}, [text]);

/**
 * PostParagraph component.
 *
 * @returns {HTMLElement}
 */
const PostParagraph = ({ text }) =>
  DOM.create('p', {
    color: '#222',
    fontSize: '1rem',
    marginTop: '8px',
    lineHeight: '1.2',
  }, {}, [text]);

/**
 * Generate the list of post components based on the model generated from Markdown.
 *
 * @param {Object[]} components - List of models to convert.
 * @returns {Object[]} List of HTMLElements for display.
 */
const createPostComponents = components =>
  components.map((component) => {
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
const Post = ({ model }) =>
  Fader([
    DOM.create('div', {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      borderRadius: '5px',
      overflow: 'hidden',
      padding: DOM.isNarrowScreen () ? '5px' : '15px',
      marginTop: '15px',
    }, {}, [
      PostTitle(model),
      PostDateAndTags(model),
      PostBody(createPostComponents(model.components)),
    ])
  ]);

const TagCloud = ({ tags }) =>
  DOM.create('div', {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: '5px',
  }, {}, [...tags.map(tag => PostTagPill({ text: tag }))]);

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
  Post,
  TagCloud,
};
