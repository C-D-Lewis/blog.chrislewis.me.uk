Muninn: Web Statistics
2026-04-06 15:32
Pebble,Releases
---

Late last year I posted about my latest major Pebble watchapp project - Muninn.
This was an attempt to create a minimal application that can track watch
battery drain and produce reasonable estimates for battery life. The goal was to
provide meaningful insight into how long a watch lasts, how much it has to go,
and if it is changing vs the general trend.

It seems to have been a success! Since the last blog post about it, I've had
great feedback in the Discord project chat and lots of help from others who
have provided feedback, recommendations, bug reports, tested new builds etc. and
it would not have been possible to make it as polished as it is today without
that input. In addition, I've seen Muninn recommended between users discussing
battery life and tracking on Reddit, Discord, and Facebook, which means he's
doing something right!

In total, as of writing this post, Muninn has gathered over 250+ hearts!

![](assets/media/2026/04/muninn-rebble.png)

![](assets/media/2026/04/muninn-repebble.png)

## What's New?

Since last year, new features have included:

- Much higher precision on days remaining and daily rate calculations.

- Tracking the last observed charge and next predicted charge date helping to guide when to charge.

- A navigable graph on the watch that has helped users know when trends have changed vs the expected change between samples.

- Expanded storage on the phone means trends over weeks and months are possible.

- Using said extra data (up to 4 months) to give insight into time between charges and overall expected battery life.

![](assets/media/2026/04/muninn-screenshots.png)

## What Now?

Mission accomplished, right? Well one could say that. As far as the original
goal is concerned, the minimal-impact Wakeup API powered app is still the same,
it's just a lot more information in charts and stats is available based on the
data collected.

Then, about two months ago, I thought what more observable and actionable
insights could be obtained if the user was not limited to the small size of the
watch screen and storage. Additionally, there were more requests for a graph
of all the data collected, not just the last four days.

I had a thought - what if the data could be shown on the web? A production-ready
chart library and the full dataset available would mean all that could be shown
as well as much more. There would be space for all the stats on the watch, plus
other features like sharing with friends, even more detailed insights, and data
export possibilities. Anyone already into tracking data for Muninn would get
even more out of it.

## Configuration Abuse

My first attempts to do this involved diving into the world of
[custom Clay components](https://github.com/pebble-dev/clay?tab=readme-ov-file#custom-components)
(still a mystery to me) and finding out how to send all the data to such a web
page using the URL. After some hours on each, it became clear that Clay
components are geared towards providing inputs in new formats for configuring
settings and not actual display components, and that the density of fields and
their potential huge number meant that URL parameters would not be a possible
option either.

Being an AWS infrastructure engineer by trade, my next thought was 'ooh goodie,
a REST API!'. I assembled the tools at my disposal and within a weekend
afternoon I had something rudimentary that the PebbleKit JS side could send
the watch data to. It consisted of the following components:

- A DynamoDB table for storing samples.

- A Lambda function for handling API requests to send and retrieve data.

- An API Gateway to expose endpoints and marshall requests towards Lambda.

- A Route53 domain to allow a stable address to be used.

![](assets/media/2026/04/MuninnWeb.png)

## Showtime

Thus followed several more nights and weekend afternoons creating the
[Terraform configuration](https://github.com/C-D-Lewis/pebble-dev/tree/master/watchapps/muninn/backend/terraform)
(an opportunity to create and update my re-usable modules!) and the
[Lambda code](https://github.com/C-D-Lewis/pebble-dev/tree/master/watchapps/muninn/backend/lambda)
in TypeScript. The AWS SDK makes it incredibly easy to use DynamoDB tables and
to handle HTTP requests from API Gateway. After some testing and creation of a
good set of unit and E2E tests, the API was ready to be integrated into the
watchapp.

This was quite simple - use the <code>fetch</code> exposed by the excellent
[pkts](https://github.com/jccit/PebbleKit.ts) project to make a
<code>POST</code> request to the new <code>POST /history</code> endpoint.

Simple enough. It became apparent that in order to allow a user to share their
data, the URL should be something short and easy to enter on a mobile device
keyboard. A short-code scheme came to mind, and so the first step to obtain this
is to exchange the unique watch token provided by PebbleKit JS for a 6-character
ID that is then used when uploading the sample history.

```text
7756f890b23348169165684742e971d2 -> C74FAA
```

The
[logic](https://github.com/C-D-Lewis/pebble-dev/blob/master/watchapps/muninn/backend/lambda/src/handlers.ts#L46)
is simple - if the watch token has been seen, return the ID already allocated.
If not, generate a new one while it doesn't already appear in the DynamoDB
table.

Once the JS side has this ID, it can proceed to make the request to upload
the sample history. Since this is done on a per-watch basis, it automatically
supports users who own multiple watches!

The URL ends up being similar to this (my watch!):

```text
https://muninn.chrislewis.me.uk?id=C74FAA
```

The first version of this showed a QR code on the watch after upload, but as it
is difficult to generate dynamic QR code images on Pebble, the user would have
to enter their code when opening the URL:

![](assets/media/2026/04/muninn-enter-code.png)

I thought this was good enough, but I receieved a great idea for enhancement -
why not show the page as the watchapps's settings page <i>inside the Pebble mobile app?</i>
It makes total sense! And brings the project back to it's first ideas. This
is very easily achieved:

```js
Pebble.addEventListener('showConfiguration', async () => {
  const id = await ensureUploadId();

  // Try and upload freshest data for the user
  await uploadHistory();

  // isAppConfigPage hides some elements that can't be clicked in the config page webview
  Pebble.openURL(`https://muninn.chrislewis.me.uk?id=${id}&isAppConfigPage=true`);
});
```

The latest version makes the upload just before opening the page - and this
seems to be allowed and working! The <code>isAppConfigPage</code> parameter
is used to hide the chart image and CSV data export buttons because they aren't
functional within the Pebble mobile app webview.

## Using the Data

What good is uploading the data if it cannot be viewed, shared, and learned
from? The last piece of this puzzle was then the
[web application](https://github.com/C-D-Lewis/pebble-dev/tree/master/watchapps/muninn/backend/client)
itself. As a relatively simple webapp it could be very quickly built using my
minimal web framework called
[fabricate.js](https://github.com/C-D-Lewis/fabricate.js) as it consists of
a few cards with rows or columns of components. 

If the URL opened already has the upload ID, the webapp loads the data and shows
the chart (using chart.js!) and the same long-term insights shown on that page
inside the watchapp but with the additional initial statistics for overall
estimated battery life.

![](assets/media/2026/04/muninn-webapp.png)

This example doesn't show the charge interval statistic well - but a watch
history with at least two charges would be able to show this value and let the
user know how often they may need to charge their watch on average.

And there we have it - the user can update their uploaded data as often as they
wish (it's opt-in), or use the new settings menu item to have it automatically
done at noon each day, as long as the watch is connected to the phone.

## Taking It Even Further

After a while it occured to me that if a large number of users opted to share
their sample histories, and the accuracy of each was reasonable (I wouldn't
expect perfection!) it would be possible to begin to glean some even more
interesting insights into the population of Pebble watches as a whole.

With this in mind, I added a scheduled EventBridge event at midnight each day
to call a new Lambda endpoint to perform some
[simple aggregations](https://github.com/C-D-Lewis/pebble-dev/blob/master/watchapps/muninn/backend/lambda/src/aggregations.ts#L102):

- For all watch models, bucket them accordingly, and calculate the overall average battery life and drain rate.

- For all SDK platforms (less meaningful but still interesting), do the same calculations.

Since Pebble watch model values are things like `pebble_time_charcoal_gray`, it
is neccessary to bucket them into more broad groups:

```js
/**
 * Groups: pebble_2_duo, pebble_2, pebble_time_steel, pebble_time_2, pebble_time_round, pebble_time
 *
 * @param {string} name - Name to map and group.
 * @returns {string} Mapped group name
 */
const getGroupName = (name) => {
  if (name.includes('pebble_2_duo')) return 'Pebble 2 Duo';
  if (name.includes('pebble_2_hr')) return 'Pebble 2 HR';
  if (name.includes('pebble_2')) return 'Pebble 2';
  if (name.includes('pebble_time_steel')) return 'Pebble Time Steel';
  if (name.includes('pebble_time_2')) return 'Pebble Time 2';
  if (name.includes('pebble_time_round')) return 'Pebble Time Round';
  if (name.includes('pebble_time')) return 'Pebble Time';

  return name;
};
```

After running this at least once, I could immediately see which watch models
tended to last longer than others. But it's important to bear in mind the huge
range of ages of batteries, and it's impossible to know which have had the
battery replacement procedure done with an equivalent or slightly larger
battery than the original.

![](assets/media/2026/04/muninn-global.png)

But even all this aside, the last piece of value the user can get is to know
where the place in the collection of all watches of the model they are wearing.
This is shown as an annotation on the battery life and drain rate components,
which brings it all back around to something they can relate to on a personal
level, which is quite fitting given the whole process started with their own
watch.

![](assets/media/2026/04/muninn-compare.png)

## Conclusion

Whew! Another long post! But it was overdue and I had a lot to cover. I'm quite
pleased with how easily this came together, how much individual value it adds
for Muninn users, and also how it unlocks a much bigger picture about Pebble
battery life as a whole across a larger population. As more users hopefully
choose to share their sample histories, the accuracy should increase!

As usual check out all the
[watchapp](https://github.com/C-D-Lewis/pebble-dev/tree/master/watchapps/muninn)
and
[backend platform](https://github.com/C-D-Lewis/pebble-dev/tree/master/watchapps/muninn/backend)
source code for yourself and enjoy using Muninn!
