One Repo, Many Worlds
2024-10-05 17:53
Integration,Raspberry Pi, AWS
---

Christmas 2020 was an unusual one, for obvious reasons. To help break up the
stream of Zoom quizzes a group of friends and I decided to start a new world
on a Minecraft server. It was to be Christmas themed and a way to keep us all
a bit more sane together and have some social fun at the same time. We ended
up creating a wonderful winter village and a few years later it's fun to go
back and see it again.

![](assets/media/2021/01/chunky-fargate-village.png)

Summer of 2021 we migrated in the same world to make a Wild West town, and
Christmas 2021 we moved again to work on a deep underground Dwarven town. All
during this time we were paying a hosting provider (I forget which one) a
monthly subscription fee and could save by pausing the server when no one was
currently playing, and eventually we forgot about it. Of course, it made sense
not to cost them money when nobody or even one person wanted to play.

To anyone who has considered using virtual servers on a service such as AWS ECS,
this will evoke the line of thinking of renting vs buying hardware. If you buy,
the upfront cost is fixed, but there is no monthly fee potentially indefinitely
thereafter. However, the burden of maintenance is on you. For the time being
it made sense.

## The Revival

Last Christmas, I wanted to bring that same group back together once again in
the seasonal spirit, and so devised a new area on the world (after obtaining a
backup from the friend who originally paid for the server) near a Villager
village and set some tasks to build the North Pole, Santa's Workshop, and bring
some gifts to the village. It was a success and we had a lot of fun.

In doing this, I hosted the world on a Raspberry Pi 4 8GB with a SATA SSD over
USB, later moving to a Raspberry Pi 5 8GB with a Pimoroni nVME BASE, which
worked like a charm. This had some distinct advantages over paying a hosting
provider (given I was okay with the burden on maintenance):

- Direct access to the filesystem and world files.

- As much monitoring as I wanted (I wrote Monitor plugin to email me if the <code>java</code> process stopped, for example)

- Ability to schedule local backups to a USB drive, and upload backups to AWS S3.

- Fun!

As an added bonus, I took advantage of Polaris' regular monitoring of an AWS
Route53 DNS record pointing at my house to make sure access was not interrupted
when my public IP address was changed.

To facilitate a robust server setup, I utilized Docker to build an image with
the correct version of Java and the Minecraft server, mounted the world as a
Docker volume, and used <code>crontab</code> to run the local and uploaded
backups. 

## More Servers

To this day, that server is still up, and this summer just passed we created
yet another communal area - a desert island getaway! This one was very different
and a lot of fun.

![](assets/media/2024/10/desert-island.jpg)

I anticipate we've not seen the last of activity in this world, and so when a
new group of friends (who have a history of playing a single night LAN party
once every other year or so) wanted a long term world to share, I had a template
to use for this new server. But it needed some work before it could run both of
them.

## Enter docker-minecraft

The solution is [docker-minecraft](https://github.com/C-D-Lewis/docker-minecraft).
This project is a single repository that allows setup and running of any number
of Minecraft servers. Each can have their own configuration, memory allocation,
and even customized server JARs if required.

Each server to be run installs the repository and uses a named set of
configuration files in <code>/config</code>. Aside from the regular Minecraft
server files such as <code>server.properties</code> is a <code>config.json</code>
file that contains settings related to the server process itself and other
associated processes. For example:

```json
{
  "SERVER_NAME": "test",
  "JAR": "minecraft-server_1.21.1.jar",
  "MEMORY": "2G",
  "LOCAL_BACKUP_DIR": "/home/chrislewis/backups",
  "S3_BACKUP_DIR": "s3://chrislewis-files/worlds",
  "DNS_SUBDOMAIN": "test",
  "PORT": "25565"
}
```

In this example:

- <code>SERVER_NAME</code>: The server's identifier around the repo and for use in scripts.

- <code>JAR</code>: Server JAR to use in the Docker image, from my S3 bucket.

- <code>MEMORY</code>: Values for the JVM min/max memory arguments.

- <code>LOCAL_BACKUP_DIR</code>: Location to store local backups.

- <code>S3_BACKUP_DIR</code>: Location to store backups in AWS S3.

- <code>DNS_SUBDOMAIN</code>: Subdomain to <code>chrislewis.me.uk</code> for maintaining an easy way to connect if IP addresses change.

- <code>PORT</code>: Port to run the Minecraft server on, if a location hosts more than one.

This config file is used in many places, such as the <code>start-docker.sh</code>
script:

```text
#!/bin/bash

set -eu

SERVER_NAME=$1

if [ ! -d "./config/$SERVER_NAME" ]; then
  echo "Invalid SERVER_NAME"
  exit 1
fi
PORT=$(cat ./config/$SERVER_NAME/config.json | jq -r ".PORT")

# Build the image
docker build -t $SERVER_NAME . --build-arg CONFIG=$SERVER_NAME

# Make sure the world directory exists to mount and persist to
mkdir -p world

# Run the image with exposed:
# - Minecraft server port
# - Dynmap port
# - Mounted world directory (some for Spigot servers too)
# - Any spigot plugins and associated data
docker run --rm \
  -p $PORT:$PORT \
  -p 8123:8123 \
  -v ./world:/server/world \
  -v ./world_nether:/server/world_nether \
  -v ./world_the_end:/server/world_the_end \
  -v ./config/$SERVER_NAME/plugins:/server/plugins \
  -t $SERVER_NAME
```

It's also used when running the backup scripts:

```text
#!/bin/bash

set -eu

SERVER_NAME=$1
USR=$2

if [ ! -d "./config/$SERVER_NAME" ]; then
  echo "Invalid SERVER_NAME"
  exit 1
fi
S3_BACKUP_DIR=$(cat ./config/$SERVER_NAME/config.json | jq -r ".S3_BACKUP_DIR")

DATE=$(TZ=GMT date +"%Y%m%d")
OUTPUT_FILE="$SERVER_NAME-$DATE.zip"

# Allow sudo crontab to find ~/.aws/
export HOME="${HOME:=/home/$USR}"

./scripts/create-zip.sh $USR
mv "backup.zip" "$OUTPUT_FILE"

echo ">>> Uploading to $S3_BACKUP_DIR"
/usr/local/bin/aws s3 cp $OUTPUT_FILE "$S3_BACKUP_DIR/"

echo ">>> Copying to latest"
/usr/local/bin/aws s3 cp "$S3_BACKUP_DIR/$OUTPUT_FILE" "$S3_BACKUP_DIR/$SERVER_NAME-latest.zip"

echo ">>> Cleaning up"
rm -rf $OUTPUT_FILE

echo "$(date)" >> upload-backup.log
echo ">>> Complete"
```

And so on. In each case, the crontab is updated to run the specific server
on boot, as well as the various supporting scripts:

```shell
# Specific user
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# docker-minecraft test
@reboot sleep 15 && /mnt/ssd/docker-minecraft && ./scripts/start-docker.sh test >> /home/pi/docker-minecraft.log 2>&1
# Local backup
0 3 * * * cd /mnt/ssd/docker-minecraft && ./scripts/local-backup.sh test pi > /home/pi/local-backup.log 2>&1
# AWS backup
0 4 * * 1 cd /mnt/ssd/docker-minecraft && ./scripts/upload-backup.sh test pi > /home/pi/upload-backup.log 2>&1
# DNS check
@reboot sleep 15 && cd /mnt/ssd/docker-minecraft && ./scripts/update-dns.sh test > /home/pi/update-dns.log 2>&1
```

Lastly, the <code>Dockerfile</code> itself uses the <code>SERVER_NAME</code> to
locate and copy in the configuration for the server specified.

```text
FROM ubuntu:jammy AS platform

RUN apt update --fix-missing && apt upgrade -y
RUN apt install -y curl jq

# Install java 22 for MC 1.21.1+
WORKDIR /opt
ADD ./scripts/install-platform-java.sh .
RUN ./install-platform-java.sh
RUN java --version || (echo "java was not found" && false)

################################################################

FROM platform

ARG CONFIG
RUN test -n "$CONFIG" || (echo "CONFIG  not set" && false)

# Primary port
EXPOSE 25565/tcp
# Alternative port
EXPOSE 25566/tcp
# Dynmap
EXPOSE 8123/tcp

WORKDIR /server

# Copy always
ADD ./scripts ./scripts

# Copy server-specific config first
ADD ./config/${CONFIG}/config.json .

# Download required minecraft server
RUN ./scripts/fetch-server.sh

# Then all other files for optimal layering
ADD ./config/${CONFIG} .

CMD ["/server/scripts/start.sh"]
```

## Conclusion

And there we have it. I'm using this already to run both aforementioned friend
group's servers and have not had any issues. It's nice to know that any new
feature or other improvement can be shared amongst all the servers with a
<code>git pull</code>, and it's easy to tweak things like updating a JAR or
increasing memory allocated.
