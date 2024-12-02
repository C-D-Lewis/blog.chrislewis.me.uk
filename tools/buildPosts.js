const { readdirSync, readFileSync, writeFileSync } = require('fs');
const { highlightCodeParagraphs } = require('./modules/syntax');

const DATE_TIME_REGEX = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/g;
const HISTORY_PATH = `${__dirname}/../assets/postHistory.js`;
const POSTS_DIR = `${__dirname}/../posts`;

let numRendered = 0;

/**
 * Transform bits inside a paragraph
 *
 * @param {string} para - Paragraph to transform.
 * @returns {string} Modified paragraph.
 */
const renderMarkdownText = (para) => {
  // Links
  while (para.includes('](')) {
    const labelStart = para.indexOf('[');
    const labelEnd = para.indexOf('](', labelStart);
    const label = para.substring(labelStart + 1, labelEnd);
    const locationStart = labelEnd + 2;
    const locationEnd = para.indexOf(')', locationStart);
    const location = para.substring(locationStart, locationEnd);

    // eslint-disable-next-line no-param-reassign
    para = `${para.substring(0, labelStart)}<a class="link" target="_blank" href="${location}">${label}</a>${para.substring(locationEnd + 1)}`;
  }

  // Lists
  if (para.startsWith('- ')) {
    const [, text] = para.split('- ');

    return `<table>
      <tr>
        <td style="padding-right:10px; vertical-align: baseline;">•</td>
        <td>${text}</td>
      </tr>
    </table>`;
  }

  return para;
};

/**
 * Process the pseudomarkdown file into component model.
 *
 * @param {string} fileName - File name.
 * @returns {object} Model of the post.
 */
const postToModel = (fileName) => {
  const text = readFileSync(`${POSTS_DIR}/${fileName}`, 'utf8');

  const [title, dateTime, tags] = text.split('\n').map((p) => p.trim());
  if (!title.length) {
    throw new Error(`${fileName} Metadata error: missing title`);
  }
  if (!dateTime.match(DATE_TIME_REGEX)) {
    throw new Error(`${fileName} Metadata error: bad dateTime`);
  }
  if (!text.includes('---\n')) {
    throw new Error(`${fileName} Metadata error: no separator`);
  }

  const model = {
    fileName,
    title,                                        // Line 1
    dateTime,                                     // Line 2
    tags: tags !== '---' ? tags.split(',') : [],  // Line 3
    components: [],
  };

  // Body is aftet YAML metadata
  const rawSections = text.split('---')[1].trim().split('\n\n');

  // Join paragraphs inside code blocks
  const sections = highlightCodeParagraphs(rawSections);

  // Render special paragraph types
  sections.forEach((section) => {
    // Image
    if (section.startsWith('![')) {
      const description = section.substring(section.indexOf('[') + 1, section.indexOf(']'));
      const srcStr = section.substring(section.indexOf('(') + 1, section.indexOf(')'));

      // Options?
      let type = 'image';
      const [src, opts] = srcStr.split(' ');
      if (opts) {
        if (opts.includes('no-shadow')) {
          type = 'image-no-shadow';
        }
      }

      model.components.push({ type, description, src });
      return;
    }

    // H3, H2, H1...
    if (section.startsWith('#')) {
      const level = section.split('#').length - 1;
      const hText = section.split('# ')[1];
      model.components.push({ type: 'header', level, text: hText });
      return;
    }

    // HTML block - untested
    // if (section.startsWith('<') && section.endsWith('>')) {
    //   model.components.push({ type: 'html', html: section });
    //   return;
    // }

    // Paragraph of text
    model.components.push({ type: 'paragraph', text: renderMarkdownText(section) });
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
    numRendered += 1;

    // Update history file
    if (!history[year]) {
      history[year] = {};
    }
    if (!history[year][month]) {
      history[year][month] = [];
    }

    const filePath = `assets/rendered/${fileName}.json`;
    history[year][month].push({ title: model.title, file: filePath, fileName });
  });
  console.log(`Rendered ${numRendered} posts`);

  // Write to history file
  writeFileSync(HISTORY_PATH, `window.postHistory = ${JSON.stringify(history, null, 2)}`, 'utf8');
  console.log('Created history.js');
};

main();
