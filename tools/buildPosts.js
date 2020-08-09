const { readdirSync, readFileSync } = require('fs');

const historyPath = `${__dirname}/../assets/history.json`;
const postsDir = `${__dirname}/../posts`;

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
 * @param {string} name - File name.
 * @returns {Object} Model of the post.
 */
const postToModel = (name) => {
  const text = readFileSync(`${postsDir}/${name}`, 'utf8');
  const [title, dateTime] = text.split('\n');
  const model = {
    title,
    dateTime,
    components: [],
  };

  const body = text.split('---')[1].trim();
  const sections = body.split('\n\n').map(p => p.trim());
  sections.forEach((section) => {
    // Image
    if (section.startsWith('![')) {
      const description = section.substring(
        section.indexOf('[') + 1,
        section.indexOf(']'),
      );
      const location = section.substring(
        section.indexOf('(') + 1,
        section.indexOf(')'),
      );

      model.components.push({
        type: 'image',
        description,
        location,
      });
      return;
    }

    // H3, H2, H1...
    if (section.startsWith('#')) {
      const level = section.split('#').length - 1;
      const text = section.split('# ')[1];

      model.components.push({
        type: 'header',
        level,
        text,
      });
      return;
    }

    // Paragraph
    model.components.push({
      type: 'paragraph',
      content: transformParagraph(section),
    });
  });

  console.log(model)
  return model;
};

/**
 * The main function.
 */
const main = () => {
  const history = require(historyPath);
  const files = readdirSync(postsDir);

  const models = files.map(postToModel);

  // Update history

};

main();
