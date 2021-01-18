const { readdirSync, readFileSync, writeFileSync } = require('fs');

const DATE_TIME_REGEX = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/g;
const HISTORY_PATH = `${__dirname}/../assets/postHistory.js`;
const POSTS_DIR = `${__dirname}/../posts`;
const TERRAFORM_KEYWORDS = [
  'resource', 'var', 'origin ', 'launch_template ', 'website ', 'default_cache_behavior ',
  'forwarded_values ', 'cookies ', 'restrictions ', 'geo_restriction ', 'viewer_certificate ',
  'alias '
];
const JAVASCRIPT_KEYWORDS = [
  'new ', 'if ', 'for ', 'else ', 'throws ', 'async ', 'await ', 'return ', 'break', '&&', '||', 'try ',
  'catch ', ' = ', ' => ', '!==', '===', 'export ', ' ? ', ' : ',
];
const JAVASCRIPT_BLUEWORDS = [
  'const', 'let', 'Object', 'exports', 'function', 'console', 'window', 'process', 'env',
];
const JAVASCRIPT_SYNTAX = ['{', '}', ',', '\'', '(', ')', ';', '[', ']'];
const STRING_DELIMITERS = ['"', '\'', '`'];

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
 * Highlight strings in code blocks.
 *
 * @param {string} line - Input line of code.
 * @returns {string} Formatted with classes.
 */
const highlightStrings = (line) => {
  STRING_DELIMITERS.forEach((d) => {
    const strings = [];

    // Gather stings
    let strStart = line.indexOf(d);
    while (strStart >= 0) {
      const strEnd = line.indexOf(d, strStart + 1) + 1;  // Include ending delimiter
      strings.push(line.substring(strStart, strEnd));

      strStart = line.indexOf(d, strEnd + 1);
    }

    // Replace with classes
    strings.forEach((string) => {
      line = line.split(string).join(`<span class="string">${string}</span>`);
    })
  });

  return line;
};

/**
 * Replace key words with styled spans.
 *
 * @param {string} line - Line of code.
 * @param {string} language - Language to use
 * @return {string} Code with keywords wrapped in styled spans.
 */
const toHighlightedLine = (line, language) => {
  // Don't modify the <pre><div class=code-block>...
  if (['<pre>', '!--'].some(p => line.includes(p))) return line;

  // Terraform
  if (language.includes('terraform')) {
    line = highlightStrings(line);

    TERRAFORM_KEYWORDS.forEach((keyword) => {
      line = line.split(keyword).join(`<span class="tf-keyword">${keyword}</span>`);
    });
  }

  // JavaScript
  if (['js', 'javascript'].includes(language)) {
    // Code comments
    if (
      line.trim().startsWith('//')
      || line.includes('/**')
      || line.includes(' * ')
      || line.includes(' */')) {
      return `<span class="comment">${line}</span>`;
    }
    
    line = highlightStrings(line);

    JAVASCRIPT_KEYWORDS.forEach((keyword) => {
      line = line.split(keyword).join(`<span class="js-keyword">${keyword}</span>`);
    });
    JAVASCRIPT_BLUEWORDS.forEach((blueword) => {
      line = line.split(blueword).join(`<span class="js-blueword">${blueword}</span>`);
    });
    JAVASCRIPT_SYNTAX.forEach((syntax) => {
      line = line.split(syntax).join(`<span class="js-syntax">${syntax}</span>`);
    });
  }

  return line;
}

/**
 * Replace key words with styled spans in a block of code.
 *
 * @param {string} block - Paragraph of code.
 * @param {string} language - Language extracted from <!-- language="js" --> above block
 * @return {string} Code with keywords wrapped in styled spans.
 */
const highlight = (block, language) => {
  if (!language) return block;

  // Process each line at a time
  block = block.split('\n').map(line => toHighlightedLine(line, language)).join('\n');

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
    // Not a code paragraph (TODO: annotate for component, not inline HTML)
    if (start === -1) break;

    // Possible <!-- language="..." --> annotation at the end of the previous section
    let language = sections[start].includes('language=')
      ? sections[start]
      : sections[start - 1];
    if (language.includes('language=')) {
      const langStart = language.indexOf('language="') + 'language="'.length;
      const langEnd = language.indexOf('"', langStart);
      language = language.slice(langStart, langEnd);
    } else {
      language = null;
    }

    // Join the paragraphs between code start/end
    const end = endIndex + start + 1;
    const joinedSection = '' + sections.slice(start, end).join('\n\n');
    sections.splice(start, end - start);
    sections.splice(start, 0, highlight(joinedSection, language));

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

    // HTML block - untested
    // if (section.startsWith('<') && section.endsWith('>')) {
    //   model.components.push({ type: 'html', html: section });
    //   return;
    // }

    // Paragraph of text
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
