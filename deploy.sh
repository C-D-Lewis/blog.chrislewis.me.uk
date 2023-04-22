#!/bin/bash

# This script is intended to be a complete build assuming:
#
#   - Using C-D-Lewis/terraform-s3-cloudfront-website
#   - Using COMMIT in index.html
#
# Usage: ./deploy.sh $SITE_DOMAIN

set -eu

export AWS_DEFAULT_REGION=us-east-1

# Website URL
SITE_DOMAIN=$1
# Bucket to create and deploy site into
BUCKET="s3://$SITE_DOMAIN"
# Current commit
COMMIT=$(git rev-parse --short HEAD)

echo "Using prfile $AWS_PROFILE in $AWS_DEFAULT_REGION" 

############################################### Build ##############################################

echo ""
echo "Building site"

# Build, if required
HAS_BUILD=$(cat package.json | jq -r '.scripts.build')
if [[ "$HAS_BUILD" != 'null' ]]; then
  npm run build
  
  # Check no changes resulted
  if [[ ! -z $(git status -s) ]]; then
    echo "There are uncommitted changes after build!"
    exit 1
  fi
fi

# Check template variable is ready and replace it for cache update
if [ ! "$(cat index.html | grep COMMIT)" ]; then
  echo "COMMIT not found in index.html"
  exit 1
fi
sed -i.bak "s/COMMIT/$COMMIT/g" index.html

############################################### Push ###############################################

echo ""
echo "Pushing files"

# Push files (required)
aws s3 cp index.html $BUCKET
aws s3 sync src $BUCKET/src
aws s3 sync assets $BUCKET/assets
aws s3 sync styles $BUCKET/styles

# Push files (optional)
aws s3 sync feed $BUCKET/feed || exit 0
aws s3 cp favicon.ico $BUCKET || exit 0

# Restore template
mv index.html.bak index.html

########################################## Infrastructure ##########################################

echo ""
echo "Updating infrastructure"

# Update infrastructure
cd terraform
terraform init
terraform apply -auto-approve
cd -

# Get CloudFront distribution ID
CF_DIST_ID=$(aws cloudfront list-distributions | jq -r ".DistributionList.Items[] | select(.Aliases.Items[0] == \"$SITE_DOMAIN\") | .Id")

# Create new invalidation
RES=$(aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths "/*")
INVALIDATION_ID=$(echo $RES | jq -r '.Invalidation.Id')

# Wait for invalidation complete
echo "Waiting for invalidation-completed for $INVALIDATION_ID..."
aws cloudfront wait invalidation-completed --distribution-id $CF_DIST_ID --id $INVALIDATION_ID

echo "Invalidation completed"

############################################## Verify ##############################################

echo ""
echo "Checking deployment"

RES=""
while [[ ! "$RES" =~ "$COMMIT" ]]; do
  sleep 5
  URL="https://$SITE_DOMAIN?t=$(date +%s)"
  echo $URL
  RES=$(curl -s $URL)
done
echo "Commit $COMMIT found in live site"
