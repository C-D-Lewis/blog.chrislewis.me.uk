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
 * Transform HTML to markdown.
 *
 * @param {string} html - The HTML.
 * @returns {string} The transformed markdown.
 */
const transformHTML = (html) => {
  // Paragraphs
  let result = replace(html, '\r\n', '\n');
  // Headers (handle strong for emphasis too)
  result = replace(result, '\n<strong>', '\n## ');
  result = replace(result, '<strong>', '');
  result = replace(result, '</strong>', '');
  // Lists
  result = replace(result, '<ul>', '\n');
  result = replace(result, '</ul>', '\n');
  result = replace(result, '<li>', '- ');
  result = replace(result, '</li>', '');
  // Links
  while (result.includes('<a ')) {
    const start = result.indexOf('<a ');
    const end = result.indexOf('</a>') + 4;

    // Images are inside links in Wordpress
    const link = result.substring(start, end);
    let src;
    let srcStart;
    if (link.includes('<img')) {
      // Just take the image
      srcStart = link.indexOf('src="') + 5;
      src = link.substring(srcStart, link.indexOf('" ', srcStart));
      const newSrc = src.replace('https://ninedof.files.wordpress.com', '/assets/media');
      const newImage = `![](${newSrc})`;
      result = result.replace(link, newImage);
      continue;
    }

    srcStart = link.indexOf('href="') + 6;
    src = link.substring(srcStart, link.indexOf('"', srcStart));
    const labelStart = link.indexOf('>') + 1;
    const label = link.substring(labelStart, link.indexOf('</a', labelStart));
    const newLink = ` [${label.trim()}](${src})`;
    result = result.replace(link, newLink);
  }

  // Cleanup double spaces before links
  result = replace(result, '  [', ' [');

  return result;
};

/**
 * Generate a markdown version of the post.
 *
 * @param {Object} post - The post.
 * @param {number} index - Post array index.
 * @returns {string} markdown post.
 */
const generateMarkdown = (post, index) => `---
index: ${index}
title: ${post.title}
postDate: ${post.postDate}
original: ${post.link}
---

${transformHTML(post.body)}
`;

/**
 * The main function.
 */
const main = async () => {
  const posts = require(POSTS_PATH);
  const history = {};

  posts.forEach((post, index) => {
    const md = generateMarkdown(post, index);

    const [year, month, day] = post.postDate.split(' ')[0].split('-');
    if (!history[year]) {
      history[year] = {};
    }
    if (!history[year][month]) {
      history[year][month] = {};
    }

    const postFileName = `${index}-${slugify(post.title, { remove: /[*+~.()'"!#:@\/]/g })}`;
    const postFilePath = `../posts/${postFileName}}.md`;

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
