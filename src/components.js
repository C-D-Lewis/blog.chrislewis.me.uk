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
      // eslint-disable-next-line no-param-reassign
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
 *
 * @returns {void}
 */
const goToTop = () => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);

/**
 * RootContainer component.
 */
fabricate.declare('RootContainer', () => fabricate('Column')
  .setStyles({
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
  }));

/**
 * Fader component.
 *
 * @param {Array<HTMLElement>} children - Children to fade in.
 * @returns {HTMLElement} Fabricate component.
 */
const Fader = (children) => {
  const div = fabricate('div')
    .setStyles({ opacity: 0, transition: '0.3s' })
    .setChildren(children);

  setTimeout(() => div.setStyles({ opacity: 1 }), 100);
  return div;
};

/**
 * SiteHeader component.
 */
fabricate.declare('SiteHeader', () => fabricate('Row')
  .setStyles({
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
 * @returns {HTMLElement} Fabricate component.
 */
const SiteTitleWord = () => fabricate('h2')
  .setStyles({
    display: 'block',
    fontFamily: 'monospace',
    fontSize: fabricate.isNarrow() ? '1.1rem' : '1.4rem',
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
    .setStyles({ marginLeft: '8px' })
    .setChildren([
      SiteTitleWord().setText('try').setStyles({ color: syntax.keyword }),
      SiteTitleWord().setText('{').setStyles({ color: syntax.comment }),
      SiteTitleWord().setText('work').setStyles({ color: syntax.function }),
      SiteTitleWord().setText('();').setStyles({ color: syntax.comment, marginLeft: '0px' }),
      SiteTitleWord().setText('}').setStyles({ color: syntax.comment }),
      SiteTitleWord().setText('finally').setStyles({ color: syntax.keyword }),
      SiteTitleWord().setText('{').setStyles({ color: syntax.comment }),
      SiteTitleWord().setText('code').setStyles({ color: syntax.function }),
      SiteTitleWord().setText('();').setStyles({ color: syntax.comment, marginLeft: '0px' }),
      SiteTitleWord().setText('}').setStyles({ color: syntax.comment }),
    ]);

  const siteTitleComment = SiteTitleWord()
    .setText('// A blog by Chris Lewis')
    .setStyles({ color: syntax.comment, marginLeft: '18px' });

  const titleWrapper = fabricate('div')
    .asFlex('column')
    .setStyles({ justifyContent: 'center', cursor: 'pointer' })
    .setChildren([siteTitleComment, siteMainTitle])
    .onClick(() => {
      window.location.href = '/';
    })
    .onHover((el, state, hovering) => el.setStyles({ filter: `brightness(${hovering ? '1.2' : '1'})` }));

  return titleWrapper;
});

/**
 * ContentContainer component.
 */
fabricate.declare('ContentContainer', () => fabricate('div')
  .asFlex(fabricate.isNarrow() ? 'column' : 'row')
  .setStyles({
    flexWrap: 'wrap',
    width: '100%',
    margin: 0,
    padding: 0,
  }));

/**
 * LeftColumn component.
 */
fabricate.declare('LeftColumn', () => fabricate('Column')
  .setStyles({
    backgroundColor: Theme.leftColumnBackground,
    flex: fabricate.isNarrow() ? '1' : '0 0 275px',
    maxWidth: fabricate.isNarrow() ? '100%' : '280px',
    justifyContent: 'start',
    padding: `${fabricate.isNarrow() ? '15px' : '90px'} 15px 30px 15px`,
    borderRight: '1px solid #111',
  }));

/**
 * LeftColumnHeader component.
 */
fabricate.declare('LeftColumnHeader', ({
  isTopSection = false,
  isCenterSection = false,
} = {}) => fabricate('span')
  .setStyles({
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
  .setStyles({
    color: '#ccc',
    display: 'block',
    fontFamily: 'sans-serif',
    fontSize: '1.1rem',
    margin: '5px 0px 0px 2px',
    cursor: 'pointer',
    transition: '0.1s',
  })
  .setAttributes({ target: '_blank' })
  .onClick(() => goToTop())
  .onHover((el, state, hovering) => el.setStyles({ marginLeft: hovering ? '10px' : '2px' }))
  .onUpdate((el, { selectedYear }) => {
    const isSelected = selectedYear === year;
    el.setStyles({
      color: isSelected ? Theme.syntax.function : '#ccc',
      fontWeight: isSelected ? 'bold' : 'initial',
    });
  }, ['selectedYear']));

/**
 * CentralColumn component.
 */
fabricate.declare('CentralColumn', () => fabricate('div')
  .asFlex(fabricate.isNarrow() ? 'column' : 'row')
  .setStyles({
    flex: '1',
    minWidth: fabricate.isNarrow() ? MAX_WIDTH_MOBILE : MAX_WIDTH_DESKTOP,
    maxWidth: '100vw',
    paddingLeft: fabricate.isNarrow() ? '0px' : '20px',
    paddingTop: '90px',

    // Center on page (breaks flow with Footer)
    // position: fabricate.isNarrow() ? 'initial' : 'absolute',
    // left: fabricate.isNarrow() ? 'initial' : '25%',
    // margin: 'auto',
  }));

/**
 * SocialPill component.
 *
 *
 * @param {object} props - Component props.
 * @param {string} props.icon - Icon name
 * @param {string} props.text - Text
 * @param {string} props.backgroundColor - Background color
 * @param {string} props.href - Link ref
 * @param {number} props.maxWidth - Max width
 * @returns {HTMLElement} Fabricate component.
 */
const SocialPill = ({
  icon, text, backgroundColor, href, maxWidth,
}) => {
  const img = fabricate('img')
    .setStyles({
      display: 'block',
      width: '24px',
      height: '24px',
    })
    .setAttributes({ src: `./assets/icons/${icon}` });

  const label = fabricate('span')
    .setStyles({
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
    .setStyles({
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
    .setAttributes({
      href,
      target: '_blank',
    })
    .setChildren([
      img,
      label,
    ])
    .onHover((el, state, hovering) => {
      label.setStyles({ display: hovering ? 'initial' : 'none' });
      el.setStyles({ width: hovering ? `${maxWidth}px` : '24px' });
    });

  return anchor;
};

/**
 * SiteSocials component.
 */
fabricate.declare('SiteSocials', () => fabricate('div')
  .asFlex('row')
  .setStyles({
    flex: fabricate.isNarrow() ? 'initial' : '1',
    marginRight: '20px',
    justifyContent: fabricate.isNarrow() ? 'center' : 'flex-end',
    alignItems: 'center',
  })
  .setChildren([
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
fabricate.declare('PostList', () => fabricate('Column')
  .setStyles({
    maxWidth: fabricate.isNarrow() ? 'initial' : MAX_WIDTH_DESKTOP,
    margin: fabricate.isNarrow() ? '0px 0px' : '0px 20px 0px 90px',
    padding: fabricate.isNarrow() ? '0px 0px 40px 0px' : '0px 10px 40px 10px',
  })
  .onUpdate((el, { postListItems }) => {
    el.setChildren(
      postListItems.map((model) => fabricate('Post', { model, startExpanded: postListItems.length === 1 })),
    );
  }, ['postListItems']));

/**
 * PostTitle component.
 *
 * @param {object} props - Component props.
 * @param {object} props.model - Post model.
 * @param {boolean} props.startExpanded - Start with post expended.
 * @returns {HTMLElement} Fabricate component.
 */
const PostTitle = ({ model, startExpanded = true }) => {
  const { title, fileName } = model;

  const postExpandedKey = Utils.postExpandedKey(fileName);

  let expanded = startExpanded;
  const expandIcon = fabricate('img')
    .setStyles({
      width: '38px',
      height: '38px',
      marginRight: '5px',
      paddingTop: '3px',
      transform: startExpanded ? 'rotateZ(90deg)' : 'initial',
      transition: '0.4s',
      cursor: 'pointer',
    })
    .setAttributes({ src: 'assets/icons/chevron-right.png' })
    .onClick((el) => {
      // Click to toggle expanded state
      expanded = !expanded;
      el.setStyles({ transform: expanded ? 'rotateZ(90deg)' : 'initial' });

      // Notify the body component
      fabricate.update(postExpandedKey, expanded);
    });

  const linkAnchor = fabricate('span')
    .setStyles({
      color: 'lightgrey',
      fontSize: '1.4rem',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginLeft: '10px',
      paddingTop: '6px',
    })
    .setText('#')
    .onHover((el, state, hovering) => el.setStyles({ color: hovering ? '#444' : 'lightgrey' }))
    .onClick(() => {
      Utils.showSinglePost(fileName.split('.')[0]);
      goToTop();
    });

  const h1 = fabricate('h1')
    .setStyles({
      color: 'black',
      fontFamily: 'sans-serif',
      fontSize: fabricate.isNarrow() ? '1.1rem' : '1.5rem',
      fontWeight: 'bold',
      marginTop: '10px',
      marginBottom: '5px',
      border: 'none',
      cursor: 'default',
    })
    .setText(title)
    .addChildren([linkAnchor]);

  const container = fabricate('div')
    .asFlex('row')
    .setStyles({ alignItems: 'center' })
    .setChildren([expandIcon, h1]);

  return container;
};

/**
 * PostTagPill component.
 *
 * @param {object} props - Component props.
 * @param {string} props.tag - Tag to show
 * @param {number} props.quantity - Quantity in tag.
 * @returns {HTMLElement} Fabricate component.
 */
const PostTagPill = ({ tag, quantity }) => {
  const img = fabricate('img')
    .setStyles({ width: '16px', height: '16px' })
    .setAttributes({ src: 'assets/icons/tag-outline.png' });

  const label = fabricate('div')
    .asFlex('column')
    .setStyles({
      color: 'white',
      fontFamily: 'sans-serif',
      fontSize: '0.8rem',
      marginLeft: '2px',
      justifyContent: 'center',
      fontWeight: 'bold',
      paddingTop: '1px',
    })
    .setText(quantity ? `${tag} (${quantity})` : tag);

  const container = fabricate('div')
    .asFlex('row')
    .setStyles({
      alignItems: 'center',
      border: `solid 2px ${Theme.syntax.function}`,
      backgroundColor: quantity ? 'none' : Theme.syntax.function,
      cursor: 'pointer',
      borderRadius: '20px',
      padding: '4px 6px',
      margin: '2px',
    })
    .setChildren([img, label])
    .onHover((el, state, hovering) => {
      if (quantity) {
        el.setStyles({ background: hovering ? Theme.syntax.function : 'none' });
      } else {
        el.setStyles({ filter: hovering ? 'brightness(1.1)' : 'brightness(1)' });
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
 * @param {object} props - Component props.
 * @param {Array<string>} props.tags - List of tags.
 * @returns {HTMLElement} Fabricate component.
 */
const PostTagsList = ({ tags }) => fabricate('div')
  .asFlex('row')
  .setStyles({
    marginLeft: fabricate.isNarrow() ? '40px' : '10px',
    marginTop: fabricate.isNarrow() ? '10px' : 'initial',
    flexWrap: 'wrap',
  })
  .setChildren(tags.map((tag) => PostTagPill({ tag })));

/**
 * PostDateAndTags component.
 *
 * @param {object} props - Component props.
 * @param {string} props.dateTime - Datetime string.
 * @param {Array<string>} props.tags - List of tags.
 * @returns {HTMLElement} Fabricate component.
 */
const PostDateAndTags = ({ dateTime, tags }) => {
  const [date] = dateTime.split(' ');

  const dateSpan = fabricate('span')
    .setStyles({
      color: '#777',
      fontFamily: 'sans-serif',
      fontSize: '1rem',
      marginLeft: '42px',
      cursor: 'default',
      paddingTop: '3px',
      minWidth: '100px',
    })
    .setText(date);

  const container = fabricate('div')
    .asFlex(fabricate.isNarrow() ? 'column' : 'row')
    .setStyles({
      alignItems: fabricate.isNarrow() ? 'start' : 'center',
      paddingBottom: '15px',
    })
    .setChildren([
      dateSpan,
      PostTagsList({ tags }),
    ]);

  return container;
};

/**
 * PostBody component.
 *
 * @param {object} props - Component props.
 * @param {object} props.model - Post model
 * @param {boolean} props.startExpanded - If starting expended.
 * @returns {HTMLElement} Fabricate component.
 */
const PostBody = ({ model, startExpanded = true }) => {
  const postExpandedKey = Utils.postExpandedKey(model.fileName);

  const container = fabricate('div')
    .setStyles({
      display: startExpanded ? 'block' : 'none',
      color: 'black',
      fontFamily: 'sans-serif',
      fontSize: '1rem',
      marginLeft: fabricate.isNarrow() ? '10px' : '39px',
      marginRight: fabricate.isNarrow() ? '5px' : '35px',
      padding: fabricate.isNarrow() ? '0px' : '5px',
      paddingTop: '10px',
      backgroundColor: '#0000',
      borderTop: 'solid 2px #4444',
    })
    // eslint-disable-next-line no-use-before-define
    .setChildren(createPostComponents(model.components))
    .onUpdate((el, state) => {
      el.setStyles({ display: state[postExpandedKey] ? 'initial' : 'none' });
    }, [postExpandedKey]);

  return container;
};

/**
 * PostImage component.
 *
 * @param {object} props - Component props.
 * @param {object} props.component - Component model.
 * @param {boolean} props.noShadow - If no shadow should be shown.
 * @returns {HTMLElement} Fabricate component.
 */
const PostImage = ({ component, noShadow }) => {
  const { src } = component;

  const img = fabricate('img')
    .setStyles({
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
    .setStyles({
      width: '100%',
      justifyContent: 'center',
      margin: '30px 0px',
      cursor: 'pointer',
    })
    .onClick(() => window.open(src, '_blank'))
    .setChildren([img]);

  return container;
};

/**
 * PostHeader component.
 *
 * @param {object} props - Component props.
 * @param {object} props.component - Component model.
 * @returns {HTMLElement} Fabricate component.
 */
const PostHeader = ({ component }) => {
  const { level, text } = component;

  return fabricate(`h${level}`)
    .setStyles({
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
 * @param {object} props - Component props.
 * @param {object} props.component - Component model.
 * @returns {HTMLElement} Fabricate component.
 */
const PostParagraph = ({ component }) => {
  const { text } = component;

  return fabricate('p')
    .setStyles({
      color: '#222',
      fontSize: fabricate.isNarrow() ? '1rem' : '1.05rem',
      marginTop: '8px',
      marginBottom: '8px',
      lineHeight: '1.35',
    })
    .setHtml(text);
};

/**
 * PostHtml component.
 *
 * @param {object} props - Component props.
 * @param {object} props.component - Component model.
 * @returns {HTMLElement} Fabricate component.
 */
const PostHtml = ({ component }) => {
  const { html } = component;

  return fabricate('div').setHtml([html]);
};

/**
 * Generate the list of post components based on the model generated from Markdown.
 *
 * @param {object[]} components - List of models to convert.
 * @returns {object[]} List of HTMLElements for display.
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
    .setStyles({
      backgroundColor: 'white',
      borderRadius: '5px',
      overflow: 'hidden',
      padding: fabricate.isNarrow() ? '5px' : '15px',
      margin: '25px 5px 5px 5px',
      minWidth: fabricate.isNarrow() ? 'initial' : MAX_WIDTH_DESKTOP,
      boxShadow: BOX_SHADOW_MATERIAL,
    })
    .setChildren([
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
    .setStyles({
      flexWrap: 'wrap',
      paddingTop: '10px',
    })
    .setChildren(postTagPills);

  return container;
});

/**
 * Footer component
 */
fabricate.declare('Footer', () => fabricate('Row')
  .setStyles({
    backgroundColor: '#111',
    justifyContent: 'center',
    padding: '15px',
    alignItems: 'center',
  })
  .setChildren([
    fabricate('Image', { src: 'assets/icons/github.png' })
      .setStyles({
        width: '38px',
        height: '38px',
        marginRight: '15px',
        cursor: 'pointer',
      })
      .onClick(() => window.open('https://github.com/C-D-Lewis/blog', '_blank')),
    fabricate('FabricateAttribution'),
  ]));
