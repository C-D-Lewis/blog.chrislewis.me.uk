#!/bin/bash

mkdir -p posts
node tools/createWordpressMarkdown.js

mkdir -p assets/rendered
node tools/buildPosts.js

mkdir -p feed
node tools/buildFeed.js
RES=$(./tools/node_modules/.bin/feed-validator feed/rss.xml)
if [[ $RES =~ "All correct" ]]; then
  echo 'Feed is valid'
else
  echo $RES
fi
