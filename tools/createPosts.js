const { readFileSync, writeFileSync } = require('fs');
const slugify = require('slugify');

/** Path to posts JSON */
const POSTS_PATH = '../assets/postImport.json';

/**
 * Replace all instances with a replacement.
 *
 * @param {string} s - String to operate on.
 * @param {string} remove - String to remove.
 * @param {string} add - String to add.
 * @returns {string} Updated string.
 */
const replace = (s, remove, add) => s.split(remove).join(add);

/**
 * Transform HTML.
 *
 * @param {string} html - The HTML.
 * @returns {string}.
 */
const transformHTML = (html) => {
  // Paragraphs
  let result = replace(html, '\r\n', '\n');

  // Headers (handle strong for emphasis too)
  result = replace(result, '\n<strong>', '\n<h2>');

  // Encoded HTML
  result = replace(result, '&lt;', '<');
  result = replace(result, '&gt;', '>');
  result = replace(result, '&quot;', '"');
  result = replace(result, '&amp;', '&');

  // Links
  while (result.includes('https://ninedof.files.wordpress.com')) {
    result = replace(result, 'https://ninedof.files.wordpress.com', '/assets/media');
  }

  // Code snippets (TODO highlighter)
  while (result.includes('[code language=')) {
    const codeMetaStart = result.indexOf('[code language=');
    const codeMetaEnd = result.indexOf(']', codeMetaStart);
    const languageStart = codeMetaStart + '[code language='.length + 1;
    const languageEnd = result.indexOf('"]', languageStart);
    const language = result.substring(languageStart, languageEnd);

    // Leave language for later highlighting
    result = replace(result, `[code language="${language}"]`, `<!-- language="${language}" -->\n<code>`);

    result = replace(result, `[code language="${language}"]`, '<code>');
    result = replace(result, '[/code]', '</code>');
  }

  // Cleanup double spaces before links
  result = replace(result, '  <a ', ' <a ');

  return result;
};

/**
 * Generate a post.
 *
 * @param {Object} post - The post.
 * @returns {string} post.
 */
const generatePost = (post) => transformHTML(post.body);

/**
 * The main function.
 */
const main = async () => {
  const posts = require(POSTS_PATH);
  const history = {};

  posts.forEach((post, index) => {
    const md = generatePost(post);

    const [year, month, day] = post.postDate.split(' ')[0].split('-');
    if (!history[year]) {
      history[year] = {};
    }
    if (!history[year][month]) {
      history[year][month] = {};
    }

    const postFileName = `${index}-${slugify(post.title, { remove: /[*+~.()'"!#:@\/]/g })}`;
    const postFilePath = `../posts/${postFileName}.html`;

    history[year][month][day] = {
      title: post.title,
      file: `${postFileName}.html`,
    };
    writeFileSync(postFilePath, md, 'utf8');
    console.log(`Wrote ${postFilePath}`);
  });

  writeFileSync('../assets/history.json', JSON.stringify(history, null, 2), 'utf8');
};

main();
