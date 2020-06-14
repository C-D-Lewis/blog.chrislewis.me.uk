---
index: 122
title: Dash API For Easy Pebble and Android Integration
postDate: 2016-07-20 22:44:03
original: https://ninedof.wordpress.com/2016/07/20/dash-api-for-easy-pebble-and-android-integration/
---

A few days ago, an interesting idea came up in the PebbleDev Slack channel: could a library make it easier for Pebble developers to integrate their apps with Android APIs, but save the pain of each and every one of them needing to publish an app with PebbleKit Android? This would be similar to how Dashboard operates, but by sharing the API access to other apps that are installed.

Turns out, it can! In one of my signature coding bursts I set to work, and prototyped a system that did just this. The result is the Dash API. With it, you can finally (and easily) provide one of the most common watchface widget requests - things like the phone's battery level, or connectivity status.

## How does it work?

The [Dash API](https://github.com/C-D-Lewis/dash-api) (named after Dashboard) [Pebble package](https://www.npmjs.com/package/pebble-dash-api) uses AppMessage to send requests to read data (such as WiFi network name, or phone battery level), or write to an API (such as turning off WiFi). Using a unique key to recognise Dash API messages, the Android app can respond to these by reading the data or manipulating the Android API and returning a response code. All the developer needs to do is instruct their users to install my [Dash API Android app](https://play.google.com/store/apps/details?id=com.wordpress.ninedof.dashapi), and then their app (and any others that use the Dash API) can take advantage of the APIs presented through the library. This approach makes the Dash API an install once, use in many apps service.

The upshot of all this is that a C developer making a watchface that wants to show the phone battery level (such as the demo app [Dual Gauge](https://apps.getpebble.com/en_US/application/578cb2e31e00a6c4b3000312)) need only use the Pebble package and not write a single line of Java, let alone go to the trouble of publishing an Android app on Google Play.

But how can one companion app target them all, without knowing they exist?

Luckily, you can extract the UUID of an app that sends an AppMessage packet to the phone from the Intent object broadcast from the Pebble Android app. Most (hopefully app) companion apps that manually register a BroadcastReceiver do a 'good citizen' UUID check to make sure they only respond to messages from their corresponding watchapp. This data can be used to simply redirect an incoming message's result right back at it, without the need to create a PebbleKit Android app with baked in UUID for each individual app.

## So how can I use it?

Simple. As explained in the [GitHub README.md file](https://github.com/C-D-Lewis/dash-api/blob/master/README.md#setting-up), a C developer should first install the package:

<code>
$ pebble package install pebble-dash-api
</code>

Next, include the single library file and call the initialiser when your app is starting, supplying the app's name (for presentation in the Android app) and an error callback for receiving any errors that may occur:

[code language="cpp"]
#include &lt;pebble-dash-api/pebble-dash-api.h&gt;;
#include &lt;pebble-events/pebble-events.h&gt;

#define APP_NAME &quot;My App&quot;

static void error_callback(ErrorCode code) {
  // Receive error codes here
}

static void init() {
  dash_api_init(APP_NAME, error_callback);
  events_app_message_open();

  /* Other init code */
}
[/code]

Next, check the Android app is available and up to date:

[code language="cpp"]
dash_api_check_is_available();
[/code]

The result will be passed to your <code>error_callback</code>. Once you get <code>ErrorCodeSuccess</code>, it is safe to start making queries, such as getting the battery level, etc. Code examples are included in the [GitHub README.md file](https://github.com/C-D-Lewis/dash-api#get-data).

## What else do I need to know?

As of 1.1 (released today), apps that read data and API states can do so invisibly. However, apps that wish to write to an API (such as turning off WiFi) will cause a notification to appear that will prompt the user to grant it access within the Dash API app. Once this is done, operation will continue without further intervention, unless permission is revoked. This should hopefully prevent any rogue apps messing with the phone, and give users visibility into which Pebble apps they have used are using the Dash API.

## Links

 [GitHub Repo](https://github.com/C-D-Lewis/dash-api)

 [Dash API Android app](https://play.google.com/store/apps/details?id=com.wordpress.ninedof.dashapi) (direct your users here!)

 [NPM Package](https://www.npmjs.com/package/pebble-dash-api)

 [Example App (Dual Gauge)](https://apps.getpebble.com/en_US/application/578cb2e31e00a6c4b3000312)

## What's next?

In the future, I'd like to expand the capabilities offered by the Dash API to other popular widget requests, things such as unread SMS count and next Calendar appointment. Perhaps for another day - coordinating GitHub repos, NPM packages, Android apps, and Pebble apps is quite tiring!
