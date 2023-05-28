Simpler Site Pipelines
2023-05-28 17:06
Integration
---

After the initial setup of deploying this blog to an AWS S3 bucket behind a
CloudFront distribution, a number of other sites have all had the same
treatment. It's a simple, cheap, and effective way to host them and can be
replicated to more in the future. Running Terrform to update these resources,
and the AWS CLI to synchronise bucket contents with local site files is also
part of this simple pattern.

Since late last year I've used GitHub actions to perform this build / push /
Terraform / invalidate process fully automatically whenever a new version is
pushed to each repository's <code>main</code>/<code>master</code> branch, which
makes it a joy to continue to work on them without worrying about finishing up
each session with deployment issues.

![](assets/media/2023/05/deployment.png)

So what's the issue? Well, now that there are several sites working this way,
the issue of DRY has come up as it always was going to - each repository has
an almost exact copy of:

- Build scripts

- Terraform code for CloudFront / S3 / Route53 resources

- Asset push scripts for AWS CLI

- CloudFront invalidation script.

- GitHub Actions workflow files.

Because the essense of the process is identical, but the minutia details of
which build steps are required, which site name and Route53 details to use,
which files need to be pushed, are different it means that slight drift in
style or convention means that I need to be careful about which sites are
totally up to date or are in an older style, and before long I'm back to
worrying about deployment success after an update to the site itself.

## The Solution

The solution was something I should have done as soon as the whole end-to-end
process was settled on - put some time into reusability! Because each site is
deployed with the same technologies they can be moved to use shared parts of
the whole process.

Therefore, I now have reduced each part down to one file - with each site
repo having identical copies that are much easier to keep up to date. The
combination of all three means a new site can also be deployed very easily.

Each part is shown in full, showing all steps and reusability details where
things are generalised or parameterised for slightly different file layouts
or build steps etc.

## .github/workflows/main.yaml

GitHub actions steps that can be run for every site identically. It sets up
Node.js, Terraform, and then simply calls the repo's copy of the reusable
<code>deploy.sh</code> (below).

```yaml
name: build
on:
  push:
    branches:
      - master
      - main
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Set up Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          # Must match version in terraform required_version
          terraform_version: 1.2.9

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Install dependencies
        run: npm ci
      
      - name: Build and deploy
        run: ./deploy.sh ${{ vars.SITE_DOMAIN }}
```

All that remains are the one-time step of adding a few environment variables
in GitHub for the actions themselves.

## deploy.sh

Script that invokes <code>npm run build</code> if it exists, checks for new
uncommitted git changes as a result, replaces any commit references for
cache-busting, pushes assets to the S3 bucket, runs Terraform, and finally
creates a CloudFront cache invalidation to make the new version truly live.

```shell
#!/bin/bash

# This script is intended to be a complete build assuming:
#
#   - Using C-D-Lewis/terraform-s3-cloudfront-website
#   - Using COMMIT in index.html
#   - Standardized Node/AWS/Terraform/Build GitHub workflow with variables:
#     - SITE_DOMAIN
#
# Usage: ./deploy.sh $SITE_DOMAIN

set -eu

export AWS_DEFAULT_REGION=us-east-1

# Website domain
SITE_DOMAIN=$1
# Bucket to create and deploy site into
BUCKET="s3://$SITE_DOMAIN"
# Current commit
COMMIT=$(git rev-parse --short HEAD)

############################################### Build ##############################################

printf "\n\n>>> Building site\n\n"

# Build, if required
HAS_BUILD=$(cat package.json | jq -r '.scripts.build')
if [[ "$HAS_BUILD" != 'null' ]]; then
  npm run build
fi
  
# Check no changes resulted
if [[ ! -z $(git status -s) ]]; then
  echo "There are uncommitted changes after build!"
  exit 1
fi

# Check template variable is ready and replace it for cache update
if [ ! "$(cat index.html | grep COMMIT)" ]; then
  echo "COMMIT not found in index.html"
  exit 1
fi
sed -i.bak "s/COMMIT/$COMMIT/g" index.html

############################################### Push ###############################################

printf "\n\n>>> Pushing files\n\n"

# Push files (from multiple projects)
aws s3 cp index.html $BUCKET
aws s3 sync src $BUCKET/src
aws s3 sync assets $BUCKET/assets || true
aws s3 sync styles $BUCKET/styles || true
aws s3 sync feed $BUCKET/feed || true
aws s3 sync dist $BUCKET/dist || true
aws s3 cp favicon.ico $BUCKET || true

# Restore template
mv index.html.bak index.html

########################################## Infrastructure ##########################################

printf "\n\n>>> Updating infrastructure\n\n"

# Update infrastructure
cd terraform
terraform init -reconfigure
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

printf "\n\n>>> Checking deployment\n\n"

RES=""
while [[ ! "$RES" =~ "$COMMIT" ]]; do
  sleep 5
  URL="https://$SITE_DOMAIN?t=$(date +%s)"
  echo $URL
  RES=$(curl -s $URL)
done
echo "Commit $COMMIT found in live site"

printf "\n\n>>> Deployment complete!\n\n"
```

## terraform-s3-cloudfront-website

A shared Terraform module that completely wraps all the S3, CloudFront, Route53
etc AWS resources for the site. This means each repo's Terraform configuration
is just one file:

```terraform
provider "aws" {
  region = var.region
}

terraform {
  required_version = "= 1.2.9"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "= 4.31.0"
    }
  }

  backend "s3" {
    bucket = "chrislewis-tfstate"
    key    = "blog"
    region = "us-east-1"
  }
}

module "main" {
  source = "github.com/c-d-lewis/terraform-s3-cloudfront-website?ref=master"

  region          = "us-east-1"
  project_name    = "blog"
  zone_id         = "Z05682866H59A0KFT8S"
  domain_name     = "blog.chrislewis.me.uk"
  certificate_arn = "arn:aws:acm:us-east-1:617929423658:certificate/a69e6906-579e-431d-9e4c-707877d325b7"
}
```

## Conclusion

The benefits are immediate - I can forget about build and deploy and focus on
adding new functionality or fixes to each site. In the event any of the build,
deploy, Terraform changes I can quickly also update all the other sites. The
shared Terraform module alone demonstrates the power of Terraform modules, which
you can
[check out here](https://github.com/C-D-Lewis/terraform-s3-cloudfront-website).

While I know I need only read the logs if I get an email in case of failure, it
is also quite rewarding to watch the whole thing turn green!

![](assets/media/2023/05/success.png)
