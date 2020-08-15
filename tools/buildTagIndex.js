const { readdirSync, readFileSync, writeFileSync } = require('fs');

const RENDERED_DIR = `${__dirname}/../assets/rendered/`;
const TAG_INDEX_PATH = `${__dirname}/../assets/tagIndex.json`;  // CANNOT CHANGE

/**
 * The main function.
 */
const main = () => {
  const tagIndex = {};

  const posts = readdirSync(RENDERED_DIR);
  posts
    .map(name => JSON.parse(readFileSync(RENDERED_DIR + name, 'utf8')))
    .forEach((json) => {
      const { tags, fileName } = json;

      tags.forEach((tag) => {
        if (!tagIndex[tag]) {
          tagIndex[tag] = [];
        }

        if (tagIndex[tag].includes(fileName)) return;

        // List all posts for a given tag it has
        const renderedName = `${fileName.split('.')[0]}.json`;
        tagIndex[tag].push(renderedName);
      });
    });
  writeFileSync(TAG_INDEX_PATH, JSON.stringify(tagIndex, null, 2), 'utf8');
  console.log(`Wrote ${TAG_INDEX_PATH}`);
};

main();
