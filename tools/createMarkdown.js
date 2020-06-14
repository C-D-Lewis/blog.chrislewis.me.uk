const { readFileSync, writeFileSync } = require('fs');
const slugify = require('slugify');

const POSTS_PATH = '../assets/posts.json';

const replace = (s, remove, add) => s.split(remove).join(add);

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

const generateMarkdown = (post, index) => `---
index: ${index}
title: ${post.title}
postDate: ${post.postDate}
original: ${post.link}
---

${transformHTML(post.body)}
`;

const main = async () => {
  const json = require(POSTS_PATH);

  json.forEach((post, index) => {
    const md = generateMarkdown(post, index);

    const outFile = `../posts/${index}-${slugify(post.title, { remove: /[*+~.()'"!#:@\/]/g })}.md`;
    writeFileSync(outFile, md, 'utf8');
    console.log(`Wrote ${outFile}`);
  });
};

main();
