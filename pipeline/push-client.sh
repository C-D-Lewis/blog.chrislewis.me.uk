#!/usr/bin/env bash

set -eu

BUCKET=s3://blog.chrislewis.me.uk
COMMIT=$(git rev-parse --short HEAD)

# Cancelling mid-push may cause template to not be replaced
if [ ! "$(cat index.html | grep COMMIT)" ]; then
  echo "COMMIT not found in index.html"
  exit 1
fi

# Update postHistory version to fix cached script issues
sed -i.bak "s/COMMIT/$COMMIT/g" index.html

# Push
aws s3 cp index.html $BUCKET
aws s3 cp favicon.ico $BUCKET
aws s3 sync src $BUCKET/src
aws s3 sync assets $BUCKET/assets
aws s3 sync styles $BUCKET/styles
aws s3 sync feed $BUCKET/feed

# Restore
mv index.html.bak index.html
