---
index: 62
title: New Watchapp: Data Toggle for Pebble (Android)
postDate: 2013-12-21 16:34:31
original: https://ninedof.wordpress.com/2013/12/21/new-watchapp-data-toggle-for-pebble/
---

I've recently upgraded my now 3-year old Galaxy S to a Nexus 5, and one difference I noticed in the stock 4.4.2 Kit Kat Android is that instead of toggling the radios (as would happen in the pull-down menu on CM 10.1), I was taken to the actual menu and then needed to perform the toggling myself.

This meant that in order to switch from Wi-Fi to Data (HSDPA here), I would have to tap 9 times to do so (not including entering my pin code on the lockscreen). Sure, I could flash the equivalent ROM or a similar one, but it would unnecessarily void my warranty (I am otherwise perfectly happy with stock Kit Kat at the moment). Another solution? Code my own!

The result is Data Toggle for Pebble, a combination of a Pebble Watchapp and Android Receiver/Service combo that performs the actual radio toggling, via AppMessage. Using the up and down buttons on the watch, the phone is asked to toggle either the Wi-Fi or Data radio and then waits for the confirmation from the phone. The one caveat (but not a deal breaker) that arises from the Android APIs is that toggling Data while Wi-Fi is connected appears to have no effect, so it is marked as 'N/A' in that case.

Here is an animated screenshot:

![](http://ninedof.files.wordpress.com/2013/12/mockup1.gif)

The Android app also doubles as an installer for the watchapp's .pbw file, as well as links to more of my content.

## Download

Both components can be installed as one from Google Play:
![](https://developer.android.com/images/brand/en_generic_rgb_wo_60.png)

Source code is available on [GitHub](https://github.com/C-D-Lewis?tab=repositories).

Enjoy!
