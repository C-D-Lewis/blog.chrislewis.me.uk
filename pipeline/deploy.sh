#!/bin/bash

set -eu

BUCKET=s3://blog.chrislewis.me.uk
SITE_URL=blog.chrislewis.me.uk

export AWS_DEFAULT_REGION=us-east-1

echo "Using aws profile $AWS_PROFILE"

# Build site, indexes, and feed
./pipeline/build-site.sh

# Should be no changes in outputs
./pipeline/check-git-status.sh

# Update client code
./pipeline/push-client.sh $BUCKET

# Deploy infrastructure
./pipeline/deploy-infra.sh

# CloudFront invalidation
./pipeline/invalidation.sh $SITE_URL

echo "Deployment complete"
