#!/bin/bash

set -eu

export AWS_DEFAULT_REGION=us-east-1

echo "Using aws profile $AWS_PROFILE"

# Build site, indexes, and feed
./pipeline/build-site.sh

# Should be no changes in outputs
./pipeline/check-git-status.sh

# Update client code
./pipeline/push-client.sh

# Deploy infrastructure
./pipeline/deploy-infra.sh

# CloudFront invalidation
./pipeline/invalidation.sh

echo "Deployment complete"
