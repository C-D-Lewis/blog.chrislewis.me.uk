#!/bin/bash

set -eu

COMMIT=$(git rev-parse --short HEAD)
BUCKET=s3://blog.chrislewis.me.uk
PROJECT_NAME=blog
SITE_URL=blog.chrislewis.me.uk

export AWS_DEFAULT_REGION=us-east-1

echo "Using aws profile $AWS_PROFILE"

# Deploy infrastructure
./pipeline/deploy-infra.sh

# Build site, indexes, and feed
./pipeline/build-site.sh

# Update client code
./pipeline/push-client.sh $BUCKET

# CloudFront invalidation
./pipeline/invalidation.sh $SITE_URL

echo "Deployment complete"
