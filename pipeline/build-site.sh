#!/bin/bash

# Import wordpress file
node tools/importWordpressXml.js

# Generate posts from wordpress file
mkdir -p posts
node tools/createWordpressMarkdown.js

# Build rendered posts
mkdir -p assets/rendered
node tools/buildPosts.js

# Build tag index
node tools/buildTagIndex.js

# Build and validate RSS feed
mkdir -p feed
node tools/buildFeed.js
echo "Sending feed.xml for validation..."
RES=$(./tools/node_modules/.bin/feed-validator feed/rss.xml)
if [[ $RES =~ "All correct" ]]; then
  echo 'Feed is valid'
else
  echo $RES
fi
