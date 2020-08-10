const { readFileSync, writeFileSync } = require('fs');
const slugify = require('slugify');

/** Path to posts JSON */
const POSTS_PATH = '../assets/import/posts.json';

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

  // Tabs
  result = replace(result, '\t', '  ');

  // Headers (handle strong for emphasis too)
  result = replace(result, '\n<strong>', '\n## ');
  result = replace(result, '</strong>\n', '\n');

  // Encoded HTML
  result = replace(result, '&lt;', '<');
  result = replace(result, '&gt;', '>');
  result = replace(result, '&quot;', '"');
  result = replace(result, '&amp;', '&');

  // Lists
  result = replace(result, '<ul>', '');
  result = replace(result, '   <li>', '• ');
  result = replace(result, '</li>', '\n');
  result = replace(result, '</ul>\n', '');

  // Links
  while (result.includes('https://ninedof.files.wordpress.com')) {
    result = replace(result, 'https://ninedof.files.wordpress.com', '/assets/import/media');
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
    result = replace(result, '[code]', '<pre><code>');
    result = replace(result, '[/code]', '</code></pre>');
  }

  // Cleanup double spaces before links
  result = replace(result, '  <a ', ' <a ');

  // Remove double paragraphs
  result = replace(result, '\n\n\n', '\n\n');

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
 * Easily list 100s of posts.
 */
const zeroPad = (val) => {
  if (val < 10) return `000${val}`;
  if (val < 100) return `00${val}`;
  if (val < 1000) return `0${val}`;
};

/**
 * The main function.
 */
const main = async () => {
  const posts = require(POSTS_PATH);

  posts.forEach((post, index) => {
    const md = generatePost(post);
    const fileContent = `${post.title}
${post.postDate}
${post.tags.join(',')}
---

${md}
`;

    const postFileName = `${zeroPad(index)}-${slugify(post.title, { remove: /[*+~.()'"!#:@\/]/g })}`;
    const postFilePath = `${__dirname}/../assets/import/posts/${postFileName}.html`;

    writeFileSync(postFilePath, fileContent, 'utf8');
    console.log(`Wrote ${postFilePath}`);
  });
};

main();
