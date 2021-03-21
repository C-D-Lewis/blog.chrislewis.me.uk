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

const MAX_WIDTH_DESKTOP = '800px';
const MAX_WIDTH_MOBILE = '400px';
const BOX_SHADOW_MATERIAL = '2px 2px 3px 1px #5555';

// Lazy load images since some tags are very large
const imgObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      entry.target.src = entry.target.dataset.src;
      imgObserver.unobserve(entry.target);
    }
  });
}, {
  rootMargin: '100px',
  threshold: 1.0,
});

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
    zIndex: 999,
  });

/**
 * SiteTitleWord component.
 *
 * @returns {HTMLElement}
 */
const SiteTitleWord = ({ text, color, marginLeft = '8px' }) =>
  DOM.create('h2', {
    display: 'block',
    color,
    fontFamily: 'monospace',
    fontSize: DOM.isMobile() ? '1.1rem' : '1.4rem',
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
    flex: DOM.isMobile() ? '1' : '0 0 240px',
    justifyContent: 'start',
    padding: `${DOM.isMobile() ? '15px' : '90px'} 15px 0px 15px`,
    borderRight: '1px solid #111',
  });

/**
 * LeftColumnHeader component.
 *
 * @returns {HTMLElement}
 */
const LeftColumnHeader = ({ text, isTopSection = false, isCenterSection = false }) =>
  DOM.create('span', {
    display: 'block',
    color: 'white',
    fontFamily: 'sans-serif',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginTop: '10px',
    paddingTop: isTopSection ? '10px' : '30px',
    cursor: 'default',
    textAlign: isCenterSection ? 'center' : 'initial',
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
    a.style.color = isSelected ? Colors.syntax.function : '#ccc';
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
    flexDirection: DOM.isMobile() ? 'column' : 'row',
    // justifyContent: DOM.isMobile() ? 'initial' : 'center',
    minWidth: DOM.isMobile() ? MAX_WIDTH_MOBILE : MAX_WIDTH_DESKTOP,
    borderLeft: DOM.isMobile() ? 'initial' : `1px solid ${Colors.lightGrey}`,
    paddingLeft: DOM.isMobile() ? '0px' : '20px',
    backgroundColor: Colors.centralColumnBackground,
    paddingTop: '90px',
  });

/**
 * SocialPill component.
 *
 * @returns {HTMLElement}
 */
const SocialPill = ({ icon, text, backgroundColor, href }) => {
  const img = DOM.create('img', {
    display: 'block',
    width: '24px',
    height: '24px',
  }, {
    src: `./assets/icons/${icon}`,
  });
  const span = DOM.create('span', {
    color: 'white',
    fontFamily: 'sans-serif',
    paddingTop: '2px',
    fontSize: '0.9rem',
    marginLeft: '5px',
    display: 'none',
  }, {}, [text]);
  const a = DOM.create('a', {
    display: 'flex',
    padding: '5px 10px',
    borderRadius: '55px',
    margin: '5px',
    backgroundColor,
    alignItems: 'center',
    textDecoration: 'none',
    minHeight: '25px',
  }, {
    href,
    target: '_blank',
  }, [img, span]);

  DOM.onHover(a, (isHovered) => {
    span.style.display = isHovered ? 'initial' : 'none';
  });
  return a;
};

/**
 * SiteSocials component.
 *
 * @returns {HTMLElement}
 */
const SiteSocials = () =>
  DOM.create('div', {
    display: 'flex',
    flex: DOM.isMobile() ? 'initial' : '1',
    marginRight: '20px',
    justifyContent: DOM.isMobile() ? 'center' : 'flex-end',
    alignItems: 'center',
  }, {}, [
    SocialPill({
      icon: 'github.png',
      text: 'GitHub',
      backgroundColor: 'black',
      href: 'https://github.com/C-D-Lewis'
    }),
    SocialPill({
      icon: 'twitter.png',
      text: 'Twitter',
      backgroundColor: 'rgb(29, 142, 238)',
      href: 'https://twitter.com/Chris_DL'
    }),
    SocialPill({
      icon: 'linkedin.png',
      text: 'LinkedIn',
      backgroundColor: 'rgb(2, 76, 184)',
      href: 'https://www.linkedin.com/in/chris-lewis-030503117',
    }),
    SocialPill({
      icon: 'rss.png',
      text: 'RSS',
      backgroundColor: 'rgb(247, 171, 24)',
      href: '/feed/rss.xml',
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
    maxWidth: DOM.isMobile() ? 'initial' : MAX_WIDTH_DESKTOP,
    margin: DOM.isMobile() ? '0px 0px' : '0px 20px',
    padding: DOM.isMobile() ? '0px 0px 40px 0px' : '0px 10px 40px 10px',
  });

/**
 * PostTitle component.
 *
 * @returns {HTMLElement}
 */
const PostTitle = ({ title, fileName }) => {
  const img = DOM.create('img', {
    width: '38px',
    height: '38px',
    marginRight: '5px',
    paddingTop: '3px',
    transform: 'rotateZ(90deg)',
    transition: '0.4s',
  }, {
    src: 'assets/icons/chevron-right.png',
  });

  let expanded = true;
  img.addEventListener('click', () => {
    expanded = !expanded;
    img.style.transform = expanded ? 'rotateZ(90deg)' : 'initial';

    Events.post('postExpanded', { fileName, expanded });
  });

  const container = DOM.create('div', {
    display: 'flex',
    alignItems: 'center',
  }, {}, [
    img,
    DOM.create('h1', {
      color: 'black',
      fontFamily: 'sans-serif',
      fontSize: DOM.isMobile() ? '1.2rem': '1.5rem',
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
  }, {}, ['#']);
  DOM.onHover(linkAnchor, (isHovered) => {
    linkAnchor.style.color = isHovered ? '#444' : 'lightgrey';
  });
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
const PostTagPill = ({ tag, quantity }) => {
  const div = DOM.create('div', {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Colors.syntax.function,
    cursor: 'pointer',
    borderRadius: '20px',
    padding: '4px 8px',
    margin: '2px',
  }, {}, [
    DOM.create('img', {
      width: '14px',
      height: '14px',
    }, { src: 'assets/icons/tag-outline.png' }),
    DOM.create('div', {
      color: 'white',
      fontFamily: 'sans-serif',
      fontSize: '0.8rem',
      marginLeft: '2px',
    }, {}, [quantity ? `${tag} (${quantity})` : tag]),
  ]);

  DOM.onHover(div, (isHovered) => {
    div.style.filter = `brightness(${isHovered ? '0.8' : '1'})`;
  });
  div.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.showTagPosts(tag);
  });
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
    marginLeft: '10px',
    flexWrap: 'wrap',
  }, {}, [...tags.map(tag => PostTagPill({ tag }))]);

/**
 * PostDateAndTags component.
 *
 * @returns {HTMLElement}
 */
const PostDateAndTags = ({ dateTime, tags }) =>
  DOM.create('div', {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '10px',
  }, {}, [
    DOM.create('div', {
      color: '#999',
      fontFamily: 'sans-serif',
      fontSize: '1rem',
      marginLeft: '44px',
      cursor: 'default',
      paddingTop: '3px',
    }, {}, [DOM.isMobile() ? dateTime.split(' ')[0] : `Posted ${dateTime.split(' ')[0]}`]),
    PostTagsList({ tags }),
  ]);

/**
 * PostBody component.
 *
 * @returns {HTMLElement}
 */
const PostBody = (model) => {
  const bodyDiv = DOM.create('div', {
    display: 'block',
    color: 'black',
    fontFamily: 'sans-serif',
    fontSize: '1rem',
    marginTop: '10px',
    marginLeft: DOM.isMobile() ? '10px' : '39px',
    padding: DOM.isMobile() ? '0px' : '5px',
    paddingRight: DOM.isMobile() ? '5px' : '35px',
    backgroundColor: '#0000',
  }, {}, createPostComponents(model.components));

  Events.subscribe('postExpanded', ({ fileName, expanded }) => {
    if (fileName !== model.fileName) return;

    bodyDiv.style.display = expanded ? 'initial' : 'none';
  });

  return bodyDiv;
};

/**
 * PostImage component.
 *
 * @returns {HTMLElement}
 */
const PostImage = ({ src }) => {
  const img = DOM.create('img', {
    maxWidth: '90%',
    height: 'auto',
    maxHeight: '600px',
    borderRadius: '5px',
    overflow: 'hidden',
    boxShadow: BOX_SHADOW_MATERIAL,
  });
  img.dataset.src = src;

  imgObserver.observe(img);

  return (
    DOM.create('div', {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      margin: '30px 0px',
      cursor: 'pointer',
    }, {
      onclick: () => window.open(src, '_blank'),
    }, [img])
  );
};

/**
 * PostHeader component.
 *
 * @returns {HTMLElement}
 */
const PostHeader = ({ level, text }) =>
  DOM.create(`h${level}`, {
    color: 'black',
    fontSize: '1.4rem',
    marginTop: '35px',
    marginBottom: '10px',
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
 * PostHtml component.
 *
 * @returns {HTMLElement}
 */
const PostHtml = ({ html }) =>
  DOM.create('div', {}, {}, [html]);

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
      case 'html': return PostHtml(component);
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
      padding: DOM.isMobile () ? '5px' : '15px',
      margin: '25px 0px',
      minWidth: DOM.isMobile() ? MAX_WIDTH_MOBILE : MAX_WIDTH_DESKTOP,
      boxShadow: BOX_SHADOW_MATERIAL,
    }, {}, [
      PostTitle(model),
      PostDateAndTags(model),
      PostBody(model),
    ])
  ]);

/**
 * Create a tag with its number of posts.
 *
 * @param {string} tag - Tag name.
 * @returns {HTMLElement}
 */
const toTag = tag => PostTagPill({ tag, quantity: window.tagIndex[tag].length });

/**
 * TagCloud component.
 *
 * @returns {HTMLElement}
 */
const TagCloud = ({ tags }) => {
  const tagPills = tags
    .sort((a, b) => window.tagIndex[a].length > window.tagIndex[b].length ? -1 : 1)
    .map(toTag);

  return (
    DOM.create('div', {
      display: 'flex',
      flexWrap: 'wrap',
      paddingTop: '10px',
    }, {}, [...tagPills])
  );
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
  Post,
  TagCloud,
};
