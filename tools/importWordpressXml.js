const { parseString } = require('xml2js');
const { promisify } = require('util');
const { readFileSync, writeFileSync } = require('fs');

const [path] = process.argv.slice(2);

const parseStringAsync = promisify(parseString);

/**
 * The main function.
 */
const main = async () => {
  const xml = readFileSync(path, 'utf8');
  const { rss } = await parseStringAsync(xml);

  const pages = rss.channel[0].item;
  const posts = pages
    .filter(p => p['wp:post_type'].includes('post'))
    .map(p => ({
      id: p['wp:post_id'][0],
      title: p.title[0],
      link: p.link[0],
      pubDate: p.pubDate[0],
      postDate: p['wp:post_date'][0],
      body: p['content:encoded'][0],
    }));

  console.log(`Extracted ${posts.length} posts`);
  writeFileSync('../assets/posts.json', JSON.stringify(posts, null, 2), 'utf8');
};

main();
