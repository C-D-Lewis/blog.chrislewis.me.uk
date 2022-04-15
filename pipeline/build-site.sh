#!/bin/bash

set -eu

# Import wordpress file and generate initial posts
#   Note: Deactivated 29/08/2021 - Modify posts/** instead now!
# node tools/importWordpressXml.js
# mkdir -p posts
# node tools/createWordpressMarkdown.js

# Build rendered posts
mkdir -p assets/rendered
node tools/buildPosts.js

# Build tag index
node tools/buildTagIndex.js

# Build and validate RSS feed
mkdir -p feed
node tools/buildFeed.js
# echo "Sending feed.xml for validation..."
# RES=$(./tools/node_modules/.bin/feed-validator feed/rss.xml)
# if [[ $RES =~ "All correct" ]]; then
#   echo 'Feed is valid'
# else
#   echo $RES
# fi

printf "\nBuild complete!\n"
