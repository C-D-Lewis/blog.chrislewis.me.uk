/* global Theme */

/** Max width of content for desktop */
const MAX_WIDTH_DESKTOP = '790px';
/** Max width of content for mobiles */
const MAX_WIDTH_MOBILE = '390px';
/** Material box shadow settings */
const BOX_SHADOW_MATERIAL = '2px 2px 3px 1px #0009';

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
 */
fabricate.declare('RootContainer', () => fabricate('div')
  .asFlex('column')
  .withStyles({
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
  }));

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
 */
fabricate.declare('SiteHeader', () => fabricate('div')
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
  }));

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
 */
fabricate.declare('SiteTitle', () => {
  const { syntax } = Theme;

  const siteMainTitle = fabricate('div')
    .asFlex('row')
    .withStyles({ marginLeft: '8px' })
    .withChildren([
      SiteTitleWord().setText('try').withStyles({ color: syntax.keyword }),
      SiteTitleWord().setText('{').withStyles({ color: syntax.comment }),
      SiteTitleWord().setText('work').withStyles({ color: syntax.function }),
      SiteTitleWord().setText('();').withStyles({ color: syntax.comment, marginLeft: '0px' }),
      SiteTitleWord().setText('}').withStyles({ color: syntax.comment }),
      SiteTitleWord().setText('finally').withStyles({ color: syntax.keyword }),
      SiteTitleWord().setText('{').withStyles({ color: syntax.comment }),
      SiteTitleWord().setText('code').withStyles({ color: syntax.function }),
      SiteTitleWord().setText('();').withStyles({ color: syntax.comment, marginLeft: '0px' }),
      SiteTitleWord().setText('}').withStyles({ color: syntax.comment }),
    ]);

  const siteTitleComment = SiteTitleWord()
    .setText('// A blog by Chris Lewis')
    .withStyles({ color: syntax.comment, marginLeft: '18px' });

  const titleWrapper = fabricate('div')
    .asFlex('column')
    .withStyles({ justifyContent: 'center', cursor: 'pointer' })
    .withChildren([siteTitleComment, siteMainTitle])
    .onClick(() => {
      window.location.href = '/';
    })
    .onHover((el, hovering) => el.addStyles({ filter: `brightness(${hovering ? '1.2' : '1'})` }));

  return titleWrapper;
});

/**
 * ContentContainer component.
 */
fabricate.declare('ContentContainer', () => fabricate('div')
  .asFlex(fabricate.isMobile() ? 'column' : 'row')
  .withStyles({
    flexWrap: 'wrap',
    width: '100%',
    margin: 0,
    padding: 0,
  }));

/**
 * LeftColumn component.
 */
fabricate.declare('LeftColumn', () => fabricate('div')
  .asFlex('column')
  .withStyles({
    backgroundColor: Theme.leftColumnBackground,
    flex: fabricate.isMobile() ? '1' : '0 0 265px',
    maxWidth: fabricate.isMobile() ? '100%' : '280px',
    justifyContent: 'start',
    padding: `${fabricate.isMobile() ? '15px' : '90px'} 15px 30px 15px`,
    borderRight: '1px solid #111',
  }));

/**
 * LeftColumnHeader component.
 */
fabricate.declare('LeftColumnHeader', ({
  isTopSection = false,
  isCenterSection = false,
} = {}) => fabricate('span')
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
  }));

/**
 * LeftColumnItem component.
 */
fabricate.declare('LeftColumnItem', ({ year } = {}) => fabricate('a')
  .withStyles({
    color: '#ccc',
    display: 'block',
    fontFamily: 'sans-serif',
    fontSize: '1.1rem',
    margin: '5px 0px 0px 10px',
    cursor: 'pointer',
  })
  .withAttributes({ target: '_blank' })
  .onClick(() => goToTop())
  .watchState((el, { selectedYear }) => {
    const isSelected = selectedYear === year;
    el.addStyles({
      color: isSelected ? Theme.syntax.function : '#ccc',
      fontWeight: isSelected ? 'bold' : 'initial',
    });
  }, ['selectedYear']));

/**
 * CentralColumn component.
 */
fabricate.declare('CentralColumn', () => fabricate('div')
  .asFlex(fabricate.isMobile() ? 'column' : 'row')
  .withStyles({
    flex: '1',
    minWidth: fabricate.isMobile() ? MAX_WIDTH_MOBILE : MAX_WIDTH_DESKTOP,
    maxWidth: '100vw',
    paddingLeft: fabricate.isMobile() ? '0px' : '20px',
    paddingTop: '90px',

    // Center on page
    position: fabricate.isMobile() ? 'initial' : 'absolute',
    left: fabricate.isMobile() ? 'initial' : '25%',
    margin: 'auto',
  }));

/**
 * SocialPill component.
 *
 * @returns {HTMLElement}
 */
const SocialPill = ({
  icon, text, backgroundColor, href, maxWidth,
}) => {
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
 */
fabricate.declare('SiteSocials', () => fabricate('div')
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
  ]));

/**
 * PostList component.
 */
fabricate.declare('PostList', () => fabricate('div')
  .asFlex('column')
  .withStyles({
    maxWidth: fabricate.isMobile() ? 'initial' : MAX_WIDTH_DESKTOP,
    margin: fabricate.isMobile() ? '0px 0px' : '0px 20px',
    padding: fabricate.isMobile() ? '0px 0px 40px 0px' : '0px 10px 40px 10px',
  })
  .watchState((el, { postListItems }) => {
    el.clear();
    el.addChildren(
      postListItems.map((model) => fabricate('Post', { model, startExpanded: postListItems.length === 1 })),
    );
  }, ['postListItems']));

/**
 * PostTitle component.
 *
 * @returns {HTMLElement}
 */
const PostTitle = ({ model, startExpanded = true }) => {
  const { title, fileName } = model;

  const postExpanded = fabricate.manageState('PostTitle', `expanded:${fileName}`, false);

  let expanded = startExpanded;
  const expandIcon = fabricate('img')
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
      postExpanded.set(expanded);
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
      Utils.showSinglePost(fileName.split('.')[0]);
      goToTop();
    });

  const h1 = fabricate('h1')
    .withStyles({
      color: 'black',
      fontFamily: 'sans-serif',
      fontSize: fabricate.isMobile() ? '1.2rem' : '1.5rem',
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
    .withChildren([expandIcon, h1]);

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
      width: '16px',
      height: '16px',
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
      padding: '4px 6px',
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
      Utils.showPostsForTag(tag);
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
    marginLeft: fabricate.isMobile() ? '40px' : '10px',
    marginTop: fabricate.isMobile() ? '10px' : 'initial',
    flexWrap: 'wrap',
  })
  .withChildren(tags.map((tag) => PostTagPill({ tag })));

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
      minWidth: fabricate.isMobile() ? '100px' : '140px',
    })
    .setText(fabricate.isMobile() ? date : `Posted ${date}`);

  const container = fabricate('div')
    .asFlex(fabricate.isMobile() ? 'column' : 'row')
    .withStyles({
      alignItems: fabricate.isMobile() ? 'start' : 'center',
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
  const postExpanded = fabricate.manageState('PostTitle', `expanded:${model.fileName}`, false);

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
    // eslint-disable-next-line no-use-before-define
    .withChildren(createPostComponents(model.components))
    .watchState((el) => {
      el.addStyles({ display: postExpanded.get() ? 'initial' : 'none' });
    }, [postExpanded.key])

  return container;
};

/**
 * PostImage component.
 *
 * @returns {HTMLElement}
 */
const PostImage = ({ component, noShadow }) => {
  const { src } = component;

  const img = fabricate('img')
    .withStyles({
      maxWidth: '90%',
      height: 'auto',
      maxHeight: '600px',
      borderRadius: '5px',
      overflow: 'hidden',
      boxShadow: !noShadow ? BOX_SHADOW_MATERIAL : undefined,
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
const PostHeader = ({ component}) => {
  const { level, text } = component;
  
  return fabricate(`h${level}`)
    .withStyles({
      color: 'black',
      fontSize: '1.4rem',
      marginTop: '10px',
      marginBottom: '10px',
      paddingTop: '45px',
      borderTop: 'solid 1px #4444',
    })
    .setText(text);
};

/**
 * PostParagraph component.
 *
 * Note: uses withChildren() to work with embedded HTML fragments.
 *
 * @returns {HTMLElement}
 */
const PostParagraph = ({ component}) => {
  const { text } = component;
  
  return fabricate('p')
    .withStyles({
      color: '#222',
      fontSize: fabricate.isMobile() ? '1rem' : '1.05rem',
      marginTop: '8px',
      marginBottom: '8px',
      lineHeight: '1.35',
    })
    .withChildren([text]);
};

/**
 * PostHtml component.
 *
 * @returns {HTMLElement}
 */
const PostHtml = ({ component }) => {
  const { html } = component;

  return fabricate('div').addChildren([html]);
};

/**
 * Generate the list of post components based on the model generated from Markdown.
 *
 * @param {Object[]} components - List of models to convert.
 * @returns {Object[]} List of HTMLElements for display.
 */
const createPostComponents = (components) => components.map((component) => {
  switch (component.type) {
    case 'image': return PostImage({ component });
    case 'image-no-shadow': return PostImage({ component, noShadow: true });
    case 'header': return PostHeader({ component });
    case 'paragraph': return PostParagraph({ component });
    case 'html': return PostHtml({ component });
    default: throw new Error(`Unknown component type ${component.type}`);
  }
});

/**
 * Post component.
 */
fabricate.declare('Post', ({ model, startExpanded = true }) => Fader([
  fabricate('div')
    .asFlex('column')
    .withStyles({
      backgroundColor: 'white',
      borderRadius: '5px',
      overflow: 'hidden',
      padding: fabricate.isMobile() ? '5px' : '15px',
      margin: '25px 5px 5px 5px',
      minWidth: fabricate.isMobile() ? 'initial' : MAX_WIDTH_DESKTOP,
      boxShadow: BOX_SHADOW_MATERIAL,
    })
    .withChildren([
      PostTitle({ model, startExpanded }),
      PostDateAndTags(model),
      PostBody({ model, startExpanded }),
    ]),
]));

/**
 * TagCloud component.
 */
fabricate.declare('TagCloud', ({ tags }) => {
  const postTagPills = tags
    .sort((a, b) => (window.tagIndex[a].length > window.tagIndex[b].length ? -1 : 1))
    .map((tag) => PostTagPill({ tag, quantity: window.tagIndex[tag].length }));

  const container = fabricate('div')
    .asFlex('row')
    .withStyles({
      flexWrap: 'wrap',
      paddingTop: '10px',
    })
    .withChildren(postTagPills);

  return container;
});
