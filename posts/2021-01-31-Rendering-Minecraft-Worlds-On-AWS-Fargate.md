Rendering Minecraft Worlds on AWS Fargate
2021-01-31 13:31
JavaScript,Integration,Java,AWS,Terraform
---

![](assets/media/2021/01/chunky-fargate-sample.png)

This personal project is one of those rare beasts - one that has long-lasting
usefulness beyond the initial building of it. It doesn't have to be the case to
be a worthwhile project, but it helps!

For a long time I've been keeping an eye on a niche open source project in the
Minecraft community called [Chunky](https://chunky.llbit.se/). It's a Java-based
app that loads chunks from a Minecraft world, allows you to set up a scene with
aspects such as lighting, camera, material properties, etc., and finally to
perform ray-traced rendering of that scene. The results offer a very pretty
view of a world that myself or a group of friends have worked hard on and gives
an opportunity to showcase it. Here's an example of a recent world rendered from
a Christmas community server:

![](assets/media/2021/01/chunky-fargate-village.png)

## Chunky

After arranging a scene in Chunky, the output is a JSON file containing all the
parameters that set up the shot including all the factors mentioned above. You
can run the <code>ChunkyLauncher.jar</code> file with many parameters to perform
the same rendering from a terminal as in the Chunky GUI. The number of samples
per pixel (iterations) and the name of the scene are the main parameters:

```shell
java \
  --module-path "/usr/share/maven-repo/org/openjfx/javafx-controls/11/:/usr/share/maven-repo/org/openjfx/javafx-base/11/:/usr/share/maven-repo/org/openjfx/javafx-graphics/11/:/usr/share/maven-repo/org/openjfx/javafx-fxml/11/" \
  --add-modules=javafx.controls,javafx.base,javafx.graphics,javafx.fxml \
  -Dchunky.home="$(pwd)" \
  -jar ChunkyLauncher.jar \
  -f \
  -target $TARGET_SPP \
  -render $SCENE_NAME
```

This is the first step towards automation on AWS Fargate, where containerized
Docker apps can be run on demand and cost only while they are running.

Onwards to Docker!

## Dockerization

Since Chunky can be run from a Linux terminal, it is fairly trivial to run in
Docker - it's just a case of choosing a suitable base image, adding the required
dependencies and then using scripts to break up the process into manageable
chunks. The <code>Dockerfile</code> for the finished project is shown below and
includes all these steps:

```dockerfile
FROM ubuntu:18.04

WORKDIR /chunky

# Environment variables
ENV MC_VERSION="1.16.4"

# For tzdata dependency
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/London

# Dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  default-jdk libopenjfx-java libcontrolsfx-java jq wget unzip awscli \
  && rm -rf /var/lib/apt/lists/*

# Chunky files
COPY ChunkyLauncher.jar /chunky/ChunkyLauncher.jar

# Initialize Chunky and Minecraft textures
RUN cd /chunky
RUN java -Dchunky.home="$(pwd)" -jar ChunkyLauncher.jar --update
RUN java -Dchunky.home="$(pwd)" -jar ChunkyLauncher.jar -download-mc $MC_VERSION

# Pipeline
COPY pipeline /chunky/pipeline

ENTRYPOINT ["./pipeline/pipeline.sh"]
```

With a suitable Docker image prepared, it can be pushed to AWS Elastic Container
Registry to be used in a Fargate task definition.

## S3 as a store

Since Fargate tasks run in AWS, it's not suitable for them to attempt to use
any local files on my development machine. Yet Chunky requires world files and
scene files in order to produce a render. To manage this, the project contains
several shell scripts that use the <code>aws s3</code> command from
<code>awscli</code> to fetch previously uploaded scene and world files from
Amazon S3.

To try and ensure the setup is as easy to do as possible, the user is required
to nominate a pre-existing S3 bucket, and a fixed subdirectory is used to
prescribe input and output file locations. It is shown in summary with some
example files below:

```none
s3://$BUCKET/
  - chunky-fargate/
    - worlds/
      - village-world.zip
    - scenes/
      - village-church-interior.json
    - renders/
      - $DATE/
        - snapshot.png
        - ...
    - tasks/
        village-all-scenes.json
```

As can probably be inferred, <code>worlds</code> contains Minecraft world
directories in a zip file, <code>scenes</code> contains scenes from Chunky GUI,
and <code>renders</code> contains the output PNG files in a directory per date.

The last directory called <code>tasks</code> contains JSON files that detail
one or more scenes in relation to a world name. More on that later.

## Automatic rendering on world files upload

As it stands, it's easy to run Chunky locally, or start a single remote Fargate
task to render a chosen scene on demand. But, the key reason to put all this
infrastructure in place is this - be able to nominate a set of scene files to be
rendered automatically whenever a new version of an ongoing world is uploaded
by the Minecraft server admin. This makes it trivial to have consistent scenes
rendered showing progress of a set of builds over time, all offloaded to the
AWS cloud.

The process is shown in the diagram below:

![](assets/media/2021/01/chunky-fargate-architecture.png)

The key piece of this puzzle is a feature of S3 called bucket notifications.
This allows a Lambda function to run when certain events (such as a new file
uploaded) occur in a particular bucket. In this case, a new zip file containing
an updated copy of the Minecraft world to be rendered. In Terraform, this is
easy to achieve:

```terraform
resource "aws_s3_bucket_notification" "bucket_notification" {
  count = var.upload_trigger_enabled ? 1 : 0

  bucket = data.aws_s3_bucket.selected.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.upload_function[0].arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "chunky-fargate/worlds/"
    filter_suffix       = ".zip"
  }
}
```

You can see the
[full function code](https://github.com/C-D-Lewis/chunky-fargate/blob/main/lambda/upload-function.js)
for all the details, but the most important parts are reading the file uploaded:

```js
/**
 * Main Lambda event handler.
 *
 * @param {object} event - S3 notification event.
 */
exports.handler = async (event) => {
  const {
    object: { key },
    bucket: { name: Bucket },
  } = event.Records[0].s3;

  /* ... */
```

Checking for task files that include the same world name:

```js
// Read all tasks
const listObjectsParms = { Bucket, Prefix: 'chunky-fargate/tasks/' };
const { Contents } = await s3.listObjects(listObjectsParms).promise();

// Select the relevant one to render
const [taskFile] = Contents.filter(p => p.Key.includes('json') && p.Key.includes(newFileName));
if (!taskFile) {
  console.log(`No task found that includes ${newFileName}, not triggering`);
  return;
}

/* ... */

const getObjectParams = { Bucket, Key: taskFile.Key };
const getObjectRes = await s3.getObject(getObjectParams).promise();
const { world, scenes } = JSON.parse(getObjectRes.Body.toString());
```

And starting a new Fargate task with overriden environment variables controlling
the scene and world used, as well as the target SPP:

```js
const res = await ecs.runTask({
  cluster: CLUSTER_NAME,
  taskDefinition: FAMILY,
  count: 1,
  launchType: 'FARGATE',
  networkConfiguration: {
    awsvpcConfiguration: {
      subnets: [SubnetId],
      securityGroups: [GroupId],
      assignPublicIp:'ENABLED',
    },
  },
  overrides: {
    containerOverrides: [{
      name: TASK_DEF_NAME,
      environment: [
        { name: 'WORLD_NAME', value: world },
        { name: 'SCENE_NAME', value: name },
        { name: 'TARGET_SPP', value: `${targetSpp}` },
        { name: 'BUCKET', value: Bucket },
      ]
    }]
  },
}).promise();

const { taskArn } = res.tasks[0];
console.log({ name, targetSpp, taskArn });
```

Performing this sort of AWS resource manipulation in AWS Lambda is made easy
by the automatic inclusion of the AWS SDK for Node.js.

What was perhaps not so easy was failing to see that the function also required
permissions for EC2 and taking an extraordinarily long time to put two and two
together when the IAM policy failed to work...

## Final results in action

So, once the infrastructure is deployed (all the required Terraform
configuration is included in the project), the last thing to put in place is a
'task' file that describes which scenes to render to what depth in which world.

Here is an example that allows the S3 bucket notification to kick off a large
set of tasks rendering many fixed scenes in parallel:

```json
{
  "bucket": "example-bucket.chrislewis.me.uk",
  "world": "xmas-village",
  "scenes": [
    {
      "name": "village-iso-farm",
      "targetSpp": 150
    },
    {
      "name": "village-iso-stable",
      "targetSpp": 200
    },
    {
      "name": "village-iso-smith",
      "targetSpp": 200
    },
    {
      "name": "village-iso-faire",
      "targetSpp": 150
    },
    {
      "name": "village-church",
      "targetSpp": 400
    }
  ]
}
```

When a new version of <code>xmas-village-world.zip</code> (containing the value
for <code>world</code> above) is uploaded to the
<code>/chunky-fargate/worlds</code> folder in the bucket, a Fargate task is
launched for each scene to produce a render.

![](assets/media/2021/01/chunky-fargate-tasks.png)

## Conclusion

Quite a long post, but a high quality personal project including skills from
work and previous projects, with a result that's reusable for current and future
Minecraft worlds and community servers, as well as another proof point for
projects on AWS!

You can check out all the source code in the
[GitHub repository](https://github.com/C-D-Lewis/chunky-fargate) to spin this
up for your own personal use - just provide you AWS credentials to Terraform.

One last pretty render...

![](assets/media/2021/01/chunky-fargate-stereo.png)
