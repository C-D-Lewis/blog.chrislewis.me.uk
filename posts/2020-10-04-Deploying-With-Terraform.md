Deploying With Terraform
2020-10-04 10:43
Integration,JavaScript,React,AWS
---

Traditional provisioning of cloud infrastructure resources is commonly done by
manually creating instances, networking them together, adding storage volumes,
setting access policies and other controls. If more capacity is needed it can
be increased by hand, and decreased when no longer needed, hopefully before
overspending. Similarly, any changes in configuration done manually runs
the risk of the initial values being forgotten, and lost resources could be hard
to restore in the same way. And if the same setup is required in a different
region or cloud provider, it would require almost exactly the same amount of
time.

## Infrastructure as Code

![](assets/media/2020/10/terraform-logo.png)

At work, we use Terraform to provision our infrastructure resources, instead of
manually creating them through the AWS console. Terraform is one example of a
concept called Infrastructure as Code. It tries to solve the problem of creating
or modifying infrastructure in the cloud in a safe, trackable and repeatable
way. The way it works is you describe all of the resources you require (and
their configuration) as code files, and Terraform compares it with what is
already deployed, and makes adjustments to align with the described state.

For example, suppose a service initially needs five instances. Describing an
Auto-scaling Group of this size causes Terraform to create them, and then the
state reflects the fact that they now exist. The ASG can later be adjusted to
ten instances by changing a single variable and redeploying. Since the IaC files
can (and should) be versioned in something like Git, both the initial and latest
configuration changes can be traced and used again in a different region.

Here is an example of a code block for such a scenario, adapted from the
[official Terraform documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/autoscaling_group) -
it described an Auto-scaling Group containing between 5 and 15
<code>t2.mirco</code> instances:

<!-- language="terraform" -->
<pre><div class="code-block">
resource "aws_launch_template" "foobar" {
  name_prefix   = "foobar"
  image_id      = "ami-1a2b3c"
  instance_type = "t2.micro"
}

resource "aws_autoscaling_group" "bar" {
  availability_zones = ["us-east-1a"]
  desired_capacity   = 5
  max_size           = 15
  min_size           = 5

  launch_template {
    id      = aws_launch_template.foobar.id
    version = "$Latest"
  }
}
</div></pre>

## Real-world Applications

You may be wondering about a more concrete example of infrastructure deployed
using Terraform - and you're looking at it! As of a few days ago, the management
of the AWS resources for this blog (S3, CloudFront, Route53) is done using
Terraform, with the state stored in an S3 bucket. Here's a representation of
that setup:

![](assets/media/2020/10/infra.png)

And similarly for another project called
[Pixels with Friends](https://github.com/c-d-lewis/pixels-with-friends) which
also includes resources from Fargate and EC2 Load Balancing:

![](assets/media/2020/10/infra-pixels.png)

Here are some examples of these resources that are in use.

## S3 Bucket Website

The blog files are pushed to a managed S3 bucket, where the
<code>domain_name</code> variables is "blog.chrislewis.me.uk". It also includes
an inline policy allowing global access - so all visitors can request and load
the site files.

<!-- language="terraform" -->
<pre><div class="code-block">
resource "aws_s3_bucket" "client_bucket" {
  bucket        = var.domain_name
  acl           = "public-read"
  force_destroy = true

  policy = EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AddPerm",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::${var.domain_name}/*"]
    }
  ]
}
EOF

  website {
    index_document = "index.html"
  }
}
</div></pre>

## CloudFront Distribution

A CloudFront Distribution allows the site files in S3 to be cached locally in
Edge Locations around the world so they always arrive nice and fast. It's
referenced as the <code>domain_name</code> in the <code>origin</code> block. The
other blocks control the cache behavior and the <code>viewer_certificate</code>,
served from Amazon Certificate Manager (ACM) allowing visitors to use HTTPS.

<!-- language="terraform" -->
<pre><div class="code-block">
resource "aws_cloudfront_distribution" "client_distribution" {
  aliases     = [var.domain_name]
  price_class = "PriceClass_100"
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.client_bucket.bucket_regional_domain_name
    origin_id   = local.origin_id
  }

  default_cache_behavior {
    viewer_protocol_policy = "https-only"
    compress               = true
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    target_origin_id       = local.origin_id
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000

    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = var.certificate_arn
    ssl_support_method  = "sni-only"
  }
}
</div></pre>

## Route53 Record

The last piece of the puzzle is a Route53 DNS record that directs visitors
navigating to <code>https://blog.chrislewis.me.uk</code> to instead go to the
CloudFront distribution URL in order to get the site served to them (also known
as an Alias record).

<!-- language="terraform" -->
<pre><div class="code-block">
resource "aws_route53_record" "client_record" {
  zone_id = var.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.client_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.client_distribution.hosted_zone_id
    evaluate_target_health = false
  }

  depends_on = [aws_cloudfront_distribution.client_distribution]
}
</div></pre>

## The Future

On these two occassions, I worked out the infrastructure configuration required,
and then created the equivalent as a Terraform description. In the future for
new projects, another approach is to create the infrastructure in Terraform
first, so that the initial deployment can be automated from the start.
