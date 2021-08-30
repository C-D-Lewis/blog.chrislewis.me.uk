PTubeStatus: TFL Status on Your Wrist
2013-11-24 18:22:28
Integration,Pebble,Releases
---

<strong></strong>I had an idea a couple of days ago while I was casting around for a way to make use of the promising abilities offered by the new <a title="PebbleJS" href="https://developer.getpebble.com/2/guides/javascript-guide.html">PebbleJS</a> feature of <a title="Pebble SDK 2.0" href="https://developer.getpebble.com/2/">Pebble SDK 2.0</a>. It essentially cuts out the 'man in the middle' apps needed for communication with the web, which can limit the audience if the developer (such as myself!) is only familiar with one platform, such as Android.

The idea I came up with was this: On the Transport for London website (<a title="TFL" href="http://www.tfl.gov.uk/">tfl.gov.uk</a>), there is an HTML table that details the line status of all the different Underground lines. On a good business day these will all show 'Good service', and on a bad day/weekend a lot will show 'Part closure' or 'Planned closure'. Wouldn't it be great if this information was more readily available to a commuter or tourist if they happened to be equipped with a Pebble watch?

So that is what I set out to do, and with a little bit of JS wisdom, the result is PTubeStatus!

![](/assets/import/media/2013/11/mockup2.gif) The major challenges were parsing the data and sending all these strings over app message without causing buffer overflows or <code>APP_MSG_BUSY</code> errors. The solution was to chain the messages sent to the watch so that when one was ack'd, the next set of data was sent. When the second set was sent, the JavaScript signaled the watch to load it into a <code>MenuLayer</code> and show it.

You can download the app to try it for yourself from <a title="mypebblefaces" href="http://www.mypebblefaces.com/apps/3905/7768/">mypebblefaces</a>, and if you find it useful and fancy making a donation, you can do so by purchasing the installer app for Android from <a title="PTubeStatus Installer" href="https://play.google.com/store/apps/details?id=com.wordpress.ninedof.ptubestatusinstaller">Google Play</a>, which I will update to let you know that the watch app also needs updating!

As usual, any feedback and bug reports are most welcome, and I will respond to each of them.

Enjoy!
