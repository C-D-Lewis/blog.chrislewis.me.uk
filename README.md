# blog

Time to roll my own.

## Post format

Blog posts are written in a simplified Markdown format in `posts`. These are
later converted into JSON objects that can be rendered as components:

* First line is the title.

* Second line is the date and time in `YYYY-MM-DD HH:MM` format.

* Each paragraph is treated as a block of text.

* Each link is converted to an achor.

* Images are converted to `img`.

* Headings are standard header levels.


## Building the blog

All posts in `posts` are built using their metadata to create component lists
that are rendered on the page, and are placed in `rendered`.

The navigation of months per year is built in `tools/createWordpressHtml.js`,
and supplemented for new posts in `posts` by `tools/buildPosts.js`.

```
node tools/buildPosts.js
```

After building, opening `index.html` and selecting a year and month will show
all the posts from `assets/history.json` referring to their rendered components
which can then be displayed.


## Import from WordPress

1. Copy xml from WordPress to `assets/export`.

2. Run `tools/importWordpressXml.js` to convert to a list of posts in
   `assets/import/posts.json`:

```
node tools/importWordpressXml.js assets/export/tryworkfinallycode.wordpress.2020-06-13.001.xml
```

The format of the import is as follows:

```json
[
  {
    "id": "2",
    "title": "Here it is",
    "link": "https://ninedof.wordpress.com/2013/03/21/here-it-is/",
    "pubDate": "Thu, 21 Mar 2013 15:16:22 +0000",
    "postDate": "2013-03-21 15:16:22",
    "body": "<p>So I've finally started that blog idea I'd had my eye on for a while ..."
  },
  ...
]
```

3. Run `tools/createWordpressHtml.js` to create imported cleaned-up HTML files,
   which should be later tidied up into proper posts files (see above). Each
   file placed in `assets/import/posts/` will have substitutions made to ease
   the transition.

```
node tools/createWordpressHtml.js
```
