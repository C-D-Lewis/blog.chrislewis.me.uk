Continuous Deployment With GitHub Actions
2022-09-17 16:42
Integration,AWS,Terraform
---

Since replacing my old Wordpress blog in 2020 (one of many 'lockdown projects')
I have been deploying this blog locally with the script below whenever I
completed a new post, or fixed a bug, or updated the look and feel.
The details of each script referenced inside can be found in the
[repository](https://github.com/c-d-lewis/blog):

```shell
#!/bin/bash

set -eu

export AWS_DEFAULT_REGION=us-east-1

echo "Using aws profile $AWS_PROFILE"

# Build site, indexes, and feed
./pipeline/build-site.sh

# Should be no changes in outputs
./pipeline/check-git-status.sh

# Update assets
./pipeline/push-assets.sh

# Update infrastructure
./pipeline/update-infra.sh

# CloudFront invalidation
./pipeline/invalidation.sh

echo "Deployment complete"
```

The way each step is self-contained in its own shell script means the process
is easy to test and each stage can be run individually if required.

The use of the AWS CLI to synchronise files with the S3 bucket and of Terraform
to easily manage the infrastructure resources in AWS makes it easy
to update the public site of the blog with a single command, and this makes it
a lot easier to begin writing a new post with the knowledge I won't have to
suffer to make it live for others to read afterward.

However, I have on more than one occasion forgotten to run this deployment
script, and thought a new post was available when in fact it was not...

## Being more professional

While this process is suitable for such a side project, I do consider this
blog to be one of my best projects to showcase technical skills (hence the use
of AWS and Terraform instead of something more self-managed like Netlify). This
means that I should try to align it with how I would aim to deliver as a
software professional at work.

Indeed, all of the webapps we create and maintain also use S3, CloudFront, and
Terraform to build and deploy, with as much automation as possible. We use
CircleCI and Terraform Enterprise to implement the CI/CD (continuous integration
and continuous delivery) workflow.

This approach focuses on allowing testing and deployment of work to production
and pre-production environments as frequently as practicible, ensuring latest
changes are tested and delivered to the world with minimal delay, instead of
days or weeks between test runs and new features delivered. Including tests
(of good quality) in the CI pipeline gives us confidence we can deploy more
frequently without fear of breaking things.

## Enter GitHub Actions

While CircleCI makes it easy to automatically build, test, and deploy changes
after pushing GitHub commits, I've been aware of GitHub actions for some time,
which is essentially the same - a build machine that runs in response to events
within the project repository and allows automated deployment. But I've not used
it up to now, and it's much more tightly integrated with GitHub and doesn't need
two extra services (CircleCI and Terraform Cloud) to achieve the automated
deployment aim.

The idea of writing a new post and having it deployed automatically after
pushing the new commit is even more appealing that a single manual command, so
I migrated the script to a GitHub action, with the help of the excellent and
comprehensive
[syntax documentation](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions).
The use of self-contained pipeline stage scripts made this easy, as well as the
existing ecosystem of actions I could build upon, including easy setup of the
AWS CLI and Terraform version required, and adding secrets natively right
in GitHub itself.

The stages will look familiar to the script above. First of all, specifying
when the pipeline should run:

```yaml
name: build
on:
  push:
    branches:
      - master
```

Next, the list of jobs (only one is used in this workflow) and what kind of
machine to use including some environment variables used by the scripts:

```yaml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    env:
      BUCKET: s3://blog.chrislewis.me.uk
      SITE_URL: blog.chrislewis.me.uk
```

After that, the stages themselves, beginning with some setup stages. This is
where the great ecosystem of existing actions I can reuse comes into play:

```yaml
steps:
  - uses: actions/checkout@v3
  
  - uses: actions/setup-node@v3
    with:
      node-version: '16'
  
  - name: Install dependencies
    run: npm ci
```

Next, building the <code>posts</code> markdown files into JSON objects
representing the components each post is rendered in. Because I expect no
changes in output after committing new post content, there's a check that after
a build the repository is still clean of uncommitted changes:

```yaml
- name: Build assets
  run: ./pipeline/build-site.sh

- name: Check git status is clean
  run: ./pipeline/check-git-status.sh
```

Once the posts are built (including the XML feed), we can set up the AWS CLI
with credentials from the GitHub Secrets feature, and push all the assets to
the S3 bucket that serves the blog itself:

```yaml
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v1
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1

- name: Push assets
  run: ./pipeline/push-assets.sh
```

Second from last, we run Terraform to ensure the infrastructure is up to date,
and the correct settings are applied to the S3 bucket and CloudFront CDN
distribution:

```yaml
- name: Set up Terraform
  uses: hashicorp/setup-terraform@v2
  with:
    # Must match version in terraform required_version
    terraform_version: 1.2.9

- name: Update infrastructure
  run: ./pipeline/update-infra.sh
```

Finally, we invalidate the CloudFront distribution so that visitors immediately
get the new version of the blog after a deployment, not just when their
browser cache expires (which could get messy if only some files are updated but
depend on new versions of others that are not):

```yaml
- name: Create invalidation
  run: ./pipeline/invalidation.sh
```

And we're done - all the way from commit to the world!

## See it in action

So there we have it - quite quick and easy to assemble, and a lot of fun to
watch go after simply pushing a commit. You can even see it yourself with this
video! Best viewed in fullscreen...

<br/>

<iframe width="560" height="315" src="https://www.youtube.com/embed/493bt2Zi1MY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Is it as good as it could be? No - for example I don't have a complete set of
tests, reducing the potential benefit from CI/CD. Perhaps an easy to use testing
pattern would be a good follow-up for improving
[fabricate.js](https://github.com/c-d-lewis/fabricate.js) though...
