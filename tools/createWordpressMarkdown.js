const { readFileSync, writeFileSync } = require('fs');
const slugify = require('slugify');

/** Path to posts JSON */
const POSTS_PATH = '../assets/import/posts.json';

let numCreated = 0;

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
  result = replace(result, '  <li>', '• ');
  result = replace(result, '</li>', '\n');
  result = replace(result, '</ul>\n', '');
  result = replace(result, '<ol>', '\n');
  result = replace(result, '</ol>', '\n');

  // Links
  while (result.includes('https://ninedof.files.wordpress.com')) {
    result = replace(result, 'https://ninedof.files.wordpress.com', '/assets/import/media');
  }
  while (result.includes('http://ninedof.files.wordpress.com')) {
    result = replace(result, 'http://ninedof.files.wordpress.com', '/assets/import/media');
  }

  // Images inside anchors
  while (result.includes('<a href="/assets/')) {
    const aStart = result.indexOf('<a href="/assets/');
    const aEnd = result.indexOf('</a>', aStart) + 4;
    const a = result.substring(aStart, aEnd);
    const srcStart = result.indexOf('src="', aStart) + 5;
    const srcEnd = result.indexOf('"', srcStart);
    const src = result.substring(srcStart, srcEnd);

    result = replace(result, a, `![](${src})`);
  }

  // Images not inside anchors
  while (result.includes('<img')) {
    const imgStart = result.indexOf('<img');
    let imgEnd = result.indexOf('</img>', imgStart) + 5;
    // Could be closed with /> instead of >...</img>
    if (imgEnd < imgStart) {
      imgEnd = result.indexOf('/>', imgStart) + 2;
    }
    const img = result.substring(imgStart, imgEnd);
    const srcStart = result.indexOf('src="', imgStart) + 5;
    const srcEnd = result.indexOf('"', srcStart);
    const src = result.substring(srcStart, srcEnd);

    result = replace(result, img, `![](${src})`);
  }

  // Remove redundant paragraphs
  while (result.includes('<p')) {
    const pStart = result.indexOf('<p');
    const pEnd = result.indexOf('>', pStart) + 1;
    const pTag = result.substring(pStart, pEnd);

    result = replace(result, pTag, '');
  }
  result = replace(result, '</p>', '');

  // Code snippets (TODO highlighter)
  while (result.includes('[code language=')) {
    const codeMetaStart = result.indexOf('[code language=');
    const codeMetaEnd = result.indexOf(']', codeMetaStart);
    const languageStart = codeMetaStart + '[code language='.length + 1;
    const languageEnd = result.indexOf('"]', languageStart);
    const language = result.substring(languageStart, languageEnd);

    // Leave language for later highlighting
    result = replace(result, `[code language="${language}"]`, `<!-- language="${language}" -->\n<pre><div class="code-block">`);
    result = replace(result, `[code language="${language}"]`, '<pre><div class="code-block">');
    result = replace(result, '[code]', '<pre><div class="code-block">');
    result = replace(result, '[/code]', '</div></pre>');
  }

  // Cleanup double spaces before links
  result = replace(result, '  <a ', ' <a ');

  // Remove double paragraphs
  result = replace(result, '\n\n\n', '\n\n');

  return result;
};

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
    const md = transformHTML(post.body);
    const fileContent = `${post.title}
${post.postDate}
${post.tags.join(',')}
---

${md}
`;

    const [year, month, day] = post.postDate.split(' ')[0].split('-');
    const slug = slugify(post.title, { remove: /[*+~.()'"!\?#:@\/]/g });
    const postFileName = `${year}-${month}-${day}-${slug}`;
    const postFilePath = `${__dirname}/../posts/${postFileName}.md`;

    writeFileSync(postFilePath, fileContent, 'utf8');
    numCreated++;
  });

  console.log(`Created ${numCreated} WordPress markdown posts`);
};

main();
