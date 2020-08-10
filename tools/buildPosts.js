const { readdirSync, readFileSync, writeFileSync } = require('fs');

const DATE_TIME_REGEX = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/g;

const historyPath = `${__dirname}/../assets/history.json`;
const postsDir = `${__dirname}/../posts`;

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
 * Process the pseudomarkdown file into component model.
 *
 * @param {string} fileName - File name.
 * @returns {Object} Model of the post.
 */
const postToModel = (fileName) => {
  const text = readFileSync(`${postsDir}/${fileName}`, 'utf8');
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
  const sections = body.split('\n\n').map(p => p.trim());
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
  const history = require(historyPath);
  const files = readdirSync(postsDir);

  // Build post models
  const models = files.map(postToModel);

  models.forEach((model) => {
    // Save model file
    const fileName = model.fileName.split('.')[0];
    const renderPath = `${__dirname}/../assets/rendered/${fileName}.json`;
    const [year, month] = model.dateTime.split('-');
    writeFileSync(renderPath, JSON.stringify(model, null, 2), 'utf8');
    console.log(`Rendered ${renderPath}`);

    // Update history file
    if (!history[year]) {
      history[year] = {};
    }
    if (!history[year][month]) {
      history[year][month] = [];
    }
    if (history[year][month].find(p => p.title === model.title)) {
      const index = history[year][month].findIndex(p => p.title === model.title);
      history[year][month].splice(index, 1);
    }

    const filePath = `assets/rendered/${fileName}.json`;
    history[year][month].push({ title: model.title, file: filePath });
  });
  writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf8');
  console.log('Updated history.json');
};

main();
