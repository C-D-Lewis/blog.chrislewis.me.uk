#!/bin/bash

set -eu

BUCKET=s3://blog.chrislewis.me.uk
CF_DIST_ID=E2N27MNWPYQH1C

echo "Using aws profile $AWS_PROFILE"

# Build
./build.sh

# Push
aws s3 mb $BUCKET
aws s3 cp index.html $BUCKET
aws s3 sync src $BUCKET/src
aws s3 sync assets $BUCKET/assets
aws s3 sync styles $BUCKET/styles

# CloudFront invalidation
aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths "/*"
