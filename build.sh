#!/bin/bash

mkdir -p posts
node tools/createWordpressMarkdown.js

mkdir -p assets/rendered
node tools/buildPosts.js
