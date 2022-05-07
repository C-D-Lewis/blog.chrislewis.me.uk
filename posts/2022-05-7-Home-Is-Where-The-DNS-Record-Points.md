Home Is Where The DNS Record Points
2022-05-07 21:33
Raspberry Pi,JavaScript,Pebble
---

A long time ago, two of my Pebble watchapps (News Headlines and Tube Status)
offered the ability to have Pebble
[Timeline pins](https://blog.chrislewis.me.uk/?post=2016-09-11-Say-Hello-to-Your-New-Pin-Pusher)
pushed to the watch OS's built-in timeline view with app-related data visible
without needing to actually open the app. Having app data mixed into calendar
events, past notifications, weather details etc in a temporal view was cool!

![](assets/media/2022/05/timeline-pins-p2.jpg)

Though they are no longer in use, as
detailed in the linked blog post, these two server processes only sent data to
the internet. But the Raspberry Pi used to host them would be even more useful
if it could serve things to outside users, such as this blog (maybe one day!).

What was once just a single Raspberry Pi v1, is now a set of three Raspberry Pi
3B+ devices in a stack. Each with its own purpose (from top to bottom) - public
services, private (LAN) services, and other utility/misc services.

It would be a fun exercise to actually host this blog on them!

## Hosting

Currently, the blog is served via AWS CloudFront from an S3 bucket website
configuration - more details can be found
[here](https://blog.chrislewis.me.uk/?post=2020-10-04-Deploying-With-Terraform).
The record itself in AWS Route 53 is shown below:

![](assets/media/2022/05/cloudfront-blog.png)

For more local hosting, the first step after assinging a Pi is to configure my
router to forward port 80 (HTTP) to the Pi with it's static local IP. On the Pi
itself is a Node.js-based server that serves the blog files.

```text
FORWARD 80:80 192.168.0.14
```

Next, reconfigure the DNS record currently in AWS Route 53 to point to my
network:

```text
ALIAS blog.chrislewis.me.uk. 86.143.277.43
```

There is only one real problem with this (apart from a lack of a CA-signed SSL
certificate) - every time my home router restarts (and maybe on other
occassions) it is likely the public internet-facing IP address will change.
Therefore any redirection or alias DNS record from
<code>blog.chrislewis.me.uk</code> to that IP address would become invalid and
the blog would be unreachable - unacceptable!

## Finding the way home

Enter the newest kid on the <code>node-microservices</code> block -
[polaris](https://github.com/c-d-lewis/node-microservices/tree/master/apps/polaris),
named after the guiding star of the same name. It's job is simple: to fix this
issue preventing viable hosting of the blog from my home Pi stack.

It does this by using a set of IAM access credentials to read the current value
of the DNS record and compare it to the detected pubic IP address.

```js
/**
 * Fetch the Route53 record's current state.
 *
 * @param {string} publicIp - Current public IP of the network.
 * @returns {object} Hosted zone ID, current IP, record name.
 */
const fetchRecordData = async (publicIp) => {
  // Find the hosted zone
  const listZonesRes = await route53.listHostedZones().promise();
  const zone = listZonesRes.HostedZones.find(({ Name }) => Name.includes(HOSTED_ZONE_NAME));
  if (!zone) throw new Error(`Hosted zone with name including ${HOSTED_ZONE_NAME} not found`);

  // List the records
  const hostedZoneId = zone.Id;
  const recordUrlName = `${RECORD_NAME_PREFIX}.${HOSTED_ZONE_NAME}`;
  const listRecordsRes = await route53.listResourceRecordSets({
    HostedZoneId: hostedZoneId,
    MaxItems: '100',
  }).promise();
  const record = listRecordsRes.ResourceRecordSets.find(
    ({ Name }) => Name.includes(recordUrlName),
  );

  // Create it as up-to-date
  if (!record) {
    await createRecord(hostedZoneId, recordUrlName, publicIp);
    return publicIp;
  }

  // Get the record value
  return {
    currentIp: record.ResourceRecords[0].Value,
    hostedZoneId,
    recordFullName: record.Name,
  };
};
```

If the record doesn't yet exist (suppose the app was deployed for a new domain)
then it is created:

```js
/**
 * Create the record if it doesn't exist.
 *
 * @param {string} hostedZoneId - Hosted zone ID.
 * @param {string} recordUrlName - Full record name.
 * @param {string} publicIp - Current public IP of the network.
 */
const createRecord = async (hostedZoneId, recordUrlName, publicIp) => {
  const res = await route53.changeResourceRecordSets({
    HostedZoneId: hostedZoneId,
    ChangeBatch: {
      Changes: [{
        Action: 'CREATE',
        ResourceRecordSet: {
          Name: `${recordUrlName}.`,
          Type: 'A',
          TTL: 60 * 5, // 5 minutes
          ResourceRecords: [{ Value: publicIp }],
        },
      }],
    },
  }).promise();
  log.debug(res);
  log.info(`Created record ${recordUrlName}`);
};
```

If the two differ, it updates the record with the new IP address:

```js
/**
 * Update the Route53 record with the current public IP of the network.
 *
 * @param {string} publicIp - Current public IP of the network.
 * @param {string} hostedZoneId - Hosted zone ID.
 * @param {string} recordFullName - Full record name.
 */
const updateRoute53RecordIp = async (publicIp, hostedZoneId, recordFullName) => {
  const res = await route53.changeResourceRecordSets({
    HostedZoneId: hostedZoneId,
    ChangeBatch: {
      Changes: [{
        Action: 'UPSERT',
        ResourceRecordSet: {
          Name: recordFullName,
          Type: 'A',
          TTL: 60 * 5, // 5 minutes
          ResourceRecords: [{ Value: publicIp }],
        },
      }],
    },
  }).promise();
  log.debug(res);
  log.info(`Updated record ${recordFullName}`);
};
```

After this update, the DNS record once again points to the local network and
the path from the public internet to the local server is restored. This is
illustrated with the following high quality diagram!

![](assets/media/2022/05/path-to-pi.png)

Of course, the blog would have been unavailable in this time, but it's better
than noticing it happened only on the next time I visit my own site...

## Next steps

Currently this is done at ten minute intervals, but this could be made more
robust by decreasing the interval, or by detecting a loss of internet
connectivity and performing the check when it is restored.

But of course, the blost must be served over secure HTTPS like it is today with
CloudFront. This means I would need to obtain a CA-signed SSL certificate to
install in the Node.js server so that going to the same address will be accepted
by modern browsers and be just as easy to reach. Something to look into...
