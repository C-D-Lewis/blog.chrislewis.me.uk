Fully Automated Cloud Minecraft
2025-11-02 21:07
AWS,Integration,Raspberry Pi
---

A while ago (last year!) I blogged about a project to wrap the Minecraft server
software in scripts to make it easy to administer many servers with a single
repository. That has been a success for a year or so, running in Docker and
based on a JSON-based configuration on a per-server basic, both for vanilla and
more complex Forge-based servers.

But there was more to do, a natural extension from Docker to ECS and to be able
to at a moment's (or a few minutes') notice be able to scale up from a local
Raspberry Pi to an instance of arbitrary size in AWS. If a large number of
players or a particularly large modpack was expected it should be easy to move
an existing server to an AWS instance, including the world files. Thus the
limitation of the Pi 5 8GB is not necessarily all I can offer.

## Terraform Apply

Of course, the first step is to get a server running. For this I extended my
existing Terraform module project
[terraform-modules](https://github.com/C-D-Lewis/terraform-modules) to include
a module for running a Fargate ECS instance with an image from an ECR
repository. This was easy enough to achieve, using code from the
[chunky-fargate](https://github.com/C-D-Lewis/chunky-fargate) and
[pixels-with-friends](https://github.com/C-D-Lewis/pixels-with-friends)
projects.

```terraform
module "infrastructure" {
  source = "github.com/c-d-lewis/terraform-modules//ecs-fargate-service?ref=master"

  region              = "eu-west-2"
  service_name        = "dkr-mc-${var.server_name}"
  container_cpu       = 4096
  container_memory    = 8192
  port                = local.config.PORT
  vpc_id              = "vpc-b1f181d9"
  certificate_arn     = "arn:aws:acm:us-east-1:617929423658:certificate/a69e6906-579e-431d-9e4c-707877d325b7"
  route53_zone_id     = "Z05682866H59A0KFT8S"
  route53_domain_name = "chrislewis.me.uk"
  create_efs          = true
  health_check_port   = 80
  create_alb          = false
  create_nlb          = true
}
```

As can be seen, the module includes inputs for specifying healthchecks - which
is required for the ALB load balancer to keep the instance registered to it
alive. As a quick solution the server is launched with a basic Python HTTP
server on port 80 since introspection into a Minecraft server with rcon is
relatively non-trivial. An NLB (Network Load Balancer) is configurable instead
of an Application Load Balancer to support customized port numbers, rather than
just HTTP/S that a web application would be using.

```text
module.infrastructure.aws_lb_listener.server_nlb_listener[0]: Creating...
module.infrastructure.aws_ecs_service.ecs_service: Creating...
module.infrastructure.aws_lb_listener.server_nlb_listener[0]: Creation complete after 1s [id=arn:aws:elasticloadbalancing:eu-west-2:617929423658:listener/net/dkr-mc-test-nlb/c003d33060dd7b87/472da2a3b477d114]
module.infrastructure.aws_ecs_service.ecs_service: Creation complete after 2s [id=arn:aws:ecs:eu-west-2:617929423658:service/dkr-mc-test-cluster/dkr-mc-test-ecs-service]
module.infrastructure.aws_route53_record.server_record: Still creating... [10s elapsed]
module.infrastructure.aws_route53_record.server_record: Still creating... [20s elapsed]
module.infrastructure.aws_route53_record.server_record: Creation complete after 30s [id=Z05682866H59A0KFT8S_dkr-mc-test-api.chrislewis.me.uk_A]

Apply complete! Resources: 21 added, 0 changed, 0 destroyed.

Outputs:

dns_address = "dkr-mc-test-api.chrislewis.me.uk"
ecr_name = "dkr-mc-test-ecr"
ecr_uri = "617929423658.dkr.ecr.eu-west-2.amazonaws.com/dkr-mc-test-ecr"
```

With the infrastructure created, all that remains is to upload a Docker image
for the server itself:

```text
[+] Building 87.2s (21/21) FINISHED                                                                    docker:default
 => [internal] load build definition from Dockerfile                                                             0.0s
 => => transferring dockerfile: 1.69kB                                                                           0.0s
 => [internal] load metadata for docker.io/library/debian:bookworm-slim                                          0.6s
 => [internal] load .dockerignore                                                                                0.0s
 => => transferring context: 121B                                                                                0.0s

...

 => exporting to image                                                                                           2.7s
 => => exporting layers                                                                                          2.7s
 => => writing image sha256:ba186da54db6cfc9cde51e9dca47abcc980a6d25e28afdf9eb0e315e6494c304                     0.0s
 => => naming to docker.io/library/docker-minecraft                                                              0.0s

Login Succeeded
The push refers to repository [617929423658.dkr.ecr.eu-west-2.amazonaws.com/dkr-mc-test-ecr]
860b8d08aa58: Pushed 

...

d6d0586ce802: Pushed 
latest: digest: sha256:c4d4c08cf3fb0e86caca868d7fdf83357868b985735bae8d17ccf09263ca868c size: 3657
```

And voila, it's up and running!

![](assets/media/2025/11/task.png)

## Seamless Migrations

But that's jsut half the battle. In this scenario, the players will expect their
data (inventory, achievements, configuration etc.) as well as the existing
Minecraft world to be seamlessly transferred to the new AWS instance from the
Raspberry Pi. Handily, the project already includes scripts that perform
nightly local and weekly S3 backups which can be used for this purpose.

By attaching an EFS (Elastic File System) to the Fargate instance, it can have
a storage device that exists after the instance is terminated or dies, unlike
the default ECS attached EBS volumes. To use this, a server config in the
project sets the <code>ON_AWS</code> property to <code>true</code> in its
<code>config.json</code>, which signals the start script to call
<code>fetch-latest-world.sh</code> to download the latest S3 backup to the EFS.
On first launch this gets the latest world (which would be uploaded before the
migration) and can carry on where the Pi left off. 

The diagram below shows the components and lifecycle of the world data in and
out:

![](assets/media/2025/11/dm-aws.png)

Likewise, if the event or reason for the larger AWS instance is over then it's
possible to easily continue on the Raspberry Pi again - using a pattern from
<code>chunky-fargate</code> I modified the script to upload a backup to work
from a temporary Fargate task launched specifically for this purpose. Using the
<code>RunTask</code> call it launches with a command to run
<code>upload-backup.sh</code> and then exit when upload to S3 is complete.

```shell
#!/bin/bash

set -eu

SERVER_NAME=$1

# Project name
PROJECT_NAME="dkr-mc-$SERVER_NAME"

# Must match the main.tf region
export AWS_DEFAULT_REGION=eu-west-2

echo ">>> Fetching required resources..."

# Get security group
RES=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=$PROJECT_NAME-sg")
SECURITY_GROUP_ID=$(echo $RES | jq -r '.SecurityGroups[0].GroupId')

# Get VPC (assuming only one)
RES=$(aws ec2 describe-vpcs)
VPC_ID=$(echo $RES | jq -r '.Vpcs[0].VpcId')

# Get subnets (assume all are public)
RES=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID")
SUBNET_ID=$(echo $RES | jq -r '.Subnets[0].SubnetId')

# Create a Fargate task
echo ">>> Creating task..."
RES=$(aws ecs run-task \
  --cluster $PROJECT_NAME-cluster \
  --task-definition $PROJECT_NAME-td \
  --count 1 \
  --launch-type FARGATE \
  --network-configuration "{
    \"awsvpcConfiguration\": {
      \"subnets\": [\"$SUBNET_ID\"],
      \"securityGroups\": [\"$SECURITY_GROUP_ID\"],
      \"assignPublicIp\": \"ENABLED\"
    }
  }" \
  --overrides "{
    \"containerOverrides\": [{
      \"name\": \"$PROJECT_NAME-container\",
      \"command\": [\"/bin/sh\", \"-c\", \"/server/scripts/upload-backup.sh $SERVER_NAME root true\"]
    }]
  }" \
)

TASK_ID=$(echo $RES | jq -r '.tasks[0].taskArn')
echo ">>> Started: $TASK_ID"
echo ""

watch ./scripts/aws/get-tasks.sh $SERVER_NAME
```

Once done, the backup is ready to download with the same scripts to the Pi
and it can take over from the expensive virtual instance.

## Conclusion

Thus the project can be said to be truly complete! It solves the problems
of configuration and management of many local servers with common configuration
options and the use of Docker, and adds a seamless journey to running on AWS
with an instance of arbitrary capabilities!
