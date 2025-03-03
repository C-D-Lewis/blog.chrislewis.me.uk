/* eslint-disable brace-style */
/* eslint-disable no-param-reassign */
// Strings
const STRING_DELIMITERS = ['"', '\'', '`'];

// Terraform
const TERRAFORM_KEYWORDS = [
  'resource', 'var', 'origin ', 'launch_template ', 'website ', 'default_cache_behavior ',
  'forwarded_values ', 'cookies ', 'restrictions ', 'geo_restriction ', 'viewer_certificate ',
  'alias ',
];

// JavaScript
const JAVASCRIPT_SYNTAX = ['{', '}', ',', '\'', '(', ')', ';', '[', ']', ': ', ' .'];
const JAVASCRIPT_KEYWORDS = [
  'new ', 'if ', 'for ', 'else ', 'throws ', 'async ', 'await ', 'return ', 'break', '&&', '||', 'try ',
  'catch ', ' = ', ' => ', '!==', '===', 'export ', ' ? ', ' : ', ' + ', ' - ', ' / ', '!', 'throw ',
  // Interferes with: mocha test case names
  // 'return',
];
const JAVASCRIPT_BLUEWORDS = [
  'const ', 'let ', ' Object', 'exports', 'function', 'console', 'window', 'process', 'var ',
];

// TypeScript
const TYPESCRIPT_SYNTAX = JAVASCRIPT_SYNTAX.concat([
  ':', ' | ',
  // '<', '>', Interferes with existing HTML in output...
]);
const TYPESCRIPT_KEYWORDS = JAVASCRIPT_KEYWORDS.concat([
  ' extends', '?', 'import', ' from ', 'declare',
]);
const TYPESCRIPT_BLUEWORDS = JAVASCRIPT_BLUEWORDS.concat([
  'interface ', ' object', 'string', ' void', 'boolean', 'integer', 'Function', 'undefined', 'type ', ' false',
  'FabricateComponent', 'StateShape', 'HTMLElement',
]);

// Dockerfile
const DOCKERFILE_KEYWORDS = [
  'FROM', 'RUN', 'WORKDIR', 'ENV', 'ARG', 'ENTRYPOINT', 'COPY',
];

// Python
const PYTHON_SYNTAX = [',', '(', ')', '[', ']', ':', '{', '}', '@', ' / ', '.'];
const PYTHON_KEYWORDS = [
  'if ', ' else', ' = ', 'import ', 'not ', ' in ', 'for ', 'from ', '*', 'global ', ' == ',
  ' continue', ' as ', ' >= ', ' <= ', ' and ', ' return ', ' != ', ' try:', ' except ', ' with ',
];
const PYTHON_GREENWORDS = [
  ' print',
];

// C/C++
const C_KEYWORDS = [
  'define', 'include ', 'static', 'const', ' = ', 'return ', '->', 'if', ' else', 'while ', '+= ', '&', ' else ', '== ', ' break',
];
const C_SYNTAX = [',', '(', ')', '[', ']', ':', '{', '}', ';'];
const C_BLUEWORDS = ['float', 'NUM_NOTES', 'struct ', 'int ', 'uint64_t', 'void ', 'bool ', ' true', ' false'];

// Java
const JAVA_KEYWORDS = ['public', 'static', 'final', 'private', 'void', ' extends ', 'import ', 'package ', ' implements ', 'if ', 'return ', ' new ', ' || ', ' && '];
const JAVA_BLUEWORDS = ['@Override', '@EventHandler', 'String ', ' class ', ' true', ' false'];

// Shell/bash
const SHELL_KEYWORDS = ['set ', 'export ', ' then', ' do', 'if ', 'fi', ' || ', 'true', 'while ', 'done', '! '];
const SHELL_SYNTAX = ['[[', ']];', '];', ']]', '$(', ')', ' [']; // Order matters here a bit, which is annoying

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
    // Note - a single quote inside double quoted string causes an infinite loop
    let strStart = line.indexOf(d);
    while (strStart >= 0) {
      const strEnd = line.indexOf(d, strStart + 1) + 1;  // Include ending delimiter
      strings.push(line.substring(strStart, strEnd));

      strStart = line.indexOf(d, strEnd + 1);
    }

    // Replace with classes
    strings.forEach((string) => {
      // Note: JSON with "type": "string" breaks if classname is 'string'
      line = line.split(string).join(`<span class="_string">${string}</span>`);
    });
  });

  return line;
};

/**
 * Format name and args for a Python 'def'
 *
 * @param {string} line - The line to process.
 * @returns {string} Formatted python 'def' line.
 */
const handlePythonDef = (line) => {
  const [, rest] = line.split('def ');
  const [name, args] = rest.split('(');
  const [argStr] = args.split(')');
  const argNames = argStr.split(',');
  const indent = line.split(' ').filter((p) => p === '').length;

  let output = `<span class="python-blue">${' '.repeat(indent)}def </span><span class="python-green">${name}</span><span class="js-syntax">(</span>`;
  argNames.forEach((arg, i) => {
    output += `<span class="python-orange">${arg}</span>`;

    if (i !== argNames.length - 1) {
      output += '<span class="js-syntax">,</span>';
    }
  });
  output += '<span class="js-syntax">):</span>';
  return output;
};

/**
 * Map a friendly language name for display.
 *
 * @param {string} language - Language identifier.
 * @returns {string} Human friendly language name.
 */
const friendlyLangName = (language) => {
  const map = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    json: 'JSON',
    text: 'Text',
    textwrap: ' ',
    cpp: 'C++',
    'c++': 'C++',
    none: 'Text',
    python: 'Python',
    terraform: 'Terraform',
    c: 'C',
    shell: 'Shell',
    dockerfile: 'Dockerfile',
    java: 'Java',
    html: 'HTML',
    yaml: 'YAML',
    ts: 'TypeScript',
    typescript: 'TypeScript',
  };
  if (!map[language]) throw new Error(`Unmappable language name: ${language}`);

  return map[language];
};

/**
 * Replace key words with styled spans.
 *
 * @param {string} line - Line of code.
 * @param {string} language - Language to use
 * @returns {string} Code with keywords wrapped in styled spans.
 */
const toHighlightedLine = (line, language) => {
  // Hide language annotation
  if (line.includes('```')) return '';

  // Hide the code block start and end syntax
  if (line.includes('```')) return line;

  // No highlighting for text
  if (['none', 'text'].includes(language)) return line;

  // Terraform
  if (language.includes('terraform')) {
    // Strings
    line = highlightStrings(line);

    TERRAFORM_KEYWORDS.forEach((keyword) => {
      line = line.split(keyword).join(`<span class="tf-keyword">${keyword}</span>`);
    });
    JAVASCRIPT_SYNTAX.forEach((syntax) => {
      line = line.split(syntax).join(`<span class="js-syntax">${syntax}</span>`);
    });
  }

  // JSON
  else if (language.includes('json')) {
    // Strings
    line = highlightStrings(line);

    JAVASCRIPT_SYNTAX.forEach((syntax) => {
      line = line.split(syntax).join(`<span class="js-syntax">${syntax}</span>`);
    });
  }

  // JavaScript
  else if (['js', 'javascript'].includes(language)) {
    const trimmed = line.trim();

    // Code comments
    if (
      trimmed.startsWith('//')
      || trimmed.startsWith('/**')
      || trimmed.startsWith('*')
      || trimmed.startsWith('*/')) {
      return `<span class="comment">${line}</span>`;
    }

    // Strings
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

  // Java
  else if (['java'].includes(language)) {
    const trimmed = line.trim();

    // Code comments
    if (
      trimmed.startsWith('//')
      || trimmed.startsWith('/**')
      || trimmed.startsWith('*')
      || trimmed.startsWith('*/')) {
      return `<span class="comment">${line}</span>`;
    }

    // Strings
    line = highlightStrings(line);

    JAVASCRIPT_SYNTAX.forEach((syntax) => {
      line = line.split(syntax).join(`<span class="js-syntax">${syntax}</span>`);
    });
    JAVA_KEYWORDS.forEach((keyword) => {
      line = line.split(keyword).join(`<span class="js-keyword">${keyword}</span>`);
    });
    JAVA_BLUEWORDS.forEach((blueword) => {
      line = line.split(blueword).join(`<span class="js-blueword">${blueword}</span>`);
    });
  }

  // Shell
  else if (['shell', 'bash'].includes(language)) {
    // Code comments
    if (line.trim().startsWith('#')) {
      return `<span class="comment">${line}</span>`;
    }

    // Strings
    line = highlightStrings(line);

    SHELL_KEYWORDS.forEach((keyword) => {
      line = line.split(keyword).join(`<span class="js-keyword">${keyword}</span>`);
    });
    SHELL_SYNTAX.forEach((syntax) => {
      line = line.split(syntax).join(`<span class="js-syntax">${syntax}</span>`);
    });
  }

  // Dockerfile
  else if (['dockerfile', 'Dockerfile'].includes(language)) {
    // Code comments
    if (line.trim().startsWith('#')) {
      return `<span class="comment">${line}</span>`;
    }

    // Strings
    line = highlightStrings(line);

    DOCKERFILE_KEYWORDS.forEach((keyword) => {
      line = line.split(keyword).join(`<span class="dockerfile-keyword">${keyword}</span>`);
    });
  }

  // Python
  else if (language.includes('python')) {
    // Strings
    line = highlightStrings(line);

    // Code comments
    if (line.trim().startsWith('#')) {
      return `<span class="comment">${line}</span>`;
    }

    // For def, the token after is a function
    if (line.includes('def ')) {
      line = handlePythonDef(line);
    }

    PYTHON_KEYWORDS.forEach((keyword) => {
      line = line.split(keyword).join(`<span class="js-keyword">${keyword}</span>`);
    });
    PYTHON_SYNTAX.forEach((syntax) => {
      line = line.split(syntax).join(`<span class="js-syntax">${syntax}</span>`);
    });
    PYTHON_GREENWORDS.forEach((greenword) => {
      line = line.split(greenword).join(`<span class="python-green">${greenword}</span>`);
    });
  }

  // C/C++
  else if (['c', 'c++', 'cpp'].includes(language)) {
    // Strings
    line = highlightStrings(line);

    // Code comments
    if (['//', '/**', '* ', '*/'].find((p) => line.trim().startsWith(p))) {
      return `<span class="comment">${line}</span>`;
    }

    C_KEYWORDS.forEach((keyword) => {
      line = line.split(keyword).join(`<span class="js-keyword">${keyword}</span>`);
    });
    C_SYNTAX.forEach((syntax) => {
      line = line.split(syntax).join(`<span class="js-syntax">${syntax}</span>`);
    });
    C_BLUEWORDS.forEach((syntax) => {
      line = line.split(syntax).join(`<span class="js-blueword">${syntax}</span>`);
    });
  }

  // YAML
  else if (['yaml', 'yml'].includes(language)) {
    // Comments
    if (['# '].find((p) => line.trim().startsWith(p))) {
      return `<span class="comment">${line}</span>`;
    }

    if (line.includes(':')) {
      // All lines are pink before : and yellow after
      const [pinkStr, ...rest] = line.split(':');
      const yellowStr = rest.join(':');
      line = `<span class="js-keyword">${pinkStr}</span><span class="comment_regular">:</span><span class="_string">${yellowStr}</span>`;
    }
  }

  // TypeScript
  else if (['ts', 'typescript'].includes(language)) {
    const trimmed = line.trim();

    // Code comments
    if (
      trimmed.startsWith('//')
      || trimmed.startsWith('/**')
      || trimmed.startsWith('*')
      || trimmed.startsWith('*/')) {
      return `<span class="comment">${line}</span>`;
    }

    // Strings
    line = highlightStrings(line);

    TYPESCRIPT_KEYWORDS.forEach((keyword) => {
      line = line.split(keyword).join(`<span class="js-keyword">${keyword}</span>`);
    });
    TYPESCRIPT_BLUEWORDS.forEach((blueword) => {
      line = line.split(blueword).join(`<span class="js-blueword">${blueword}</span>`);
    });
    TYPESCRIPT_SYNTAX.forEach((syntax) => {
      line = line.split(syntax).join(`<span class="js-syntax">${syntax}</span>`);
    });
  }

  return line;
};

/**
 * Replace key words with styled spans in a block of code.
 *
 * @param {string} block - Paragraph of code.
 * @param {string} language - Language extracted from triple-backtick $LANGUAGE in block.
 * @returns {string} Code with keywords wrapped in styled spans.
 */
const highlight = (block, language) => (!language
  ? block
  : block
    .split('\n')
    .map((line) => toHighlightedLine(line, language))
    .join('\n'));

/**
 * Join paragraphs that span a code section and apply highlighting
 *
 * @param {string[]} sections - List of paragraph sections.
 * @returns {string[]} sections - Modified list of paragraph sections.
 */
const highlightCodeParagraphs = (sections) => {
  const resultSections = [];

  // For each section
  let language;
  let isCodeBlock = false;
  let snippetSections = [];
  sections.forEach((section) => {
    // If contains ```, set isCodeBlock
    if (section.startsWith('```') && !isCodeBlock) {
      isCodeBlock = true;

      // Check the language and remove tag
      language = section.slice(3, section.indexOf('\n'));
    }

    // If !isCodeBlock, just add it section
    if (!isCodeBlock) {
      resultSections.push(section);
      return;
    }

    // Highlight and gather joinable sections
    if (isCodeBlock) {
      // Add joinable sections
      snippetSections.push(section);

      // If contains ``` unset isCodeBlock - could be the same section if just one paragraph
      if (section.endsWith('```')) {
        // Add styling and store
        const preClass = language === 'textwrap' ? 'wrap' : '';
        const highlightedSnippet = `<div class="lang-label lang-${language}">${friendlyLangName(language)}</div>
<pre class="${preClass}"><div class="code-block">
${highlight(snippetSections.join('\n\n'), language).trim()}
</div></pre>`;
        resultSections.push(highlightedSnippet);

        // Reset for next code block
        isCodeBlock = false;
        language = null;
        snippetSections = [];
      }
    }
  });

  return resultSections;
};

module.exports = {
  highlightCodeParagraphs,
};
