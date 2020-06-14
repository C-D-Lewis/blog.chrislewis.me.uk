---
index: 108
title: Dashboard for Pebble 1.13 - Lollipop Consequences
postDate: 2014-11-23 00:51:00
original: https://ninedof.wordpress.com/2014/11/23/dashboard-for-pebble-1-13-lollipop-consequences/
---

Dashboard for Pebble is now version 1.13. This version contains a new Materially design, as well as fixes to the Data and ringer toggles as a result of the changes in Android 5.0 Lollipop.

The major point to note is that the method reflection I was using to implement the Data [relied on an internal API](http://stackoverflow.com/questions/26539445/the-setmobiledataenabled-method-is-no-longer-callable-as-of-android-l-and-later) in the ConnectivityManager class (which has existed in Android since very early versions). This API has since been moved to a more system-exclusive location (the Telephony class) that cannot be invoked using method reflection and as such the feature stopped working on Android 5.

Being one of the main features of Dashboard (and half the sole purpose in the [original Data Toggle watchapp](http://ninedof.wordpress.com/2013/12/21/new-watchapp-data-toggle-for-pebble/)), this outcome was unacceptable. After searching for an alternative and finding nothing but [similarly disgruntled Android developers](https://code.google.com/p/android/issues/detail?id=78084), I came across a [widget developer named Cygery](http://forum.xda-developers.com/android/apps-games/app-toggle-data-5-0-widget-to-toggle-t2937936) who had found a way to implement this behavior in Android 5, and after a brief email exchange I was informed of his method, which was quite ingenious.

As a result, full functionality has been restored on Android 5, but at a large price - the feature now requires root privileges to change that particular settings. This is obviously not ideal, but the only way I can see the feature working beyond Android 5. Users on KitKat and below remain unaffected and the app should work as it did for them. Therefore, the Dashboard Android app will request root when it starts, as well as post a notification if the Data toggle is used and root access is not given. Most SuperUser apps will allow this access to be given on a per-app basis, so please allow this if you are a Android 5 user and need to use the Data toggle.

## Download
![](https://developer.android.com/images/brand/en_generic_rgb_wo_60.png)
