const { readdirSync, readFileSync, writeFileSync } = require('fs');

const RENDERED_DIR = `${__dirname}/../assets/rendered/`;
const TITLE = 'try { work(); } finally { code(); }';
const DESCRIPTION = 'A blog by Chris Lewis';
const BLOG_HOME_LINK = 'https://blog.chrislewis.me.uk';
const TEMPLATE_START = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${TITLE}</title>
  <link>${BLOG_HOME_LINK}</link>
  <description>${DESCRIPTION}</description>
`
const TEMPLATE_END = `</channel>
</rss>
`;
const FEED_PATH = `${__dirname}/../feed/rss.xml`;  // CANNOT CHANGE
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const REPLACEMENTS = [
  ['&', '&amp;'],
];

/**
 * Create the XML object for a feed item.
 *
 * @param {Object} item - Item to add.
 * @returns {string} <item> object.
 */
const toItemXml = (item) => {
  let title = item.title;
  REPLACEMENTS.forEach(([before, after]) => {
    title = title.replace(before, after);
  });

  return `<item>
  <title>${title}</title>
  <pubDate>${item.pubDate}</pubDate>
  <link>${item.link}</link>
  <guid>${item.link}</guid>
  <description>${item.description}</description>
</item>`;
};

/**
 * Pad a value less than ten.
 */
const zeroPad = val => val < 10 ? `0${val}` : val;

/*
 * Sort by date in descending order.
 *
 * @param {string} a - fileName A.
 * @param {string} b - fileName B.
 * @returns {number} 1 if date A is earlier, -1 otherwise.
 */
const descendingDateSort = (a, b) => {
  const dateA = a.split('-').slice(0, 3).join('-');
  const dateB = b.split('-').slice(0, 3).join('-');
  return dateA < dateB ? 1 : -1;
};

/**
 * Create a compatible pubDate from dateTime.
 *
 * @param {string} dateTime - Datetime format YYYY-MM-DD HH:MM(:SS)
 * @returns {string} pubDate format, such as "Mon, 27 Mar 2017 01:04:59 GMT"
 */
const createPubDate = (dateTime) => {
  const date = new Date(dateTime);
  const hours = zeroPad(date.getHours());
  const minutes = zeroPad(date.getMinutes());
  const seconds = zeroPad(date.getSeconds());
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()} ${hours}:${minutes}:${seconds} GMT`;
};

/**
 * The main function.
 */
const main = () => {
  const posts = readdirSync(RENDERED_DIR);
  const items = posts
    .sort(descendingDateSort)
    .map(name => JSON.parse(readFileSync(RENDERED_DIR + name, 'utf8')))
    .map(json => ({
      title: json.title,
      pubDate: createPubDate(json.dateTime),
      link: `${BLOG_HOME_LINK}?post=${json.fileName.split('.')[0]}`,
      description: json.description || 'No description',
    }))
    .map(toItemXml);
  const xml = TEMPLATE_START + items.join('\n') + TEMPLATE_END;
  writeFileSync(FEED_PATH, xml, 'utf8');
  console.log('Created rss.xml');
};

main();
