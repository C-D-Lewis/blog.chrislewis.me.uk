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

/** Max width of content for desktop */
const MAX_WIDTH_DESKTOP = '790px';
/** Max width of content for mobiles */
const MAX_WIDTH_MOBILE = '390px';
/** Material box shadow settings */
const BOX_SHADOW_MATERIAL = '2px 2px 3px 1px #5555';

// Lazy load images since some tags include a lot of posts
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
const RootContainer = () => fabricate('div')
  .asFlex('column')
  .withStyles({
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
  const div = fabricate('div')
    .withStyles({
      opacity: 0,
      transition: '0.3s',
    })
    .withChildren(children);

  setTimeout(() => div.withStyles({ opacity: 1 }), 100);
  return div;
};

/**
 * SiteHeader component.
 *
 * @returns {HTMLElement}
 */
const SiteHeader = () => fabricate('div')
  .asFlex('row')
  .withStyles({
    width: '100vw',
    minHeight: '80px',
    padding: 15,
    cursor: 'default',
    borderBottom: '1px solid #111',
    backgroundColor: Theme.syntax.background,
    position: 'fixed',
    zIndex: 999,
  });

/**
 * SiteTitleWord component.
 *
 * @returns {HTMLElement}
 */
const SiteTitleWord = () => fabricate('h2')
  .withStyles({
    display: 'block',
    fontFamily: 'monospace',
    fontSize: fabricate.isMobile() ? '1.1rem' : '1.4rem',
    marginLeft: '8px',
    marginTop: '0px',
    marginBottom: '0px',
  });

/**
 * SiteTitle component.
 *
 * @returns {HTMLElement}
 */
const SiteTitle = () => {
  const siteMainTitle = fabricate('div')
    .asFlex('row')
    .withStyles({ marginLeft: '8px' })
    .withChildren([
      SiteTitleWord().setText('try').withStyles({ color: Theme.syntax.keyword }),
      SiteTitleWord().setText('{').withStyles({ color: Theme.syntax.comment }),
      SiteTitleWord().setText('work').withStyles({ color: Theme.syntax.function }),
      SiteTitleWord().setText('();').withStyles({ color: Theme.syntax.comment, marginLeft: '0px' }),
      SiteTitleWord().setText('}').withStyles({ color: Theme.syntax.comment }),
      SiteTitleWord().setText('finally').withStyles({ color: Theme.syntax.keyword }),
      SiteTitleWord().setText('{').withStyles({ color: Theme.syntax.comment }),
      SiteTitleWord().setText('code').withStyles({ color: Theme.syntax.function }),
      SiteTitleWord().setText('();').withStyles({ color: Theme.syntax.comment, marginLeft: '0px' }),
      SiteTitleWord().setText('}').withStyles({ color: Theme.syntax.comment }),
    ]);

  const siteTitleComment = SiteTitleWord()
    .setText('// A blog by Chris Lewis')
    .withStyles({
      color: Theme.syntax.comment,
      marginLeft: '18px',
    });

  const titleWrapper = fabricate('div')
    .asFlex('column')
    .withStyles({
      justifyContent: 'center',
      cursor: 'pointer',
    })
    .withChildren([
      siteTitleComment,
      siteMainTitle,
    ])
    .onClick(() => (window.location.href = '/'))
    .onHover((el, hovering) => el.addStyles({ filter: `brightness(${hovering ? '1.2' : '1'})` }));

  return titleWrapper;
};

/**
 * ContentContainer component.
 *
 * @returns {HTMLElement}
 */
const ContentContainer = () => fabricate('div')
  .asFlex(fabricate.isMobile() ? 'column' : 'row')
  .withStyles({
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
const LeftColumn = () => fabricate('div')
  .asFlex('column')
  .withStyles({
    backgroundColor: Theme.leftColumnBackground,
    flex: fabricate.isMobile() ? '1' : '0 0 265px',
    maxWidth: fabricate.isMobile() ? '100%' : '280px',
    justifyContent: 'start',
    padding: `${fabricate.isMobile() ? '15px' : '90px'} 15px 30px 15px`,
    borderRight: '1px solid #111',
  });

/**
 * LeftColumnHeader component.
 *
 * @returns {HTMLElement}
 */
const LeftColumnHeader = ({ isTopSection = false, isCenterSection = false } = {}) => fabricate('span')
  .withStyles({
    display: 'block',
    color: 'white',
    fontFamily: 'sans-serif',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginTop: '10px',
    paddingTop: isTopSection ? '10px' : '15px',
    cursor: 'default',
    textAlign: isCenterSection ? 'center' : 'initial',
  });

/**
 * LeftColumnItem component.
 *
 * @returns {HTMLElement}
 */
const LeftColumnItem = ({ getIsSelected } = {}) => {
  const anchor = fabricate('a')
    .withStyles({
      color: '#ccc',
      display: 'block',
      fontFamily: 'sans-serif',
      fontSize: '1.1rem',
      marginTop: '10px',
      cursor: 'pointer',
    })
    .withAttributes({ target: '_blank' })
    .onClick(() => goToTop());

  Events.subscribe('selectionUpdated', () => {
    const isSelected = getIsSelected ? getIsSelected() : false;

    anchor.withStyles({
      color: isSelected ? Theme.syntax.function : '#ccc',
      fontWeight: isSelected ? 'bold' : 'initial',
    });
  });

  return anchor;
};

/**
 * CentralColumn component.
 *
 * @returns {HTMLElement}
 */
const CentralColumn = () => fabricate('div')
  .asFlex(fabricate.isMobile() ? 'column' : 'row')
  .withStyles({
    flex: '1',
    minWidth: fabricate.isMobile() ? MAX_WIDTH_MOBILE : MAX_WIDTH_DESKTOP,
    maxWidth: '100vw',
    paddingLeft: fabricate.isMobile() ? '0px' : '20px',
    backgroundColor: Theme.centralColumnBackground,
    paddingTop: '90px',

    // Center on page
    position: fabricate.isMobile() ? 'initial' : 'absolute',
    left: fabricate.isMobile() ? 'initial' : '25%',
    margin: 'auto',
  });

/**
 * SocialPill component.
 *
 * @returns {HTMLElement}
 */
const SocialPill = ({ icon, text, backgroundColor, href, maxWidth }) => {
  const img = fabricate('img')
    .withStyles({
      display: 'block',
      width: '24px',
      height: '24px',
    })
    .withAttributes({ src: `./assets/icons/${icon}` });

  const label = fabricate('span')
    .withStyles({
      color: 'white',
      fontFamily: 'sans-serif',
      paddingTop: '2px',
      fontSize: '0.9rem',
      marginLeft: '5px',
      display: 'none',
      fontWeight: 'bold',
    })
    .setText(text);

  const anchor = fabricate('a')
    .asFlex('row')
    .withStyles({
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
    })
    .withAttributes({
      href,
      target: '_blank',
    })
    .withChildren([
      img,
      label,
    ])
    .onHover((el, hovering) => {
      label.addStyles({ display: hovering ? 'initial' : 'none' });
      el.addStyles({ width: hovering ? `${maxWidth}px` : '24px' });
    });

  return anchor;
};

/**
 * SiteSocials component.
 *
 * @returns {HTMLElement}
 */
const SiteSocials = () => fabricate('div')
  .asFlex('row')
  .withStyles({
    flex: fabricate.isMobile() ? 'initial' : '1',
    marginRight: '20px',
    justifyContent: fabricate.isMobile() ? 'center' : 'flex-end',
    alignItems: 'center',
  })
  .withChildren([
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
  ]);

/**
 * PostList component.
 *
 * @returns {HTMLElement}
 */
const PostList = () => fabricate('div')
  .asFlex('column')
  .withStyles({
    maxWidth: fabricate.isMobile() ? 'initial' : MAX_WIDTH_DESKTOP,
    margin: fabricate.isMobile() ? '0px 0px' : '0px 20px',
    padding: fabricate.isMobile() ? '0px 0px 40px 0px' : '0px 10px 40px 10px',
  });

/**
 * PostTitle component.
 *
 * @returns {HTMLElement}
 */
const PostTitle = ({ model, startExpanded = true }) => {
  const { title, fileName } = model;

  let expanded = startExpanded;
  const icon = fabricate('img')
    .withStyles({
      width: '38px',
      height: '38px',
      marginRight: '5px',
      paddingTop: '3px',
      transform: startExpanded ? 'rotateZ(90deg)' : 'initial',
      transition: '0.4s',
      cursor: 'pointer',
    })
    .withAttributes({ src: 'assets/icons/chevron-right.png' })
    .onClick((el) => {
      // Click to toggle expanded state
      expanded = !expanded;
      el.withStyles({ transform: expanded ? 'rotateZ(90deg)' : 'initial' });
  
      // Notify the body component
      Events.post('postExpanded', { fileName, expanded });
    });

  const linkAnchor = fabricate('span')
    .withStyles({
      color: 'lightgrey',
      fontSize: '1.4rem',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginLeft: '10px',
      paddingTop: '6px',
    })
    .setText('#')
    .onHover((el, hovering) => el.addStyles({ color: hovering ? '#444' : 'lightgrey' }))
    .onClick(() => {
      window.showSinglePost(fileName.split('.')[0]);
      goToTop();
    });

  const h1 = fabricate('h1')
    .withStyles({
      color: 'black',
      fontFamily: 'sans-serif',
      fontSize: fabricate.isMobile() ? '1.2rem': '1.5rem',
      fontWeight: 'bold',
      marginTop: '10px',
      marginBottom: '5px',
      border: 'none',
      cursor: 'default',
    })
    .withChildren([title, linkAnchor]);

  const container = fabricate('div')
    .asFlex('row')
    .withStyles({ alignItems: 'center' })
    .withChildren([icon, h1]);

  return container;
};

/**
 * PostTagPill component.
 *
 * @returns {HTMLElement}
 */
const PostTagPill = ({ tag, quantity }) => {
  const img = fabricate('img')
    .withStyles({
      width: '14px',
      height: '14px',
    })
    .withAttributes({ src: 'assets/icons/tag-outline.png' });

  const label = fabricate('div')
    .asFlex('column')
    .withStyles({
      color: 'white',
      fontFamily: 'sans-serif',
      fontSize: '0.8rem',
      marginLeft: '2px',
      justifyContent: 'center',
      fontWeight: 'bold',
    })
    .setText(quantity ? `${tag} (${quantity})` : tag);

  const container = fabricate('div')
    .asFlex('row')
    .withStyles({
      alignItems: 'center',
      border: `solid 2px ${Theme.syntax.function}`,
      backgroundColor: quantity ? 'none' : Theme.syntax.function,
      cursor: 'pointer',
      borderRadius: '20px',
      padding: '4px 8px',
      margin: '2px',
    })
    .withChildren([img, label])
    .onHover((el, hovering) => {
      if (quantity) {
        el.addStyles({ background: hovering ? Theme.syntax.function : 'none' });
      } else {
        el.addStyles({ filter: hovering ? 'brightness(1.1)' : 'brightness(1)' });
      }
    })
    .onClick(() => {
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
const PostTagsList = ({ tags }) => fabricate('div')
  .asFlex('row')
  .withStyles({
    marginLeft: fabricate.isMobile() ? '40px': '10px',
    marginTop: fabricate.isMobile() ? '10px' : 'initial',
    flexWrap: 'wrap',
  })
  .withChildren(tags.map(tag => PostTagPill({ tag })));

/**
 * PostDateAndTags component.
 *
 * @returns {HTMLElement}
 */
const PostDateAndTags = ({ dateTime, tags }) => {
  const [date] = dateTime.split(' ');

  const dateSpan = fabricate('span')
    .withStyles({
      color: '#777',
      fontFamily: 'sans-serif',
      fontSize: '1rem',
      marginLeft: '42px',
      cursor: 'default',
      paddingTop: '3px',
      minWidth: fabricate.isMobile () ? '100px' : '140px',
    })
    .setText(fabricate.isMobile() ? date : `Posted ${date}`);

  const container = fabricate('div')
    .asFlex(fabricate.isMobile() ? 'column' : 'row')
    .withStyles({
      alignItems: fabricate.isMobile() ? 'start': 'center',
      paddingBottom: '15px',
    })
    .withChildren([
      dateSpan,
      PostTagsList({ tags }),
    ]);

  return container;
};

/**
 * PostBody component.
 *
 * @returns {HTMLElement}
 */
const PostBody = ({ model, startExpanded = true }) => {
  const container = fabricate('div')
    .withStyles({
      display: startExpanded ? 'block' : 'none',
      color: 'black',
      fontFamily: 'sans-serif',
      fontSize: '1rem',
      marginLeft: fabricate.isMobile() ? '10px' : '39px',
      marginRight: fabricate.isMobile() ? '5px' : '35px',
      padding: fabricate.isMobile() ? '0px' : '5px',
      paddingTop: '10px',
      backgroundColor: '#0000',
      borderTop: 'solid 2px #4444',
    })
    .withChildren(createPostComponents(model.components));

  // Start expanded?
  Events.subscribe('postExpanded', ({ fileName, expanded }) => {
    if (fileName !== model.fileName) return;

    container.withStyles({ display: expanded ? 'initial' : 'none' });
  });

  return container;
};

/**
 * PostImage component.
 *
 * @returns {HTMLElement}
 */
const PostImage = ({ src }) => {
  const img = fabricate('img')
    .withStyles({
      maxWidth: '90%',
      height: 'auto',
      maxHeight: '600px',
      borderRadius: '5px',
      overflow: 'hidden',
      boxShadow: BOX_SHADOW_MATERIAL,
    });

  // Lazy load image when in view
  img.dataset.src = src;
  imgObserver.observe(img);

  const container = fabricate('div')
    .asFlex('row')
    .withStyles({
      width: '100%',
      justifyContent: 'center',
      margin: '30px 0px',
      cursor: 'pointer',
    })
    .onClick(() => window.open(src, '_blank'))
    .withChildren([img]);

  return container;
};

/**
 * PostHeader component.
 *
 * @returns {HTMLElement}
 */
const PostHeader = ({ level, text }) => fabricate(`h${level}`)
  .withStyles({
    color: 'black',
    fontSize: '1.4rem',
    marginTop: '35px',
    marginBottom: '10px',
  })
  .setText(text);

/**
 * PostParagraph component.
 * 
 * Note: uses addChildren() to work with embedded HTML fragments.
 *
 * @returns {HTMLElement}
 */
const PostParagraph = ({ text }) => fabricate('p')
  .withStyles({
    color: '#222',
    fontSize: fabricate.isMobile() ? '1rem' : '1.05rem',
    marginTop: '8px',
    marginBottom: '8px',
    lineHeight: '1.35',
  })
  .withChildren([text]);

/**
 * PostHtml component.
 *
 * @returns {HTMLElement}
 */
const PostHtml = ({ html }) => fabricate('div').addChildren([html]);

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
    fabricate('div')
      .asFlex('column')
      .withStyles({
        backgroundColor: 'white',
        borderRadius: '5px',
        overflow: 'hidden',
        padding: fabricate.isMobile () ? '5px' : '15px',
        margin: '25px 5px 5px 5px',
        minWidth: fabricate.isMobile() ? 'initial' : MAX_WIDTH_DESKTOP,
        boxShadow: BOX_SHADOW_MATERIAL,
      })
      .withChildren([
        PostTitle({ model, startExpanded }),
        PostDateAndTags(model),
        PostBody({ model, startExpanded }),
      ]),
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

  const container = fabricate('div')
    .asFlex('row')
    .withStyles({
      flexWrap: 'wrap',
      paddingTop: '10px',
    })
    .withChildren(postTagPills);

  return container;
};

/**
 * Empty component.
 *
 * @returns {HTMLElement}
 */
const Nothing = () => fabricate('div');

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
  Nothing,
};
