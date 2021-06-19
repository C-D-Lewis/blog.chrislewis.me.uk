/** Colors used in components. */
const Theme = {
  lightGrey: '#0004',
  leftColumnBackground: '#333',
  centralColumnBackground: 'rgb(33, 33, 33)',
  syntax: {
    background: 'rgb(26, 26, 26)',
    keyword: 'rgb(236 64 135)',
    function: 'rgb(100, 204, 118)',
    comment: 'rgb(120 117 125)',
  }
};

const MAX_WIDTH_DESKTOP = '790px';
const MAX_WIDTH_MOBILE = '390px';
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
 * Smooth scroll to top of page.
 */
const goToTop = () => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);

/**
 * RootContainer component.
 *
 * @returns {HTMLElement}
 */
const RootContainer = () =>
  DOM.create(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
    }
  );

/**
 * Fader component.
 *
 * @returns {HTMLElement}
 */
const Fader = (children) => {
  const div = DOM.create(
    'div',
    {
      opacity: 0,
      transition: '0.3s',
    },
    {},
    children
  );
  setTimeout(() => (div.style.opacity = 1), 100);
  return div;
};

/**
 * SiteHeader component.
 *
 * @returns {HTMLElement}
 */
const SiteHeader = () =>
  DOM.create(
    'div',
    {
      display: 'flex',
      flexDirection: 'row',
      width: '100vw',
      minHeight: '80px',
      padding: 15,
      cursor: 'default',
      borderBottom: '1px solid #111',
      backgroundColor: Theme.syntax.background,
      position: 'fixed',
      zIndex: 999,
    }
  );

/**
 * SiteTitleWord component.
 *
 * @returns {HTMLElement}
 */
const SiteTitleWord = ({ text, color, marginLeft = '8px' }) =>
  DOM.create(
    'h2',
    {
      display: 'block',
      color,
      fontFamily: 'monospace',
      fontSize: DOM.isMobile() ? '1.1rem' : '1.4rem',
      marginLeft,
      marginTop: '0px',
      marginBottom: '0px',
    },
    {},
    [text]
  );

/**
 * SiteTitle component.
 *
 * @returns {HTMLElement}
 */
const SiteTitle = () => {
  const siteMainTitle = DOM.create(
    'div',
    {
      display: 'flex',
      marginLeft: '8px',
    },
    {},
    [
      SiteTitleWord({ text: 'try', color: Theme.syntax.keyword }),
      SiteTitleWord({ text: '{', color: Theme.syntax.comment }),
      SiteTitleWord({ text: 'work', color: Theme.syntax.function }),
      SiteTitleWord({ text: '();', color: Theme.syntax.comment, marginLeft: '0px' }),
      SiteTitleWord({ text: '}', color: Theme.syntax.comment }),
      SiteTitleWord({ text: 'finally', color: Theme.syntax.keyword }),
      SiteTitleWord({ text: '{', color: Theme.syntax.comment }),
      SiteTitleWord({ text: 'code', color: Theme.syntax.function }),
      SiteTitleWord({ text: '();', color: Theme.syntax.comment, marginLeft: '0px' }),
      SiteTitleWord({ text: '}', color: Theme.syntax.comment }),
    ]
  );

  const titleWrapper = DOM.create(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      cursor: 'pointer',
    },
    {},
    [
      SiteTitleWord({
        text: '// A blog by Chris Lewis',
        color: Theme.syntax.comment,
        marginLeft: '18px',
      }),
      siteMainTitle,
    ]
  );

  titleWrapper.addEventListener('click', () => {
    window.location.href = '/';
  });
  DOM.onHover(titleWrapper, (isHovered) => {
    titleWrapper.style.filter = `brightness(${isHovered ? '1.2' : '1'})`;
  });

  return titleWrapper;
};

/**
 * ContentContainer component.
 *
 * @returns {HTMLElement}
 */
const ContentContainer = () =>
  DOM.create(
    'div',
    {
      display: 'flex',
      flexDirection: DOM.isMobile() ? 'column' : 'row',
      flexWrap: 'wrap',
      width: '100%',
      margin: 0,
      padding: 0,
    }
  );

/**
 * LeftColumn component.
 *
 * @returns {HTMLElement}
 */
const LeftColumn = () =>
  DOM.create(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: Theme.leftColumnBackground,
      flex: DOM.isMobile() ? '1' : '0 0 265px',
      justifyContent: 'start',
      padding: `${DOM.isMobile() ? '15px' : '90px'} 15px 0px 15px`,
      borderRight: '1px solid #111',
    }
  );

/**
 * LeftColumnHeader component.
 *
 * @returns {HTMLElement}
 */
const LeftColumnHeader = ({ text, isTopSection = false, isCenterSection = false }) =>
  DOM.create(
    'span',
    {
      display: 'block',
      color: 'white',
      fontFamily: 'sans-serif',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginTop: '10px',
      paddingTop: isTopSection ? '10px' : '15px',
      cursor: 'default',
      textAlign: isCenterSection ? 'center' : 'initial',
    },
    {},
    [text]
  );

/**
 * LeftColumnItem component.
 *
 * @returns {HTMLElement}
 */
const LeftColumnItem = ({ text, onClick = {}, getIsSelected = () => {} }) => {
  const anchor = DOM.create(
    'a',
    {
      color: '#ccc',
      display: 'block',
      fontFamily: 'sans-serif',
      fontSize: '1.1rem',
      marginTop: '10px',
      cursor: 'pointer',
    },
    {
      target: '_blank',
    },
    [text]
  );

  anchor.addEventListener('click', () => {
    goToTop();
    onClick();
  });

  Events.subscribe('selectionUpdated', () => {
    const isSelected = getIsSelected();

    anchor.style.color = isSelected ? Theme.syntax.function : '#ccc';
    anchor.style.fontWeight = isSelected ? 'bold' : 'initial';
  });

  return anchor;
};

/**
 * CentralColumn component.
 *
 * @returns {HTMLElement}
 */
const CentralColumn = () =>
  DOM.create(
    'div',
    {
      display: 'flex',
      flexDirection: DOM.isMobile() ? 'column' : 'row',
      flex: '1',
      minWidth: DOM.isMobile() ? MAX_WIDTH_MOBILE : MAX_WIDTH_DESKTOP,
      maxWidth: '100vw',
      paddingLeft: DOM.isMobile() ? '0px' : '20px',
      backgroundColor: Theme.centralColumnBackground,
      paddingTop: '90px',

      // Center on page
      position: DOM.isMobile() ? 'initial' : 'absolute',
      left: DOM.isMobile() ? 'initial' : '25%',
      margin: 'auto',
    }
  );

/**
 * SocialPill component.
 *
 * @returns {HTMLElement}
 */
const SocialPill = ({ icon, text, backgroundColor, href, maxWidth }) => {
  const img = DOM.create(
    'img',
    {
      display: 'block',
      width: '24px',
      height: '24px',
    },
    {
      src: `./assets/icons/${icon}`,
    }
  );

  const label = DOM.create(
    'span',
    {
      color: 'white',
      fontFamily: 'sans-serif',
      paddingTop: '2px',
      fontSize: '0.9rem',
      marginLeft: '5px',
      display: 'none',
      fontWeight: 'bold',
    },
    {},
    [text]
  );

  const anchor = DOM.create(
    'a',
    {
      display: 'flex',
      padding: '5px 10px',
      width: '24px',
      borderRadius: '55px',
      margin: '5px',
      backgroundColor,
      alignItems: 'center',
      textDecoration: 'none',
      minHeight: '25px',
      transition: '0.3s',
      overflow: 'hidden',
    },
    {
      href,
      target: '_blank',
    },
    [
      img,
      label
    ]
  );

  DOM.onHover(anchor, (isHovered) => {
    label.style.display = isHovered ? 'initial' : 'none';
    anchor.style.width = isHovered ? `${maxWidth}px` : '24px';
  });

  return anchor;
};

/**
 * SiteSocials component.
 *
 * @returns {HTMLElement}
 */
const SiteSocials = () =>
  DOM.create(
    'div',
    {
      display: 'flex',
      flex: DOM.isMobile() ? 'initial' : '1',
      marginRight: '20px',
      justifyContent: DOM.isMobile() ? 'center' : 'flex-end',
      alignItems: 'center',
    },
    {},
    [
      SocialPill({
        icon: 'github.png',
        text: 'GitHub',
        backgroundColor: 'black',
        href: 'https://github.com/C-D-Lewis',
        maxWidth: 80,
      }),
      SocialPill({
        icon: 'twitter.png',
        text: 'Twitter',
        backgroundColor: 'rgb(29, 142, 238)',
        href: 'https://twitter.com/Chris_DL',
        maxWidth: 80,
      }),
      SocialPill({
        icon: 'linkedin.png',
        text: 'LinkedIn',
        backgroundColor: 'rgb(2, 76, 184)',
        href: 'https://www.linkedin.com/in/chris-lewis-030503117',
        maxWidth: 90,
      }),
      SocialPill({
        icon: 'rss.png',
        text: 'RSS',
        backgroundColor: 'rgb(247, 171, 24)',
        href: '/feed/rss.xml',
        maxWidth: 60,
      }),
    ]
  );

/**
 * PostList component.
 *
 * @returns {HTMLElement}
 */
const PostList = () =>
  DOM.create(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: DOM.isMobile() ? 'initial' : MAX_WIDTH_DESKTOP,
      margin: DOM.isMobile() ? '0px 0px' : '0px 20px',
      padding: DOM.isMobile() ? '0px 0px 40px 0px' : '0px 10px 40px 10px',
    }
  );

/**
 * PostTitle component.
 *
 * @returns {HTMLElement}
 */
const PostTitle = ({ model, startExpanded = true }) => {
  const { title, fileName } = model;

  const icon = DOM.create(
    'img',
    {
      width: '38px',
      height: '38px',
      marginRight: '5px',
      paddingTop: '3px',
      transform: startExpanded ? 'rotateZ(90deg)' : 'initial',
      transition: '0.4s',
      cursor: 'pointer',
    },
    {
      src: 'assets/icons/chevron-right.png',
    }
  );

  // Click to toggle expanded state
  let expanded = startExpanded;
  icon.addEventListener('click', () => {
    expanded = !expanded;
    icon.style.transform = expanded ? 'rotateZ(90deg)' : 'initial';

    // Notify the body component
    Events.post('postExpanded', { fileName, expanded });
  });

  const h1 = DOM.create(
    'h1',
    {
      color: 'black',
      fontFamily: 'sans-serif',
      fontSize: DOM.isMobile() ? '1.2rem': '1.5rem',
      fontWeight: 'bold',
      marginTop: '10px',
      marginBottom: '5px',
      border: 'none',
      cursor: 'default',
    },
    {},
    [title]
  );

  const container = DOM.create(
    'div',
    {
      display: 'flex',
      alignItems: 'center',
    },
    {},
    [icon, h1]
  );

  const linkAnchor = DOM.create(
    'span',
    {
      color: 'lightgrey',
      fontSize: '1.4rem',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginLeft: '10px',
      paddingTop: '6px',
    },
    {},
    ['#']
  );

  DOM.onHover(linkAnchor, (isHovered) => {
    linkAnchor.style.color = isHovered ? '#444' : 'lightgrey';
  });

  linkAnchor.addEventListener('click', () => {
    window.showSinglePost(fileName.split('.')[0]);
    goToTop();
  });

  DOM.addChild(h1, linkAnchor);

  return container;
};

/**
 * PostTagPill component.
 *
 * @returns {HTMLElement}
 */
const PostTagPill = ({ tag, quantity }) => {
  const img = DOM.create(
    'img',
    {
      width: '14px',
      height: '14px',
    },
    {
      src: 'assets/icons/tag-outline.png',
    }
  );

  const label = DOM.create(
    'span',
    {
      color: 'white',
      fontFamily: 'sans-serif',
      fontSize: '0.8rem',
      marginLeft: '2px',
      marginTop: '2px',
    },
    {},
    [quantity ? `${tag} (${quantity})` : tag]
  );

  const container = DOM.create(
    'div',
    {
      display: 'flex',
      alignItems: 'center',
      border: `solid 2px ${Theme.syntax.function}`,
      backgroundColor: quantity ? 'none' : Theme.syntax.function,
      cursor: 'pointer',
      borderRadius: '20px',
      padding: '4px 8px',
      margin: '2px',
    },
    {},
    [
      img,
      label,
    ]
  );

  DOM.onHover(container, (isHovered) => {
    if (quantity) {
      container.style.background = isHovered ? Theme.syntax.function : 'none';
    } else {
      container.style.filter = `brightness(${isHovered ? '1.1' : '1'})`;
    }
  });

  container.addEventListener('click', () => {
    window.showTagPosts(tag);
    goToTop();
  });

  return container;
};

/**
 * PostTagsList component.
 *
 * @returns {HTMLElement}
 */
const PostTagsList = ({ tags }) =>
  DOM.create(
    'div',
    {
      display: 'flex',
      flexDirection: 'row',
      marginLeft: DOM.isMobile() ? '40px': '10px',
      marginTop: DOM.isMobile() ? '10px' : 'initial',
      flexWrap: 'wrap',
    },
    {},
    tags.map(tag => PostTagPill({ tag }))
  );

/**
 * PostDateAndTags component.
 *
 * @returns {HTMLElement}
 */
const PostDateAndTags = ({ dateTime, tags }) => {
  const [date] = dateTime.split(' ');

  const dateSpan = DOM.create(
    'span',
    {
      color: '#777',
      fontFamily: 'sans-serif',
      fontSize: '1rem',
      marginLeft: '42px',
      cursor: 'default',
      paddingTop: '3px',
      minWidth: '90px',
    },
    {},
    [DOM.isMobile() ? date : `Posted ${date}`]
  );

  const container = DOM.create(
    'div',
    {
      display: 'flex',
      flexDirection: DOM.isMobile() ? 'column' : 'row',
      alignItems: DOM.isMobile() ? 'start': 'center',
      paddingBottom: '15px',
    },
    {},
    [
      dateSpan,
      PostTagsList({ tags }),
    ]
  );

  return container;
};

/**
 * PostBody component.
 *
 * @returns {HTMLElement}
 */
const PostBody = ({ model, startExpanded = true }) => {
  const container = DOM.create(
    'div',
    {
      display: startExpanded ? 'block' : 'none',
      color: 'black',
      fontFamily: 'sans-serif',
      fontSize: '1rem',
      marginLeft: DOM.isMobile() ? '10px' : '39px',
      marginRight: DOM.isMobile() ? '5px' : '35px',
      padding: DOM.isMobile() ? '0px' : '5px',
      paddingTop: '10px',
      backgroundColor: '#0000',
      borderTop: 'solid 2px #4444',
    },
    {},
    createPostComponents(model.components)
  );

  // Start expanded?
  Events.subscribe('postExpanded', ({ fileName, expanded }) => {
    if (fileName !== model.fileName) return;

    container.style.display = expanded ? 'initial' : 'none';
  });

  return container;
};

/**
 * PostImage component.
 *
 * @returns {HTMLElement}
 */
const PostImage = ({ src }) => {
  const img = DOM.create(
    'img',
    {
      maxWidth: '90%',
      height: 'auto',
      maxHeight: '600px',
      borderRadius: '5px',
      overflow: 'hidden',
      boxShadow: BOX_SHADOW_MATERIAL,
    }
  );

  // Lazy load image when in view
  img.dataset.src = src;
  imgObserver.observe(img);

  const container = DOM.create(
    'div',
    {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      margin: '30px 0px',
      cursor: 'pointer',
    },
    {
      onclick: () => window.open(src, '_blank'),
    },
    [img]
  );

  return container;
};

/**
 * PostHeader component.
 *
 * @returns {HTMLElement}
 */
const PostHeader = ({ level, text }) =>
  DOM.create(
    `h${level}`,
    {
      color: 'black',
      fontSize: '1.4rem',
      marginTop: '35px',
      marginBottom: '10px',
    },
    {},
    [text]
  );

/**
 * PostParagraph component.
 *
 * @returns {HTMLElement}
 */
const PostParagraph = ({ text }) =>
  DOM.create(
    'p',
    {
      color: '#222',
      fontSize: '1.1rem',
      marginTop: '8px',
      marginBottom: '8px',
      lineHeight: '1.3',
    },
    {},
    [text]
  );

/**
 * PostHtml component.
 *
 * @returns {HTMLElement}
 */
const PostHtml = ({ html }) => DOM.create('div', {}, {}, [html]);

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
const Post = ({ model, startExpanded = true }) =>
  Fader([
    DOM.create(
      'div',
      {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: '5px',
        overflow: 'hidden',
        padding: DOM.isMobile () ? '5px' : '15px',
        margin: '25px 5px 5px 5px',
        minWidth: DOM.isMobile() ? 'initial' : MAX_WIDTH_DESKTOP,
        boxShadow: BOX_SHADOW_MATERIAL,
      },
      {},
      [
        PostTitle({ model, startExpanded }),
        PostDateAndTags(model),
        PostBody({ model, startExpanded }),
      ]
    )
  ]);

/**
 * TagCloud component.
 *
 * @returns {HTMLElement}
 */
const TagCloud = ({ tags }) => {
  const postTagPills = tags
    .sort((a, b) => window.tagIndex[a].length > window.tagIndex[b].length ? -1 : 1)
    .map(tag => PostTagPill({ tag, quantity: window.tagIndex[tag].length }));

  const container = DOM.create(
    'div',
    {
      display: 'flex',
      flexWrap: 'wrap',
      paddingTop: '10px',
    },
    {},
    postTagPills
  );

  return container;
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
