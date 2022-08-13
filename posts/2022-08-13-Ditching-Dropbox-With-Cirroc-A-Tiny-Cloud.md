Ditching Dropbox with Cirroc: A Tiny Cloud
2022-08-13 16:14
Python,Integration,Raspberry Pi,AWS
---

In September 2014, I upgraded from the free version of Dropbox after enjoying
the (at the time) novel and extremely easy way to backup and share files. Up to
this point, the next best options were a multitude of smaller 'file sharing'
sites that had limited hosting or were a pain to use and were not automated, or
handing a friend a USB stick. Emails could only contain attachments of up to a
few megabytes and around that time Google Mail began refusing attachments that
contained executable and archived files.

![](assets/media/2022/08/dropbox-logo.png)

The ability to back up and share a file simply by moving it into the right
folder was great for personal files, and sharing project files while I was at
university working on group projects. Indeed, I still have some of those shared
folders, which provides a fun insights back in time.

### A cloudy forecast

Since 2014, as could probably have been expected, Dropbox have expanded their
feature offering to add many new features like document signing, camera photo
backup, password manager, 'online-only' files, multiple file versions, etc.
which if I'm being honest I do not need. Over the years, I've grappled with some
annoyances that have at times made me question if I really need to pay for
it - most notably when after
[many years](https://superuser.com/questions/853236/how-to-make-dropbox-ignore-specific-folders-in-the-sync)
there is no such facility as a <code>.dropboxignore</code> to allow me to not
sync thousands of files in <code>node_modules</code>, for example. A recent
change takes a step in the right direction, but is
[not scalable](https://help.dropbox.com/files-folders/restore-delete/ignored-files)
to dozens of Node.js projects, and other valid use cases also exist.

Lastly, if we roughly average out the original price and more recent price
increases (which bring more features, but all I use is file sync), we can
collectively reel at the total figure: almost a thousand pounds!

![](assets/media/2022/08/joey-shocked.gif)

I don't want to continue paying more for essentially a smaller and smaller
subset of paid-for features (my other long-time subscriptions to Spotify,
Digital Ocean, and Netflix not under this particular microscope), and of course
long-time readers will sense the words 'Raspberry' and 'Pi' coming a mile away
by this point...

### New clouds are forming

I came across the common concept of a Raspberry Pi-based NAS
(Network Attached Storage) quite some time ago, but after signing into
Dropbox.com to retrieve one file and having to battle not one but <i>three</i>
popups advertising yet more features not related to file storage or sharing
in order to do so I felt another nail in the subscription... and got to thinking
of creating a NAS of my own.

![](assets/media/2022/08/cirroc.jpg)

And the result is an object emblazoned with the 3D printed name Cirroc (short
for [cirrocumulus](https://en.wikipedia.org/wiki/Cirrocumulus_cloud), a very
small type of cloud - how clever...), which houses quite minimally a Raspberry
Pi 4 with two Crucial 1TB SSDs in RAID-1 mirror configuration.

And it's pretty good - over an Ethernet connection and 802.11ac (Wifi 6) from my PC
I can transfer at around 20 MB/s (160 Mbps) in both directions, which is plenty
for small files and even reasonable for larger gigabyte level transfers which
I'm resigned to taking many minutes anyway.

The base was nicely printed by my brother and has precisely measured holes for
M3 bolts to hold each device in place.

![](assets/media/2022/08/cirroc-3d.jpg)

The final piece of the puzzle is the tiny Adafriut PiOLED module sat on the Pi's
GPIO and connects over I2C to provide a simple bitmapped display. I took the
example Python script for showing system stats and specialised it for the job
of showing the status of a RAID-1 NAS drive array - CPU, disk usage (GB), and
how many healthy drives are in the array.

![](assets/media/2022/08/cirroc-close.jpg)

My favorite part was using <code>PIL</code> to overlay a progress bar of disk
usage inside a tiny cloud bitmap icon using the self-same image as the mask.
Cute!

### Cloudy with chances of rain

The last part is particularly important - originally I chose two cheaper USB 3
to SATA adapter cables to connect the SSDs, which seemed to have compatability
problems with the Pi. Adding quirks mode to avoid using UAS seemed to improve
things, but at the time it would take a long transfer (>30 GB) to cause the OS
to mark the USB device as faulty and so the RAID-1 array was degraded to just
one copy - not ideal.

So, this combination of physical monitoring alongside
finally implementing Amazon SES (Simple Email Service) in the
[node-microservices](https://github.com/C-D-Lewis/node-microservices/blob/master/apps/monitor/src/plugins/mdstat.js)
project for alerting allows me to have a bit more piece of mind that this won't
occur with the new, more premium cables. Using the AWS SDK to achieve this was
quite straightforward:

```js
const sesApi = new AWS.SES({ apiVersion: '2010-12-01' });

const credentials = new AWS.Credentials({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

AWS.config.update({ region: 'eu-west-2', credentials });

/**
 * Send a notification email.
 *
 * @param {string} msg - Message content.
 */
exports.notify = async (msg) => {
  const res = await sesApi.sendEmail({
    Source: SENDER_ADDRESS,
    Destination: { ToAddresses: [TO_ADDRESS] },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: msg,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: SUBJECT,
      },
    },
  }).promise();
  log.info(`ses: Sent email ${res.MessageId}`);
};
```

### Conclusion

So, have I cancelled my Dropbox subscription at long last and created my own
perfect replacement for easy-to-use file syncing and sharing?

Of course not! It's not anywhere near as fault-tolerant, replicated, or hightly
available as Dropbox's offering, but it's mine, and it has yet more interesting
possibilities for the future:

- Scripts to automatically back up archives of music, photos, code, videos, etc.

- Automatically bringing a RAID drive back into the array when degraded.

- Using users to share portions of the drive publically and with friends.

However, I have managed to shrink my usage of Dropbox down from over 30GB to
just 10, and will be continuing towards fitting in the free tier allocation
(starting at 2GB, but I have participated in many promotions of the years that
adds several more GB, but won't know the final number until I cancel the plan)
and finally removing the infinite recurring cost in the near future.

For now, it's accessible with Sambda and Windows network drive mapping, which is
a great start. A sunny outlook!
