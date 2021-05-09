#!/usr/bin/env bash

set -eu

BUCKET=$1

# Push
aws s3 cp index.html $BUCKET
aws s3 cp favicon.ico $BUCKET
aws s3 sync src $BUCKET/src
aws s3 sync assets $BUCKET/assets
aws s3 sync styles $BUCKET/styles
aws s3 sync feed $BUCKET/feed
