const { readdirSync, readFileSync, writeFileSync } = require('fs');

const DATE_TIME_REGEX = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/g;
const HISTORY_PATH = `${__dirname}/../assets/postHistory.js`;
const POSTS_DIR = `${__dirname}/../posts`;
const TERRAFORM_KEYWORDS = [
  'resource', 'var', 'origin ', 'launch_template ', 'website ',
  'default_cache_behavior ', 'forwarded_values ', 'cookies ', 'restrictions ',
  'geo_restriction ', 'viewer_certificate '];
const JAVASCRIPT_KEYWORDS = ['if', 'for', 'else', 'throws'];
const JAVASCRIPT_BLUEWORDS = ['const', 'let', 'Object', 'exports'];

let numRendered = 0;

/**
 * Transform bits inside a paragraph
 *
 * @param {string} para - Paragraph to transform.
 * @returns {string} Modified paragraph.
 */
const transformParagraph = (para) => {
  // Links
  while (para.includes('](')) {
    const labelStart = para.indexOf('[');
    const labelEnd = para.indexOf('](', labelStart);
    const label = para.substring(labelStart + 1, labelEnd);
    const locationStart = labelEnd + 2;
    const locationEnd = para.indexOf(')', locationStart);
    const location = para.substring(locationStart, locationEnd);

    para = para.substring(0, labelStart)
     + `<a class="link" target="_blank" href="${location}">${label}</a>`
     + para.substring(locationEnd + 1);
  }

  return para;
};

/**
 * Replace key words with styled spans.
 *
 * @param {string} block - Paragraph of code.
 * @return {string} Code with keywords wrapped in styled spans.
 */
const highlight = (block) => {
  const classes = block.split('\n')[0];

  // Terraform
  if (classes.includes('terraform')) {
    TERRAFORM_KEYWORDS.forEach((keyword) => {
      block = block.split(keyword).join(`<span class="tf-keyword">${keyword}</span>`);
    });
  }

  // JavaScript
  if (classes.includes('javascript')) {
    JAVASCRIPT_KEYWORDS.forEach((keyword) => {
      block = block.split(keyword).join(`<span class="js-keyword">${keyword}</span>`);
    });
    JAVASCRIPT_BLUEWORDS.forEach((blueword) => {
      block = block.split(blueword).join(`<span class="js-blueword">${blueword}</span>`);
    });
  }

  return block;
};

/**
 * Join paragraphs that span a code section.
 *
 * @param {string[]} sections - List of paragraph sections.
 * @returns {string[]} sections - Modified list of paragraph sections.
 */
const joinCodeParagraphs = (sections) => {
  let start = sections.findIndex(p => p.includes('<pre') && !p.includes('</pre>'));
  let endIndex = sections.slice(start).findIndex(p => p.includes('</pre'));
  while (endIndex !== -1) {
    if (start === -1) break;

    // Join the paragraphs between code start/end
    const end = endIndex + start + 1;
    const joinedSection = '' + sections.slice(start, end).join('\n\n');
    sections.splice(start, end - start);
    sections.splice(start, 0, highlight(joinedSection));

    start = sections.findIndex(p => p.includes('<pre') && !p.includes('</pre>'));
    endIndex = sections.slice(start).findIndex(p => p.includes('</pre'));
  }
};

/**
 * Process the pseudomarkdown file into component model.
 *
 * @param {string} fileName - File name.
 * @returns {Object} Model of the post.
 */
const postToModel = (fileName) => {
  const text = readFileSync(`${POSTS_DIR}/${fileName}`, 'utf8');
  const [title, dateTime, tags] = text.split('\n').map(p => p.trim());
  if (!title.length || !dateTime.match(DATE_TIME_REGEX) || !text.includes('---\n')) {
    throw new Error(`metadata error: ${fileName}`);
  }

  const model = {
    title,
    fileName,
    dateTime,
    tags: tags !== '---' ? tags.split(',') : [],
    components: [],
  };
  const body = text.split('---')[1].trim();
  const sections = body.split('\n\n');

  // Join paragraphs inside code blocks
  joinCodeParagraphs(sections);

  sections.forEach((section) => {
    // Image
    if (section.startsWith('![')) {
      const description = section.substring( section.indexOf('[') + 1, section.indexOf(']'));
      const src = section.substring(section.indexOf('(') + 1, section.indexOf(')'));
      model.components.push({ type: 'image', description, src });
      return;
    }

    // H3, H2, H1...
    if (section.startsWith('#')) {
      const level = section.split('#').length - 1;
      const text = section.split('# ')[1];
      model.components.push({ type: 'header', level, text });
      return;
    }

    // Paragraph
    model.components.push({ type: 'paragraph', text: transformParagraph(section) });
  });

  return model;
};

/**
 * The main function.
 */
const main = () => {

  // Build post models
  const files = readdirSync(POSTS_DIR);
  const models = files.map(postToModel);

  const history = {};
  models.forEach((model) => {
    // Save model file
    const fileName = model.fileName.split('.')[0];
    const renderPath = `${__dirname}/../assets/rendered/${fileName}.json`;
    const [year, month] = model.dateTime.split('-');
    writeFileSync(renderPath, JSON.stringify(model, null, 2), 'utf8');
    numRendered++;

    // Update history file
    if (!history[year]) {
      history[year] = {};
    }
    if (!history[year][month]) {
      history[year][month] = [];
    }

    const filePath = `assets/rendered/${fileName}.json`;
    history[year][month].push({ title: model.title, file: filePath, fileName: fileName });
  });
  console.log(`Rendered ${numRendered} posts`);

  writeFileSync(HISTORY_PATH, `window.postHistory = ${JSON.stringify(history, null, 2)}`, 'utf8');
  console.log('Created history.js');
};

main();
