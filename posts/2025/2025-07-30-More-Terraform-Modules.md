More Terraform Modules
2025-07-30 11:32
Terraform,AWS
---

For a couple of years now, I've had multiple websites and site-like projects
have their infrastructure in AWS S3 and CloudFront deployed via Terraform. This
has a few key benefits - the ownership of these resources is automated, updates
can be applied with a simple <code>terraform apply</code>, and they all share
the exact same configuration. So I can deploy them, and forget them. Updates
to the sites themselves are done with a GitHub Actions script that runs on each
push to master and run very well.

## Existing Modules

When I create a new site-like project that needs storage in S3, a CloudFront
public CDN distribution, and a Route53 record to <code>chrislewis.me.uk</code>
it is easy to duplicate this configuration thanks to Terraform's module system.
This allows you to specify some set of resources, some input variables, and
some output attributes to be used by the module consumer.

The prime example I have of this is the <code>s3-cloudfront-website</code>
module in my [terraform-modules](https://github.com/c-d-lewis/terraform-modules)
repository. It manages a number of resources that together store, serve, and
route to the website itself:

- <code>aws_s3_bucket</code>, the bucket storing the website files and assets.

- <code>aws_cloudfront_distribution</code>, the distribution making the files locally available around the world, increasing speed over the S3 bucket website feature.

- <code>aws_route53_record</code>, the DNS record pointing to the site, such as this blog!

![](assets/media/2020/10/infra.png)

The second module is a similar one that is designed to allow public storage
of files and assets that are extraneous to the website itself, such as large
videos or many photos that shouldn't necessarily be in a GitHub repository. This
one is called <code>s3-cloudfront-storage</code> and has a similar set of
managed resources:

- <code>aws_s3_bucket</code>, the bucket storing the larger files and assets.

- <code>aws_cloudfront_distribution</code>, the distribution making the files available around the world.

An example project that contains both of these re-usable modules in its own
Terraform configuration might look like this:

```terraform
provider "aws" {}

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
    key    = "examplemedia"
    region = "us-east-1"
  }
}

module "main" {
  source = "github.com/c-d-lewis/terraform-modules//s3-cloudfront-website?ref=master"

  region              = "us-east-1"
  project_name        = "examplemedia"
  zone_id             = "Z02325229T1MW94OQ7L4"
  domain_name         = "examplemedia.com"
  alt_domain_name     = "www.examplemedia.com"
  certificate_arn     = "arn:aws:acm:us-east-1:117020423158:certificate/0110f87f-1fc4-4404-be45-1b17a7181234"
  default_root_object = "dist/index.html"
}

module "assets" {
  source = "github.com/c-d-lewis/terraform-modules//s3-cloudfront-storage?ref=master"

  region        = "us-east-1"
  bucket_name   = "examplemedia.com-assets"
  cache_forever = true
}
```

That's it! The outputs provide the storage, availability, routing, and extra
large file storage for the rest of the project to push files to and retrieve
them when needed.

## A New Module

Lately, I had a need to be able to create an API service accessible from AWS.
Previous experience pointed me to a simple Docker container running in Fargate.
Since I'd done so well out of the Terraform modules for the websites, I thought
it would be a good time to exercise these muscules again and create a re-usable
module for such a service. 

The result is a new module called <code>ecs-fargate-service</code> and it is
already used in two places. In summary it manages the resources required to
run a Fargate service in AWS that is available to the public internet. It
requires a few more resources than the other modules but is quite
self-sufficient:

- <code>aws_ecr_repository</code>, an ECR repository to push the Docker image to.

- <code>aws_ecs_cluster</code>, a cluster in ECS to contain the service.

- <code>aws_ecs_service</code>, the service itself.

- <code>aws_ecs_task_definition</code>, the definition of the task to run in Fargate in the service.

- <code>aws_iam_role</code>, IAM role for the task.

- <code>aws_iam_role_policy</code>, policy listing permissions for the task.

- <code>aws_lb</code>, Application load balancer to expose the service.

- <code>aws_lb_listener</code>, a listener on HTTPS to connect traffic to the task.

- <code>aws_lb_target_group</code>, group of targets containing the task and health checks.

- <code>aws_security_group</code>, security group allowing inbound port and outbound port access.

- <code>aws_route53_record</code>, a DNS record for applications of the service API to connect to.

![](assets/media/2025/07/fargate-infra.png)

An example of this is shown below for the <code>node-microservices</code>
project that manages tasks running on my Raspberry Pis. A large instance size
is not required for this type of application but any other size could be used.

```terraform
module "infrastructure" {
  source = "github.com/c-d-lewis/terraform-modules//ecs-fargate-service?ref=master"

  region              = "us-east-1"
  service_name        = "node-microservices"
  container_cpu       = 512
  container_memory    = 1024
  port                = 5959
  vpc_id              = "vpc-c3b70bb9"
  certificate_arn     = "arn:aws:acm:us-east-1:117020423158:certificate/0110f87f-1fc4-4404-be45-1b17a7181234"
  route53_zone_id     = "Z02325229T1MW94OQ7L4"
  route53_domain_name = "chrislewis.me.uk"
}

output "dns_address" {
  value = module.infrastructure.service_dns
}

output "ecr_name" {
  value = module.infrastructure.ecr_name
}

output "ecr_uri" {
  value = module.infrastructure.ecr_uri
}
```

Once applied, the Terraform output contains useful information:

```text
...

module.infrastructure.aws_route53_record.server_record: Still creating... [10s elapsed]
module.infrastructure.aws_route53_record.server_record: Still creating... [20s elapsed]
module.infrastructure.aws_route53_record.server_record: Still creating... [30s elapsed]
module.infrastructure.aws_route53_record.server_record: Still creating... [40s elapsed]
module.infrastructure.aws_route53_record.server_record: Creation complete after 45s [id=Z02325229T1MW94OQ7L4_node-microservices-api.chrislewis.me.uk_A]

Apply complete! Resources: 14 added, 0 changed, 0 destroyed.

Outputs:

dns_address = "node-microservices-api.chrislewis.me.uk"
ecr_name = "node-microservices-ecr"
ecr_uri = "617929423658.dkr.ecr.us-east-1.amazonaws.com/node-microservices-ecr"
```

The AWS console confirms the task is launched:

![](assets/media/2025/07/fargate.png)

Once the task is up and running, it can be contacted!

```shell
$ curl -X POST https://node-microservices-api.chrislewis.me.uk/conduit \
  -H Content-Type:application/json \
  -d '{"to":"attic","topic":"listApps"}'
```

```text
{
  "status": 200,
  "message": {
    "appNames": [
      "conduit"
    ]
  }
}
```

Another benefit of the encapsulated module is that the entire application can
be destroyed with one command too:

```text
...

module.infrastructure.aws_security_group.security_group: Destroying... [id=sg-0d9db5b23e1caafae]
module.infrastructure.aws_security_group.security_group: Still destroying... [id=sg-0d9db5b23e1caafae, 10s elapsed]
module.infrastructure.aws_security_group.security_group: Still destroying... [id=sg-0d9db5b23e1caafae, 20s elapsed]
module.infrastructure.aws_security_group.security_group: Destruction complete after 21s

Destroy complete! Resources: 14 destroyed.
```

## What's Next

Useful as this is to get a couple of services up and running quickly, there are
a few usability points to address:

- IAM permissions, there should be a way to pipe in permission policies into the Terraform run instead of them being fixed.

- Any additional routing or ports should be configurable in the inputs.

As usual, in making use of this I will find obstacles and ways to overcome them!
